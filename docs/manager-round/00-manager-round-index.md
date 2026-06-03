# Zoho SOC Analyst Manager Round Master Guide

This pack is focused only on the manager round. The earlier guide covered overall SOC basics; this one is for deeper questioning on networking, cybersecurity fundamentals, architecture flow, SOC triage, scripting, and manager-level thinking.

## How to answer in the manager round

Use this structure for almost every technical answer:

1. Define the concept in one clean sentence.
2. Explain how it behaves in real traffic, logs, or systems.
3. Give one SOC investigation example.
4. Mention evidence you would collect.
5. Close with mitigation, escalation, or reporting.

Example:

> TCP is reliable and connection-oriented. It starts with SYN, SYN-ACK, ACK, then tracks sequence and acknowledgement numbers. In a SOC alert, I would inspect source/destination IP, source/destination port, TCP flags, action, bytes, and whether a successful session followed a scan or failed attempt. If it involved a critical asset or suspicious external source, I would correlate firewall, endpoint, DNS, and SIEM logs before closing or escalating.

## Highest-probability manager topics

Study these first:

1. TCP handshake, TCP flags, TCP close, RST, SYN flood, TCP scans.
2. UDP behavior, DNS/DHCP/NTP/SNMP use, UDP reflection, DNS tunneling.
3. Public IP vs private IP, RFC 1918 ranges, NAT/PAT, CIDR, subnet basics.
4. What happens when you type a website in a browser: DNS, ARP, TCP, TLS, HTTP, WAF/LB/app/DB, response.
5. Data center architecture: edge, firewall, DMZ, WAF, load balancer, app tier, DB tier, logs to SIEM.
6. North-south vs east-west traffic and lateral movement.
7. Firewall vs WAF vs IDS vs IPS vs EDR vs SIEM vs proxy.
8. OWASP Top 10: know 2021 for interview recall and 2025 for current awareness.
9. SQLi, XSS, IDOR/BOLA, SSRF, command injection, path traversal, auth/session issues.
10. SOC triage: event vs alert vs incident, true/false positive, prioritization, escalation.
11. Incident response lifecycle: preparation, detection/analysis, containment, eradication, recovery, lessons learned.
12. Phishing investigation: headers, SPF, DKIM, DMARC, URLs, attachments, recipients, clicks, endpoint/sign-in logs.
13. Windows logs: 4624, 4625, 4672, 4688, 7045, 1102; Sysmon 1, 3, 10, 11, 12/13, 22.
14. Linux triage: /var/log/auth.log, /var/log/secure, journalctl, ss, ps, lsof, grep, awk, sort, uniq.
15. Active Directory: domain, domain controller, Kerberos, NTLM, LDAP, GPO, groups, privilege escalation.
16. Scripting: Bash pipelines, Python IOC parsing/enrichment, PowerShell event queries.
17. SIEM rules: log collection, normalization, correlation, thresholds, exceptions, severity, MITRE mapping.
18. Threat intelligence: IOC vs IOA, VirusTotal, AbuseIPDB, CISA KEV, MITRE ATT&CK.
19. Current threat trends: vulnerability exploitation, ransomware, infostealers, mobile social engineering, supply chain.
20. Managerial behavior: shift readiness, calm escalation, ownership, written communication, follow-up to closure.

## Topics from the JD mapped to interview questions

| JD line | What the manager may ask | What to prove |
|---|---|---|
| Stay updated on malware and threats | How do you stay updated? What is CISA KEV? What current threats matter in 2026? | You use official sources and turn threat intel into triage/detection action. |
| Technical assistance with remediation | How would you tell an app team to fix SQLi? How would you advise after phishing? | You can write clear remediation, not only identify alerts. |
| Assessment reports with RCA | What goes into an incident report? | Summary, evidence, timeline, impact, root cause, containment, remediation, recommendations. |
| Monitor ticket queues and prioritize | Two alerts arrive. Which first? | Asset criticality, confirmed success, active spread, confidence, business impact. |
| Monitor internal channels | External team asks if an alert is real. How do you reply? | Communicate facts, confidence, next action, and ETA. |
| 24x7 monitoring | Are you ready for shifts? | Discipline, handover notes, sleep/focus management, checklist thinking. |
| Assist senior analysts | When do you escalate? | Know playbook limits and high-impact conditions. |
| Initial triage as per playbooks | Walk me through suspicious IP/phishing/WAF alert. | Structured triage and evidence collection. |
| Investigate events from sources | What logs would you check? | Firewall, WAF, DNS, proxy, EDR, identity, app, database, SIEM. |
| Follow up for closure | How do you avoid leaving tickets hanging? | Owners, next action, deadline, status, closure evidence. |
| Enhance monitoring beyond alerts | How would you tune a noisy rule? | Baseline, context, thresholds, exclusions, test false positives and false negatives. |
| Windows, OS X, Linux | What logs/commands do you know? | Practical admin comfort, not just theory. |
| Shell scripting MUST | Parse a log or automate enrichment. | Bash/Python/PowerShell command confidence. |
| Create rules in security tools | Build a detection rule. | Condition, time window, threshold, severity, MITRE mapping, testing. |

## OWASP versions to know

The current OWASP Top 10 release is 2025. Many interviewers still ask the 2021 list because it has been used for years.

Know OWASP Top 10:2021 by memory:

1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server-Side Request Forgery

Know OWASP Top 10:2025 for current awareness:

1. Broken Access Control
2. Security Misconfiguration
3. Software Supply Chain Failures
4. Cryptographic Failures
5. Injection
6. Insecure Design
7. Authentication Failures
8. Software or Data Integrity Failures
9. Security Logging and Alerting Failures
10. Mishandling of Exceptional Conditions

Good interview line:

> I know the 2021 list because it is commonly asked, but OWASP now lists 2025 as the current release. The core idea for SOC is not just listing names; I should explain how each issue appears in logs and what evidence confirms exploitation.

## One-day revision path

Morning:

1. TCP/UDP, public/private IP, NAT, DNS, DHCP, common ports.
2. Browser-to-website flow and data center architecture.
3. Firewall vs WAF vs IDS/IPS.

Afternoon:

1. OWASP attack detection in logs.
2. SOC triage, incident response lifecycle, escalation.
3. Windows/Linux logs and scripting commands.

Night:

1. Run through the scenario bank.
2. Speak answers out loud using the five-part structure.
3. Prepare resume bridges: bug bounty, Burp, Nmap, Knowledge Nexus, Zoho internship, scripting round.

