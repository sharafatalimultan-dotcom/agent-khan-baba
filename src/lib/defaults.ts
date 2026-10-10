// Default content used when Supabase is not configured or a table is empty.
// Admins can override all of this from /admin. VERIFY every number and URL before launch.

export type Faq = { id: string; question: string; answer: string; sort_order: number };
export type Helpline = {
  id: string;
  network: string;
  number: string;
  note: string | null;
  website: string | null;
  sort_order: number;
};
export type OfficialLink = {
  id: string;
  label: string;
  url: string;
  description: string | null;
  category: string;
  sort_order: number;
};
export type SeoEntry = { title: string; description: string };

export const DEFAULT_FAQS: Faq[] = [
  {
    id: "d1",
    question: "Can this website show me who owns any mobile number?",
    answer:
      "No. Registration data of other people is private and protected. This site does not sell or reveal third-party SIM-owner records. It guides you to official, authorized ways to check SIMs registered on your own CNIC and to report misuse.",
    sort_order: 1,
  },
  {
    id: "d2",
    question: "How do I check how many SIMs are registered on my CNIC?",
    answer:
      "Use the method published by the Pakistan Telecommunication Authority (PTA) for checking SIMs against your own CNIC, such as the SMS service or the PTA portal listed on our PTA Guide page. Always confirm the current method on pta.gov.pk because services change.",
    sort_order: 2,
  },
  {
    id: "d3",
    question: "I found a SIM I do not recognise on my CNIC. What should I do?",
    answer:
      "Do not ignore it. Follow the official process to report the SIM to PTA and request blocking through your network operator. Our Block or Report a SIM page lists the steps and contact points.",
    sort_order: 3,
  },
  {
    id: "d4",
    question: "Do you store my CNIC or mobile number?",
    answer:
      "No. Numbers you type are validated in your browser and on our server, but they are not saved. Any diagnostic logging uses a one-way hash only and contains no readable personal data.",
    sort_order: 4,
  },
  {
    id: "d5",
    question: "Are you affiliated with PTA or any mobile network?",
    answer:
      "No. This is an independent information website. We link to official sources but are not a government body or a network operator.",
    sort_order: 5,
  },
  {
    id: "d6",
    question: "Why does the tool show instructions instead of results?",
    answer:
      "Because a lookup only returns data when a legally authorized provider has been connected and approved. Until then, we show the official verification steps so you never receive invented or unverified information.",
    sort_order: 6,
  },
  {
    id: "d7",
    question: "Is it safe to send my CNIC to unofficial websites?",
    answer:
      "No. Sharing your CNIC with unofficial sites or apps exposes you to identity theft and fraud. Use only official channels and never share OTPs, PINs or biometric verification codes with anyone.",
    sort_order: 7,
  },
];

export const DEFAULT_HELPLINES: Helpline[] = [
  { id: "h1", network: "PTA Complaint Helpline", number: "0800-55055", note: "Toll free. Telecom complaints and SIM misuse.", website: "https://www.pta.gov.pk", sort_order: 1 },
  { id: "h2", network: "Jazz", number: "111", note: "From a Jazz number. Also 111-300-300 from other networks.", website: "https://jazz.com.pk", sort_order: 2 },
  { id: "h3", network: "Zong", number: "310", note: "From a Zong number. Also 111-222-111 from other networks.", website: "https://www.zong.com.pk", sort_order: 3 },
  { id: "h4", network: "Telenor", number: "345", note: "From a Telenor number. Check the Telenor website for the current number from other networks.", website: "https://www.telenor.com.pk", sort_order: 4 },
  { id: "h5", network: "Ufone", number: "333", note: "From a Ufone number. Also 111-33-33-33 from other networks.", website: "https://www.ufone.com", sort_order: 5 },
  { id: "h6", network: "FIA Cyber Crime Wing (NR3C)", number: "1991", note: "Report fraud, identity theft and cyber crime.", website: "https://nr3c.gov.pk", sort_order: 6 },
];

export const DEFAULT_LINKS: OfficialLink[] = [
  { id: "l1", label: "Pakistan Telecommunication Authority (PTA)", url: "https://www.pta.gov.pk", description: "The telecom regulator. Start here for current consumer services.", category: "pta", sort_order: 1 },
  { id: "l2", label: "PTA Consumer Complaint Portal", url: "https://complaint.pta.gov.pk", description: "File a complaint about SIM misuse or service issues.", category: "report", sort_order: 2 },
  { id: "l3", label: "NADRA", url: "https://www.nadra.gov.pk", description: "National identity authority. Contact for CNIC related concerns.", category: "pta", sort_order: 3 },
  { id: "l4", label: "FIA National Response Centre for Cyber Crime", url: "https://nr3c.gov.pk", description: "Report fraud, impersonation and cyber crime.", category: "report", sort_order: 4 },
];

export const DEFAULT_SEO: Record<string, SeoEntry> = {
  "/": {
    title: "Agent Khan Baba | Official SIM Verification Guide",
    description:
      "Learn how to verify SIM information in Pakistan using official PTA and network methods. Check SIMs on your own CNIC and report unauthorized SIMs safely.",
  },
  "/sim-verification-guide": {
    title: "SIM Verification Guide Pakistan | Step by Step",
    description:
      "A clear step by step guide to verifying SIMs registered on your own CNIC in Pakistan using official, authorized methods.",
  },
  "/pta-guide": {
    title: "PTA Guide | Official Telecom Services for Consumers",
    description:
      "How to use Pakistan Telecommunication Authority services for SIM checks, complaints and blocking, with official links.",
  },
  "/network-helplines": {
    title: "Mobile Network Helplines Pakistan | Jazz, Zong, Telenor, Ufone",
    description:
      "Helpline numbers and official websites for Pakistani mobile networks and the PTA complaint line.",
  },
  "/block-report-sim": {
    title: "Block or Report an Unauthorized SIM in Pakistan",
    description:
      "What to do if a SIM is registered on your CNIC without your knowledge: report to PTA, contact your network and protect your identity.",
  },
  "/faqs": {
    title: "SIM Verification FAQs Pakistan",
    description: "Answers to common questions about SIM verification, CNIC safety and reporting in Pakistan.",
  },
  "/about": {
    title: "About Agent Khan Baba",
    description: "Who we are, what this site does and what it will never do.",
  },
  "/contact": {
    title: "Contact Us | Agent Khan Baba",
    description: "Send us feedback, corrections or questions about our SIM verification guides.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Agent Khan Baba",
    description: "How we handle data, cookies and advertising on this website.",
  },
  "/terms-and-conditions": {
    title: "Terms and Conditions | Agent Khan Baba",
    description: "The terms for using this information website.",
  },
  "/disclaimer": {
    title: "Disclaimer | Agent Khan Baba",
    description: "Independent information website. Not affiliated with PTA, NADRA or any network operator.",
  },
};
