import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeCnic, normalizeMobile, maskCnic, maskMobile } from "../src/lib/validation.ts";

test("mobile: accepts common formats and normalises to 03XXXXXXXXX", () => {
  for (const input of ["03001234567", "+923001234567", "923001234567", "00923001234567", "0300-1234567", "0300 123 4567", "3001234567"]) {
    const r = normalizeMobile(input);
    assert.deepEqual(r, { ok: true, value: "03001234567" }, input);
  }
});

test("mobile: rejects bad input with a message", () => {
  for (const input of ["", "   ", "0300123456", "030012345678", "02001234567", "03991234567", "abc", "+92300123456a", "++923001234567"]) {
    const r = normalizeMobile(input);
    assert.equal(r.ok, false, input);
    if (!r.ok) assert.ok(r.message.length > 0);
  }
});

test("cnic: accepts 13 digits with or without dashes", () => {
  assert.deepEqual(normalizeCnic("3520212345671"), { ok: true, value: "3520212345671" });
  assert.deepEqual(normalizeCnic("35202-1234567-1"), { ok: true, value: "3520212345671" });
});

test("cnic: rejects bad input", () => {
  for (const input of ["", "123", "35202123456712", "35202-1234567-A", "0520212345671"]) {
    assert.equal(normalizeCnic(input).ok, false, input);
  }
});

test("masking never leaks the full value", () => {
  assert.equal(maskMobile("03001234567").includes("1234"), false);
  assert.equal(maskCnic("3520212345671").includes("35202"), false);
});
