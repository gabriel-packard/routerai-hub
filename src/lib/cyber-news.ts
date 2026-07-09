export interface CyberNews {
  id: string;
  title: string;
  source: string;
  summary: string;
  date: string;
  tag: string;
}

export const CYBER_NEWS: CyberNews[] = [
  {
    id: "accenture-azure",
    title: "Accenture Azure DevOps Data Breach",
    source: "The Hacker News",
    summary: "Misconfigured Azure DevOps repos exposed internal source code and customer references at Accenture.",
    date: "2026-06-14",
    tag: "Cloud Misconfig",
  },
  {
    id: "canvas-lms",
    title: "Canvas LMS Data Leak Exposes Student Records",
    source: "BleepingComputer",
    summary: "A leaky API endpoint in Canvas LMS enabled unauthenticated enumeration of student grade data across several universities.",
    date: "2026-06-02",
    tag: "API Security",
  },
  {
    id: "cisco-sdwan",
    title: "Cisco SD-WAN Zero-Day Flaws Under Active Exploitation",
    source: "Dark Reading",
    summary: "CVSS 9.8 auth-bypass in Cisco SD-WAN vManage is being weaponized to pivot into enterprise WAN edges.",
    date: "2026-05-27",
    tag: "Zero-Day",
  },
  {
    id: "moveit-round-2",
    title: "MOVEit Transfer: Round 2 Ransomware Wave",
    source: "KrebsOnSecurity",
    summary: "CL0P affiliates are re-targeting unpatched MOVEit Transfer instances with a new SQLi variant.",
    date: "2026-05-11",
    tag: "Ransomware",
  },
  {
    id: "chrome-v8",
    title: "Chrome V8 Zero-Day Patched — Update Now",
    source: "Google Threat Analysis Group",
    summary: "A type-confusion bug in V8 is being exploited in the wild. Patch to 143.0.7402.55 immediately.",
    date: "2026-04-30",
    tag: "Browser",
  },
  {
    id: "aws-imds",
    title: "AWS IMDSv1 Abuse Behind Multiple Cloud Intrusions",
    source: "Wiz Research",
    summary: "Attackers continue to exploit legacy IMDSv1 on EC2 to steal IAM credentials and pivot into cloud accounts.",
    date: "2026-04-18",
    tag: "Cloud",
  },
];
