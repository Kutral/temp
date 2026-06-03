import type { ManagerRoundScenario } from './types'

export const managerRoundScenarios: ManagerRoundScenario[] = [
  {
    title: 'Single successful database login at 3 AM',
    prompt:
      'You see one successful login to a database server at 3 AM from an unknown public IP. Another alert shows many failed SSH attempts on a developer machine. Which first?',
    firstChecks: [
      'Handle the database login first because it is successful access to a critical asset.',
      'Check user, source IP, authentication method, geo, VPN status, MFA, change window, and whether the database is normally exposed.',
      'Correlate database audit logs, firewall/VPN logs, endpoint logs, and previous failed attempts.',
    ],
    signals: [
      'Critical asset',
      'Successful authentication',
      'Unusual time',
      'Unknown public IP',
      'Possible data exposure',
    ],
    answerFrame: [
      'I would not ignore failed SSH attempts, but successful access to a critical database has higher immediate impact.',
      'I would validate whether the login is expected, then scope what queries or data access occurred after login.',
      'If unauthorized, I would escalate, disable or reset the account through approved process, and preserve audit evidence.',
    ],
    escalateWhen:
      'Escalate immediately if the account is privileged, data was queried/exported, MFA was bypassed, or the source cannot be tied to approved VPN/business activity.',
  },
  {
    title: 'WAF blocks repeated SQL injection attempts',
    prompt: 'A WAF alert shows repeated payloads like UNION SELECT and %27 OR 1=1 against a login endpoint.',
    firstChecks: [
      'Confirm action: blocked, challenged, logged only, or allowed.',
      'Capture URL, method, payload, source IP, user agent, response code, response size, and timestamp.',
      'Search web/app/database logs for requests that bypassed the WAF or returned abnormal errors.',
    ],
    signals: [
      'Injection payloads',
      'Repeated endpoint targeting',
      'Authentication page',
      'Potential automated scanner',
      'Possible app weakness',
    ],
    answerFrame: [
      'I classify it as a web attack attempt first, not a confirmed breach.',
      'I verify whether the WAF blocked every request and whether the application produced SQL errors or unusual responses.',
      'I would recommend blocking/rate limiting if abusive, and send evidence to the app team for input validation and prepared statement review.',
    ],
    escalateWhen:
      'Escalate if any request was allowed, a 500/error spike appears, sensitive endpoint was targeted, or the source pivots to authenticated activity.',
  },
  {
    title: 'Private IP starts scanning internal subnet',
    prompt: 'Firewall or NDR shows 10.20.4.18 connecting to many internal hosts on ports 445 and 3389.',
    firstChecks: [
      'Identify hostname, owner, user, asset role, and whether a vulnerability scan was scheduled.',
      'Check EDR process tree for scanner tools, malware, scripts, or lateral movement commands.',
      'Review SMB/RDP success events and failed logons around the same time.',
    ],
    signals: [
      'East-west movement',
      'SMB/RDP targeting',
      'Internal private source',
      'Possible worm or lateral movement',
      'Needs asset owner validation',
    ],
    answerFrame: [
      'Because this is internal-to-internal traffic, I treat it as potential lateral movement until a valid scan/change is confirmed.',
      'I correlate network logs with endpoint and Windows authentication events to see if connections succeeded.',
      'If not expected, I isolate the source through approved process and hunt for the same behavior elsewhere.',
    ],
    escalateWhen:
      'Escalate if the source is not a scanner, connections succeed, privileged accounts are involved, or multiple hosts show follow-on process execution.',
  },
  {
    title: 'UDP DNS traffic spike to unusual domains',
    prompt: 'A host sends high-volume DNS queries to random-looking subdomains.',
    firstChecks: [
      'Check query names, frequency, length, NXDOMAIN rate, destination resolver, and whether DNS is going to approved resolvers.',
      'Inspect endpoint process responsible for DNS queries if Sysmon/EDR telemetry exists.',
      'Look for matching proxy/firewall egress after DNS resolution.',
    ],
    signals: [
      'DGA-like domains',
      'DNS tunneling possibility',
      'High NXDOMAIN rate',
      'Unusual process',
      'Possible C2',
    ],
    answerFrame: [
      'UDP DNS is normal, but volume, entropy, and destination matter.',
      'I would verify whether this is software update/CDN noise or suspicious beaconing/tunneling.',
      'If suspicious, I block domains/resolver path, isolate the host if needed, and collect process plus DNS timeline.',
    ],
    escalateWhen:
      'Escalate if DNS is tied to suspicious process execution, known malicious domains, data-looking subdomains, or outbound connections to bad IPs.',
  },
  {
    title: 'Phishing email with clicked URL',
    prompt: 'A user reports a phishing email, and proxy logs show they clicked the link.',
    firstChecks: [
      'Inspect headers, sender, SPF/DKIM/DMARC, URLs, attachments, and landing page behavior.',
      'Search all recipients and identify clickers.',
      'Check account sign-ins, MFA prompts, mailbox rules, forwarding, and endpoint activity after click time.',
    ],
    signals: [
      'User interaction',
      'Credential theft risk',
      'Possible mailbox compromise',
      'Scope beyond one user',
      'Needs containment',
    ],
    answerFrame: [
      'I would treat the click as potential compromise, not just phishing attempt.',
      'I scope who received it and who clicked, then check if credentials were submitted or malware executed.',
      'I would block URL/domain, purge email, reset credentials if needed, and document recipients and actions.',
    ],
    escalateWhen:
      'Escalate if credentials were submitted, malicious code executed, mailbox forwarding rules were created, or privileged users were targeted.',
  },
  {
    title: 'PowerShell encoded command alert',
    prompt: 'EDR alerts on powershell.exe with -nop -w hidden -enc from a user workstation.',
    firstChecks: [
      'Capture full command line, parent process, user, script block logs if enabled, and network/file activity.',
      'Decode the Base64 safely in an isolated analysis process if permitted.',
      'Check whether Office, browser, or script host launched PowerShell.',
    ],
    signals: [
      'Obfuscation',
      'Defense evasion flags',
      'Possible malware downloader',
      'Needs parent-child context',
      'Endpoint containment candidate',
    ],
    answerFrame: [
      'Those flags are high-risk because they hide UI, bypass normal interaction, and obfuscate intent.',
      'I would inspect parent process and decode the command to understand whether it downloads payloads, changes persistence, or contacts C2.',
      'If malicious, I isolate host, collect hash/process artifacts, and hunt the command pattern across endpoints.',
    ],
    escalateWhen:
      'Escalate if the command downloads files, modifies registry/tasks/services, steals credentials, or connects externally.',
  },
  {
    title: 'Ransomware early warning',
    prompt: 'An endpoint shows mass file renames, shadow copy deletion, and suspicious network connections.',
    firstChecks: [
      'Confirm file activity volume, process name, parent process, command line, user, and affected shares.',
      'Look for vssadmin/wbadmin/bcdedit usage, service stop attempts, and encryption extensions.',
      'Identify spread: other endpoints, SMB activity, domain account use, and backup system access.',
    ],
    signals: [
      'Mass file modification',
      'Recovery interference',
      'Lateral movement risk',
      'Business impact',
      'Immediate containment needed',
    ],
    answerFrame: [
      'I would treat this as critical because availability and recovery are at risk.',
      'I would isolate affected endpoints, disable compromised accounts through approved process, and protect backups/shares.',
      'I would escalate to IR immediately while preserving evidence and timeline.',
    ],
    escalateWhen:
      'Escalate immediately; ransomware behavior is beyond normal Tier 1 closure and needs coordinated incident response.',
  },
  {
    title: 'Noisy failed-login SIEM rule',
    prompt: 'A failed-login rule creates thousands of alerts every shift. How do you improve it?',
    firstChecks: [
      'Measure current false positives by source, user, asset, time, authentication type, and known service accounts.',
      'Separate brute force, password spraying, misconfigured service, scanner, and normal user mistakes.',
      'Check if success-after-failure, privileged accounts, impossible travel, or critical assets should increase severity.',
    ],
    signals: [
      'Alert fatigue',
      'Needs context',
      'Threshold problem',
      'Detection engineering mindset',
      'Risk of false negatives',
    ],
    answerFrame: [
      'I would not simply raise the threshold blindly because that may create false negatives.',
      'I would add context: asset criticality, distinct users, distinct sources, success after failures, privileged users, and business-hour baseline.',
      'I would test the tuned rule against past incidents and document what changed.',
    ],
    escalateWhen:
      'Escalate tuning decisions if they reduce coverage for critical systems or require detection engineering approval.',
  },
  {
    title: 'Impossible travel login detection',
    prompt:
      'A user logs in from India, then 30 minutes later from Germany. The SIEM flags this as impossible travel. How do you investigate?',
    firstChecks: [
      'Verify both login events: timestamps, source IPs, geolocations, authentication method, MFA status, device fingerprint, user agent, and session IDs.',
      'Check if either login used a VPN, proxy, Tor exit node, or cloud provider IP range — these can cause false geo-mismatches.',
      'Compare device fingerprints and browser/OS metadata between the two sessions to determine if both are from the same device or different devices.',
      'Check if both sessions are active concurrently or if the first session was terminated before the second began.',
      'Verify with the user or their manager whether international travel, VPN usage, or delegated access is expected.',
    ],
    signals: [
      'Geographically impossible time gap',
      'Possible credential theft',
      'Potential session token reuse or replay',
      'MFA bypass risk',
      'Could indicate account sharing or compromise',
    ],
    answerFrame: [
      'I would first determine if this is a true geographic impossibility or a VPN/proxy artifact by examining the source IP context.',
      'I would check whether both logins succeeded, whether MFA was prompted and passed, and whether the device fingerprints match.',
      'If the logins are from genuinely different locations with different devices and no VPN explanation, I treat this as potential credential compromise and check for data access, mailbox rule changes, lateral movement, and privilege escalation during both sessions.',
      'I would also check if the user\'s credentials appeared in recent credential dumps or if phishing was reported targeting this user.',
    ],
    escalateWhen:
      'Escalate if both logins are from different devices without VPN explanation, if sensitive data was accessed during the suspicious session, if MFA was bypassed, or if the account has elevated privileges.',
  },
  {
    title: 'DNS tunneling and data exfiltration via DNS',
    prompt:
      'Your SIEM shows a single internal host sending thousands of DNS queries to a single domain, with unusually long and encoded-looking subdomain names. How do you investigate?',
    firstChecks: [
      'Examine the DNS query patterns: subdomain length (normal is under 30 chars; tunneling often exceeds 50), character entropy (Base32/Base64 encoded strings), query frequency (hundreds per minute vs normal single-digit), and consistent parent domain.',
      'Check the NXDOMAIN response rate — DNS tunneling tools often generate high NXDOMAIN rates due to encoding/chunking errors or intentional non-existent lookups.',
      'Identify the process on the endpoint making these queries using Sysmon Event ID 22 or EDR process-to-DNS correlation. Legitimate software does not generate high-entropy subdomain queries.',
      'Calculate data volume: total bytes in query names vs normal DNS baseline. DNS tunneling can exfiltrate data at 10-50 KB/s — slow but sufficient for credentials, configs, and database exports.',
      'Check if the destination domain is registered recently, uses unusual TLD, has low reputation, or resolves to known C2 infrastructure.',
    ],
    signals: [
      'High-volume DNS to single domain',
      'Long, high-entropy subdomain names',
      'Elevated NXDOMAIN rate',
      'Suspicious process generating queries',
      'Data exfiltration channel',
      'Potential C2 communication',
    ],
    answerFrame: [
      'I would treat high-entropy, high-volume DNS queries to a single domain as a strong indicator of DNS tunneling until proven otherwise.',
      'I would identify the source process and user, check whether known tunneling tools (iodine, dnscat2, dns2tcp, Cobalt Strike DNS beacon) are present, and inspect the endpoint for signs of compromise.',
      'I would calculate the data volume exfiltrated by analyzing total query name bytes over time, and check what data the user or process had access to.',
      'For immediate containment, I would block the suspicious domain at the DNS resolver/RPZ, isolate the endpoint if compromise is confirmed, and hunt for the same domain or similar patterns across all endpoints.',
    ],
    escalateWhen:
      'Escalate if data exfiltration is confirmed or strongly suspected, if the endpoint shows signs of C2 activity, if the process is associated with known attacker tooling, or if the affected user has access to sensitive data.',
  },
  {
    title: 'Supply chain compromise alert',
    prompt:
      'A security advisory reports that a trusted third-party library used in your organization contains a backdoor in its latest update. How do you respond?',
    firstChecks: [
      'Verify the advisory source and affected versions: check the vendor\'s official security bulletin, CVE databases, and trusted sources like CISA, NVD, or the project\'s GitHub security advisories.',
      'Identify deployment scope: which internal systems, applications, and environments use the affected library version. Check package managers (npm, pip, Maven), container images, and CI/CD build manifests.',
      'Compare file hashes of deployed binaries against known-good hashes from before the compromise and against the known-bad hashes published in the advisory.',
      'Monitor network connections from affected systems for C2 indicators: unusual outbound connections, DNS queries to new domains, data exfiltration patterns, and connections to IPs/domains listed in the advisory IOCs.',
      'Check if any affected system has shown anomalous behavior since the compromised version was deployed: unexpected process execution, file modifications, privilege escalation, or lateral movement.',
    ],
    signals: [
      'Trusted vendor compromise',
      'Wide potential blast radius',
      'Backdoor in legitimate software',
      'Supply chain integrity failure',
      'Possible active exploitation',
      'Needs cross-team coordination',
    ],
    answerFrame: [
      'I would immediately scope the impact: how many systems, which environments, how long the compromised version has been deployed, and what data those systems have access to.',
      'I would validate the compromise by comparing deployed hashes against both the known-good prior version and the known-bad compromised version.',
      'For containment, I would work with the application team to roll back to the last known-good version, block IOCs from the advisory at firewall/proxy/DNS, and isolate any system showing post-compromise behavior.',
      'I would perform retroactive hunting across all logs from the deployment date of the compromised version to identify any exploitation that already occurred.',
    ],
    escalateWhen:
      'Escalate immediately — supply chain compromises can have widespread impact. Escalate if the library is deployed in production, if any system shows post-compromise activity, or if the compromised library handles sensitive data, authentication, or cryptographic operations.',
  },
  {
    title: 'Insider threat — unusual data access patterns',
    prompt:
      'An alert fires because an employee in HR is accessing engineering design documents and customer databases outside their normal scope, at 2 AM on a weekend. How do you investigate?',
    firstChecks: [
      'Verify the user identity and confirm the account is not compromised by checking authentication logs, MFA status, source IP/device, and whether the session started with normal login flow.',
      'Check the data classification and sensitivity of accessed files. Determine whether the user has legitimate access permissions or if access control is too permissive.',
      'Review the volume and pattern: how many files accessed, was data downloaded or just viewed, were there bulk downloads or systematic access patterns, and how does this compare to the user\'s normal access baseline?',
      'Check for data exfiltration channels: USB device connections (Windows Event ID 6416 or EDR USB monitoring), cloud storage uploads (proxy/CASB logs), email attachments with sensitive files, or print jobs.',
      'Coordinate with HR to check the employee\'s status: is the employee on a PIP (Performance Improvement Plan), has the employee submitted resignation, are there any pending disciplinary actions, or is there a known business reason for this access?',
    ],
    signals: [
      'Out-of-scope data access',
      'Off-hours activity',
      'Potential data theft',
      'Insider threat indicators',
      'Possible pre-resignation exfiltration',
      'Requires HR coordination',
    ],
    answerFrame: [
      'I would first verify account integrity to rule out compromise, then focus on the intent indicators: what data was accessed, how much, through what channel, and whether any data left the organization.',
      'I would review the user\'s normal access baseline to determine if this is genuinely anomalous or if they have a legitimate business reason (cross-team project, role change, manager-approved task).',
      'I would check all exfiltration channels — USB, cloud uploads, email, print — and document the timeline of access, volumes, and data sensitivity.',
      'Insider threat investigations are sensitive. I would document findings factually without speculation, protect the employee\'s privacy per company policy, and coordinate with HR and legal through my manager rather than confronting the employee directly.',
    ],
    escalateWhen:
      'Escalate to manager and HR/legal if data exfiltration is confirmed, if the employee is accessing highly sensitive data without authorization, if the employee has submitted resignation or is on a PIP, or if the access pattern suggests systematic data collection.',
  },
  {
    title: 'Certificate anomaly and SSL stripping detection',
    prompt:
      'TLS inspection reveals that several internal services are presenting expired or self-signed certificates, and a user reports that their banking site loaded over HTTP instead of HTTPS. How do you investigate?',
    firstChecks: [
      'For internal certificate issues: identify which services are affected, check certificate details (issuer, CN/SAN, expiration date, chain completeness), determine if certificates expired due to renewal failure or were replaced with self-signed certs by an attacker.',
      'For the HTTP downgrade report: check the user\'s proxy/browser logs for the banking site connection — was it HTTPS initially and downgraded, or was it always HTTP? Check for HSTS header presence on the site.',
      'Inspect the network path for MITM indicators: ARP cache on the user\'s machine (arp -a), check for ARP spoofing on the switch, verify the default gateway MAC address, and look for rogue devices on the network segment.',
      'Check if a TLS-intercepting proxy is deployed and functioning correctly — sometimes proxy certificate issues can cause false self-signed alerts.',
      'Review network logs for SSLstrip-style behavior: HTTP 301/302 redirects being intercepted, HTTPS links in responses being rewritten to HTTP, or DNS spoofing redirecting to an attacker-controlled proxy.',
    ],
    signals: [
      'Certificate trust failure',
      'Possible MITM attack',
      'HTTPS to HTTP downgrade',
      'Internal PKI management issue',
      'SSL stripping possibility',
      'Network-level compromise risk',
    ],
    answerFrame: [
      'I would separate the two issues but investigate for a common cause: a MITM attacker on the network could both present self-signed certificates to internal services and perform SSL stripping on external connections.',
      'For the certificate anomalies, I would check whether this is a PKI/certificate management failure (expired certs not renewed) or a security incident (certs replaced by attacker). I compare current certificate fingerprints against known-good values from certificate inventory.',
      'For the SSL stripping, I would verify the user\'s network path for ARP spoofing, rogue DHCP, or DNS poisoning. I would check if HSTS is configured on affected sites and whether the browser ignored HSTS warnings.',
      'If MITM is confirmed, I would identify the rogue device, isolate the affected network segment, force re-authentication for all users on the segment, and investigate what data may have been intercepted during the attack window.',
    ],
    escalateWhen:
      'Escalate immediately if MITM is confirmed or strongly suspected, if self-signed certificates appeared without change management approval, if sensitive data (credentials, financial, PII) was transmitted over the downgraded HTTP connection, or if multiple users or segments are affected.',
  },
]
