# Scripting and Log Analysis Cheatsheet

## Bash pipelines

Top source IPs in Apache/Nginx access log:

```bash
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -10
```

Failed SSH IPs:

```bash
grep 'Failed password' /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head -10
```

Successful SSH logins:

```bash
grep 'Accepted password' /var/log/auth.log
```

Find lines for one suspicious IP:

```bash
grep '203.0.113.50' access.log
```

Count HTTP status codes:

```bash
awk '{print $9}' access.log | sort | uniq -c | sort -nr
```

Find likely SQLi attempts:

```bash
grep -Ei "union select|or 1=1|%27|sleep\\(|benchmark\\(" access.log
```

Find traversal attempts:

```bash
grep -Ei "\\.\\./|%2e%2e%2f|/etc/passwd|boot.ini" access.log
```

Find XSS attempts:

```bash
grep -Ei "<script|%3cscript|onerror=|onload=|javascript:" access.log
```

## Explain the pipeline

Use this explanation:

> grep filters lines, awk extracts fields, sort groups or ranks data, uniq -c counts repeated lines, and head limits output. I use these tools because SOC logs are often huge text files and pipelines let me stream data without loading the entire file into memory.

## Linux triage commands

Show active sockets:

```bash
ss -tulnp
```

Show established connections:

```bash
ss -tunap | grep ESTAB
```

Show process tree:

```bash
ps auxf
```

Show logged-in users:

```bash
w
```

Show login history:

```bash
last
```

Follow live log:

```bash
tail -f /var/log/auth.log
```

Find recently modified files:

```bash
find /var/www -type f -mtime -1 -ls
```

Check file permissions:

```bash
ls -la /var/www/html
```

## Windows PowerShell triage

Failed logons:

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}
```

Successful logons:

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624}
```

Process creation:

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4688}
```

Network connections:

```powershell
Get-NetTCPConnection | Sort-Object State,RemoteAddress
```

Processes:

```powershell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 20
```

Services:

```powershell
Get-Service | Where-Object {$_.Status -eq 'Running'}
```

## Python IOC extraction example

```python
import re
from pathlib import Path

ip_pattern = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")

def extract_ips(path: str) -> set[str]:
    ips: set[str] = set()
    for line in Path(path).read_text(errors="ignore").splitlines():
        ips.update(ip_pattern.findall(line))
    return ips

for ip in sorted(extract_ips("access.log")):
    print(ip)
```

How to explain:

> I use regex to extract indicators, a set to deduplicate them, and then I can enrich each IP with internal allowlists, AbuseIPDB, VirusTotal, or other approved threat intel sources.

## SIEM rule thinking

A detection rule should include:

- Behavior to detect.
- Required log source.
- Required fields.
- Time window.
- Threshold.
- Asset/user criticality.
- Severity.
- Exclusions.
- MITRE ATT&CK mapping.
- Triage instructions.
- Test examples.

Example:

```text
Rule: Possible password spraying
Condition:
  More than 20 distinct users receive failed logons
  From the same source IP
  Within 10 minutes
  Against VPN or identity provider
Escalate if:
  Any success follows failures
  Privileged accounts are involved
  Source IP has bad reputation
```

## What to say about your scripting round

Use this:

> The scripting task tested whether I can think like an analyst with automation. In a SOC, I would use shell scripts for quick log parsing, Python for structured parsing and enrichment, and PowerShell for Windows event investigation. I focus on correctness, explainability, and not hiding assumptions.

