import { test, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import type { AddressInfo } from "node:net";

const server = http.createServer((req, res) => {
  if (req.headers.authorization !== "Bearer test-key") { res.statusCode = 401; return res.end("{}"); }
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const { value } = JSON.parse(body);
    if (value === "00000000000") { res.statusCode = 404; return res.end("{}"); }
    if (value === "99999999999") { res.statusCode = 500; return res.end("{}"); }
    res.setHeader("content-type", "application/json");
    // Provider returns more than we are allowed to show: it must be filtered out.
    res.end(JSON.stringify({ network: "TestNet", status: "active", owner_name: "SHOULD NOT LEAK", cnic: "1234512345671" }));
  });
});
await new Promise<void>((r) => server.listen(0, r));
after(() => server.close());
const port = (server.address() as AddressInfo).port;

const { lookup, providerConfigured } = await import("../src/lib/provider.ts");

test("not configured: returns not_configured and never calls out", async () => {
  delete process.env.VERIFICATION_API_URL;
  delete process.env.VERIFICATION_API_KEY;
  assert.equal(providerConfigured(), false);
  assert.deepEqual(await lookup("mobile", "03001234567"), { status: "not_configured" });
});

test("configured: only allow-listed fields are returned", async () => {
  process.env.VERIFICATION_API_URL = `http://127.0.0.1:${port}/`;
  process.env.VERIFICATION_API_KEY = "test-key";
  process.env.VERIFICATION_ALLOWED_FIELDS = "network,status";
  const r = await lookup("mobile", "03001234567");
  assert.equal(r.status, "ok");
  if (r.status === "ok") {
    assert.deepEqual(r.fields, { network: "TestNet", status: "active" });
    assert.equal(JSON.stringify(r).includes("SHOULD NOT LEAK"), false);
    assert.equal(JSON.stringify(r).includes("1234512345671"), false);
  }
});

test("404 maps to not_found and 500 maps to error", async () => {
  assert.deepEqual(await lookup("mobile", "00000000000"), { status: "not_found" });
  const e = await lookup("mobile", "99999999999");
  assert.equal(e.status, "error");
});

test("wrong key is an error, not data", async () => {
  process.env.VERIFICATION_API_KEY = "wrong";
  assert.equal((await lookup("mobile", "03001234567")).status, "error");
});
