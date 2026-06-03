import type { ManagerRoundStudyBlock } from './types'

export const managerRoundStudyPlan: ManagerRoundStudyBlock[] = [
  {
    title: 'First priority: networking and architecture',
    items: [
      'Recite TCP handshake, TCP flags, UDP behavior, DNS, DHCP, NAT/PAT, public/private IP, common ports, and TLS/HTTP flow.',
      'Practice drawing: Internet -> firewall -> DMZ -> WAF/load balancer -> app -> database -> SIEM logs.',
      'Explain north-south vs east-west traffic and why east-west matters for lateral movement.',
    ],
  },
  {
    title: 'Second priority: SOC triage and incident handling',
    items: [
      'Memorize event vs alert vs incident, true/false positives, NIST IR lifecycle, escalation criteria, and ticket/report structure.',
      'Practice prioritization with asset criticality and successful vs failed activity.',
      'Prepare one crisp answer for phishing, suspicious IP, WAF alert, brute force, malware endpoint, and internal scan.',
    ],
  },
  {
    title: 'Third priority: OS, logs, and scripting',
    items: [
      'Windows: 4624, 4625, 4672, 4688, 7045, 1102; Sysmon 1, 3, 10, 11, 12/13, 22.',
      'Linux: /var/log/auth.log or /var/log/secure, journalctl, ss, ps, lsof, grep, awk, sort, uniq.',
      'Practice Bash pipelines and one Python IOC extraction/enrichment explanation.',
    ],
  },
  {
    title: 'Fourth priority: web security and Zoho angle',
    items: [
      'Know OWASP 2021 for interview recall and OWASP 2025 as current awareness.',
      'Tie your bug bounty work to SOC detection: SQLi/XSS payloads in logs, IDOR access patterns, Burp/Nmap evidence habits.',
      'Mention Zoho security culture carefully: secure SDLC, vulnerability scanners/manual review, WAF/IDPS, data centers, encryption, and VRP from official Zoho pages.',
    ],
  },
]

export const managerRoundThreatWatch: string[] = [
  'Vulnerability exploitation is a major 2026 theme; prioritize exposed internet-facing systems and CISA KEV-listed CVEs.',
  'Mobile social engineering, smishing, and vishing are rising; phishing is no longer only email.',
  'Ransomware response must protect backups, identity systems, hypervisors, and recovery paths, not only infected endpoints.',
  'Supply-chain and third-party incidents require asset ownership, vendor exposure, and external dependency awareness.',
  'Infostealers and session theft make MFA, impossible travel, unusual device, and token/session monitoring important.',
  'AI-assisted attack speed makes fundamentals more important: patching, segmentation, least privilege, logging, and detection quality.',
]
