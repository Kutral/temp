import type { ManagerRoundQuestionGroup } from './types'

export const managerRoundQuestionGroups: ManagerRoundQuestionGroup[] = [
  {
    title: 'Networking and data center deep dive',
    focus: 'Be ready to draw flows and connect every protocol answer to logs.',
    questions: [
      {
        question: 'Explain TCP vs UDP in SOC terms.',
        answer: [
          'TCP is reliable and connection-oriented; I expect handshake, sequence/acknowledgement, and connection state in logs.',
          'UDP is connectionless; I focus more on volume, destination, application context, and whether the protocol is abused for tunneling or reflection.',
          'In a SOC ticket, I would mention source, destination, port, protocol, direction, action, bytes, and process/user context.',
        ],
      },
      {
        question: 'What happens when a user opens an HTTPS website?',
        answer: [
          'DNS resolution maps the domain to an IP, then routing/NAT sends the packet through the gateway.',
          'TCP handshake creates the transport connection, TLS validates identity and encrypts the session, then HTTP requests are exchanged.',
          'Security controls can log DNS, firewall session, WAF/proxy decision, TLS metadata, app access, and endpoint process.',
        ],
      },
      {
        question: 'What is a data center DMZ?',
        answer: [
          'A DMZ is a controlled network zone for services that must face outside users, such as reverse proxies, WAFs, or web servers.',
          'It reduces direct exposure of internal application and database networks.',
          'SOC value: DMZ logs help separate external scanning from deeper internal movement.',
        ],
      },
      {
        question: 'What is north-south vs east-west traffic?',
        answer: [
          'North-south is traffic entering or leaving the data center or cloud boundary.',
          'East-west is internal system-to-system traffic.',
          'After a compromise, east-west monitoring is critical for detecting lateral movement.',
        ],
      },
    ],
  },
  {
    title: 'Firewall, WAF, IDS/IPS, and defensive architecture',
    focus: 'Do not describe tools as magic boxes; define placement, visibility, action, and evidence.',
    questions: [
      {
        question: 'Why do we need a WAF if the firewall allows only 80 and 443?',
        answer: [
          'A network firewall may correctly allow HTTPS to the web application.',
          'The malicious SQLi/XSS payload is inside that allowed HTTP/S request.',
          'A WAF inspects Layer 7 web content such as URL, parameters, headers, cookies, and body patterns.',
        ],
      },
      {
        question: 'IDS vs IPS?',
        answer: [
          'IDS is usually passive and raises alerts from observed traffic.',
          'IPS is inline and can block, drop, or reset traffic.',
          'In investigation, I check whether the control only detected or actually prevented the traffic.',
        ],
      },
      {
        question: 'Stateful vs stateless firewall?',
        answer: [
          'Stateless filtering evaluates packets mostly rule by rule without remembering session context.',
          'Stateful filtering tracks connection state and can allow return traffic for established sessions.',
          'For SOC analysis, stateful logs help explain whether inbound traffic is new or part of an existing connection.',
        ],
      },
      {
        question: 'What evidence does each tool provide?',
        answer: [
          'Firewall: source, destination, ports, protocol, action, bytes, rule.',
          'WAF: URL, method, payload, attack category, action, response.',
          'EDR: process tree, command line, hash, user, file, registry, network.',
          'SIEM: correlation, timeline, severity, related events, ticket context.',
        ],
      },
    ],
  },
  {
    title: 'OWASP and web application security',
    focus: 'Use your bug bounty experience to show defender thinking.',
    questions: [
      {
        question: 'How would SQL injection appear in logs?',
        answer: [
          'Look for encoded quotes such as %27, OR 1=1, UNION SELECT, comment markers, sleep/time payloads, and unusual parameter length.',
          'Then check response code, response size, app errors, database logs, and whether WAF blocked or allowed it.',
          'I would report exploit attempt vs confirmed exploitation based on evidence.',
        ],
      },
      {
        question: 'Why is IDOR/BOLA difficult for SOC detection?',
        answer: [
          'The request may look normal because it uses valid authenticated HTTP traffic.',
          'Detection depends on patterns: one user accessing many object IDs, jumping sequences, cross-tenant access, or unusual authorization failures.',
          'App logs with user ID, object ID, tenant ID, and authorization decision are important.',
        ],
      },
      {
        question: 'What OWASP item is especially important for SOC?',
        answer: [
          'Security Logging and Alerting/Monitoring Failures are directly relevant because missing logs make incident reconstruction impossible.',
          'Broken Access Control is also high priority because it appears frequently and can be subtle in logs.',
          'I would connect OWASP issues to what telemetry should exist.',
        ],
      },
      {
        question: 'What is SSRF and why can it be dangerous?',
        answer: [
          'SSRF tricks a server into making requests to internal or metadata services.',
          'It can bypass perimeter controls because the request originates from a trusted server.',
          'SOC clues include unusual server-side outbound requests, metadata IP access, and suspicious URL parameters.',
        ],
      },
    ],
  },
  {
    title: 'SOC operations, logs, and escalation',
    focus: 'Show that you can run a shift, not just answer theory.',
    questions: [
      {
        question: 'How do you prioritize two alerts?',
        answer: [
          'I compare asset criticality, whether access succeeded, data sensitivity, active spread, confidence, and business impact.',
          'A successful unknown login to a database usually outranks failed attempts on a low-criticality workstation.',
          'I document why I chose the priority and keep the lower alert queued or assigned based on SLA.',
        ],
      },
      {
        question: 'When do you escalate?',
        answer: [
          'When the playbook boundary is exceeded, a critical asset is involved, activity is active/spreading, privileged accounts are involved, or containment requires permissions I do not own.',
          'I also escalate when evidence is ambiguous but potential impact is high.',
          'Escalation should include facts, timeline, impact, and the exact decision needed.',
        ],
      },
      {
        question: 'How do you close a false positive?',
        answer: [
          'I prove expected business context, benign source, known change, allowlisted tool, or normal baseline.',
          'I include evidence from at least the alert source and one supporting source where possible.',
          'If the alert is noisy, I recommend rule tuning rather than silently closing repeats.',
        ],
      },
      {
        question: 'What makes a strong incident report?',
        answer: [
          'Executive summary, affected assets/users, timeline, evidence, root cause, impact, containment, remediation, owner, current status, and lessons learned.',
          'It should be understandable to a manager and useful to the next analyst.',
          'Avoid unsupported claims; write what is known, unknown, and pending.',
        ],
      },
    ],
  },
  {
    title: 'Scripting and automation',
    focus: 'They already tested scripting, so be ready to explain and extend it.',
    questions: [
      {
        question: 'Find top 10 IPs in a large access log.',
        answer: [
          "Use: awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -10",
          'awk extracts the source IP field, sort groups identical values, uniq -c counts, sort -nr ranks, head shows top results.',
          'For huge logs, I would stream the file and avoid loading everything into memory.',
        ],
      },
      {
        question: 'How would Python help in SOC?',
        answer: [
          'Parse JSON/CSV logs, extract IOCs with regex, deduplicate them, enrich with APIs, and write a report.',
          'Python is better than shell when data is structured or when error handling/API calls are needed.',
          'I would protect API keys and handle rate limits/timeouts.',
        ],
      },
      {
        question: 'How do you write a detection rule?',
        answer: [
          'Define malicious behavior, required logs, fields, time window, threshold, severity, MITRE mapping, exclusions, and test data.',
          'Then test against known benign and malicious samples.',
          'Finally document why the rule exists and how analysts should triage it.',
        ],
      },
    ],
  },
  {
    title: 'Managerial and Zoho-fit questions',
    focus: 'Blend confidence, humility, clear communication, and shift readiness.',
    questions: [
      {
        question: 'Why should we hire you for SOC instead of development?',
        answer: [
          'My development background helps me understand how applications are built and where logic flaws happen.',
          'My bug bounty work gives attacker mindset and evidence collection discipline.',
          'SOC lets me use both to defend real users through monitoring, triage, and remediation communication.',
        ],
      },
      {
        question: 'How do you stay updated?',
        answer: [
          'I follow official and high-signal sources: CISA KEV/advisories, OWASP, MITRE ATT&CK, Microsoft security docs, vendor advisories, and trusted threat reports.',
          'I convert updates into practical actions: what logs to check, what IOCs matter, what detections need tuning, and what assets are exposed.',
          'I avoid forwarding news blindly; I validate threat intel with internal evidence.',
        ],
      },
      {
        question: 'Are you ready for 24x7 monitoring?',
        answer: [
          'Yes. I understand SOC is continuous operations and the role needs discipline during night shifts and handovers.',
          'I would manage sleep, hydration, breaks, and written notes carefully because alert quality depends on analyst focus.',
          'I would use checklists and handover notes to avoid missing context between shifts.',
        ],
      },
      {
        question: 'What if you do not know the answer during an incident?',
        answer: [
          'I would not guess. I would state what I know, collect more evidence, check the playbook, search trusted internal/official references, and escalate if impact or uncertainty is high.',
          'The key is to keep the incident moving while being honest about confidence.',
          'I would document assumptions separately from confirmed facts.',
        ],
      },
    ],
  },
  {
    title: 'Cryptography and TLS',
    focus: 'Understand crypto concepts practically — how they appear in SOC workflows, not academic depth.',
    questions: [
      {
        question: 'What is the difference between encryption and hashing?',
        answer: [
          'Encryption is reversible — data is transformed using a key and can be decrypted back to plaintext. Used for confidentiality (TLS, disk encryption, VPN tunnels).',
          'Hashing is one-way — data is transformed into a fixed-size fingerprint that cannot be reversed. Used for integrity verification (file hashes, password storage, digital signatures).',
          'SOC relevance: I use hashes to verify malware samples (SHA-256 on VirusTotal), confirm forensic image integrity, and compare file versions. I encounter encryption when analyzing TLS certificates, VPN tunnels, and encrypted C2 channels.',
        ],
      },
      {
        question: 'Explain symmetric vs asymmetric encryption.',
        answer: [
          'Symmetric uses one shared key for both encrypt and decrypt. Fast, efficient for bulk data. AES-256 is the current standard. Challenge: securely distributing the shared key.',
          'Asymmetric uses a key pair — public key encrypts, private key decrypts (or private signs, public verifies). RSA and ECC are common. Slower, used for key exchange and digital signatures.',
          'In TLS, both are used together: asymmetric crypto exchanges keys during the handshake, then symmetric crypto (AES-GCM) encrypts the actual data for performance.',
        ],
      },
      {
        question: 'How does the TLS handshake work?',
        answer: [
          'TLS 1.3: ClientHello (supported ciphers, key share, SNI) → ServerHello (chosen cipher, key share, encrypted certificate and finished) → Client verifies cert chain, sends finished → encrypted data begins. One round trip.',
          'TLS 1.2: same concept but takes two round trips and sends the certificate in plaintext. Also supports less-secure options like RSA key exchange (no PFS).',
          'SOC can inspect: SNI in ClientHello for domain visibility, JA3/JA3S fingerprints for TLS implementation identification, certificate details for trust validation, and TLS version/cipher for downgrade attack detection.',
        ],
      },
      {
        question: 'What happens when a certificate expires?',
        answer: [
          'Browsers and clients will show a warning or refuse the connection depending on the application. The connection is technically still encrypted, but identity verification fails.',
          'SOC investigation: check if the certificate expired due to renewal failure (ops issue) or if it was replaced by a self-signed certificate (potential MITM). Compare the certificate fingerprint against the organization\'s certificate inventory.',
          'Expired certificates on internal services can also indicate abandoned or shadow IT systems that are not properly maintained — these are often vulnerable.',
        ],
      },
      {
        question: 'How do you verify the integrity of a file or forensic image?',
        answer: [
          'Generate a cryptographic hash (SHA-256 preferred) of the original file immediately upon collection. Record this hash in the evidence log with timestamp and analyst name.',
          'Before analysis, re-hash the file and compare. If hashes match, integrity is confirmed. If they differ, the file has been modified and may not be admissible or reliable.',
          'Tools: sha256sum (Linux), Get-FileHash (PowerShell), certutil -hashfile (Windows CMD). For forensic disk images, use both MD5 and SHA-256 for compatibility with different tools and legal requirements.',
        ],
      },
    ],
  },
  {
    title: 'Cloud security and Zero Trust',
    focus: 'Show awareness of how cloud changes the attack surface and SOC operations compared to traditional on-premises environments.',
    questions: [
      {
        question: 'Explain the shared responsibility model.',
        answer: [
          'In IaaS (e.g., EC2, Azure VMs): provider manages physical infra, hypervisor, and storage hardware. Customer manages OS, applications, data, identity, network configuration, and patching.',
          'In SaaS (e.g., Office 365, Zoho): provider manages almost everything. Customer is responsible for identity management, access controls, data classification, and monitoring user behavior.',
          'SOC implication: in cloud environments, the logs you receive and the containment actions available depend entirely on the service model. You cannot image a server in SaaS — you work with API-driven audit logs and identity-based controls.',
        ],
      },
      {
        question: 'What are the most common cloud security misconfigurations?',
        answer: [
          'Publicly exposed storage (S3 buckets, Azure blobs) with sensitive data — often due to default permissions or ACL misconfiguration. Check: bucket policies, public access blocks, and access logs.',
          'Overly permissive IAM policies: wildcard permissions (Action: "*", Resource: "*"), unused credentials, service accounts with admin privileges, and missing MFA on privileged accounts.',
          'Security groups and network ACLs allowing 0.0.0.0/0 inbound on management ports (SSH 22, RDP 3389), disabled logging (CloudTrail, VPC Flow Logs), and unencrypted storage or transit.',
        ],
      },
      {
        question: 'What is Zero Trust and how does it differ from traditional VPN?',
        answer: [
          'Zero Trust principles: verify explicitly (authenticate and authorize every request based on all available data), use least privilege (JIT/JEA access, risk-based adaptive policies), and assume breach (minimize blast radius, segment access, verify end-to-end encryption).',
          'Traditional VPN grants network-level access — once authenticated, the user is "inside" and can often reach many resources. ZTNA (Zero Trust Network Access) grants per-application access with continuous verification.',
          'SOC impact: Zero Trust generates richer authentication and authorization logs per access request, enables more granular anomaly detection, and limits the blast radius of compromised credentials compared to flat VPN access.',
        ],
      },
      {
        question: 'What cloud logs would you check during an investigation?',
        answer: [
          'AWS: CloudTrail (API calls, who did what, when, from where), VPC Flow Logs (network connections), GuardDuty findings (threat detection), S3 access logs, and CloudWatch Logs for application-level events.',
          'Azure: Activity Log (control plane operations), Sign-in Logs and Audit Logs (identity events), NSG Flow Logs (network), and Defender for Cloud alerts. GCP: Admin Activity logs, Data Access logs, and Security Command Center findings.',
          'Key fields to check: identity (who), action (what API call), resource (what was affected), source IP, timestamp, user agent, and whether the action succeeded or was denied.',
        ],
      },
      {
        question: 'How does identity become the new perimeter in cloud?',
        answer: [
          'In traditional networks, the firewall was the perimeter — inside was trusted, outside was not. In cloud, there is no fixed perimeter; users, services, and data can be anywhere.',
          'Identity (IAM) becomes the primary control plane: who can access what, under what conditions, with what level of verification. Compromised credentials are the #1 cloud attack vector.',
          'SOC focus shifts to: impossible travel, unusual API calls, privilege escalation, cross-account access, service account abuse, and token/key theft. Identity logs become as critical as firewall logs were in traditional environments.',
        ],
      },
    ],
  },
  {
    title: 'Active Directory and lateral movement',
    focus: 'Demonstrate understanding of how AD attacks work and how the SOC detects each stage of compromise.',
    questions: [
      {
        question: 'Explain the Kerberos authentication flow.',
        answer: [
          'Step 1: Client sends AS-REQ to KDC with encrypted timestamp (pre-authentication). KDC validates against AD, returns TGT (Ticket Granting Ticket) encrypted with krbtgt account hash. Event ID 4768 is logged.',
          'Step 2: When accessing a service, client presents TGT to KDC\'s TGS (Ticket Granting Service), requesting a service ticket for the target SPN. KDC returns service ticket encrypted with the service account\'s hash. Event ID 4769 is logged.',
          'Step 3: Client presents the service ticket to the target service. The service decrypts it with its own hash, validates the ticket, and grants access. No password is ever transmitted — only encrypted tickets.',
        ],
      },
      {
        question: 'What is Kerberoasting and how do you detect it?',
        answer: [
          'Kerberoasting (T1558.003): any authenticated domain user can request a service ticket for any SPN. The attacker extracts the ticket and offline-cracks the service account password from the encrypted portion.',
          'Detection: monitor Event ID 4769 for anomalies — a single user requesting tickets for many different SPNs in a short time, especially with RC4 encryption type (0x17) when the environment normally uses AES.',
          'Mitigation: use long, complex passwords for service accounts (25+ characters), use Group Managed Service Accounts (gMSA) where possible, audit SPN assignments, and alert on bulk TGS requests.',
        ],
      },
      {
        question: 'What is a Golden Ticket attack and why is it so dangerous?',
        answer: [
          'Golden Ticket (T1558.001): if an attacker obtains the krbtgt account password hash (via DCSync or domain controller compromise), they can forge TGTs for any user, including Domain Admin, with any group membership and any lifetime.',
          'It is extremely dangerous because: the forged ticket is cryptographically valid, it survives individual password resets, it can impersonate any user, and it is very difficult to detect since the ticket never touches the KDC for validation.',
          'Remediation requires resetting the krbtgt password TWICE (current and previous keys), rebuilding trust in the domain, and potentially rebuilding domain controllers if they were compromised. Detection: look for TGTs with abnormally long lifetimes, Event ID 4769 without corresponding 4768, and domain field anomalies.',
        ],
      },
      {
        question: 'How do you detect lateral movement in a Windows environment?',
        answer: [
          'Monitor authentication events: Event ID 4624 (successful logon) with unusual source-destination pairs, Type 3 (network) and Type 10 (RDP) from unexpected hosts, and Event ID 4648 (explicit credential logon).',
          'Monitor process execution: Event ID 4688 or Sysmon 1 for PsExec, wmic.exe, mstsc.exe, PowerShell remoting, and Event ID 7045 for new service installations (PsExec creates PSEXESVC).',
          'Correlate across hosts: the same account authenticating to many hosts in sequence, admin share access (C$, ADMIN$), and time-based patterns (rapid sequential logins). Map findings to MITRE ATT&CK T1021 (Remote Services) sub-techniques.',
        ],
      },
      {
        question: 'Which Active Directory Event IDs are most critical for SOC?',
        answer: [
          'Authentication: 4768 (TGT request), 4769 (TGS request), 4771 (Kerberos pre-auth failed), 4776 (NTLM credential validation), 4624/4625 (logon success/failure).',
          'Privilege and group changes: 4672 (special privileges assigned), 4728/4732/4756 (member added to security-enabled group), 4662 (directory service access — critical for DCSync detection with specific replication GUIDs).',
          'Operational security: 7045 (new service installed), 4697 (service installed — varies by OS), 1102 (audit log cleared — potential evidence destruction), and 4720 (user account created). I would build SIEM correlation rules that chain these events together.',
        ],
      },
    ],
  },
  {
    title: 'DNS and network services',
    focus: 'Show deep understanding of DNS, DHCP, and ARP — how they work normally and how attackers abuse them.',
    questions: [
      {
        question: 'What are the key DNS record types and when do they matter for security?',
        answer: [
          'A (IPv4 address) and AAAA (IPv6) are the primary resolution records. MX (mail server) records are critical for email security — attackers may set up lookalike MX records for phishing infrastructure.',
          'TXT records hold SPF, DKIM, and DMARC policies for email authentication. CNAME (alias) can be abused for subdomain takeover if the target is decommissioned. NS records define authoritative servers — NS hijacking redirects entire zones.',
          'PTR (reverse DNS) maps IPs back to hostnames — useful for SOC to identify hosts. SOA (Start of Authority) contains zone metadata including serial number and TTL defaults. Understanding these helps the SOC interpret DNS logs and detect manipulation.',
        ],
      },
      {
        question: 'Walk me through the DNS resolution process.',
        answer: [
          'Client checks browser cache → OS resolver cache → hosts file → sends recursive query to configured DNS server (corporate or ISP) on UDP port 53.',
          'Recursive resolver checks its cache, then performs iterative queries: root server referral → TLD server referral (.com, .org) → authoritative nameserver for the domain → receives the final answer.',
          'Response is cached at each layer with TTL. SOC visibility: internal DNS server logs capture every query, Sysmon Event ID 22 ties queries to processes, and passive DNS databases track historical resolution.',
        ],
      },
      {
        question: 'Explain the DHCP process and what happens with a rogue DHCP server.',
        answer: [
          'DHCP DORA: client broadcasts Discover (UDP 67/68) → server responds with Offer (IP, subnet, gateway, DNS) → client broadcasts Request for chosen offer → server sends Acknowledge confirming the lease.',
          'A rogue DHCP server on the network can respond to Discover messages with its own Offer, providing a malicious gateway (for MITM) or malicious DNS servers (for DNS spoofing/phishing redirection).',
          'Defense: DHCP snooping on managed switches validates DHCP messages and maintains a trusted binding table. Only ports connected to authorized DHCP servers are allowed to send Offer/Acknowledge messages. SOC should alert on DHCP snooping violations.',
        ],
      },
      {
        question: 'What is ARP and how is it abused by attackers?',
        answer: [
          'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses on the local subnet. It is stateless — any device can send an ARP reply, and receivers update their cache without verification.',
          'ARP spoofing/poisoning: attacker sends gratuitous ARP replies claiming their MAC address maps to the gateway\'s IP. Victim traffic is then routed through the attacker, enabling MITM, credential sniffing, and session hijacking.',
          'Detection: DAI (Dynamic ARP Inspection) on switches validates ARP against the DHCP snooping table. SOC can monitor for duplicate IP-to-MAC mappings, ARP storm alerts, and IDS/IPS signatures for ARP anomalies. On endpoints, static ARP entries for critical gateways can prevent cache poisoning.',
        ],
      },
      {
        question: 'How is DNS abused by attackers, and how does the SOC detect it?',
        answer: [
          'DNS tunneling: encode data in subdomain labels (e.g., dGVzdA.evil.com) to exfiltrate data or establish C2 over port 53, which is rarely blocked. Detection: query length > 50 chars, high entropy in subdomains, high volume to single domain, and NXDOMAIN spikes.',
          'DNS beaconing/DGA: malware uses Domain Generation Algorithms to create pseudo-random domain names for C2 resilience. Detection: high unique domain count, algorithmmic patterns, low TTL, newly registered domains, and Sysmon Event ID 22 tying queries to suspicious processes.',
          'DNS hijacking/poisoning: redirect legitimate domains to attacker-controlled IPs via cache poisoning, compromised DNS servers, or registrar account takeover. Detection: monitor DNS response changes, DNSSEC validation failures, and compare resolved IPs against known-good baselines.',
        ],
      },
    ],
  },
]
