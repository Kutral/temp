# Manager Round Question Bank

Use these as spoken practice. Keep answers short first, then go deeper only if the manager asks follow-ups.

## Networking

### 1. What is the difference between TCP and UDP?

TCP is reliable and connection-oriented. It uses a handshake, sequence numbers, acknowledgements, retransmission, and connection state. UDP is connectionless and lightweight; it sends datagrams without guaranteeing delivery or order. In SOC analysis, TCP logs show connection state and flags, while UDP investigation depends more on volume, destination, payload behavior, and application context.

### 2. Explain TCP three-way handshake.

Client sends SYN, server replies SYN-ACK, client replies ACK. After that, data transfer starts. In logs or Wireshark, this helps confirm whether a connection was attempted, established, reset, or half-open.

### 3. What is a SYN flood?

A SYN flood sends many SYN packets without completing the handshake, forcing the server to hold half-open connection state. It affects availability. Evidence includes a spike in SYNs, incomplete handshakes, many sources or spoofed sources, and resource exhaustion.

### 4. DNS uses TCP or UDP?

DNS normally uses UDP 53 for speed and low overhead. It can use TCP 53 for zone transfers, large responses, or when UDP response truncation requires retry over TCP. In SOC, unusual DNS volume, random subdomains, or DNS to unapproved resolvers may indicate tunneling or C2.

### 5. Public IP vs private IP?

Public IPs are globally routable. Private IPs are used inside enterprise networks and are not directly routed on the public Internet. RFC 1918 ranges are 10/8, 172.16/12, and 192.168/16. For a private IP in an alert, I map it internally; for a public IP, I enrich it with reputation and ownership.

### 6. What is NAT/PAT?

NAT translates private addresses to public addresses. PAT maps multiple internal hosts to one public IP by tracking source ports. In SOC, NAT logs help identify the original internal host behind a shared public IP.

### 7. What happens when you type a URL?

DNS resolves the domain. The client reaches its gateway and routes to the destination. TCP opens a connection to 443. TLS validates certificate and encrypts the session. HTTP request passes through edge controls like firewall, WAF, reverse proxy, and load balancer, then app and database layers respond. Logs from DNS, firewall, WAF, proxy, app, DB, and endpoint can support investigation.

### 8. What is east-west traffic?

East-west is internal traffic between systems, such as workstation to file server or app server to database. It matters because attackers often move laterally after initial compromise.

## Data center and architecture

### 9. Draw a secure web app architecture.

Internet -> edge router -> firewall -> DMZ -> WAF/reverse proxy -> load balancer -> web/app tier -> database tier -> logs to SIEM. Database should not be directly exposed. Each tier should have least privilege and segmentation.

### 10. What is a DMZ?

A DMZ is a network zone for systems that need limited external exposure. It protects internal networks by placing public-facing services in a separate controlled area.

### 11. Where do you place a WAF?

In front of the web application, usually before or near the reverse proxy/load balancer path. It inspects HTTP/S requests and blocks application-layer attacks like SQLi and XSS.

### 12. What is HA vs DR?

High availability keeps service running during component failures, often through redundancy and failover. Disaster recovery restores service after larger failures, often using backups, replication, and secondary sites.

## Firewall, WAF, IDS/IPS, SIEM, EDR

### 13. Firewall vs WAF?

Firewall mainly controls network traffic by IP, port, protocol, state, rule, and sometimes application/user. WAF inspects Layer 7 web content such as URLs, headers, methods, cookies, and parameters. A firewall can allow HTTPS while a WAF blocks SQLi inside the HTTPS request.

### 14. IDS vs IPS?

IDS detects and alerts, often from mirrored traffic. IPS is inline and can block or reset traffic. In a ticket, I check whether the control only detected or also prevented the activity.

### 15. SIEM vs EDR?

SIEM centralizes and correlates logs from many sources. EDR focuses on endpoint behavior: processes, command lines, files, registry, network connections, and response actions such as isolation.

### 16. Proxy vs reverse proxy?

Forward proxy represents internal users going out to the Internet. Reverse proxy represents servers to external clients, often protecting and routing inbound web traffic.

## OWASP and web security

### 17. Why know OWASP Top 10 as a SOC analyst?

Because web attacks appear in WAF, proxy, web access, app error, and database logs. A SOC analyst should detect attack attempts, determine whether they succeeded, and communicate remediation to application teams.

### 18. SQLi log clues?

Encoded quotes like %27, OR 1=1, UNION SELECT, comment markers, sleep/time payloads, abnormal 500 errors, response-size changes, and repeated parameter probing.

