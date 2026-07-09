export interface SecurityNudge {
  id: string;
  title: string;
  body: string;
  action?: string;
}

export const SECURITY_NUDGES: SecurityNudge[] = [
  {
    id: "os-patch",
    title: "Did you update your OS?",
    body: "The recent Cisco SD-WAN zero-day happened because of this exact kind of unpatched flaw. Run system updates today.",
    action: "Check for updates",
  },
  {
    id: "mfa",
    title: "Turn on MFA everywhere.",
    body: "80% of account takeovers involve stolen passwords. A physical key or authenticator app blocks nearly all of them.",
    action: "Review your accounts",
  },
  {
    id: "backups",
    title: "Backup check-in.",
    body: "The MOVEit ransomware wave is still active. Verify you have offline, versioned backups you've actually restored from.",
    action: "Test a restore",
  },
  {
    id: "browser",
    title: "Restart your browser.",
    body: "A fresh Chrome V8 zero-day is being exploited in the wild. Restart to apply the latest patch.",
    action: "Relaunch browser",
  },
  {
    id: "api-keys",
    title: "Rotate stale API keys.",
    body: "Long-lived keys in old repos are the #1 root cause of cloud breaches. Rotate anything older than 90 days.",
    action: "Audit secrets",
  },
];
