import type { ManagerRoundFlow } from './types'

export const managerRoundFlows: ManagerRoundFlow[] = [
  {
    title: 'Browser request to a Zoho-style SaaS application',
    interviewPrompt: 'Explain what happens when you type zoho.com in a browser and press Enter.',
    steps: [
      'Browser checks cache, then asks a DNS resolver for the domain IP.',
      'Client uses ARP locally if needed to reach the gateway, then routes traffic to the destination.',
      'For HTTPS, client opens TCP with SYN -> SYN-ACK -> ACK to port 443.',
      'TLS handshake validates certificate, negotiates cipher suite, and creates encrypted session keys.',
      'HTTP request travels through edge controls such as CDN, DDoS protection, WAF, reverse proxy, and load balancer.',
      'Application tier processes the request and may query database or internal services.',
      'Response returns through the same path; DNS, WAF, firewall, proxy, app, and endpoint logs may feed the SIEM.',
    ],
    talkTrack:
      'I would explain it layer by layer: DNS first, transport connection, TLS encryption, HTTP request, security controls, app/database processing, response, and logs for SOC visibility.',
    evidence: ['DNS logs', 'Firewall session', 'WAF event', 'Load balancer log', 'App access log', 'Endpoint browser/proxy log'],
  },
  {
    title: 'Segmented data center web architecture',
    interviewPrompt: 'Draw a basic secure data center flow for a public web app.',
    steps: [
      'Internet user reaches edge router and perimeter firewall.',
      'Allowed traffic enters the DMZ where public-facing reverse proxies, WAFs, and load balancers sit.',
      'Load balancer forwards valid HTTP/S traffic to web or app servers.',
      'App servers access database servers on restricted internal ports.',
      'East-west traffic is segmented by VLANs, ACLs, host firewalls, and service rules.',
      'IDS/IPS, NetFlow, WAF, firewall, EDR, and app logs feed central SIEM monitoring.',
    ],
    talkTrack:
      'I would never place the database directly on the Internet. The goal is layered controls, least privilege between tiers, high availability, and enough logging to reconstruct suspicious activity.',
    evidence: ['Perimeter firewall logs', 'WAF logs', 'Load balancer logs', 'Server logs', 'Database audit logs', 'IDS/IPS alerts'],
  },
  {
    title: 'SOC alert to incident handling flow',
    interviewPrompt: 'What do you do when a SIEM alert appears in the queue?',
    steps: [
      'Acknowledge the alert and record timestamp, source, destination, user, asset, rule, and severity.',
      'Validate whether the activity is expected by checking asset role, user role, change window, allowlists, and recent tickets.',
      'Collect supporting evidence from adjacent logs: firewall, DNS, proxy, EDR, identity, application, and threat intel.',
      'Classify as false positive, benign true positive, suspicious, or incident.',
      'Contain or recommend mitigation if active risk exists; escalate if business impact, critical assets, or uncertainty is high.',
      'Document timeline, impact, root cause, actions taken, owner, pending tasks, and closure evidence.',
    ],
    talkTrack:
      'My priority is not to panic or close quickly. I validate, scope, preserve evidence, act within playbook authority, and escalate when the incident exceeds Tier 1 confidence or permissions.',
    evidence: ['SIEM alert', 'Ticket notes', 'Correlated logs', 'Threat intel result', 'Containment action', 'Closure proof'],
  },
  {
    title: 'Phishing investigation flow',
    interviewPrompt: 'An employee reports a suspicious email. What are your exact steps?',
    steps: [
      'Preserve the email and inspect full headers, not only the visible From name.',
      'Check SPF, DKIM, DMARC, Return-Path, Reply-To, Received chain, sender domain, and lookalike spelling.',
      'Extract URLs and attachment hashes safely; check reputation and detonate only in approved sandbox process.',
      'Search mail logs for all recipients and identify who opened, clicked, or submitted credentials.',
      'Check endpoint, browser/proxy, DNS, and sign-in logs for follow-on activity.',
      'Block sender/domain/URL/hash, remove messages, reset credentials, isolate endpoint if payload executed, and document findings.',
    ],
    talkTrack:
      'The manager will like hearing that I determine scope, not just whether one email is bad. I check who else received it, who interacted, and whether any account or endpoint is now compromised.',
    evidence: ['Raw headers', 'Authentication results', 'URL/hash reputation', 'Recipient search', 'Click logs', 'Sign-in logs'],
  },
  {
    title: 'WAF SQL injection or XSS alert flow',
    interviewPrompt: 'WAF alerts on a possible SQLi/XSS attempt. What next?',
    steps: [
      'Capture source IP, user account if any, URL, method, parameters, payload, user agent, response code, response size, and action.',
      'Classify the payload: SQLi, XSS, command injection, traversal, SSRF, scanner, or malformed benign request.',
      'Verify whether WAF blocked it or application processed it.',
      'Check app errors, database logs, unusual 500s, data-size changes, and follow-on authenticated activity.',
      'Search for repeat attempts across other endpoints and source IPs.',
      'Escalate with evidence and recommend WAF rule tuning, input validation, prepared statements, output encoding, or access control fixes.',
    ],
    talkTrack:
      'A WAF block is not automatically the end of the case. I still check repetition, target criticality, whether any request got through, and whether the application showed exploitation symptoms.',
    evidence: ['WAF event', 'Web access log', 'App error log', 'Database audit log', 'Threat intel', 'Developer remediation ticket'],
  },
  {
    title: 'Endpoint beaconing or malware suspicion flow',
    interviewPrompt: 'EDR shows a suspicious process contacting an unknown IP. What do you do?',
    steps: [
      'Record hostname, user, process, parent process, command line, file path, hash, destination, port, and first seen time.',
      'Check process lineage for Office-to-script, browser-to-exe, PowerShell encoded command, or unsigned binary behavior.',
      'Correlate DNS, proxy, firewall, and Sysmon network events for the same host.',
      'Check reputation for IP/domain/hash and compare with internal allowlists.',
      'If active C2, credential theft, or lateral movement is suspected, isolate endpoint through approved process.',
      'Hunt for same hash, same command line, same domain, and same user activity across the environment.',
    ],
    talkTrack:
      'The key is process context. A destination IP alone is weak evidence; process tree plus DNS/proxy/firewall plus file hash makes the case stronger.',
    evidence: ['EDR process tree', 'Sysmon Event ID 1/3/22', 'Firewall/proxy logs', 'Hash reputation', 'Isolation record', 'Hunt results'],
  },
  {
    title: 'DNS resolution complete flow',
    interviewPrompt: 'Walk me through exactly what happens when a client resolves a domain name, and where DNS logs appear for SOC.',
    steps: [
      'Application requests resolution. Browser/OS checks local DNS cache first (previously resolved entries with valid TTL).',
      'If not cached, OS checks the hosts file (C:\\Windows\\System32\\drivers\\etc\\hosts on Windows, /etc/hosts on Linux). Entries here override DNS — attackers may modify this for redirection.',
      'OS sends a recursive query to the configured DNS resolver (corporate DNS server, ISP resolver, or public resolver like 8.8.8.8 on UDP port 53).',
      'Recursive resolver checks its own cache. If not found, it begins iterative queries starting with a root nameserver (e.g., a.root-servers.net).',
      'Root nameserver responds with a referral to the appropriate TLD nameserver (e.g., .com TLD servers for "example.com").',
      'TLD nameserver responds with a referral to the authoritative nameserver for the specific domain (e.g., ns1.example.com).',
      'Authoritative nameserver returns the final answer (e.g., A record 93.184.216.34). If DNSSEC is enabled, the response includes RRSIG signatures for validation.',
      'Response is cached at each layer (resolver, OS, browser) according to the TTL value. The application now has the IP and initiates the connection.',
      'SOC visibility points: internal DNS server query logs, Sysmon Event ID 22 (DNS query with process context), passive DNS databases, DNS firewall/RPZ (Response Policy Zone) logs, and network-level DNS capture.',
    ],
    talkTrack:
      'I would trace the query from the application through each cache layer and delegation step, emphasizing that each resolution level is a potential logging and detection point. The key for SOC is knowing which process initiated the query and whether the resolved domain is suspicious.',
    evidence: [
      'Internal DNS server query/response logs',
      'Sysmon Event ID 22 (process-level DNS)',
      'Passive DNS databases',
      'DNS firewall/RPZ block logs',
      'Network packet capture on port 53',
      'NXDOMAIN and SERVFAIL rate metrics',
    ],
  },
  {
    title: 'VPN connection establishment flow',
    interviewPrompt: 'Explain the step-by-step process of establishing an IPSec VPN connection and what the SOC sees at each stage.',
    steps: [
      'User launches VPN client and enters credentials (username/password, certificate, or MFA token). Client resolves the VPN gateway hostname via DNS.',
      'IKE Phase 1 begins: client and VPN gateway negotiate security parameters (encryption algorithm, hash, DH group, authentication method, lifetime) and establish a secure management channel (ISAKMP SA) over UDP port 500.',
      'In Main Mode (6 messages, identity protected) or Aggressive Mode (3 messages, faster but identity exposed), peers authenticate using pre-shared keys (PSK) or digital certificates and establish the IKE SA.',
      'IKE Phase 2 (Quick Mode): using the secure channel from Phase 1, peers negotiate the IPSec SA parameters (ESP/AH, encryption, integrity, PFS DH group, traffic selectors) for the actual data tunnel.',
      'ESP tunnel is established. All matching traffic is encrypted with the negotiated algorithms and encapsulated in ESP packets (IP protocol 50). If NAT is detected, NAT-T encapsulates ESP in UDP port 4500.',
      'Client receives an internal IP address from the VPN gateway pool. DNS, routing, and split/full tunnel policy are pushed to the client. User traffic now flows through the encrypted tunnel.',
      'VPN concentrator/gateway logs the complete session: username, source public IP, assigned internal IP, authentication method, MFA result, connection timestamp, session duration, bytes transferred, and disconnect reason.',
    ],
    talkTrack:
      'I would emphasize that VPN logs are a critical SOC data source for remote access visibility. I check for impossible travel, concurrent sessions from different locations, brute force against the VPN portal, unusual connection times, and excessive data transfer. VPN is often the first target in credential-based attacks.',
    evidence: [
      'VPN gateway authentication logs',
      'IKE negotiation logs (Phase 1/2 success or failure)',
      'Assigned IP and session metadata',
      'RADIUS/LDAP/MFA authentication logs',
      'Firewall logs for UDP 500/4500 and ESP',
      'NetFlow for tunnel traffic volume',
    ],
  },
  {
    title: 'TLS 1.3 handshake flow',
    interviewPrompt: 'Walk through the TLS 1.3 handshake and explain how it differs from TLS 1.2. What can the SOC see?',
    steps: [
      'Client sends ClientHello: supported TLS versions, cipher suites (TLS 1.3 only allows AEAD ciphers like AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305), supported groups (key exchange curves), key share (client\'s ephemeral DH public key), and SNI (Server Name Indication — visible in plaintext, used by SOC for domain monitoring).',
      'Server responds with ServerHello: chosen cipher suite, server\'s key share. From this point, both sides can compute the handshake keys. Server immediately sends EncryptedExtensions, Certificate, CertificateVerify (signature proving private key possession), and Finished — all encrypted.',
      'Client receives server messages, verifies the certificate chain (Leaf → Intermediate → Root CA in trust store), validates CertificateVerify signature, computes application keys, and sends its own Finished message.',
      'Encrypted application data begins. Total handshake: 1-RTT (round trip time), compared to TLS 1.2\'s 2-RTT. TLS 1.3 also supports 0-RTT resumption using PSK (Pre-Shared Key) from previous sessions, but 0-RTT data is vulnerable to replay attacks.',
      'Key differences from TLS 1.2: server certificate is encrypted (not visible to passive observers), no RSA key exchange (mandatory PFS), removed insecure algorithms (RC4, 3DES, CBC, static DH), no renegotiation, and faster handshake.',
      'SOC visibility: SNI in ClientHello is still plaintext in most deployments (ECH/ESNI may encrypt it in the future), JA3/JA3S fingerprints identify client/server TLS implementations, certificate transparency logs provide public certificate issuance records, and TLS-intercepting proxies can provide full content inspection.',
    ],
    talkTrack:
      'I would explain the 1-RTT advantage and mandatory PFS in TLS 1.3, then note the SOC implications: encrypted server certificates reduce passive inspection capability, making endpoint and proxy-based logging more important. JA3 fingerprinting and SNI remain valuable for threat detection without decryption.',
    evidence: [
      'SNI from ClientHello (domain visibility)',
      'JA3/JA3S TLS fingerprints',
      'Certificate Transparency logs',
      'TLS-intercepting proxy logs (if deployed)',
      'Firewall/IDS TLS metadata (version, cipher)',
      'Certificate chain validation alerts',
    ],
  },
  {
    title: 'Lateral movement detection flow',
    interviewPrompt: 'An endpoint is compromised. Walk me through how the attacker moves laterally and how the SOC detects each step.',
    steps: [
      'Initial compromise: attacker gains foothold via phishing (T1566), exploit (T1190), or valid credentials (T1078). EDR alerts on suspicious process execution, and the compromised host becomes the pivot point.',
      'Credential harvesting: attacker dumps credentials using Mimikatz (T1003.001 LSASS), SAM database extraction (T1003.002), or Kerberoasting (T1558.003). SOC detection: Sysmon Event ID 10 (process access to lsass.exe), Event ID 4769 spikes for Kerberoasting, credential guard alerts.',
      'Internal reconnaissance/discovery: attacker enumerates the network using net user /domain, net group "Domain Admins" /domain, nltest /dclist, ping sweeps, port scans, and potentially BloodHound/SharpHound for AD mapping (T1087, T1016, T1018). SOC detection: unusual LDAP queries, SMB enumeration patterns, process creation events for recon tools.',
      'Lateral movement attempt: attacker uses harvested credentials to move to other systems via PsExec/SMB (T1021.002, creates service, Event ID 7045), WMI (T1047, wmiprvse.exe child processes), RDP (T1021.001, Event ID 4624 Type 10), WinRM (T1021.006), or Pass-the-Hash (T1550.002). Each method leaves distinct log artifacts.',
      'SOC detection correlations: process creation events (4688/Sysmon 1) showing lateral movement tools, authentication events (4624/4625) with unusual source-destination pairs, new service installations (7045), unusual network connections to admin shares (C$, ADMIN$), and time-based anomalies (off-hours, rapid multi-host access).',
      'Containment response: isolate compromised endpoints via EDR network isolation, disable or reset compromised accounts, block attacker\'s internal IPs at network segments, hunt for same TTPs across all endpoints, preserve forensic evidence, and escalate to IR team with full timeline and IOCs.',
    ],
    talkTrack:
      'I would walk through the attacker\'s progression from foothold to credential theft to recon to movement, showing that each phase has detectable artifacts. The SOC advantage is correlation — a single Event ID 4624 is normal, but 4624 from an unusual source after 4769 spikes after a phishing alert tells a story. I would hunt proactively for the same TTPs across the environment.',
    evidence: [
      'EDR process tree and command line logs',
      'Windows Event IDs: 4624, 4625, 4648, 4688, 4769, 7045, 1102',
      'Sysmon Events: 1 (process), 3 (network), 10 (process access), 11 (file create)',
      'Firewall/NDR for internal east-west connections',
      'Authentication logs (NTLM/Kerberos)',
      'AD audit logs for group/privilege changes',
    ],
  },
]
