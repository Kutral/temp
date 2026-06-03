import type { ManagerRoundDomain } from './types'

export const managerRoundDomains: ManagerRoundDomain[] = [
  {
    title: 'TCP, UDP, ports, and protocol behavior',
    managerAngle:
      'A SOC manager may start with "TCP vs UDP" and keep drilling until you can connect handshake behavior to logs, scans, and attacks.',
    mustExplain: [
      'TCP is connection-oriented and reliable; it uses sequence numbers, acknowledgements, retransmission, and the SYN -> SYN-ACK -> ACK handshake.',
      'UDP is connectionless and lightweight; delivery, ordering, and duplicate protection are not guaranteed, so applications must handle reliability if needed.',
      'TCP flags matter in SOC logs: SYN for connection start, ACK for acknowledgement, FIN for graceful close, RST for reset, PSH for pushed data.',
      'Ports identify application services, but port number alone does not prove the protocol. HTTP can run on 53 and malware can tunnel over 443.',
    ],
    mustMemorize: [
      'TCP examples: HTTP/HTTPS, SSH, SMTP, IMAP, RDP, SMB.',
      'UDP examples: DNS, DHCP, NTP, SNMP, VoIP, streaming, QUIC.',
      'Key ports: 21 FTP, 22 SSH, 25 SMTP, 53 DNS, 67/68 DHCP, 80 HTTP, 123 NTP, 135/139/445 Windows services, 443 HTTPS, 3389 RDP.',
      'SYN flood: many SYNs without completing handshakes can exhaust server state; scan noise shows many SYNs to many ports.',
    ],
    likelyQuestions: [
      'Walk me through the TCP three-way handshake and where it appears in firewall or Wireshark logs.',
      'Why does DNS often use UDP but sometimes TCP?',
      'How can attackers abuse allowed ports like 443 or 53?',
      'What does a TCP RST tell you during investigation?',
    ],
    answerFormula:
      'Define the protocol, explain how it behaves on the wire, name the log fields you would inspect, then connect it to a security scenario.',
  },
  {
    title: 'Public IP, private IP, subnetting, and NAT',
    managerAngle:
      'They may test whether you can look at an IP address in a log and immediately understand exposure, routing, ownership, and investigation path.',
    mustExplain: [
      'RFC 1918 private ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.',
      'Private IPs are valid inside an enterprise but are not directly reachable from the public Internet.',
      'NAT/PAT maps many internal private hosts to one or more public IPs and ports, so firewall/NAT logs are needed to identify the true internal host.',
      'CIDR and subnet masks define network and host portions; managers may ask simple subnet reasoning, not only definitions.',
    ],
    mustMemorize: [
      '10.0.0.0 - 10.255.255.255',
      '172.16.0.0 - 172.31.255.255',
      '192.168.0.0 - 192.168.255.255',
      'Direction matters: external-to-internal ingress, internal-to-external egress, internal-to-internal lateral movement.',
    ],
    likelyQuestions: [
      'If a SIEM alert shows source 192.168.10.25, can you check it in VirusTotal?',
      'How does a private laptop receive a response from a public website?',
      'What is the difference between NAT and PAT?',
      'How do you identify the endpoint behind a shared public IP?',
    ],
    answerFormula:
      'Classify the IP, identify direction and network zone, then name the logs needed to map it to a user, asset, and business context.',
  },
  {
    title: 'Data center and enterprise network architecture',
    managerAngle:
      'The employee warning about architecture/flows means you should be able to draw traffic through edge, DMZ, WAF, load balancer, application, database, and logging layers.',
    mustExplain: [
      'North-south traffic enters or leaves the data center; east-west traffic moves between internal systems.',
      'A typical web app path is Internet -> router/edge -> firewall -> DMZ -> WAF/reverse proxy/load balancer -> app tier -> database tier.',
      'Segmentation limits blast radius; database servers should not be directly Internet reachable.',
      'High availability uses redundant devices, load balancers, failover, backups, and disaster recovery across data centers.',
    ],
    mustMemorize: [
      'DMZ: semi-trusted zone for externally reachable services.',
      'WAF: Layer 7 HTTP protection in front of web apps.',
      'IDS receives mirrored traffic; IPS sits inline and can block.',
      'SPAN/TAP, NetFlow, firewall logs, WAF logs, proxy logs, EDR, and app logs feed the SOC.',
    ],
    likelyQuestions: [
      'Draw the architecture of a public web application hosted in a data center.',
      'Where would you place a WAF and why?',
      'What is east-west traffic and why is it important after compromise?',
      'How do logs from the data center reach the SIEM?',
    ],
    answerFormula:
      'Start from the user request, walk each network/security layer in order, then explain what each layer logs and what it protects.',
  },
  {
    title: 'OWASP Top 10, web attacks, and WAF thinking',
    managerAngle:
      'Your bug bounty background is a strength, so expect deeper questions on SQLi, XSS, IDOR/BOLA, SSRF, auth failures, and how a SOC detects them.',
    mustExplain: [
      'OWASP Top 10:2025 is current; Top 10:2021 is still common in interviews, so know both and call out the difference calmly.',
      'A network firewall allowing 443 does not stop SQL injection because the malicious payload is inside allowed HTTP/S traffic.',
      'WAFs inspect URLs, headers, methods, parameters, body patterns, cookies, and anomaly scores at Layer 7.',
      'Broken access control and IDOR are detected through suspicious object access patterns, not only one obvious payload string.',
    ],
    mustMemorize: [
      'OWASP 2025 includes Broken Access Control, Security Misconfiguration, Software Supply Chain Failures, Cryptographic Failures, Injection, Insecure Design, Authentication Failures, Software/Data Integrity Failures, Security Logging and Alerting Failures, and Mishandling Exceptional Conditions.',
      'OWASP 2021 includes Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable and Outdated Components, Identification and Authentication Failures, Software/Data Integrity Failures, Security Logging and Monitoring Failures, and SSRF.',
      'Log clues: %27, UNION SELECT, OR 1=1, <script>, ../, /etc/passwd, whoami, curl, unusual 401/403/500 spikes, response size anomalies.',
      'SOC follow-up: was it blocked, was it allowed, did it return data, did errors spike, did the same IP repeat, did account activity follow?',
    ],
    likelyQuestions: [
      'Why do we need a WAF if we already have a firewall?',
      'How would SQL injection appear in web logs?',
      'What makes IDOR hard to detect?',
      'Which OWASP issue is most relevant to SOC monitoring?',
    ],
    answerFormula:
      'Name the vulnerability, show one request/log clue, determine whether exploitation succeeded, then give remediation and monitoring recommendations.',
  },
  {
    title: 'Defensive tools: firewall, IDS/IPS, SIEM, EDR, proxy, email security',
    managerAngle:
      'Managers want practical tool boundaries. You should explain what each tool sees, what it misses, and what evidence you collect from it.',
    mustExplain: [
      'Firewall controls traffic between networks by policy, usually based on IP, port, protocol, state, application, or user context.',
      'IDS detects and alerts; IPS can prevent by dropping packets, resetting sessions, or blocking traffic inline.',
      'SIEM collects, normalizes, correlates, and alerts on logs from many sources.',
      'EDR records endpoint behavior such as process trees, command lines, file writes, registry changes, and network connections.',
      'Proxy and email gateways help with web browsing and phishing evidence: URL, category, user, action, sender, auth results, attachment hash.',
    ],
    mustMemorize: [
      'Firewall: IP/port/protocol/session/action.',
      'WAF: URL/method/headers/body/payload/application response.',
      'EDR: process/user/hash/parent-child/network/persistence.',
      'SIEM: correlation rule/time window/fields/evidence/ticket.',
    ],
    likelyQuestions: [
      'Explain firewall vs WAF vs IDS vs IPS.',
      'What is the difference between AV and EDR?',
      'What logs would you check for a suspicious IP alert?',
      'How would you tune a noisy SIEM rule?',
    ],
    answerFormula:
      'For every tool, answer: where is it placed, what does it inspect, what action can it take, and what evidence does it give the SOC?',
  },
  {
    title: 'SOC operations, triage, escalation, reporting, and 24x7 mindset',
    managerAngle:
      'The JD is heavy on triage, ticket queues, written remediation, prioritization, incident closure, and improving monitoring beyond playbook alerts.',
    mustExplain: [
      'Event is any observable activity; alert is a rule-detected suspicious event; incident is confirmed or strongly suspected security impact.',
      'Prioritize by asset criticality, confirmed success, scope, business impact, confidence, and active spread.',
      'A Tier 1 analyst should follow playbooks, collect evidence, close obvious false positives with proof, and escalate when impact or uncertainty is high.',
      'Good reporting includes summary, timeline, evidence, root cause, impact, containment, remediation, owner, status, and recommendations.',
    ],
    mustMemorize: [
      'NIST IR: preparation, detection/analysis, containment, eradication, recovery, post-incident lessons learned.',
      'True positive, false positive, true negative, false negative.',
      'Shift handover: active incidents, pending evidence, owners, next action, deadline, risk.',
      'Alert improvement: baseline normal behavior, suppress known benign, add context, tune threshold, map to MITRE ATT&CK.',
    ],
    likelyQuestions: [
      'Two alerts come at once. Which do you handle first and why?',
      'When do you escalate to a senior analyst?',
      'How do you prove an alert is false positive?',
      'What makes a good incident report?',
    ],
    answerFormula:
      'State your priority decision, justify with impact and evidence, describe immediate actions, document clearly, and mention escalation criteria.',
  },
  {
    title: 'Windows, Linux, macOS, Active Directory, and endpoint logs',
    managerAngle:
      'The JD explicitly says administrative skill across Windows, OS X, and Linux. Expect log paths, event IDs, process/network commands, and AD basics.',
    mustExplain: [
      'Windows Security logs show logons, failures, privilege use, process creation if auditing is enabled, service installs, and audit clearing.',
      'Sysmon improves endpoint telemetry with process creation, network connection, DNS query, registry, file, and injection-related events.',
      'Linux triage uses /var/log/auth.log or /var/log/secure, journalctl, ps, ss, lsof, who, last, grep, awk, and file permission checks.',
      'Active Directory centralizes identity; domain controllers, Kerberos/NTLM, groups, GPOs, and privileged accounts are core SOC investigation areas.',
      'macOS basics include unified logs, system extensions, launch agents/daemons, Gatekeeper, and suspicious persistence locations.',
    ],
    mustMemorize: [
      'Windows: 4624 successful logon, 4625 failed logon, 4672 special privileges, 4688 process creation, 7045 service installed, 1102 audit log cleared.',
      'Sysmon: 1 process creation, 3 network connection, 7 image loaded, 10 process access, 11 file create, 12/13 registry, 22 DNS query.',
      'Linux: /var/log/auth.log, /var/log/secure, /var/log/syslog, /var/log/messages, /var/log/nginx/access.log.',
      'AD: domain, domain controller, LDAP, Kerberos tickets, groups, GPO, account lockout, password spraying.',
    ],
    likelyQuestions: [
      'Which Windows Event IDs do you check for brute force?',
      'What Linux commands show active network connections?',
      'What is Active Directory and why does SOC monitor it?',
      'What does Event ID 1102 indicate?',
    ],
    answerFormula:
      'Name the log source, name the specific event or command, explain the field you inspect, then connect it to the incident timeline.',
  },
  {
    title: 'Scripting, log-search queries, and automation',
    managerAngle:
      'Because shell scripting is marked MUST, the manager may ask you to explain your scripting round and then extend it into real SOC log parsing.',
    mustExplain: [
      'Bash pipelines are ideal for fast text logs: grep filters, awk/cut extracts, sort orders, uniq -c counts, head ranks.',
      'Python is useful when logs are JSON/CSV, when regex extraction is needed, or when enrichment APIs are involved.',
      'PowerShell is important for Windows investigation: Get-WinEvent, Get-Process, Get-Service, Get-NetTCPConnection.',
      'Security tool rules need clear logic: condition, time window, threshold, exclusions, severity, MITRE mapping, and test cases.',
    ],
    mustMemorize: [
      "Top IPs from access log: awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -10",
      "Failed SSH count: grep 'Failed password' /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr",
      "PowerShell event query: Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}",
      'Python flow: read file, parse fields/regex, deduplicate IOCs, enrich, write report.',
    ],
    likelyQuestions: [
      'How would you parse a 10 GB Apache log for top source IPs?',
      'How would you automate IP reputation enrichment?',
      'What checks do you add before running a script in production?',
      'How would you tune a detection rule that is too noisy?',
    ],
    answerFormula:
      'Start with a one-line command, explain each stage, then mention scale, validation, error handling, and how the output supports triage.',
  },
  {
    title: 'Threat intelligence, current threats, and staying updated',
    managerAngle:
      'The JD asks you to stay updated on malware and threats. Use current examples without turning the answer into news trivia.',
    mustExplain: [
      'CISA KEV helps prioritize vulnerabilities known to be exploited in the wild.',
      'MITRE ATT&CK maps adversary tactics and techniques so alerts can be explained as behavior, not just tool names.',
      'Current breach trends emphasize vulnerability exploitation, mobile social engineering, supply-chain risk, ransomware, infostealers, and abuse of trusted services.',
      'Threat intel must be validated against internal evidence before blocking or escalating.',
    ],
    mustMemorize: [
      'IOC examples: IP, domain, URL, hash, email sender, user-agent, registry key, file path.',
      'IOA examples: password spraying, impossible travel, PowerShell encoded command, unusual DNS volume, mass file rename.',
      'Sources to mention: CISA KEV/advisories, vendor advisories, MITRE ATT&CK, Microsoft/Sysinternals docs, OWASP, VirusTotal, AbuseIPDB, trusted security blogs.',
      'Do not over-trust one reputation result; correlate with logs and business context.',
    ],
    likelyQuestions: [
      'How do you stay updated on latest malware?',
      'What is the difference between IOC and IOA?',
      'How would you use MITRE ATT&CK in a SOC ticket?',
      'Why should vulnerability exploitation change SOC priorities in 2026?',
    ],
    answerFormula:
      'Mention credible sources, explain how you convert intelligence into detection or triage action, and close with validation against internal logs.',
  },
  {
    title: 'DNS deep dive: records, resolution, and abuse',
    managerAngle:
      'DNS is foundational to nearly every network activity. A manager may start with "explain DNS resolution" and drill into record types, caching, poisoning, tunneling, and how DNS-over-HTTPS impacts SOC visibility.',
    mustExplain: [
      'DNS maps human-readable domain names to IP addresses (and vice versa). It uses a hierarchical, distributed database with delegated authority at each level.',
      'Resolution hierarchy: browser cache → OS resolver cache → configured recursive DNS server → root nameservers (.) → TLD nameservers (.com) → authoritative nameserver for the domain → answer cached at each layer with TTL.',
      'Key record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail server priority), NS (authoritative nameserver), TXT (SPF/DKIM/DMARC/verification), PTR (reverse lookup), SOA (zone authority and serial).',
      'DNS poisoning/spoofing injects false records into resolver caches, redirecting users to attacker-controlled IPs. DNSSEC adds digital signatures to DNS responses to prevent tampering.',
      'DNS tunneling encodes data in DNS queries/responses (e.g., base64 in subdomain labels) to exfiltrate data or establish C2 over port 53, which is almost always allowed through firewalls.',
      'DNS over HTTPS (DoH) and DNS over TLS (DoT) encrypt DNS queries, improving privacy but reducing SOC visibility because traditional DNS logging at network level no longer captures query content.',
    ],
    mustMemorize: [
      'DNS uses UDP port 53 for most queries; TCP port 53 for zone transfers (AXFR/IXFR) and responses exceeding 512 bytes.',
      'Root servers are identified by letters a.root-servers.net through m.root-servers.net; there are 13 logical root server identities served by hundreds of anycast instances.',
      'TTL (Time To Live) controls how long a record is cached; attackers may use very low TTLs (fast flux) to rotate IPs rapidly.',
      'SOC DNS log fields: query name, query type, response code (NOERROR, NXDOMAIN, SERVFAIL, REFUSED), source IP, resolved IP, timestamp, process (if Sysmon Event ID 22).',
      'DGA (Domain Generation Algorithm) indicators: high entropy domain names, algorithmically generated patterns, high NXDOMAIN rates, rapid unique domain lookups.',
    ],
    likelyQuestions: [
      'Walk me through DNS resolution step by step.',
      'What are the key DNS record types and when does each matter for security?',
      'How would you detect DNS tunneling in your SIEM?',
      'What impact does DNS over HTTPS have on SOC monitoring?',
      'How does DNS poisoning work and how do you detect it?',
    ],
    answerFormula:
      'Start with what DNS does and how resolution works, name the record types relevant to the scenario, explain the attack vector or abuse pattern, then describe what DNS logs reveal to the SOC and what fields to inspect.',
  },
  {
    title: 'DHCP, ARP, and Layer 2 fundamentals',
    managerAngle:
      'Layer 2 knowledge separates strong candidates from those who only know application-layer security. Expect questions on DHCP process, ARP spoofing, VLANs, and how Layer 2 attacks enable man-in-the-middle or network sniffing.',
    mustExplain: [
      'DHCP assigns IP addresses dynamically using the DORA process: Discover (broadcast to find servers), Offer (server proposes an IP), Request (client accepts one offer), Acknowledge (server confirms the lease).',
      'DHCP snooping is a switch-level security feature that validates DHCP messages and builds a binding table mapping MAC → IP → port → VLAN, preventing rogue DHCP servers from poisoning network configuration.',
      'ARP maps IP addresses to MAC addresses on the local network. ARP is stateless and trusts all replies, making it vulnerable to ARP spoofing/poisoning where an attacker sends gratuitous ARP replies to associate their MAC with another host\'s IP.',
      'ARP spoofing enables man-in-the-middle attacks, session hijacking, and traffic interception on the local subnet. Detection involves monitoring for duplicate IP-to-MAC mappings, gratuitous ARP storms, and DAI (Dynamic ARP Inspection) alerts.',
      'VLANs (802.1Q) segment broadcast domains at Layer 2, reducing attack surface and containing lateral movement. VLAN hopping via double tagging or switch spoofing can bypass segmentation if trunking is misconfigured.',
      'Spanning Tree Protocol (STP) prevents Layer 2 loops. STP attacks can cause network disruption or traffic redirection. BPDU Guard protects edge ports from rogue switches.',
    ],
    mustMemorize: [
      'DHCP ports: server listens on UDP 67, client uses UDP 68. DHCPv6 uses UDP 546 (client) and UDP 547 (server).',
      'DHCP DORA: Discover (broadcast) → Offer → Request → Acknowledge. Lease renewal at 50% (T1) and 87.5% (T2) of lease time.',
      'ARP operates at Layer 2 and has no authentication. Gratuitous ARP is an unsolicited ARP reply used to update caches — also the basis of ARP poisoning.',
      'DAI (Dynamic ARP Inspection) validates ARP packets against the DHCP snooping binding table and drops invalid ARP messages.',
      'Layer 2 vs Layer 3 attacks: Layer 2 attacks (ARP spoofing, VLAN hopping, MAC flooding, STP manipulation) are local subnet attacks; Layer 3+ attacks can traverse routed networks.',
    ],
    likelyQuestions: [
      'Explain the DHCP process and what happens if a rogue DHCP server exists.',
      'What is ARP spoofing and how do you detect it?',
      'How do VLANs improve security?',
      'What is the difference between Layer 2 and Layer 3 attacks?',
      'What is DHCP snooping and why does it matter?',
    ],
    answerFormula:
      'Define the protocol and its normal behavior, explain the attack that exploits it, name the detection mechanism or log evidence, then connect to how a SOC analyst would investigate or contain the issue.',
  },
  {
    title: 'VPN, tunneling, and Zero Trust architecture',
    managerAngle:
      'VPN and Zero Trust are critical for remote workforce security. A manager will test whether you understand VPN protocols, where VPN logs fit in SOC workflows, and whether you grasp the shift from perimeter-based to identity-based security.',
    mustExplain: [
      'IPSec VPN has two phases: IKE Phase 1 (establish secure channel, authenticate peers, negotiate SA using main mode or aggressive mode) and IKE Phase 2 (negotiate IPSec SA, establish ESP/AH tunnel for actual data encryption).',
      'ESP (Encapsulating Security Payload) provides confidentiality + integrity + authentication. AH (Authentication Header) provides integrity + authentication but no encryption. ESP is used far more commonly.',
      'SSL/TLS VPN operates at the application layer (typically port 443), is easier to deploy through browsers, and does not require special client software for basic access.',
      'Split tunnel routes only corporate traffic through VPN while Internet traffic goes direct — faster but reduces SOC visibility. Full tunnel routes everything through VPN — slower but complete visibility and policy enforcement.',
      'VPN logs are critical for SOC: connection timestamp, source IP, assigned internal IP, user identity, authentication method, MFA status, session duration, bytes transferred, disconnect reason.',
      'Zero Trust principles: verify explicitly (authenticate and authorize every request), use least privilege access (JIT/JEA), assume breach (minimize blast radius, segment access, verify end-to-end encryption). ZTNA replaces traditional VPN by providing per-application access rather than full network access.',
    ],
    mustMemorize: [
      'IPSec ports/protocols: IKE uses UDP 500, NAT traversal uses UDP 4500, ESP is IP protocol 50, AH is IP protocol 51.',
      'Site-to-site VPN connects two networks (always-on, gateway-to-gateway). Remote access VPN connects individual users to the corporate network.',
      'Zero Trust mantra: "Never trust, always verify." Identity is the new perimeter, not the network edge.',
      'ZTNA vs VPN: VPN grants network-level access once authenticated; ZTNA grants application-level access per request with continuous verification.',
      'SOC VPN investigation: check for impossible travel (login from two distant geos in short time), concurrent sessions from different IPs, brute force against VPN portal, and credential stuffing.',
    ],
    likelyQuestions: [
      'Explain the two phases of IPSec VPN.',
      'What is the difference between split tunnel and full tunnel, and which is better for security?',
      'What is Zero Trust and how does it change SOC operations?',
      'What VPN logs would you check during an incident investigation?',
      'Why might an organization prefer ZTNA over traditional VPN?',
    ],
    answerFormula:
      'Define the VPN type or Zero Trust concept, explain how it works technically, describe the logs and evidence it generates, then connect to a SOC investigation or detection scenario.',
  },
  {
    title: 'TLS/SSL handshake and certificate management',
    managerAngle:
      'TLS is everywhere in modern networks. A manager expects you to explain the handshake, differentiate TLS 1.2 from 1.3, understand certificate chain of trust, and know what TLS errors mean during SOC investigation.',
    mustExplain: [
      'TLS 1.2 handshake (2-RTT): ClientHello (supported cipher suites, random) → ServerHello (chosen cipher, random) → Server sends Certificate + ServerKeyExchange + ServerHelloDone → Client verifies cert, sends ClientKeyExchange + ChangeCipherSpec + Finished → Server sends ChangeCipherSpec + Finished → encrypted data flows.',
      'TLS 1.3 handshake (1-RTT): ClientHello includes key share → ServerHello includes key share + encrypted extensions + certificate + finished → Client verifies and sends finished → encrypted data begins. The entire handshake is faster and more secure.',
      'Certificate chain of trust: Root CA (self-signed, stored in trust stores) → Intermediate CA (signed by root) → Leaf/end-entity certificate (signed by intermediate, presented by server). All three must form a valid chain for the browser/client to trust the connection.',
      'Cipher suite negotiation selects key exchange algorithm (ECDHE, DHE), authentication (RSA, ECDSA), bulk encryption (AES-128-GCM, AES-256-GCM, ChaCha20), and hash (SHA-256, SHA-384). TLS 1.3 removed insecure options like RSA key exchange, RC4, 3DES, and CBC mode.',
      'Perfect Forward Secrecy (PFS) uses ephemeral keys (ECDHE/DHE) so that compromise of the server\'s long-term private key does not decrypt past sessions. TLS 1.3 mandates PFS.',
      'Common TLS errors for SOC: expired certificate (check renewal process), self-signed certificate (not trusted by default, may indicate MITM or misconfiguration), CN/SAN mismatch (domain doesn\'t match cert), revoked certificate (check CRL/OCSP), weak cipher suite (potential downgrade attack).',
    ],
    mustMemorize: [
      'TLS 1.2 uses 2 round trips; TLS 1.3 uses 1 round trip and supports 0-RTT resumption (with replay risk).',
      'TLS 1.3 removed: RSA key exchange (no PFS), RC4, 3DES, CBC, static DH, compression, and renegotiation.',
      'Certificate pinning: client stores expected certificate or public key hash and rejects connections with different certificates, preventing CA compromise or MITM with rogue certs.',
      'SSL stripping (sslstrip): attacker downgrades victim\'s HTTPS connection to HTTP via MITM, intercepting plaintext traffic. HSTS (HTTP Strict Transport Security) header prevents this by telling browsers to always use HTTPS.',
      'SOC TLS inspection: many organizations deploy TLS-intercepting proxies that decrypt, inspect, and re-encrypt traffic. This creates visibility but requires proper certificate management and privacy considerations.',
    ],
    likelyQuestions: [
      'Walk me through the TLS 1.3 handshake.',
      'What is the difference between TLS 1.2 and TLS 1.3?',
      'What does "certificate chain of trust" mean?',
      'What would you do if you see a self-signed certificate alert?',
      'What is Perfect Forward Secrecy and why does it matter?',
    ],
    answerFormula:
      'Describe the handshake steps in order, explain why each step matters for security, identify what log evidence or alerts the SOC would see, then connect to a real investigation scenario like MITM detection or certificate anomaly.',
  },
  {
    title: 'Cryptography for SOC analysts',
    managerAngle:
      'A SOC analyst does not need to implement crypto but must understand when and why encryption, hashing, and digital signatures appear in investigations — from verifying file integrity to understanding TLS inspection to handling forensic evidence.',
    mustExplain: [
      'Symmetric encryption uses one shared key for both encryption and decryption. Fast and efficient for bulk data. Examples: AES-128, AES-256 (current standard), DES (broken, 56-bit key), 3DES (legacy, slow). Key distribution is the challenge.',
      'Asymmetric encryption uses a key pair: public key encrypts, private key decrypts (or private signs, public verifies). Slower but solves key distribution. Examples: RSA (2048/4096-bit), ECC (Elliptic Curve, shorter keys for same security), Diffie-Hellman (key exchange, not encryption).',
      'Hashing produces a fixed-size fingerprint of data. One-way, deterministic, and collision-resistant. Examples: MD5 (128-bit, broken, still seen in legacy), SHA-1 (160-bit, deprecated), SHA-256 (current standard for integrity), SHA-3 (alternative standard).',
      'HMAC (Hash-based Message Authentication Code) combines a secret key with a hash to provide both integrity and authentication. Used in API authentication, session tokens, and message verification.',
      'Digital signatures: sender hashes the message, encrypts the hash with their private key. Receiver decrypts with sender\'s public key and compares hashes. Provides authentication, integrity, and non-repudiation.',
      'PKI (Public Key Infrastructure): Root CA → Intermediate CA → end-entity certificates. Trust stores, CRLs, OCSP, certificate lifecycle management. PKI underpins TLS, code signing, email signing (S/MIME), and VPN authentication.',
    ],
    mustMemorize: [
      'AES-256 is the gold standard for symmetric encryption. AES-GCM provides both encryption and authentication (AEAD).',
      'RSA key sizes: 2048-bit minimum, 4096-bit recommended. ECC P-256 provides equivalent security to RSA-3072 with much smaller keys.',
      'Hash comparison: MD5 = 128 bits (broken), SHA-1 = 160 bits (deprecated), SHA-256 = 256 bits (standard), SHA-3 = variable (alternative).',
      'SOC crypto use cases: file hash verification (malware analysis), certificate inspection (TLS alerts), evidence integrity (forensic chain of custody), password storage (bcrypt/scrypt/Argon2, not raw MD5/SHA).',
      'Diffie-Hellman enables two parties to establish a shared secret over an insecure channel without transmitting the secret itself. ECDHE is the modern ephemeral variant used in TLS.',
    ],
    likelyQuestions: [
      'What is the difference between encryption and hashing?',
      'When would a SOC analyst need to understand cryptography?',
      'Explain symmetric vs asymmetric encryption with examples.',
      'How do you verify the integrity of a forensic disk image?',
      'What is a digital signature and how does it work?',
    ],
    answerFormula:
      'Define the cryptographic concept, give concrete examples with key sizes or algorithm names, explain where a SOC analyst encounters it in daily work, then connect to an investigation scenario like hash verification or certificate analysis.',
  },
  {
    title: 'MITRE ATT&CK framework for SOC operations',
    managerAngle:
      'MITRE ATT&CK is the industry standard for describing adversary behavior. A manager expects you to map alerts to tactics and techniques, use ATT&CK for gap analysis, and reference specific technique IDs when discussing threats.',
    mustExplain: [
      'MITRE ATT&CK is a knowledge base of adversary tactics (the "why" — the goal), techniques (the "how" — the method), and sub-techniques (specific implementation). Enterprise ATT&CK covers Windows, Linux, macOS, Cloud, Network, and Containers.',
      'Key tactics in order: Reconnaissance → Resource Development → Initial Access → Execution → Persistence → Privilege Escalation → Defense Evasion → Credential Access → Discovery → Lateral Movement → Collection → Command and Control → Exfiltration → Impact.',
      'Initial Access examples: T1566 Phishing (spearphishing attachment .001, link .002, service .003), T1190 Exploit Public-Facing Application (web app vulns, Log4Shell, Exchange ProxyLogon/ProxyShell), T1078 Valid Accounts.',
      'Execution: T1059 Command and Scripting Interpreter (PowerShell .001, Bash .004, Python .006), T1204 User Execution (malicious link .001, file .002).',
      'Persistence and Privilege Escalation: T1053 Scheduled Task/Job, T1547 Boot or Logon Autostart Execution (Registry Run Keys .001), T1543 Create or Modify System Process (Windows Service .003).',
      'Credential Access: T1003 OS Credential Dumping (LSASS Memory .001, SAM .002, DCSync .006), T1558 Steal or Forge Kerberos Tickets (Golden Ticket .001, Kerberoasting .003).',
      'Lateral Movement: T1021 Remote Services (RDP .001, SMB/Windows Admin Shares .002, WinRM .006), T1570 Lateral Tool Transfer.',
      'SOC integration: map SIEM rules to ATT&CK technique IDs, identify detection gaps by comparing covered techniques to known adversary profiles, use ATT&CK Navigator to visualize coverage, include technique IDs in incident tickets for consistent language.',
    ],
    mustMemorize: [
      'Tactic = why (goal), Technique = how (method), Sub-technique = specific implementation. Procedures = real-world adversary usage.',
      'T1566 Phishing, T1190 Exploit Public-Facing App, T1059 Command/Scripting Interpreter, T1053 Scheduled Task, T1547 Boot Autostart, T1003 Credential Dumping, T1021 Remote Services.',
      'ATT&CK Navigator is a web tool to visualize coverage, heat-map detections, and identify blind spots.',
      'MITRE D3FEND is the defensive counterpart — maps defensive techniques to ATT&CK offensive techniques.',
      'When writing a SOC ticket: "Observed T1059.001 (PowerShell) spawned from T1204.002 (User Execution: Malicious File)" is more precise than "suspicious PowerShell detected."',
    ],
    likelyQuestions: [
      'What is MITRE ATT&CK and how do you use it in a SOC?',
      'Explain the difference between tactics, techniques, and sub-techniques.',
      'How would you map a SIEM alert to ATT&CK?',
      'Name some Initial Access and Lateral Movement techniques.',
      'How does ATT&CK help with detection gap analysis?',
    ],
    answerFormula:
      'Name the framework component (tactic/technique), give the technique ID and name, describe the adversary behavior, explain what log evidence the SOC would use for detection, then show how ATT&CK improves alert classification and coverage analysis.',
  },
  {
    title: 'Active Directory attacks and defense',
    managerAngle:
      'Active Directory is the backbone of enterprise identity in Windows environments. A manager will test your understanding of Kerberos, common AD attack paths, critical Event IDs, and how the SOC detects and responds to AD-targeted attacks.',
    mustExplain: [
      'Kerberos authentication flow: client requests TGT from KDC/AS (Authentication Service) with encrypted timestamp → KDC validates, returns TGT encrypted with krbtgt hash → client presents TGT to TGS (Ticket Granting Service) requesting service ticket → TGS returns service ticket encrypted with target service account hash → client presents service ticket to target service.',
      'Kerberoasting (T1558.003): attacker with any domain user account requests service tickets for SPNs, then extracts and offline-cracks the service account password from the ticket. Detection: Event ID 4769 with encryption type 0x17 (RC4) and anomalous volume of TGS requests from a single user.',
      'AS-REP Roasting: targets accounts with "Do not require Kerberos pre-authentication" enabled. Attacker requests AS-REP without proving identity, extracts and offline-cracks the password. Detection: Event ID 4768 with pre-authentication type 0 and result code 0.',
      'Pass-the-Hash (T1550.002): attacker uses stolen NTLM hash to authenticate without knowing the plaintext password. Detection: Event ID 4624 with Logon Type 9 (NewCredentials) or 3 (Network) from unusual sources, and mismatched account/workstation patterns.',
      'Golden Ticket (T1558.001): attacker with the krbtgt account hash forges TGTs for any user including Domain Admin. Extremely difficult to detect because the ticket is valid. Detection: TGT with abnormally long lifetime, Event ID 4769 without corresponding 4768, domain field anomalies.',
      'DCSync (T1003.006): attacker mimics domain controller replication (using GetNCChanges) to extract password hashes from AD. Requires Replicating Directory Changes privileges. Detection: Event ID 4662 with specific GUIDs for directory replication, unexpected source computer for replication requests.',
      'BloodHound maps AD relationships and identifies shortest attack paths to Domain Admin. Defenders should run BloodHound proactively to find and remediate dangerous paths before attackers do.',
    ],
    mustMemorize: [
      'AD Event IDs: 4768 (TGT requested/AS), 4769 (Service Ticket requested/TGS), 4770 (Service Ticket renewed), 4771 (Kerberos pre-auth failed), 4776 (NTLM credential validation).',
      'Kerberoasting indicators: spike in 4769 events, RC4 encryption (0x17) when AES should be standard, single user requesting tickets for many SPNs.',
      'Golden Ticket persistence: survives password resets of all accounts EXCEPT krbtgt. Remediation requires resetting krbtgt password TWICE (to invalidate both current and previous keys).',
      'Privileged AD groups to monitor: Domain Admins, Enterprise Admins, Schema Admins, Account Operators, Backup Operators, Server Operators, and all members of AdminSDHolder-protected groups.',
      'DCSync detection: Event 4662 with GUID {1131f6aa-9c07-11d1-f79f-00c04fc2dcd2} (DS-Replication-Get-Changes) from non-DC sources. Also monitor for Mimikatz or SharpHound process execution.',
    ],
    likelyQuestions: [
      'Explain the Kerberos authentication flow.',
      'What is Kerberoasting and how do you detect it?',
      'What is a Golden Ticket attack and why is it dangerous?',
      'Which AD Event IDs are most important for SOC monitoring?',
      'How would you detect lateral movement through Active Directory?',
    ],
    answerFormula:
      'Describe the AD/Kerberos mechanism involved, explain how the attacker abuses it, name the specific Event IDs and log fields for detection, then describe the SOC response and containment actions.',
  },
  {
    title: 'Cloud security and shared responsibility model',
    managerAngle:
      'As organizations migrate to cloud, SOC analysts must understand the shared responsibility model, cloud-native logging, identity-based attacks, and common misconfigurations. Expect questions about how cloud changes traditional SOC workflows.',
    mustExplain: [
      'Shared responsibility model: In IaaS, customer manages OS, apps, data, identity, network config; provider manages physical infra, hypervisor, storage hardware. In PaaS, provider also manages OS and runtime. In SaaS, provider manages almost everything; customer manages identity, access, and data classification.',
      'Identity is the new perimeter in cloud. IAM misconfigurations (overly permissive policies, unused credentials, lack of MFA, wildcard permissions) are the most common root cause of cloud breaches.',
      'Common cloud misconfigurations: publicly exposed S3 buckets/Azure blobs with sensitive data, security groups allowing 0.0.0.0/0 inbound, unencrypted storage, logging disabled, overprivileged service accounts, API keys committed to public repositories.',
      'Cloud audit logs: AWS CloudTrail (API activity, management events, data events), Azure Activity Log + Azure Monitor, GCP Cloud Audit Logs (Admin Activity, Data Access, System Event). These are the SOC\'s primary evidence source in cloud environments.',
      'Serverless and container security: containers can have vulnerable base images, excessive privileges, exposed management interfaces (Kubernetes dashboard). Serverless functions can have injection via event data, overprivileged execution roles, and insecure dependencies.',
      'CSPM (Cloud Security Posture Management) tools continuously scan cloud configurations against security benchmarks (CIS Benchmarks) and alert on misconfigurations. Examples: AWS Security Hub, Azure Defender for Cloud, GCP Security Command Center, third-party tools like Prisma Cloud.',
    ],
    mustMemorize: [
      'IaaS: customer owns OS through data. PaaS: customer owns app and data. SaaS: customer owns identity and data classification.',
      'AWS critical logs: CloudTrail (API), VPC Flow Logs (network), GuardDuty (threat detection), S3 access logs, CloudWatch (metrics/logs). Azure equivalents: Activity Log, NSG Flow Logs, Defender for Cloud, Storage Analytics.',
      'Top cloud attack vectors: credential theft/leak, misconfigured storage, overprivileged IAM, exposed management interfaces, insecure APIs, supply chain via compromised CI/CD.',
      'Zero Trust in cloud: no implicit trust based on network location; every request is authenticated, authorized, and encrypted regardless of origin. Micro-segmentation limits blast radius.',
      'Cloud incident response differences: no physical access, API-driven evidence collection, snapshot-based forensics, IAM-centric containment (revoke keys, disable accounts, modify policies), and ephemeral infrastructure may destroy evidence if not preserved.',
    ],
    likelyQuestions: [
      'Explain the shared responsibility model for IaaS vs SaaS.',
      'What are the most common cloud security misconfigurations?',
      'How does cloud change SOC investigation workflows?',
      'What cloud logs would you check during an incident?',
      'How does Zero Trust apply to cloud environments?',
    ],
    answerFormula:
      'Identify the cloud service model, explain who is responsible for what, name the specific cloud logs or tools for detection, then describe how the SOC investigates and responds differently compared to on-premises environments.',
  },
]
