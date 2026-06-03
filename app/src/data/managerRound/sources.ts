import type { ManagerRoundSource } from './types'

export const managerRoundSources: ManagerRoundSource[] = [
  {
    title: 'NIST SP 800-61 Rev. 2: Computer Security Incident Handling Guide',
    whyItMatters: 'Incident response lifecycle, triage mindset, containment, recovery, and post-incident lessons learned.',
    url: 'https://www.nist.gov/publications/computer-security-incident-handling-guide',
  },
  {
    title: 'NIST SP 800-92: Guide to Computer Security Log Management',
    whyItMatters: 'Why centralized log management and robust log processes matter for SOC work.',
    url: 'https://csrc.nist.gov/pubs/sp/800/92/final',
  },
  {
    title: 'NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy',
    whyItMatters: 'Firewall definition, firewall policy, perimeter controls, host/network firewalls, and proxies.',
    url: 'https://csrc.nist.gov/pubs/sp/800/41/r1/final',
  },
  {
    title: 'NIST SP 800-94: Guide to Intrusion Detection and Prevention Systems',
    whyItMatters: 'IDS/IPS placement, classes of IDPS, enterprise monitoring, and relation to SIEM.',
    url: 'https://csrc.nist.gov/pubs/sp/800/94/final',
  },
  {
    title: 'OWASP Top 10:2025 and OWASP Top 10:2021',
    whyItMatters: 'Current web security risks plus the older list many interviewers still expect from memory.',
    url: 'https://owasp.org/Top10/2025/',
  },
  {
    title: 'RFC 9293 TCP, RFC 768 UDP, and RFC 1918 private IP space',
    whyItMatters: 'Primary protocol references for TCP, UDP, and private IP address ranges.',
    url: 'https://www.rfc-editor.org/rfc/rfc1918',
  },
  {
    title: 'MITRE ATT&CK Enterprise',
    whyItMatters: 'How to explain alerts as adversary tactics and techniques, not only isolated indicators.',
    url: 'https://attack.mitre.org/tactics/enterprise/',
  },
  {
    title: 'Microsoft phishing investigation and Windows/Sysmon references',
    whyItMatters: 'Practical phishing checklist, Windows Event IDs, and endpoint telemetry examples.',
    url: 'https://learn.microsoft.com/en-us/security/operations/incident-response-playbook-phishing',
  },
  {
    title: 'Zoho security, enterprise security, and Vulnerability Reward Program',
    whyItMatters: 'Company-specific talking points: secure SDLC, WAF/IDPS, data centers, encryption, vulnerability reporting.',
    url: 'https://www.zoho.com/enterprise/security.html',
  },
  {
    title: 'ManageEngine Log360 documentation',
    whyItMatters: 'Zoho/ManageEngine SIEM context: log management, AD auditing, UEBA, cloud monitoring, compliance, and SOC visibility.',
    url: 'https://demo.log360.com/help/index.html',
  },
  {
    title: 'Verizon 2026 DBIR press release and CISA KEV catalog',
    whyItMatters: 'Current threat awareness: vulnerability exploitation, mobile social engineering, supply-chain risk, and exploited CVE prioritization.',
    url: 'https://www.verizon.com/about/news/breach-industry-wide-dbir-finds',
  },
  {
    title: 'Nmap, Wireshark, VirusTotal, and AbuseIPDB official docs',
    whyItMatters: 'Tool-level interview confidence for scans, packet filters, hash/domain/IP reputation, and IP enrichment.',
    url: 'https://nmap.org/book/port-scanning-options.html',
  },
]