### 19. XSS log clues?

Script tags, event handlers such as onerror/onload, encoded JavaScript, suspicious HTML payloads, and reflected parameters. Confirm impact by checking whether it was stored, reflected, blocked, or executed.

### 20. What is IDOR?

IDOR is broken access control where a user can access another user's object by changing an ID. It is hard to detect because the request can look normal. Logs need user ID, object ID, tenant/account ID, and authorization result.

### 21. What is SSRF?

SSRF tricks a server into making requests to internal resources or metadata services. It can bypass perimeter controls because the server is making the request. Look for unusual server outbound requests and suspicious URL parameters.

## SOC operations

### 22. Event vs alert vs incident?

Event is any activity. Alert is a suspicious event flagged by a rule. Incident is confirmed or strongly suspected security impact.

### 23. True positive vs false positive vs false negative?

True positive: alert fired and threat is real. False positive: alert fired but activity is benign. False negative: no alert fired but threat happened. False negatives are dangerous because attacks slip through.

### 24. How do you prioritize alerts?

Asset criticality, successful access, active spread, privileged account, data sensitivity, confidence, and business impact.

### 25. When do you escalate?

Critical assets, privileged accounts, confirmed unauthorized access, active malware/ransomware, unclear high-impact evidence, playbook gap, or containment requiring permissions beyond my role.

### 26. What is a good incident report?

Summary, affected assets/users, timeline, evidence, root cause, impact, containment, remediation, recommendations, owner, current status, and closure proof.

### 27. How do you reduce false positives?

Understand baseline, identify benign patterns, add context, tune thresholds, use allowlists carefully, add asset/user criticality, and test against old true and false positives.

## Phishing

### 28. Phishing investigation steps?

Preserve email, inspect headers, check SPF/DKIM/DMARC, extract URLs/attachments safely, search recipients, identify clickers, check sign-ins and endpoint activity, block indicators, purge email, reset credentials if needed, document.

### 29. SPF vs DKIM vs DMARC?

SPF checks whether sending IP is authorized for the domain. DKIM validates a cryptographic signature on message parts. DMARC uses SPF/DKIM alignment and domain policy to tell receivers what to do with failures.

### 30. What if SPF/DKIM/DMARC pass but email is malicious?

Passing email authentication proves sending infrastructure alignment, not that content is safe. The sender account or service may be compromised. I still check URL, attachment, sender behavior, user reports, and campaign scope.

## Windows, Linux, AD

### 31. Windows Event IDs?

4624 successful logon, 4625 failed logon, 4672 special privileges, 4688 process creation, 7045 service installed, 1102 audit log cleared.

### 32. Sysmon events?

1 process creation, 3 network connection, 10 process access, 11 file create, 12/13 registry, 22 DNS query.

### 33. Linux logs?

/var/log/auth.log or /var/log/secure for authentication, /var/log/syslog or /var/log/messages for system events, journalctl for systemd logs, web server logs under /var/log/nginx or /var/log/apache2.

### 34. Active Directory basics?

AD centralizes identity. Domain controllers authenticate users, groups manage access, GPO pushes policy, Kerberos/NTLM handle authentication, and SOC monitors logons, privilege changes, account lockouts, and suspicious DC activity.

## Scripting

### 35. Top 10 IPs from access log?

```bash
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -10
```

Explain each stage: extract, sort, count, rank, limit.

### 36. Failed SSH source IPs?

```bash
grep 'Failed password' /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head
```

### 37. Python for SOC?

Read logs, extract IOCs using regex, deduplicate with sets, enrich using APIs, handle errors/rate limits, and output a CSV or report.

### 38. PowerShell for Windows logs?

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}
```

## Managerial

### 39. Why SOC?

I enjoy investigation, evidence collection, and root-cause analysis. My bug bounty work gives attacker mindset, and my development background helps me understand how applications fail. SOC lets me apply both defensively.

### 40. Why Zoho?

Zoho has a strong engineering culture, secure software development practices, its own data center/security posture, and a public vulnerability reward program. My Zoho incubation experience also gave me context about the company culture.

### 41. Are you ready for 24x7?

Yes. SOC requires continuous monitoring. I would manage sleep, health, handover notes, checklists, and focus discipline so alert quality does not drop during shifts.

### 42. What if you do not know something?

I will not guess. I will state known facts, gather evidence, check playbooks and trusted references, ask the right internal owner, and escalate if uncertainty plus impact is high.

