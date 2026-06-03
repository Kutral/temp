# SOC Operations and Scenario Playbook

## SOC triage formula

Use this for any scenario:

1. Identify the alert source and fields.
2. Validate context: user, asset, business role, change window, allowlist.
3. Correlate supporting logs.
4. Decide false positive, suspicious, or incident.
5. Contain or escalate based on impact and authority.
6. Document timeline, evidence, impact, actions, owner, and closure proof.

## Event, alert, incident

- Event: any observable activity, such as a login, process start, DNS query, or firewall connection.
- Alert: an event or group of events that a rule flags as suspicious.
- Incident: confirmed or strongly suspected activity that affects confidentiality, integrity, or availability.

Interview line:

> I do not call every alert an incident. I validate evidence, scope, and impact first. But if the asset is critical or activity is active, I escalate early.

## Prioritization

Use these factors:

- Critical asset beats low-value asset.
- Successful suspicious access beats failed attempts.
- Active spread beats isolated historical event.
- Privileged account beats normal account.
- Data access/exfiltration beats blocked scan.
- High confidence beats weak reputation-only alert.
- Regulatory/customer impact increases priority.

Example:

> Multiple failed SSH logins on a developer workstation are important, but one successful unknown login to a database server at 3 AM is more urgent because it is a confirmed access event on a critical asset.

## Escalation triggers

Escalate when:

- Critical server, database, domain controller, production app, or privileged account is involved.
- The activity is active, spreading, or causing business impact.
- You see successful unauthorized access.
- You suspect malware, ransomware, credential theft, or data exfiltration.
- The action requires permissions you do not have.
- The playbook does not cover the situation.
- Evidence is unclear but potential impact is high.

## Scenario: suspicious public IP

Prompt:

> A firewall alert shows a public IP connecting to an internal server.

Answer:

1. Check source IP, destination IP, destination port, protocol, action, bytes, rule, and timestamp.
2. Determine direction: external-to-internal or internal-to-external.
3. Identify destination asset and business role.
4. Check if the service is expected to be exposed.
5. Enrich public IP using reputation, WHOIS, geo, and internal threat intel.
6. Correlate WAF/proxy/EDR/app logs.
7. If blocked and scanner-only, document. If allowed or repeated against critical services, escalate.

Evidence:

- Firewall log
- NAT log
- WAF/proxy log
- Server log
- EDR process/network event
- Threat intel result

## Scenario: private IP scanning internal subnet

Prompt:

> 10.20.4.18 is connecting to many internal hosts on 445 and 3389.

Answer:

1. Private source means internal asset; map to hostname/user using DHCP, EDR, CMDB, or AD logs.
2. Check whether vulnerability scanning was scheduled.
3. Inspect process tree: nmap, masscan, PowerShell, malware, or legitimate admin tool.
4. Check Windows 4624/4625 and SMB/RDP logs for success after scanning.
5. If unauthorized, isolate host and hunt for same pattern.

Escalate if:

- It is not an approved scanner.
- Connections succeed.
- Privileged accounts appear.
- Multiple hosts show follow-on execution.

## Scenario: WAF SQLi alert

Prompt:

> WAF alerts on `UNION SELECT`, `%27`, or `OR 1=1`.

Answer:

1. Capture URL, method, parameters, source IP, user-agent, action, response code, and response size.
2. Classify attack type: SQLi, XSS, traversal, command injection, scanner noise.
3. Verify whether WAF blocked, challenged, logged only, or allowed.
4. Check app errors and DB audit logs.
5. Search repeats by same source and same endpoint.
6. Recommend WAF tuning, prepared statements, input validation, and app owner review.

Close only if:

- WAF blocked all requests.
- No app/database error or data response.
- No follow-on activity.
- Source and repetition are documented.

## Scenario: phishing user clicked

Prompt:

> User reports phishing and proxy logs show a click.

Answer:

1. Preserve email and inspect headers.
2. Check SPF, DKIM, DMARC, Return-Path, Reply-To, and Received chain.
3. Extract URLs and attachment hashes safely.
4. Search who else received the email.
5. Check who opened/clicked.
6. Check sign-in logs, MFA prompts, mailbox forwarding rules, endpoint activity, and browser/proxy logs.
7. Block URL/domain/hash, purge messages, reset credentials if needed, isolate if malware executed.

Escalate if:

- Credentials were submitted.
- Malware executed.
- Privileged user clicked.
- Mailbox rules or suspicious sign-ins appear.

## Scenario: PowerShell encoded command

Prompt:

> EDR alerts on `powershell.exe -nop -w hidden -enc`.

Answer:

1. Capture command line, parent process, user, hostname, hash, and network connections.
2. Decode Base64 safely if permitted.
3. Check parent process: Office, browser, script host, scheduled task.
4. Look for downloads, registry writes, service installs, credential access, and outbound C2.
5. Isolate if malicious or active.
6. Hunt same command/hash/domain across endpoints.

Escalate if:

- Command downloads payload.
- Persistence is created.
- LSASS/process access appears.
- External C2 is contacted.

## Scenario: failed-login rule is noisy

Prompt:

> A failed-login SIEM rule creates thousands of alerts.

Answer:

1. Measure false positives by user, source, target, time, service account, and asset.
2. Separate user mistakes, misconfigured service, scanner, brute force, and password spraying.
3. Add context: distinct users, distinct sources, success after failures, privileged accounts, critical assets.
4. Tune threshold carefully.
5. Test against old true positives and known benign events.
6. Document what changed and residual risk.

Good line:

> I would not blindly raise the threshold because that may reduce detection. I would add context so the rule catches risky patterns and suppresses known benign noise.

## Scenario: ransomware early warning

Prompt:

> EDR shows mass file modification and shadow copy deletion.

Answer:

1. Treat as critical.
2. Identify process, user, host, parent process, file paths, shares, and first seen time.
3. Check for vssadmin, wbadmin, bcdedit, service stop commands, and network share activity.
4. Isolate affected endpoints through approved process.
5. Disable/reset compromised accounts if needed.
6. Protect backups and file shares.
7. Escalate to IR immediately.

## Scenario: suspicious DNS tunneling

Prompt:

> Host sends high-volume DNS queries to random subdomains.

Answer:

1. Check query names, length, entropy, frequency, NXDOMAIN rate, and destination resolver.
2. Confirm whether it uses approved DNS resolvers.
3. Identify process generating DNS using EDR/Sysmon if available.
4. Check for follow-on firewall/proxy connections.
5. Compare with known software/CDN behavior.
6. Block suspicious domains and isolate host if tied to malware.

