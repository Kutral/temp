import { useEffect, useMemo, useState, type ReactNode } from 'react'
import WellnessSection from './pages/WellnessSection'
import './pages/Wellness.css'
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Bug,
  CheckCircle2,
  HeartPulse,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Cloud,
  Code2,
  Copy,
  Database,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  KeyRound,
  Laptop,
  Layers3,
  ListChecks,
  LockKeyhole,
  MailWarning,
  Network,
  NotebookTabs,
  Play,
  Radar,
  RefreshCcw,
  Route,
  Search,
  ServerCog,
  ShieldCheck,
  Siren,
  Sparkles,
  TerminalSquare,
  Trophy,
  UserRound,
  Wifi,
  Wrench,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { topicStudyNotes } from './data/topicStudyNotes'
import {
  managerRoundDomains,
  managerRoundFlows,
  managerRoundQuestionGroups,
  managerRoundScenarios,
  managerRoundSources,
  managerRoundStudyPlan,
  managerRoundThreatWatch,
} from './data/managerRound'
import { resumeQuestionsData } from './data/resumeQuestions'
import './App.css'

type SectionId = 'dashboard' | 'manager' | 'resume' | 'resumeQuestions' | 'questions' | 'topics' | 'playbooks' | 'zoho' | 'cheatsheet' | 'wellness'

type TopicCategory =
  | 'Core'
  | 'Networking'
  | 'Systems'
  | 'SOC'
  | 'Threats'
  | 'Tools'
  | 'Enterprise'
  | 'Career'

type TopicFilter = TopicCategory | 'All'

type Topic = {
  id: string
  number: number
  title: string
  category: TopicCategory
  icon: LucideIcon
  explanation: string
  whySoc: string
  checklist: string[]
  interviewQuestions: string[]
}

type QuestionGroup = {
  title: string
  description: string
  icon: LucideIcon
  questions: {
    question: string
    answer: ReactNode
  }[]
}

type Playbook = {
  title: string
  trigger: string
  steps: string[]
  evidence: string[]
  close: string
}

const navItems: { id: SectionId; label: string; icon: LucideIcon; helper: string }[] = [
  { id: 'dashboard', label: 'Mission brief', icon: Radar, helper: 'What to study first' },
  { id: 'manager', label: 'Manager round', icon: Brain, helper: 'Deep technical prep' },
  { id: 'resumeQuestions', label: 'Resume Qs', icon: FileText, helper: '50+ Managerial Qs' },
  { id: 'resume', label: 'Resume story', icon: UserRound, helper: 'Your profile and proof' },
  { id: 'questions', label: 'Question bank', icon: NotebookTabs, helper: 'Practice answers' },
  { id: 'topics', label: '24 topic map', icon: Layers3, helper: 'Gemini PDF coverage' },
  { id: 'playbooks', label: 'SOC playbooks', icon: ClipboardCheck, helper: 'Scenario responses' },
  { id: 'zoho', label: 'About Zoho', icon: ServerCog, helper: 'SOC infrastructure & culture' },
  { id: 'cheatsheet', label: 'Night-before', icon: ListChecks, helper: 'Fast revision' },
  { id: 'wellness', label: 'Focus & Breathe', icon: HeartPulse, helper: 'Pomodoro timer & box breathing' },
]

const resumeProfile = {
  name: 'Candidate Profile',
  headline: 'Networking and Cybersecurity graduate focused on SOC alert triage, web security, and threat analysis.',
  contacts: [],
  summary:
    'Hands-on web application security experience through bug bounty programs using Burp Suite and Nmap. Strong Linux CLI, Bash scripting, networking fundamentals, CCNA, and Cisco Cybersecurity Essentials grounding.',
  skillGroups: [
    {
      label: 'Security tools',
      items: ['Burp Suite', 'Wireshark', 'Nmap'],
    },
    {
      label: 'Cybersecurity',
      items: ['OWASP Top 10', 'Web application penetration testing', 'Bug bounty research'],
    },
    {
      label: 'Systems and scripting',
      items: ['Linux and Unix CLI', 'Windows', 'Bash', 'Python', 'Java', 'SQL'],
    },
    {
      label: 'Networking',
      items: ['TCP/IP', 'OSI model', 'DNS', 'HTTP/S', 'Firewalls', 'Routing and switching'],
    },
  ],
  projects: [
    {
      name: 'Bug Bounty Research and Vulnerability Disclosure',
      stack: 'Web application security - Burp Suite, Nmap, OWASP Top 10',
      points: [
        'Identified and reported XSS, IDOR, and authentication flaws through independent web penetration testing.',
        'Used Burp Suite to intercept HTTP traffic and Nmap to map open ports, services, and target systems.',
        'Documented proof-of-concept evidence and remediation briefs similar to SOC investigation reports.',
      ],
    },
    {
      name: 'Knowledge Nexus - Library Management System',
      stack: 'Java Servlets, JSP, MySQL',
      points: [
        'Implemented secure authentication and role-based access control.',
        'Used PreparedStatements to defend database operations against SQL injection.',
        'Designed RESTful APIs with server-side validation and defense-in-depth thinking.',
      ],
    },
  ],
  experience: {
    title: 'Incubation Intern',
    org: 'Zoho School for Graduate Studies',
    location: 'Vellore',
    dates: 'July 2025 - January 2026',
    points: [
      'Completed structured training in Core Java, OOP design patterns, SOLID principles, and DSA.',
      'Built analytical debugging and root-cause analysis habits through systematic problem solving.',
      'Participated in code reviews to identify logic flaws and document fixes clearly.',
    ],
  },
  education: 'B.Tech Computer Science and Engineering, specialization in Networking and Cybersecurity, Vel Tech Chennai, CGPA 8.18/10.',
  certifications: [
    'Cybersecurity Essentials - Cisco Networking Academy',
    'CCNA v7: Introduction to Networks - Cisco Networking Academy',
    'PCAP: Programming Essentials in Python - Cisco / Python Institute',
    'MePro Level 7 - Pearson',
  ],
}

const topicCatalog: Topic[] = [
  {
    id: 'cybersecurity-fundamentals',
    number: 1,
    title: 'Cybersecurity Fundamentals',
    category: 'Core',
    icon: ShieldCheck,
    explanation:
      'Security starts with protecting confidentiality, integrity, and availability. A SOC analyst also needs AAA, risk language, and basic control principles to explain why an alert matters.',
    whySoc:
      'Every triage note eventually answers: what asset is at risk, what threat is acting, what control failed, and what business impact could follow.',
    checklist: [
      'CIA triad: confidentiality, integrity, availability.',
      'AAA: authentication proves identity, authorization grants access, accounting records actions.',
      'Asset, vulnerability, threat, risk, exploit, and mitigation.',
      'Least privilege, defense in depth, zero trust, need to know, and separation of duties.',
    ],
    interviewQuestions: [
      'Explain vulnerability, threat, risk, exploit, and mitigation with one example.',
      'How would least privilege reduce the blast radius of a compromised account?',
    ],
  },
  {
    id: 'networking-fundamentals',
    number: 2,
    title: 'Networking Fundamentals',
    category: 'Networking',
    icon: Network,
    explanation:
      'Networking concepts explain where traffic came from, where it went, what protocol carried it, and whether the behavior is normal.',
    whySoc:
      'IP reputation checks, port scans, firewall events, DNS lookups, proxy logs, and packet captures all depend on networking basics.',
    checklist: [
      'OSI layers and TCP/IP model: network access, internet, transport, application.',
      'TCP versus UDP, three-way handshake, headers, payloads, and packet structure.',
      'IPv4, public/private IPs, subnet mask, gateway, NAT, MAC address, and ARP.',
      'DNS A, MX, CNAME records; DHCP; HTTP, HTTPS, SSL/TLS; VPN.',
      'Ports: 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 67/68 DHCP, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 445 SMB, 3389 RDP.',
    ],
    interviewQuestions: [
      'What is the difference between TCP and UDP, and why would a SOC analyst care?',
      'What do NAT, DNS, and DHCP each do in a corporate network?',
    ],
  },
  {
    id: 'linux-fundamentals',
    number: 3,
    title: 'Linux Fundamentals',
    category: 'Systems',
    icon: TerminalSquare,
    explanation:
      'Linux is a daily analysis surface for logs, servers, scripts, and triage commands. The key is being fast with files, processes, permissions, and text processing.',
    whySoc:
      'Many investigations start with SSH logs, process lists, network sockets, file changes, and command-line parsing.',
    checklist: [
      'Files: pwd, ls, cd, mkdir, rm, cp, mv, touch, cat, less, head, tail.',
      'Search: find, grep, locate.',
      'Permissions: chmod, chown, umask with read 4, write 2, execute 1.',
      'Users/processes: useradd, passwd, ps, top, htop, kill, pkill.',
      'Services/networking: systemctl, service, ifconfig, ip, ping, traceroute, netstat, ss, curl, wget.',
      'Logs: /var/log/syslog, /var/log/messages, /var/log/auth.log.',
      'Parsing: awk, sed, sort, uniq, cut.',
    ],
    interviewQuestions: [
      'How would you count failed SSH logins from /var/log/auth.log?',
      'What Linux commands help you see active connections and suspicious processes?',
    ],
  },
  {
    id: 'windows-fundamentals',
    number: 4,
    title: 'Windows Fundamentals',
    category: 'Systems',
    icon: Laptop,
    explanation:
      'Windows telemetry is central in enterprise SOCs: authentication, services, PowerShell, registry changes, and process creation all leave evidence.',
    whySoc:
      'Failed logons, suspicious PowerShell, new services, and registry persistence are common alert sources.',
    checklist: [
      'Event Viewer: Security, Application, and System logs.',
      'Event IDs: 4624 successful logon, 4625 failed logon, 4672 special privileges, 4688 process creation, 7045 service installed, 1102 audit log cleared.',
      'Services, Task Manager, Registry, CMD, and PowerShell basics.',
      'Commands: ipconfig, netstat, tasklist, taskkill.',
    ],
    interviewQuestions: [
      'Which Windows event IDs would you check for brute force or suspicious admin access?',
      'Why is PowerShell heavily monitored in a SOC?',
    ],
  },
  {
    id: 'shell-scripting',
    number: 5,
    title: 'Shell Scripting',
    category: 'Systems',
    icon: Code2,
    explanation:
      'Shell scripts help automate repetitive log checks and small response actions without waiting for a full tool.',
    whySoc:
      'A Tier 1 analyst who can quickly count, filter, and summarize logs saves time during noisy incidents.',
    checklist: [
      'Variables, loops, if/else, functions, reading files, command substitution, and exit codes.',
      'Exit code 0 means success; non-zero means failure.',
      'Practice: grep "Failed password" /var/log/auth.log | wc -l.',
    ],
    interviewQuestions: [
      'Write or explain a shell command to count failed login attempts.',
      'What is an exit code and how would you use it in automation?',
    ],
  },
  {
    id: 'python-basics',
    number: 6,
    title: 'Python Basics',
    category: 'Systems',
    icon: Code2,
    explanation:
      'Python is useful for parsing logs, extracting indicators, calling security APIs, and building small analyst utilities.',
    whySoc:
      'SOC data is repetitive and text-heavy. Python helps turn raw evidence into searchable, repeatable analysis.',
    checklist: [
      'Variables, loops, conditionals, file reading, lists, dictionaries, and functions.',
      'Regex for IP extraction: re.findall(r"[0-9]+(?:\\.[0-9]+){3}", line).',
      'Useful modules: re, json, csv, requests, datetime.',
    ],
    interviewQuestions: [
      'How would you extract IP addresses from a log file with Python?',
      'Where could Python help in a SOC workflow?',
    ],
  },
  {
    id: 'soc-operations',
    number: 7,
    title: 'SOC Operations',
    category: 'SOC',
    icon: Activity,
    explanation:
      'A SOC is a centralized team that monitors, triages, investigates, escalates, and coordinates response to security events.',
    whySoc:
      'Interviewers often test whether you understand daily SOC work, not only textbook security terms.',
    checklist: [
      'Tier 1 triages alerts and filters false positives.',
      'Tier 2 investigates confirmed alerts and coordinates containment.',
      'Tier 3 hunts for hidden threats and improves detections.',
      'Ticketing, playbooks, runbooks, documentation, and escalation are part of the workflow.',
      'Incident lifecycle: detect, analyze, contain, eradicate, recover, lessons learned.',
    ],
    interviewQuestions: [
      'What does a Tier 1 SOC analyst do during a shift?',
      'When would you escalate an alert to Tier 2?',
    ],
  },
  {
    id: 'siem-fundamentals',
    number: 8,
    title: 'SIEM Fundamentals',
    category: 'SOC',
    icon: Database,
    explanation:
      'A SIEM collects and normalizes logs from many sources, then correlates events into alerts that analysts can investigate.',
    whySoc:
      'SIEM alerts are the front door for many SOC investigations, so you need to understand how alerts are created and why false positives happen.',
    checklist: [
      'Popular SIEMs: Splunk, IBM QRadar, Elastic/ELK, Wazuh.',
      'Collection gathers logs; normalization standardizes fields; correlation links events.',
      'True positive, false positive, true negative, false negative.',
      'Example correlation: many failed logins followed by a successful login within five minutes.',
    ],
    interviewQuestions: [
      'Explain true positive, false positive, true negative, and false negative.',
      'What is log normalization and why does correlation need it?',
    ],
  },
  {
    id: 'log-analysis',
    number: 9,
    title: 'Log Analysis',
    category: 'SOC',
    icon: Search,
    explanation:
      'Log analysis is the habit of finding meaningful patterns in authentication, firewall, proxy, web, endpoint, DNS, and system records.',
    whySoc:
      'Alerts are only the starting point. Logs confirm scope, timeline, impact, and next actions.',
    checklist: [
      'Authentication logs: brute force, impossible travel, unusual admin access.',
      'Firewall logs: blocked traffic, port scans, denied outbound traffic.',
      'Proxy/web logs: strange URLs, SQL injection strings, XSS payloads, malware downloads.',
      'DNS logs: domains with poor reputation, domain-generation patterns, unexpected lookups.',
    ],
    interviewQuestions: [
      'What logs would you inspect for a brute-force alert?',
      'What suspicious patterns would you expect in DNS logs?',
    ],
  },
  {
    id: 'incident-response',
    number: 10,
    title: 'Incident Response',
    category: 'SOC',
    icon: Siren,
    explanation:
      'Incident response is the structured process for confirming an incident, limiting damage, removing the cause, restoring service, and learning from it.',
    whySoc:
      'A clear response process prevents panic and makes your actions explainable to managers and technical teams.',
    checklist: [
      'NIST lifecycle: preparation, identification, containment, eradication, recovery, lessons learned.',
      'Phishing example: identify the machine, isolate it, reset credentials, remove malware, recover files, document the case.',
      'Always preserve evidence and record the timeline.',
    ],
    interviewQuestions: [
      'Walk me through your response if an employee clicks a phishing link.',
      'What is the difference between containment and eradication?',
    ],
  },
  {
    id: 'malware',
    number: 11,
    title: 'Malware',
    category: 'Threats',
    icon: Bug,
    explanation:
      'Malware categories describe how malicious code behaves, spreads, hides, steals, or disrupts systems.',
    whySoc:
      'Knowing the behavior helps you choose the right containment and evidence collection steps.',
    checklist: [
      'Virus needs user execution and attaches to files.',
      'Worm self-replicates across networks.',
      'Trojan appears legitimate but hides malicious behavior.',
      'Ransomware encrypts data for payment.',
      'Spyware, adware, rootkit, keylogger, and botnet behaviors.',
    ],
    interviewQuestions: [
      'How is a worm different from a virus?',
      'What would make you suspect ransomware activity?',
    ],
  },
  {
    id: 'common-attacks',
    number: 12,
    title: 'Common Attacks',
    category: 'Threats',
    icon: AlertTriangle,
    explanation:
      'Common attacks are the patterns you must identify quickly: social engineering, credential attacks, web app attacks, interception, and availability attacks.',
    whySoc:
      'Many SOC alerts are named after these techniques, so you need plain-English explanations and first-response actions.',
    checklist: [
      'Phishing, spear phishing, smishing, and vishing.',
      'Brute force and password spraying.',
      'SQL injection, XSS, command injection, directory traversal.',
      'Man-in-the-middle, DoS, and DDoS.',
    ],
    interviewQuestions: [
      'Explain SQL injection and XSS, and how they differ.',
      'Why is password spraying harder to detect than simple brute force?',
    ],
  },
  {
    id: 'defensive-tools',
    number: 13,
    title: 'Defensive Security Tools',
    category: 'Tools',
    icon: Wrench,
    explanation:
      'Defensive tools enforce, inspect, or record security decisions at the network, endpoint, web, and browsing layers.',
    whySoc:
      'When an alert fires, you must know which tool produced it and what that tool can or cannot prove.',
    checklist: [
      'Firewall blocks traffic by IP, port, protocol, or rule.',
      'Antivirus detects known bad files by signature.',
      'EDR detects suspicious behavior and gives endpoint telemetry.',
      'WAF protects web apps from HTTP attacks like SQLi and XSS.',
      'Proxy mediates web traffic and can block or log destinations.',
    ],
    interviewQuestions: [
      'How is EDR different from traditional antivirus?',
      'Where would a WAF help during a web application attack?',
    ],
  },
  {
    id: 'ids-ips',
    number: 14,
    title: 'IDS and IPS',
    category: 'Tools',
    icon: Eye,
    explanation:
      'IDS detects and alerts; IPS detects and blocks. Host-based sensors watch one machine, while network-based sensors watch traffic on the wire.',
    whySoc:
      'You need to know whether an alert only observed malicious traffic or also prevented it.',
    checklist: [
      'IDS is passive: sees attacks and alerts.',
      'IPS is active: drops or blocks malicious packets.',
      'HIDS runs on a host, such as OSSEC.',
      'NIDS watches network traffic, such as Snort or Suricata.',
    ],
    interviewQuestions: [
      'Explain IDS versus IPS with a simple analogy.',
      'What is the difference between HIDS and NIDS?',
    ],
  },
  {
    id: 'nmap',
    number: 15,
    title: 'Nmap',
    category: 'Tools',
    icon: Route,
    explanation:
      'Nmap discovers live hosts, open ports, services, versions, and sometimes operating systems.',
    whySoc:
      'Nmap knowledge helps you understand scan alerts and validate exposed services during an investigation.',
    checklist: [
      'nmap target: standard scan.',
      'nmap -sS target: SYN scan.',
      'nmap -sV target: service/version detection.',
      'nmap -O target: OS detection.',
      'nmap -Pn target: skip ping discovery when ping is blocked.',
    ],
    interviewQuestions: [
      'What does nmap -sV do?',
      'Why would you use -Pn during a scan?',
    ],
  },
  {
    id: 'wireshark',
    number: 16,
    title: 'Wireshark',
    category: 'Tools',
    icon: Wifi,
    explanation:
      'Wireshark captures packets and lets analysts filter noisy traffic down to the conversations that matter.',
    whySoc:
      'PCAP analysis can confirm what data a suspicious host sent, which domains it resolved, or which protocol was abused.',
    checklist: [
      'PCAP records traffic traveling over the network.',
      'Filters: ip.addr == 192.168.1.5, tcp.port == 80 or http, dns.',
      'Use it to inspect malware callbacks, DNS requests, HTTP traffic, and suspicious sessions.',
    ],
    interviewQuestions: [
      'What Wireshark filter would show traffic for a single IP?',
      'How could a PCAP help during malware investigation?',
    ],
  },
  {
    id: 'threat-intelligence',
    number: 17,
    title: 'Threat Intelligence',
    category: 'Threats',
    icon: Brain,
    explanation:
      'Threat intelligence gives context to indicators and behaviors so an analyst can judge whether an alert is likely malicious.',
    whySoc:
      'IOC and IOA enrichment helps decide whether to close, monitor, block, or escalate an alert.',
    checklist: [
      'IOC: hard evidence such as malicious IP, file hash, or domain.',
      'IOA: behavior such as repeated failed logins or suspicious process chains.',
      'MITRE ATT&CK maps tactics and techniques.',
      'Cyber Kill Chain maps attack stages.',
      'Tools: VirusTotal and AbuseIPDB.',
    ],
    interviewQuestions: [
      'What is the difference between IOC and IOA?',
      'How would you use VirusTotal or AbuseIPDB in IP analysis?',
    ],
  },
  {
    id: 'authentication-security',
    number: 18,
    title: 'Authentication Security',
    category: 'Enterprise',
    icon: KeyRound,
    explanation:
      'Authentication proves who a user is; authorization decides what they can do. Enterprise identity systems add MFA, SSO, directory services, and centralized policy.',
    whySoc:
      'Credential attacks are common, and identity telemetry often tells you whether an incident has spread.',
    checklist: [
      'Authentication versus authorization.',
      'MFA combines something you know with something you have or are.',
      'SSO centralizes access across apps.',
      'LDAP is used to query directories such as Active Directory.',
    ],
    interviewQuestions: [
      'Explain authentication versus authorization with an example.',
      'Why does MFA help even if a password is stolen?',
    ],
  },
  {
    id: 'cryptography-basics',
    number: 19,
    title: 'Cryptography Basics',
    category: 'Core',
    icon: LockKeyhole,
    explanation:
      'Cryptography protects confidentiality, integrity, and authenticity using encryption, hashing, and signatures.',
    whySoc:
      'SOC analysts need to verify hashes, understand TLS, and explain why encryption, hashing, and signing are different.',
    checklist: [
      'Encryption is two-way with a key.',
      'Symmetric encryption uses the same key to lock and unlock.',
      'Asymmetric encryption uses public/private key pairs.',
      'Hashing is one-way; MD5 and SHA256 are common hash examples.',
      'Digital signatures prove sender identity and message integrity.',
    ],
    interviewQuestions: [
      'What is the difference between encryption and hashing?',
      'Why are digital signatures useful?',
    ],
  },
  {
    id: 'email-security',
    number: 20,
    title: 'Email Security',
    category: 'Enterprise',
    icon: MailWarning,
    explanation:
      'Email security focuses on delivery protocols, spoofing controls, header analysis, phishing detection, and attachment/link risk.',
    whySoc:
      'Phishing is a common entry point, and Zoho interview reports mention email analysis tasks.',
    checklist: [
      'SMTP sends email; POP3 and IMAP receive email.',
      'Phishing and spoofing are common email attacks.',
      'SPF lists allowed sending IPs for a domain.',
      'DKIM signs messages to detect tampering.',
      'DMARC tells receivers what to do if SPF or DKIM fails.',
    ],
    interviewQuestions: [
      'What are SPF, DKIM, and DMARC?',
      'What email headers would you inspect in a phishing report?',
    ],
  },
  {
    id: 'active-directory',
    number: 21,
    title: 'Active Directory Basics',
    category: 'Enterprise',
    icon: ServerCog,
    explanation:
      'Active Directory centralizes users, machines, groups, authentication, and policy across Windows environments.',
    whySoc:
      'Most enterprise credential, privilege, and lateral movement investigations involve AD evidence.',
    checklist: [
      'Domain: computers and users sharing a centralized directory.',
      'Domain Controller: server that handles logons and security rules.',
      'Groups manage permissions at scale.',
      'Group Policy Objects push security settings to computers and users.',
    ],
    interviewQuestions: [
      'What does a Domain Controller do?',
      'Why are groups and GPOs important for security?',
    ],
  },
  {
    id: 'cloud-security',
    number: 22,
    title: 'Cloud Security Basics',
    category: 'Enterprise',
    icon: Cloud,
    explanation:
      'Cloud security depends on understanding which layer the provider manages and which layer the customer must secure.',
    whySoc:
      'Cloud incidents often come from misconfiguration, exposed storage, stolen API keys, or weak identity controls.',
    checklist: [
      'SaaS: you use the software, such as Gmail or Office 365.',
      'PaaS: provider manages the platform, you manage the application.',
      'IaaS: provider gives infrastructure, you manage OS and above.',
      'Risks: public storage buckets, leaked keys, overly permissive IAM.',
    ],
    interviewQuestions: [
      'Explain SaaS, PaaS, and IaaS with examples.',
      'Why are public storage buckets and stolen API keys serious?',
    ],
  },
  {
    id: 'report-writing',
    number: 23,
    title: 'Report Writing',
    category: 'Career',
    icon: FileText,
    explanation:
      'A SOC report turns technical evidence into a clear incident summary, root cause, impact, mitigation, and recommendations.',
    whySoc:
      'Good reports help managers understand risk and help the next analyst continue the case without losing context.',
    checklist: [
      'Incident summary: what happened.',
      'Root cause: why it happened.',
      'Impact: what was affected.',
      'Mitigation: what stopped it.',
      'Recommendations: how to prevent recurrence.',
    ],
    interviewQuestions: [
      'How would you explain a phishing incident to a non-technical manager?',
      'What sections should a SOC incident report include?',
    ],
  },
  {
    id: 'behavioral-questions',
    number: 24,
    title: 'Behavioral Questions',
    category: 'Career',
    icon: BriefcaseBusiness,
    explanation:
      'Behavioral answers should show curiosity, reliability, shift readiness, communication, and a realistic understanding of SOC work.',
    whySoc:
      'Zoho will care about practical mindset, flexibility for 24/7 operations, and whether you can explain security calmly.',
    checklist: [
      'Why SOC: investigations, puzzle solving, and defensive impact.',
      'Why Zoho: product culture, self-built ecosystem, and learning environment.',
      'Shift work: adaptability, healthy sleep planning, and understanding 24/7 security.',
      'Explain technical ideas using analogies, such as a firewall as a bouncer checking IDs.',
    ],
    interviewQuestions: [
      'Why do you want to work in a SOC?',
      'Are you comfortable with rotational shifts?',
    ],
  },
]

const questionGroups: QuestionGroup[] = [
  {
    title: 'Resume-driven questions',
    description: 'Use these to connect your actual experience to SOC work.',
    icon: UserRound,
    questions: [
      {
        question: 'Tell me about yourself.',
        answer: (
          <AnswerBlocks
            items={[
              'Start with: "I am [Your Name], a B.Tech CSE graduate specialized in Networking and Cybersecurity."',
              'Mention hands-on web security through bug bounty research using Burp Suite, Nmap, and OWASP Top 10.',
              'Connect to SOC: "I enjoy investigation, evidence collection, and root-cause analysis, so SOC alert triage is a natural fit."',
              'Close with Zoho: "My Zoho incubation experience strengthened my debugging discipline and clear documentation."',
            ]}
          />
        ),
      },
      {
        question: 'Explain your bug bounty methodology.',
        answer: (
          <AnswerBlocks
            items={[
              'Recon: understand scope, technologies, endpoints, and exposed services.',
              'Scanning: use Nmap for open ports and service enumeration.',
              'Testing: use Burp Suite to intercept traffic and test OWASP Top 10 issues such as XSS, IDOR, and auth flaws.',
              'Evidence: capture request/response, impact, proof of concept, and remediation advice.',
              'SOC connection: this mirrors alert investigation - collect evidence, validate impact, document clearly.',
            ]}
          />
        ),
      },
      {
        question: 'How do XSS, IDOR, and authentication flaws relate to SOC work?',
        answer: (
          <AnswerBlocks
            items={[
              'XSS can show up in web logs as script payloads or suspicious parameters.',
              'IDOR is an authorization failure, so I would inspect access patterns and object IDs.',
              'Authentication flaws map to login anomalies, session abuse, password resets, and credential attacks.',
              'My offensive familiarity helps me recognize attack patterns faster during monitoring.',
            ]}
          />
        ),
      },
      {
        question: 'What security did you build into Knowledge Nexus?',
        answer: (
          <AnswerBlocks
            items={[
              'Implemented secure authentication and role-based access control.',
              'Used PreparedStatements to prevent SQL injection in database operations.',
              'Applied strict server-side validation for RESTful APIs.',
              'SOC angle: I understand what normal secure design should look like, so suspicious deviations are easier to spot.',
            ]}
          />
        ),
      },
      {
        question: 'What did your Zoho incubation internship teach you?',
        answer: (
          <AnswerBlocks
            items={[
              'Core Java, OOP, SOLID, DSA, and real-world application development discipline.',
              'Systematic debugging and root-cause analysis, which map directly to alert investigation.',
              'Code review habits: identify logic flaws, communicate risk, and document fixes.',
            ]}
          />
        ),
      },
      {
        question: 'Why SOC after web application security?',
        answer: (
          <AnswerBlocks
            items={[
              'Bug bounty work gave me attacker mindset and evidence collection habits.',
              'SOC lets me apply that mindset defensively to protect users and systems.',
              'I want to grow from Tier 1 triage into deeper incident response and threat hunting.',
            ]}
          />
        ),
      },
    ],
  },
  {
    title: 'Technical questions from the prep PDF',
    description: 'Short, clear answers for the topics Zoho is likely to probe.',
    icon: Brain,
    questions: [
      {
        question: 'Explain the CIA triad and AAA.',
        answer: (
          <AnswerBlocks
            items={[
              'CIA: confidentiality protects secrecy, integrity protects correctness, availability keeps systems usable.',
              'AAA: authentication verifies identity, authorization decides permissions, accounting logs activity.',
              'SOC example: a successful admin login touches all three - identity, permission, and audit trail.',
            ]}
          />
        ),
      },
      {
        question: 'What is the difference between TCP and UDP?',
        answer: (
          <AnswerBlocks
            items={[
              'TCP is reliable and connection-oriented. It uses SYN, SYN-ACK, ACK.',
              'UDP is faster and connectionless, but it does not guarantee delivery.',
              'SOC angle: scan patterns, DNS, streaming, and suspicious beaconing may use different protocol behaviors.',
            ]}
          />
        ),
      },
      {
        question: 'How do you investigate a suspicious IP?',
        answer: (
          <AnswerBlocks
            items={[
              'Identify source, destination, port, protocol, timestamp, and affected asset.',
              'Check SIEM logs, firewall/proxy logs, DNS logs, and endpoint activity.',
              'Enrich with VirusTotal, AbuseIPDB, WHOIS, and internal allowlists.',
              'Decide whether it is true positive, false positive, or needs escalation.',
            ]}
          />
        ),
      },
      {
        question: 'What are SPF, DKIM, and DMARC?',
        answer: (
          <AnswerBlocks
            items={[
              'SPF says which mail servers can send for a domain.',
              'DKIM signs email to prove it was not tampered with.',
              'DMARC tells receivers what policy to apply if SPF or DKIM fails.',
              'In phishing analysis, I would also inspect Return-Path, Reply-To, URLs, attachments, and sender reputation.',
            ]}
          />
        ),
      },
      {
        question: 'Explain IDS versus IPS.',
        answer: (
          <AnswerBlocks
            items={[
              'IDS is passive: it detects and alerts.',
              'IPS is active: it detects and blocks malicious packets.',
              'For impact, I would ask: did the control only observe the attack, or did it prevent it?',
            ]}
          />
        ),
      },
      {
        question: 'What should be in a SOC incident report?',
        answer: (
          <AnswerBlocks
            items={[
              'Incident summary, timeline, root cause, affected assets, evidence, impact, actions taken, mitigation, and recommendations.',
              'Write it so a manager understands business risk and another analyst can reproduce your investigation.',
            ]}
          />
        ),
      },
    ],
  },
  {
    title: 'HR and behavioral questions',
    description: 'Answer with confidence, flexibility, and grounded motivation.',
    icon: BriefcaseBusiness,
    questions: [
      {
        question: 'Why do you want to join Zoho?',
        answer: (
          <AnswerBlocks
            items={[
              'Zoho is a respected product-based Indian company with a strong engineering culture.',
              'I already have exposure to Zoho School for Graduate Studies, so I value the learning environment.',
              'The SOC role gives me real-world exposure to enterprise threats, monitoring, and response.',
            ]}
          />
        ),
      },
      {
        question: 'Are you comfortable with 24/7 rotational shifts?',
        answer: (
          <AnswerBlocks
            items={[
              'Yes. Security is a 24/7 responsibility and I understand SOC coverage cannot stop after office hours.',
              'I will manage sleep, routine, and handoff discipline so shift work does not affect alert quality.',
              'I am comfortable with weekday offs if that is part of the operational model.',
            ]}
          />
        ),
      },
      {
        question: 'How do you handle pressure during an incident?',
        answer: (
          <AnswerBlocks
            items={[
              'I follow the playbook, verify evidence, and prioritize by severity and business impact.',
              'I communicate early if escalation is needed instead of silently guessing.',
              'My debugging and bug bounty experience trained me to stay patient while investigating incomplete clues.',
            ]}
          />
        ),
      },
      {
        question: 'Explain a firewall to a non-technical manager.',
        answer: (
          <AnswerBlocks
            items={[
              'A firewall is like a security gate for network traffic.',
              'It checks who is coming in, where they want to go, and whether the rulebook allows it.',
              'If traffic violates policy or looks risky, it can block or log it for investigation.',
            ]}
          />
        ),
      },
    ],
  },
]

const playbooks: Playbook[] = [
  {
    title: 'Suspicious IP alert',
    trigger: 'SIEM or firewall flags traffic to or from an unknown IP.',
    steps: [
      'Confirm source asset, destination IP, port, protocol, timestamp, and direction.',
      'Check whether the destination is expected for the user, server, or application.',
      'Review firewall, proxy, DNS, and endpoint logs around the same time.',
      'Enrich the IP with VirusTotal, AbuseIPDB, WHOIS, geolocation, and internal allowlists.',
      'Escalate if reputation is bad, traffic is repeated, or the endpoint shows related suspicious activity.',
    ],
    evidence: ['SIEM event', 'Firewall session', 'DNS query', 'Proxy URL', 'Endpoint process', 'Threat intelligence result'],
    close: 'Close as false positive only when business context and reputation both support it.',
  },
  {
    title: 'Phishing email report',
    trigger: 'User reports suspicious email or mail gateway raises an alert.',
    steps: [
      'Preserve the message and inspect headers: From, Reply-To, Return-Path, Received path, SPF, DKIM, DMARC.',
      'Check sender domain age, lookalike spelling, URLs, attachments, and urgency language.',
      'Detonate or scan attachments safely if process allows it.',
      'Search mail logs for other recipients and block sender, domain, URL, or hash if confirmed malicious.',
      'Reset credentials and isolate host if the user clicked or submitted data.',
    ],
    evidence: ['Email headers', 'URL reputation', 'Attachment hash', 'Recipient search', 'Endpoint/browser logs'],
    close: 'Document whether it was spoofing, credential phishing, malware delivery, or benign marketing.',
  },
  {
    title: 'Brute-force or password spraying',
    trigger: 'Multiple failed logons, account lockouts, or impossible login patterns.',
    steps: [
      'Identify affected account, source IPs, target systems, logon type, and time window.',
      'Distinguish brute force from password spraying by checking many attempts against one user versus one password across many users.',
      'Look for a successful login after failures.',
      'Check VPN, AD, Windows event IDs 4624 and 4625, and MFA logs.',
      'Recommend block, password reset, MFA enforcement, and user notification if confirmed.',
    ],
    evidence: ['Windows Security logs', 'VPN logs', 'AD logs', 'MFA logs', 'Geo/IP reputation'],
    close: 'Escalate immediately if failures are followed by a successful privileged login.',
  },
  {
    title: 'Suspected malware endpoint',
    trigger: 'EDR, antivirus, proxy, or user report indicates malware behavior.',
    steps: [
      'Record hostname, user, file path, hash, process tree, network connections, and first-seen time.',
      'Check hash reputation and sandbox behavior if permitted.',
      'Isolate the host if active command-and-control, credential theft, or lateral movement is suspected.',
      'Remove persistence, reset credentials, and verify no related hosts are affected.',
      'Update detections or block indicators after validation.',
    ],
    evidence: ['EDR alert', 'File hash', 'Process tree', 'Network connection', 'Registry/service persistence', 'User timeline'],
    close: 'Do not delete evidence before preserving key artifacts and timeline.',
  },
  {
    title: 'SQL injection or XSS web alert',
    trigger: 'WAF, proxy, or application logs show web attack payloads.',
    steps: [
      'Capture requested URL, method, parameters, user agent, source IP, response code, and affected application.',
      'Classify payload: SQLi, XSS, command injection, directory traversal, or scanner noise.',
      'Check whether the request was blocked, allowed, or returned abnormal response size or status.',
      'Search for repeat activity from the same IP or same target endpoint.',
      'Escalate to application team with evidence and remediation suggestions.',
    ],
    evidence: ['WAF event', 'Web access log', 'Application error log', 'Request and response sample', 'Source reputation'],
    close: 'Your Knowledge Nexus and bug bounty stories are strong examples here.',
  },
]

const ports = [
  ['20/21', 'FTP', 'File transfer, unencrypted'],
  ['22', 'SSH', 'Secure remote login'],
  ['23', 'Telnet', 'Insecure remote login'],
  ['25', 'SMTP', 'Sends email'],
  ['53', 'DNS', 'Domain resolution'],
  ['67/68', 'DHCP', 'IP assignment'],
  ['80', 'HTTP', 'Unencrypted web'],
  ['110', 'POP3', 'Older email retrieval'],
  ['143', 'IMAP', 'Modern email retrieval'],
  ['443', 'HTTPS', 'Encrypted web'],
  ['445', 'SMB', 'Windows file sharing'],
  ['3389', 'RDP', 'Remote desktop'],
]

const windowsEvents = [
  ['4624', 'Successful logon'],
  ['4625', 'Failed logon'],
  ['4672', 'Special privileges assigned'],
  ['4688', 'Process creation'],
  ['7045', 'Service installed'],
  ['1102', 'Audit log cleared'],
]

const nightBefore = [
  'TCP versus UDP and the three-way handshake.',
  'Port numbers: 21, 22, 53, 80, 443, 3389, plus SMB 445 and email ports.',
  'Linux log paths, especially /var/log/auth.log, plus grep, awk, tail, ss, and netstat.',
  'Windows Event IDs 4624 and 4625, plus 4672, 4688, 7045, and 1102.',
  'XSS versus SQL injection, plus IDOR and authentication flaws from your resume.',
  'Phishing investigation: headers, SPF, DKIM, DMARC, URLs, attachments, recipient search.',
  'SIEM true/false positive matrix and incident response lifecycle.',
]

const categoryAccent: Record<TopicCategory, string> = {
  Core: 'text-lime-200 border-lime-300/30 bg-lime-300/10',
  Networking: 'text-cyan-200 border-cyan-300/30 bg-cyan-300/10',
  Systems: 'text-amber-200 border-amber-300/30 bg-amber-300/10',
  SOC: 'text-emerald-200 border-emerald-300/30 bg-emerald-300/10',
  Threats: 'text-rose-200 border-rose-300/30 bg-rose-300/10',
  Tools: 'text-sky-200 border-sky-300/30 bg-sky-300/10',
  Enterprise: 'text-violet-200 border-violet-300/30 bg-violet-300/10',
  Career: 'text-zinc-100 border-zinc-300/30 bg-zinc-300/10',
}

const topicFilters: TopicFilter[] = ['All', 'Core', 'Networking', 'Systems', 'SOC', 'Threats', 'Tools', 'Enterprise', 'Career']

const beginnerCheatCodes: Record<string, string> = {
  'cybersecurity-fundamentals':
    'Use this sentence: "Asset has value, vulnerability is the weakness, threat is who/what attacks it, risk is the possible loss, exploit is the method, mitigation reduces the risk."',
  'networking-fundamentals':
    'Think envelope: IP is address, port is apartment number, protocol is delivery style, payload is the message. For interviews, always mention source, destination, port, protocol, and time.',
  'linux-fundamentals':
    'Use the 5-command starter kit: pwd to orient, ls to list, cat/less to read, grep to find, tail -f to watch live logs.',
  'windows-fundamentals':
    'For Windows login questions, start with 4625 for failed logons, 4624 for successful logons, then ask: who, from where, when, and was privilege granted?',
  'shell-scripting':
    'Cheatcode: pipe small commands together. grep finds the line, awk/cut extracts the field, sort/uniq counts repeats, wc counts total lines.',
  'python-basics':
    'For Python in SOC, say: "I use it to parse logs, extract IOCs, call reputation APIs, and generate small reports."',
  'soc-operations':
    'Tier 1 answer formula: validate alert, gather evidence, remove false positives, document, escalate when impact or uncertainty is high.',
  'siem-fundamentals':
    'SIEM in one line: logs come in, fields become standard, rules connect events, alerts tell analysts where to look first.',
  'log-analysis':
    'Log reading cheatcode: filter by time, asset, user, source IP, destination, action, then compare before/after the alert.',
  'incident-response':
    'Never jump to deletion. Say: identify, contain, preserve evidence, eradicate, recover, document lessons learned.',
  malware:
    'Classify malware by behavior: steals, hides, spreads, encrypts, spies, or controls. Behavior decides the response.',
  'common-attacks':
    'Web attack shortcut: SQLi attacks database queries, XSS attacks users through browser script, IDOR abuses authorization checks.',
  'defensive-tools':
    'Tool memory hook: firewall controls traffic, AV checks known files, EDR watches behavior, WAF protects web requests, proxy mediates browsing.',
  'ids-ips':
    'IDS is the camera, IPS is the guard. Camera alerts; guard can stop traffic.',
  nmap:
    'Interview-safe Nmap line: "I use it to identify live hosts, exposed ports, service versions, and possible attack surface, only with authorization."',
  wireshark:
    'Start with filters: ip.addr for a host, dns for domains, http for web, tcp.port for a port. Reduce noise before interpreting.',
  'threat-intelligence':
    'IOC is evidence, IOA is behavior. Hash/IP/domain are IOCs; repeated failures or unusual PowerShell is IOA.',
  'authentication-security':
    'Authentication asks "Who are you?" Authorization asks "What can you do?" Accounting asks "What did you do?"',
  'cryptography-basics':
    'Encryption is reversible with a key. Hashing is one-way. Signing proves who sent it and whether it changed.',
  'email-security':
    'Phishing triage order: sender, headers, SPF/DKIM/DMARC, links, attachment hash, other recipients, user clicked or not.',
  'active-directory':
    'AD mental model: Domain Controller is the login authority, groups grant access at scale, GPO pushes rules to many machines.',
  'cloud-security':
    'Cloud question shortcut: first identify SaaS/PaaS/IaaS, then say what the customer still controls: users, data, keys, configs.',
  'report-writing':
    'Report format cheatcode: what happened, why it happened, what was affected, what we did, what prevents repeat.',
  'behavioral-questions':
    'Behavioral answer formula: honest motivation, resume proof, SOC usefulness, willingness to learn and work shifts.',
}

function ResumeQuestionsSection() {
  const [activeCategory, setActiveCategory] = useState<string>(resumeQuestionsData[0].id)
  const activeData = resumeQuestionsData.find((c) => c.id === activeCategory) || resumeQuestionsData[0]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Resume Deep-Dive (50+ Questions)</h2>
              <p className="text-sm text-zinc-400">Managerial and technical questions extracted directly from your resume.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6 border-b border-zinc-800 pb-4">
            {resumeQuestionsData.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.title}
                  <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-xs">
                    {category.questions.length}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold text-zinc-200">{activeData.title}</h3>
            <p className="mb-6 text-sm text-zinc-400">{activeData.description}</p>
            
            <div className="space-y-4">
              {activeData.questions.map((q, idx) => (
                <details
                  key={idx}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/80 [&_summary::-webkit-details-marker]:hidden overflow-hidden transition-all duration-300"
                >
                  <summary className="flex cursor-pointer items-start justify-between gap-4 p-4 hover:bg-zinc-800/50">
                    <div className="flex gap-4">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-400 group-open:bg-indigo-500/20 group-open:text-indigo-400">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-medium leading-6 text-zinc-200 group-open:text-white">
                        {q.q}
                      </h4>
                    </div>
                    <span className="shrink-0 text-zinc-500 transition duration-300 group-open:-rotate-180">
                      <ChevronDown className="h-5 w-5" />
                    </span>
                  </summary>
                  <div className="border-t border-zinc-800 bg-zinc-950/50 p-4 pl-14">
                    <p className="text-sm leading-relaxed text-zinc-400">{q.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const studyStorageKey = 'zoho-soc-prep-mastered-topics'

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard')
  const [query, setQuery] = useState('')
  const [topicCategory, setTopicCategory] = useState<TopicFilter>('All')
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      const saved = window.localStorage.getItem('zoho-soc-prep-sidebar-collapsed')
      return saved === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    window.localStorage.setItem('zoho-soc-prep-sidebar-collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  const [masteredTopicIds, setMasteredTopicIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []

    try {
      const saved = window.localStorage.getItem(studyStorageKey)
      return saved ? JSON.parse(saved) as string[] : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(studyStorageKey, JSON.stringify(masteredTopicIds))
  }, [masteredTopicIds])

  const filteredTopics = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const categoryFiltered = topicCategory === 'All'
      ? topicCatalog
      : topicCatalog.filter((topic) => topic.category === topicCategory)

    if (!normalized) return categoryFiltered

    return categoryFiltered.filter((topic) => {
      const studyNote = topicStudyNotes[topic.id]
      const haystack = [
        topic.title,
        topic.category,
        topic.explanation,
        topic.whySoc,
        beginnerCheatCodes[topic.id],
        studyNote?.beginner,
        studyNote?.mentalModel,
        studyNote?.zohoAnswer,
        studyNote?.practice,
        studyNote?.resumeBridge,
        ...topic.checklist,
        ...topic.interviewQuestions,
        ...(studyNote?.mustMemorize ?? []),
        ...(studyNote?.socWorkflow ?? []),
        ...(studyNote?.commonConfusions ?? []),
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalized)
    })
  }, [query, topicCategory])

  const activeNav = navItems.find((item) => item.id === activeSection) ?? navItems[0]
  const questionCount = questionGroups.reduce((sum, group) => sum + group.questions.length, 0)
  const masteredCount = masteredTopicIds.length
  const progressPercent = Math.round((masteredCount / topicCatalog.length) * 100)

  function toggleMasteredTopic(topicId: string) {
    setMasteredTopicIds((current) =>
      current.includes(topicId) ? current.filter((id) => id !== topicId) : [...current, topicId],
    )
  }

  return (
    <div className="min-h-screen bg-[#07090c] text-zinc-100">
      <div className="fixed inset-0 -z-10 signal-grid" />
      <div className="min-h-screen xl:grid xl:grid-cols-[auto_1fr]">
        <aside className={`hidden border-b border-white/10 bg-[#080b0f]/95 backdrop-blur-xl xl:sticky xl:top-0 xl:block xl:h-screen xl:overflow-y-auto xl:border-b-0 xl:border-r transition-all duration-300 ${
          sidebarCollapsed ? 'xl:w-20' : 'xl:w-[304px]'
        }`}>
          <div className={`flex min-h-full flex-col gap-6 transition-all duration-300 ${
            sidebarCollapsed ? 'p-3' : 'p-5'
          }`}>
            <div className={`rounded-lg border border-lime-300/25 bg-lime-300/10 transition-all duration-300 ${
              sidebarCollapsed ? 'p-2 text-center' : 'p-4'
            } shadow-[0_0_40px_rgba(190,255,71,0.08)]`}>
              <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-lime-300 text-black">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-lime-200">SOC Prep</p>
                    <h1 className="text-lg font-semibold leading-tight text-white">Zoho Analyst Console</h1>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  Resume-backed interview prep for the June 2, 2026 Chennai SOC Analyst interview.
                </p>
              )}
            </div>

            <nav className="grid gap-2" aria-label="Primary sections">
              {navItems.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  active={item.id === activeSection}
                  onClick={() => setActiveSection(item.id)}
                  collapsed={sidebarCollapsed}
                />
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`group mt-2 flex items-center rounded-lg border border-transparent text-zinc-500 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-100 ${
                sidebarCollapsed ? 'h-12 w-12 justify-center p-0 mx-auto' : 'gap-3 px-3 py-2 text-left'
              }`}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={`h-5 w-5 shrink-0 transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">Collapse sidebar</span>
              )}
            </button>

            {!sidebarCollapsed ? (
              <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Coverage</span>
                  <span className="font-mono text-sm text-lime-200">{masteredCount}/{topicCatalog.length}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-lime-300 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="mt-3 text-xs leading-5 text-zinc-400">
                  Mark topics as mastered in the topic map. Your progress is saved in this browser.
                </p>
              </div>
            ) : (
              <div className="mt-auto text-center" title={`Progress: ${progressPercent}% (${masteredCount}/${topicCatalog.length} mastered)`}>
                <div className="relative mx-auto h-12 w-12 rounded-full border border-white/10 bg-white/[0.03] grid place-items-center">
                  <span className="font-mono text-xs text-lime-200">{progressPercent}%</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07090c]/90 backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
                  <span className="text-lime-200 xl:hidden">Zoho SOC Prep / </span>
                  {activeNav.helper}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">{activeNav.label}</h2>
              </div>

              <label className="group flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 transition focus-within:border-lime-300/60 lg:max-w-md">
                <Search className="h-4 w-4 text-zinc-500 transition group-focus-within:text-lime-200" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onFocus={() => setActiveSection('topics')}
                  aria-label="Search topics and questions"
                  placeholder="Search DNS, SPF, Nmap, IDOR..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                />
                <Filter className="h-4 w-4 text-zinc-600" />
              </label>
            </div>
          </header>

          <div className="px-5 pb-28 pt-6 lg:px-8 lg:py-8">
            <div style={{ display: activeSection === 'dashboard' ? 'block' : 'none' }}>
              <Dashboard
                questionCount={questionCount}
                masteredCount={masteredCount}
                progressPercent={progressPercent}
                onOpenTopics={() => setActiveSection('topics')}
              />
            </div>
            <div style={{ display: activeSection === 'manager' ? 'block' : 'none' }}>
              <ManagerRoundSection />
            </div>
            <div style={{ display: activeSection === 'resumeQuestions' ? 'block' : 'none' }}>
              <ResumeQuestionsSection />
            </div>
            <div style={{ display: activeSection === 'resume' ? 'block' : 'none' }}>
              <ResumeSection />
            </div>
            <div style={{ display: activeSection === 'questions' ? 'block' : 'none' }}>
              <QuestionsSection />
            </div>
            <div style={{ display: activeSection === 'topics' ? 'block' : 'none' }}>
              <TopicsSection
                query={query}
                topics={filteredTopics}
                selectedCategory={topicCategory}
                onCategoryChange={setTopicCategory}
                masteredTopicIds={masteredTopicIds}
                onToggleMastered={toggleMasteredTopic}
              />
            </div>
            <div style={{ display: activeSection === 'playbooks' ? 'block' : 'none' }}>
              <PlaybooksSection />
            </div>
            <div style={{ display: activeSection === 'zoho' ? 'block' : 'none' }}>
              <ZohoSection />
            </div>
            <div style={{ display: activeSection === 'cheatsheet' ? 'block' : 'none' }}>
              <CheatSheetSection />
            </div>
            <div style={{ display: activeSection === 'wellness' ? 'block' : 'none' }}>
              <WellnessSection />
            </div>
          </div>
        </main>
      </div>
      <MobileNav activeSection={activeSection} onSelect={setActiveSection} />
    </div>
  )
}

function NavButton({
  item,
  active,
  onClick,
  collapsed = false,
}: {
  item: { id: SectionId; label: string; helper: string; icon: LucideIcon }
  active: boolean
  onClick: () => void
  collapsed?: boolean
}) {
  const Icon = item.icon

  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`group flex items-center rounded-lg border text-left transition ${
        collapsed
          ? 'h-12 w-12 justify-center p-0 mx-auto'
          : 'gap-3 px-3 py-3'
      } ${
        active
          ? 'border-lime-300/50 bg-lime-300/10 text-white shadow-[inset_0_0_0_1px_rgba(190,255,71,0.08)]'
          : 'border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-100'
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-lime-200' : 'text-zinc-500 group-hover:text-cyan-200'}`} />
      {!collapsed && (
        <>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">{item.label}</span>
            <span className="block truncate text-xs text-zinc-500">{item.helper}</span>
          </span>
          {active && <ChevronRight className="h-4 w-4 text-lime-200" />}
        </>
      )}
    </button>
  )
}

function MobileNav({ activeSection, onSelect }: { activeSection: SectionId; onSelect: (section: SectionId) => void }) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-8 gap-1 rounded-lg border border-white/10 bg-[#090d12]/95 p-2 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl xl:hidden" aria-label="Mobile sections">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = item.id === activeSection

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`grid min-h-14 place-items-center rounded-md px-1 text-[10px] transition ${
              active ? 'bg-lime-300 text-black' : 'text-zinc-500 hover:bg-white/10 hover:text-white'
            }`}
            aria-label={item.label}
          >
            <Icon className="h-5 w-5" />
            <span className="mt-1 hidden md:block">{item.label.split(' ')[0]}</span>
          </button>
        )
      })}
    </nav>
  )
}

function Dashboard({
  questionCount,
  masteredCount,
  progressPercent,
  onOpenTopics,
}: {
  questionCount: number
  masteredCount: number
  progressPercent: number
  onOpenTopics: () => void
}) {
  const priorityTopics = topicCatalog.filter((topic) =>
    ['Networking', 'Systems', 'SOC', 'Tools', 'Enterprise'].includes(topic.category),
  )

  return (
    <section className="panel-enter mx-auto w-full max-w-7xl space-y-6">
      <div className="grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0d1117] p-6 md:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-300/80 to-transparent" />
          <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-lime-200">Personalized Prep Room</p>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                My SOC interview control room.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
                A focused prep application that ties your bug bounty, Linux, networking, Zoho internship, and secure Java project stories to real SOC interview scenarios.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Burp Suite', 'Nmap', 'Wireshark', 'Linux CLI', 'Bash', 'Python', 'OWASP Top 10', 'CCNA'].map((skill) => (
                  <Pill key={skill}>{skill}</Pill>
                ))}
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onOpenTopics}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-lime-300 px-4 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-lime-200"
                >
                  <Play className="h-4 w-4" />
                  Start topic drill
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('quick-cheatcodes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-200/50"
                >
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                  Show cheatcodes
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/30 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Interview stance</p>
              <div className="mt-4 space-y-4">
                <SignalLine label="Primary edge" value="Offensive mindset for defense" />
                <SignalLine label="Best stories" value="Bug bounty, Knowledge Nexus, Zoho internship" />
                <SignalLine label="Must prove" value="Triage, documentation, shift readiness" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Metric icon={Layers3} label="Gemini topics" value="24/24" helper="Covered explicitly" />
          <Metric icon={NotebookTabs} label="Practice prompts" value={String(questionCount)} helper="Resume, technical, HR" />
          <Metric icon={Trophy} label="Mastered" value={`${masteredCount}/24`} helper={`${progressPercent}% saved locally`} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <StudyDrill />

        <SectionPanel title="High-probability topics from source docs" icon={Siren}>
          <div className="grid gap-3 sm:grid-cols-2">
            {priorityTopics.slice(0, 8).map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={onOpenTopics}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-left transition hover:-translate-y-0.5 hover:border-lime-300/40 hover:bg-lime-300/10"
              >
                <span className="font-mono text-xs text-zinc-500">Topic {topic.number}</span>
                <span className="mt-1 block text-sm font-semibold text-white">{topic.title}</span>
                <span className="mt-2 block text-xs leading-5 text-zinc-400">{beginnerCheatCodes[topic.id]}</span>
              </button>
            ))}
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionPanel title="Study order for the remaining window" icon={Route}>
          <ol className="space-y-3">
            {[
              'Networking and ports first: TCP/UDP, DNS, NAT, DHCP, common ports, Wireshark filters.',
              'SOC workflow next: SIEM, true/false positive matrix, log analysis, incident response.',
              'Email/IP scenarios: phishing headers, SPF/DKIM/DMARC, VirusTotal, AbuseIPDB.',
              'Resume stories last: bug bounty method, Knowledge Nexus SQLi defense, Zoho root-cause analysis.',
            ].map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-300">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-lime-300/30 bg-lime-300/10 font-mono text-xs text-lime-200">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </SectionPanel>

        <SectionPanel title="Quick beginner cheatcodes" icon={Sparkles}>
          <div id="quick-cheatcodes" className="grid gap-3 sm:grid-cols-2">
            {[
              topicCatalog[0],
              topicCatalog[1],
              topicCatalog[9],
              topicCatalog[19],
            ].map((topic) => (
              <div key={topic.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="font-mono text-xs text-lime-200">Topic {topic.number}: {topic.title}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{beginnerCheatCodes[topic.id]}</p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>

      <SectionPanel title="Zoho SOC Analyst Interview Process" icon={ClipboardCheck}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              round: 'Round 1: Written & Aptitude Test',
              focus: 'Core Networking & OS Fundamentals',
              desc: 'Expect short technical questions and aptitude MCQs covering subnets, common ports, DNS records, and standard Linux/Windows commands.',
            },
            {
              round: 'Round 2: Technical Interview 1',
              focus: 'OS, Protocols, and Command Line',
              desc: 'Examines TCP handshakes, headers, Wireshark filter syntax, and command pipeline writing (e.g. log filtering using grep/awk).',
            },
            {
              round: 'Round 3: Technical Interview 2',
              focus: 'Scenario Triage & Resume Drill',
              desc: 'Triage scenarios (e.g. phishing email analysis, SQLi attempt, suspicious login). Expect questions defending your bug bounty POCs and Java projects.',
            },
            {
              round: 'Round 4: HR & Behavioral Round',
              focus: 'Shift Adaptability & Culture Fit',
              desc: 'Evaluates your rotational 24/7 shift readiness, salary details, and alignment with Zoho\'s engineering-first culture.',
            },
          ].map((step, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs text-lime-200 uppercase tracking-[0.16em]">{step.round}</p>
                <h3 className="mt-2 text-sm font-semibold text-white">{step.focus}</h3>
                <p className="mt-3 text-xs leading-5 text-zinc-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title="Source coverage" icon={FileText}>
        <div className="grid gap-3 md:grid-cols-3">
          <SourceBadge
            title="Resume_C.pdf"
            text="Profile, skills, projects, internship, education, certifications, and resume-specific answers are included."
          />
          <SourceBadge
            title="Gemini prep PDF"
            text="All 24 interview topics are mapped with beginner explanations, SOC relevance, checklists, and questions."
          />
          <SourceBadge
            title="claudeFrontend.md"
            text="Applied as visual direction: bold, distinctive, motion-rich, non-generic, responsive, and production-minded."
          />
        </div>
      </SectionPanel>
    </section>
  )
}

function StudyDrill() {
  const [index, setIndex] = useState(0)
  const [answerVisible, setAnswerVisible] = useState(false)
  const drillTopics = [
    topicCatalog[1],
    topicCatalog[19],
    topicCatalog[7],
    topicCatalog[9],
    topicCatalog[11],
    topicCatalog[20],
  ]
  const topic = drillTopics[index % drillTopics.length]
  const question = topic.interviewQuestions[0]

  function nextCard() {
    setAnswerVisible(false)
    setIndex((current) => (current + 1) % drillTopics.length)
  }

  return (
    <SectionPanel title="60-second drill card" icon={Play}>
      <div className="rounded-lg border border-lime-300/25 bg-lime-300/10 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-full border border-lime-300/30 px-3 py-1 font-mono text-xs text-lime-100">
            Topic {topic.number}
          </span>
          <span className="font-mono text-xs text-zinc-500">{index + 1}/{drillTopics.length}</span>
        </div>
        <h3 className="text-xl font-semibold leading-7 text-white">{question}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Say your answer out loud first. Then reveal the cheatcode and compare your structure.
        </p>
      </div>

      {answerVisible && (
        <div className="mt-4 rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
          <p className="font-semibold text-cyan-100">{topic.title} cheatcode</p>
          <p className="mt-2">{beginnerCheatCodes[topic.id]}</p>
          <p className="mt-3 text-cyan-100">
            Interview close: {topic.whySoc}
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setAnswerVisible((current) => !current)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-lime-300 px-4 py-3 text-sm font-semibold text-black transition hover:bg-lime-200"
        >
          <Eye className="h-4 w-4" />
          {answerVisible ? 'Hide answer' : 'Reveal answer'}
        </button>
        <button
          type="button"
          onClick={nextCard}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-200/50"
        >
          <RefreshCcw className="h-4 w-4 text-cyan-200" />
          Next drill
        </button>
      </div>
    </SectionPanel>
  )
}

function ResumeSection() {
  return (
    <section className="panel-enter mx-auto w-full max-w-7xl space-y-6">
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <SectionPanel title="Candidate profile" icon={UserRound}>
          <div className="space-y-5">
            <div>
              <h3 className="text-3xl font-semibold text-white">{resumeProfile.name}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{resumeProfile.headline}</p>
            </div>
            <div className="grid gap-2">
              {resumeProfile.contacts.map((contact) => (
                <div key={contact} className="rounded-md border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-zinc-300">
                  {contact}
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
              {resumeProfile.summary}
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="How your resume maps to SOC" icon={ShieldCheck}>
          <div className="grid gap-4 md:grid-cols-3">
            <ResumeMapping
              title="Alert mindset"
              text="Bug bounty work proves you can follow clues, validate impact, and avoid shallow assumptions."
            />
            <ResumeMapping
              title="Evidence discipline"
              text="Your reports with proof of concept and remediation briefs map directly to incident documentation."
            />
            <ResumeMapping
              title="Systematic analysis"
              text="Zoho internship debugging and code review translate to root-cause analysis and clear escalation."
            />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {resumeProfile.skillGroups.map((group) => (
              <div key={group.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <h4 className="text-sm font-semibold text-white">{group.label}</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Pill key={item}>{item}</Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionPanel title="Projects to defend in interview" icon={BriefcaseBusiness}>
          <div className="space-y-4">
            {resumeProfile.projects.map((project) => (
              <article key={project.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <h3 className="font-semibold text-white">{project.name}</h3>
                <p className="mt-1 font-mono text-xs text-lime-200">{project.stack}</p>
                <ul className="mt-4 space-y-2">
                  {project.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm leading-6 text-zinc-300">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-lime-200" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Education, internship, certifications" icon={GraduationCap}>
          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Experience</p>
              <h3 className="mt-2 font-semibold text-white">
                {resumeProfile.experience.title}, {resumeProfile.experience.org}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                {resumeProfile.experience.location} - {resumeProfile.experience.dates}
              </p>
              <ul className="mt-4 space-y-2">
                {resumeProfile.experience.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm leading-6 text-zinc-300">
                    <CircleDot className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Education</p>
              <p className="mt-2">{resumeProfile.education}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Certifications</p>
              <div className="mt-3 grid gap-2">
                {resumeProfile.certifications.map((certification) => (
                  <div key={certification} className="rounded-md bg-black/20 px-3 py-2 text-sm text-zinc-300">
                    {certification}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionPanel>
      </div>
    </section>
  )
}

function QuestionsSection() {
  return (
    <section className="panel-enter mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-lg border border-white/10 bg-[#0d1117] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">Practice mode</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Answer like an analyst, not like a glossary.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
          Each answer is shaped from your resume and the Gemini prep PDF. Keep answers structured: context, evidence, action, impact.
        </p>
      </div>

      <div className="grid gap-5">
        {questionGroups.map((group) => {
          const Icon = group.icon
          return (
            <SectionPanel key={group.title} title={group.title} icon={Icon}>
              <p className="mb-4 text-sm leading-6 text-zinc-400">{group.description}</p>
              <div className="grid gap-3 lg:grid-cols-2">
                {group.questions.map((item) => (
                  <QuestionCard key={item.question} question={item.question}>
                    {item.answer}
                  </QuestionCard>
                ))}
              </div>
            </SectionPanel>
          )
        })}
      </div>
    </section>
  )
}

function TopicsSection({
  query,
  topics,
  selectedCategory,
  onCategoryChange,
  masteredTopicIds,
  onToggleMastered,
}: {
  query: string
  topics: Topic[]
  selectedCategory: TopicFilter
  onCategoryChange: (category: TopicFilter) => void
  masteredTopicIds: string[]
  onToggleMastered: (topicId: string) => void
}) {
  return (
    <section className="panel-enter mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-[#0d1117] p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">Gemini PDF coverage check</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">All 24 topics, made interview-readable.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
            Search filters across explanations, checklists, and interview questions. Clear the search box to see the full map.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/25 p-4 text-right">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Visible topics</p>
          <p className="mt-1 text-3xl font-semibold text-lime-200">{topics.length}</p>
        </div>
      </div>

      <div className="flex w-full gap-2 overflow-x-auto rounded-lg border border-white/10 bg-[#0d1117]/80 p-2">
        {topicFilters.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`shrink-0 rounded-md px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] transition ${
              selectedCategory === category
                ? 'bg-lime-300 text-black'
                : 'border border-white/10 bg-white/[0.03] text-zinc-400 hover:border-cyan-200/40 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {query && topics.length === 0 ? (
        <div className="rounded-lg border border-rose-300/30 bg-rose-300/10 p-6 text-sm text-rose-100">
          No topics matched "{query}". Try a term like DNS, SPF, Nmap, Linux, SIEM, or report.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto w-full">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              mastered={masteredTopicIds.includes(topic.id)}
              onToggleMastered={() => onToggleMastered(topic.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function PlaybooksSection() {
  return (
    <section className="panel-enter mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-lg border border-white/10 bg-[#0d1117] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">Scenario prep</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Walk through cases like you are already on shift.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
          Zoho interview reports mention IP analysis, email analysis, SQL injection, and day-to-day SOC case questions. Use these as answer templates.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {playbooks.map((playbook) => (
          <PlaybookCard key={playbook.title} playbook={playbook} />
        ))}
      </div>
    </section>
  )
}

function ManagerRoundSection() {
  type MgrTab = 'overview' | 'foundations' | 'diagrams' | 'flows' | 'scenarios' | 'questions' | 'studyplan'

  const [activeTab, setActiveTab] = useState<MgrTab>('overview')
  const [expandedDomain, setExpandedDomain] = useState<number | null>(null)
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null)

  const mgrStorageKey = 'zoho-soc-mgr-mastered-domains'
  const [masteredDomains, setMasteredDomains] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = window.localStorage.getItem(mgrStorageKey)
      return saved ? JSON.parse(saved) as string[] : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(mgrStorageKey, JSON.stringify(masteredDomains))
  }, [masteredDomains])

  function toggleDomainMastered(title: string) {
    setMasteredDomains((current) =>
      current.includes(title) ? current.filter((d) => d !== title) : [...current, title],
    )
  }

  const totalDomains = managerRoundDomains.length
  const masteredDomainCount = masteredDomains.length
  const domainProgressPercent = totalDomains > 0 ? Math.round((masteredDomainCount / totalDomains) * 100) : 0
  const totalQuestions = managerRoundQuestionGroups.reduce((sum, g) => sum + g.questions.length, 0)
  const totalScenarios = managerRoundScenarios.length
  const totalFlows = managerRoundFlows.length

  const tabs: { id: MgrTab; label: string; icon: LucideIcon }[] = [
    { id: 'overview', label: 'Command Deck', icon: Radar },
    { id: 'foundations', label: 'Foundations', icon: Brain },
    { id: 'diagrams', label: 'Diagrams', icon: Network },
    { id: 'flows', label: 'Flows', icon: Route },
    { id: 'scenarios', label: 'Scenarios', icon: Siren },
    { id: 'questions', label: 'Questions', icon: NotebookTabs },
    { id: 'studyplan', label: 'Study Plan', icon: ListChecks },
  ]

  return (
    <section className="panel-enter mx-auto w-full max-w-7xl space-y-6">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-lg border border-lime-300/20 bg-[#0d1117] p-6 lg:p-10">
        <div className="mgr-hero-gradient" />
        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-lime-200">Manager round · deep technical prep</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
            Master every topic the manager will drill.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
            Built from your JD, employee hints, your scripting round experience, official references (NIST, OWASP, MITRE, RFCs), and 2026 threat intelligence. Covers TCP/UDP, data centers, IP addressing, OWASP Top 10, WAF vs firewall, SOC triage, scripting, Active Directory, cloud security, encryption, and more.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['TCP/UDP', 'Data Center', 'Public/Private IP', 'OWASP 2025+2021', 'WAF vs Firewall', 'IDS/IPS', 'SOC Triage', 'SIEM', 'Logs', 'Scripting', 'DNS', 'TLS/SSL', 'VPN/Zero Trust', 'MITRE ATT&CK', 'Active Directory', 'Cloud Security', 'Encryption'].map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            <div className="mgr-stat">
              <span className="mgr-stat-value">{totalDomains}</span>
              <span className="mgr-stat-label">Domains</span>
            </div>
            <div className="mgr-stat">
              <span className="mgr-stat-value">{totalQuestions}</span>
              <span className="mgr-stat-label">Questions</span>
            </div>
            <div className="mgr-stat">
              <span className="mgr-stat-value">{totalScenarios}</span>
              <span className="mgr-stat-label">Scenarios</span>
            </div>
            <div className="mgr-stat">
              <span className="mgr-stat-value">{totalFlows}</span>
              <span className="mgr-stat-label">Arch Flows</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 rounded-lg border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Domain mastery</span>
              <span className="font-mono text-sm text-lime-200">{masteredDomainCount}/{totalDomains} · {domainProgressPercent}%</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lime-300 to-cyan-200 transition-all duration-700"
                style={{ width: `${domainProgressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-zinc-500">Mark domains as mastered in the Foundations tab. Progress is saved in this browser.</p>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <nav className="mgr-tabs" aria-label="Manager round sections">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`mgr-tab ${activeTab === tab.id ? 'mgr-tab--active' : ''}`}
            >
              <TabIcon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* ── Tab Content ── */}

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 mgr-stagger">
          {/* Quick access grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setActiveTab('foundations')}
              className="mgr-glow-card rounded-lg bg-[#0d1117] p-5 text-left"
            >
              <Brain className="h-8 w-8 text-lime-200" />
              <h3 className="mt-3 text-lg font-semibold text-white">{totalDomains} Foundation Domains</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                TCP/UDP, DNS, OWASP, WAF, firewalls, MITRE ATT&CK, Active Directory, cloud security, encryption, and more. Each domain has must-explain points, memorize lists, likely questions, and answer formulas.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-lime-200">
                Explore domains <ChevronRight className="h-3 w-3" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diagrams')}
              className="mgr-glow-card rounded-lg bg-[#0d1117] p-5 text-left"
            >
              <Network className="h-8 w-8 text-cyan-200" />
              <h3 className="mt-3 text-lg font-semibold text-white">6 Architecture Diagrams</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Interactive SVG visualizations of data center topology, TCP handshake, OSI/TCP-IP models, NIST IR lifecycle, MITRE ATT&CK kill chain, and phishing investigation flow.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-200">
                View diagrams <ChevronRight className="h-3 w-3" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scenarios')}
              className="mgr-glow-card rounded-lg bg-[#0d1117] p-5 text-left"
            >
              <Siren className="h-8 w-8 text-rose-300" />
              <h3 className="mt-3 text-lg font-semibold text-white">{totalScenarios} Live Scenarios</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Real-world SOC scenarios: database login at 3 AM, SQLi attempts, lateral movement, DNS tunneling, insider threats, impossible travel, supply chain attacks, and more.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-rose-300">
                Practice scenarios <ChevronRight className="h-3 w-3" />
              </span>
            </button>
          </div>

          {/* Study order */}
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <SectionPanel title="Study order for manager round" icon={Route}>
              <div className="space-y-4">
                {managerRoundStudyPlan.map((block, index) => (
                  <div key={block.title} className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-lime-200">Priority {index + 1}</p>
                    <h3 className="mt-1 text-sm font-semibold text-white">{block.title}</h3>
                    <div className="mt-3">
                      <StudyList items={block.items} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionPanel>

            <div className="space-y-5">
              <SectionPanel title="2026 threat watch" icon={Siren}>
                <StudyList items={managerRoundThreatWatch} />
              </SectionPanel>

              <SectionPanel title="Research sources used" icon={FileText}>
                <div className="grid gap-2">
                  {managerRoundSources.slice(0, 6).map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3 transition hover:border-lime-300/40 hover:bg-lime-300/10"
                    >
                      <h3 className="text-xs font-semibold text-white">{source.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-zinc-400">{source.whyItMatters}</p>
                    </a>
                  ))}
                </div>
              </SectionPanel>
            </div>
          </div>
        </div>
      )}

      {/* FOUNDATIONS */}
      {activeTab === 'foundations' && (
        <div className="space-y-4 mgr-stagger">
          <div className="rounded-lg border border-white/10 bg-[#0d1117] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">
              {totalDomains} domains · {masteredDomainCount} mastered · {domainProgressPercent}% complete
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Foundation domains the manager may drill</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              Click any domain to expand its full breakdown. Mark as mastered when you can explain every point from memory.
            </p>
          </div>

          {managerRoundDomains.map((domain, index) => {
            const isExpanded = expandedDomain === index
            const isMastered = masteredDomains.includes(domain.title)
            return (
              <article
                key={domain.title}
                className={`mgr-glow-card rounded-lg bg-[#0d1117] transition ${isMastered ? 'border-lime-300/40' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedDomain(isExpanded ? null : index)}
                  className="flex w-full items-start gap-4 p-5 text-left"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-lime-300/30 bg-lime-300/10 font-mono text-sm font-bold text-lime-200">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{domain.title}</h3>
                      {isMastered && <CheckCircle2 className="h-5 w-5 text-lime-300" />}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{domain.managerAngle}</p>
                  </div>
                  <ChevronRight className={`mt-1 h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                <div className={`mgr-domain-content ${isExpanded ? 'mgr-domain-content--open' : ''}`}>
                  <div>
                    <div className="border-t border-white/10 p-5">
                      <div className="grid gap-5 lg:grid-cols-2">
                        <StudyBlock title="Must explain clearly" tone="lime">
                          <StudyList items={domain.mustExplain} />
                        </StudyBlock>
                        <StudyBlock title="Must memorize cold" tone="cyan">
                          <StudyList items={domain.mustMemorize} />
                        </StudyBlock>
                      </div>

                      <div className="mt-4">
                        <StudyBlock title="Likely interview questions" tone="white">
                          <StudyList items={domain.likelyQuestions} />
                        </StudyBlock>
                      </div>

                      <div className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
                        <strong className="text-amber-100">Answer formula:</strong> {domain.answerFormula}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleDomainMastered(domain.title)}
                        className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition ${
                          isMastered
                            ? 'bg-lime-300 text-black hover:bg-lime-200'
                            : 'border border-white/10 bg-white/[0.04] text-white hover:border-lime-300/50'
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {isMastered ? 'Mastered ✓' : 'Mark as mastered'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* DIAGRAMS */}
      {activeTab === 'diagrams' && (
        <div className="space-y-6 mgr-stagger">
          <div className="rounded-lg border border-white/10 bg-[#0d1117] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-200">Interactive architecture diagrams</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Visual reference for every concept the manager may ask you to draw</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              The employee mentioned the manager asks about architectural diagrams and traffic flows. Study these visualizations so you can recreate them on a whiteboard.
            </p>
          </div>

          <div className="diagram-gallery">
            {/* Network Topology */}
            <div className="diagram-container">
              <span className="diagram-label">Data Center Architecture</span>
              <div className="pt-8">
                <MgrDiagramNetworkTopology />
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-500 relative z-10">
                Internet → Edge → Firewall → DMZ (WAF/LB) → App Tier → Database → SIEM. North-south = in/out, East-west = internal lateral.
              </p>
            </div>

            {/* TCP Handshake */}
            <div className="diagram-container">
              <span className="diagram-label">TCP Three-Way Handshake</span>
              <div className="pt-8">
                <MgrDiagramTcpHandshake />
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-500 relative z-10">
                SYN → SYN-ACK → ACK establishes connection. FIN → ACK → FIN → ACK tears it down. Visible in firewall and Wireshark logs.
              </p>
            </div>

            {/* OSI Model */}
            <div className="diagram-container">
              <span className="diagram-label">OSI vs TCP/IP Model</span>
              <div className="pt-8">
                <MgrDiagramOsiModel />
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-500 relative z-10">
                7-layer OSI maps to 4-layer TCP/IP. Know which protocols live at each layer and how data encapsulation works.
              </p>
            </div>

            {/* Incident Lifecycle */}
            <div className="diagram-container">
              <span className="diagram-label">NIST IR Lifecycle</span>
              <div className="pt-8">
                <MgrDiagramIncidentLifecycle />
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-500 relative z-10">
                Preparation → Detection/Analysis → Containment → Eradication → Recovery → Lessons Learned. Know this cold.
              </p>
            </div>

            {/* Attack Kill Chain */}
            <div className="diagram-container">
              <span className="diagram-label">Cyber Kill Chain</span>
              <div className="pt-8">
                <MgrDiagramAttackFlow />
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-500 relative z-10">
                Recon → Weaponize → Deliver → Exploit → Install → C2 → Actions. SOC can detect/disrupt at each stage.
              </p>
            </div>

            {/* Phishing Flow */}
            <div className="diagram-container">
              <span className="diagram-label">Phishing Investigation Flow</span>
              <div className="pt-8">
                <MgrDiagramPhishingFlow />
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-500 relative z-10">
                Systematic phishing triage: headers → SPF/DKIM/DMARC → URLs → attachments → scope → containment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FLOWS */}
      {activeTab === 'flows' && (
        <div className="space-y-6 mgr-stagger">
          <div className="rounded-lg border border-white/10 bg-[#0d1117] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">Architecture & traffic flow answers</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Walk the manager through each flow step by step</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              Practice explaining these flows out loud. For each step, name what happens, what security control is involved, and what log evidence it produces.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {managerRoundFlows.map((flow) => (
              <article key={flow.title} className="mgr-glow-card rounded-lg bg-[#0d1117] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200">{flow.interviewPrompt}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{flow.title}</h3>
                <ol className="mt-4 space-y-3">
                  {flow.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-6 text-zinc-300">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-lime-300/30 bg-lime-300/10 font-mono text-xs text-lime-200">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 rounded-lg border border-lime-300/20 bg-lime-300/10 p-3 text-sm leading-6 text-lime-50">
                  {flow.talkTrack}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {flow.evidence.map((item) => (
                    <Pill key={item}>{item}</Pill>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* SCENARIOS */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6 mgr-stagger">
          <div className="rounded-lg border border-white/10 bg-[#0d1117] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-rose-300">Scenario-based interview prep</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">The manager will give you a situation. Think out loud.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              Click each scenario to reveal the full investigation approach. Practice: state what you check first, what signals matter, how you frame your answer, and when you escalate.
            </p>
          </div>

          <div className="grid gap-4">
            {managerRoundScenarios.map((scenario, index) => {
              const isOpen = expandedScenario === index
              return (
                <article key={scenario.title} className="mgr-glow-card rounded-lg bg-[#0d1117]">
                  <button
                    type="button"
                    onClick={() => setExpandedScenario(isOpen ? null : index)}
                    className="flex w-full items-start gap-4 p-5 text-left"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-rose-300/30 bg-rose-300/10 font-mono text-sm font-bold text-rose-300">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-white">{scenario.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{scenario.prompt}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {scenario.signals.map((signal) => (
                          <Pill key={signal}>{signal}</Pill>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className={`mt-1 h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                  </button>

                  <div className={`mgr-domain-content ${isOpen ? 'mgr-domain-content--open' : ''}`}>
                    <div>
                      <div className="border-t border-white/10 p-5">
                        <div className="grid gap-4 lg:grid-cols-2">
                          <StudyBlock title="First checks" tone="white">
                            <StudyList items={scenario.firstChecks} />
                          </StudyBlock>
                          <StudyBlock title="Answer frame" tone="cyan">
                            <StudyList items={scenario.answerFrame} />
                          </StudyBlock>
                        </div>
                        <div className="mt-4 rounded-lg border border-rose-300/25 bg-rose-300/10 p-3 text-sm leading-6 text-rose-50">
                          <strong className="text-rose-100">Escalate when:</strong> {scenario.escalateWhen}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}

      {/* QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="space-y-6 mgr-stagger">
          <div className="rounded-lg border border-white/10 bg-[#0d1117] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">Deep question bank · {totalQuestions} questions</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Practice every question the manager could ask</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              Click each question to reveal a structured answer. The answers follow the SOC formula: define, explain behavior, name evidence/logs, connect to scenario.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {managerRoundQuestionGroups.map((group) => (
              <div key={group.title} className="mgr-glow-card rounded-lg bg-[#0d1117] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200">{group.focus}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{group.title}</h3>
                <div className="mt-4 grid gap-3">
                  {group.questions.map((item) => (
                    <QuestionCard key={item.question} question={item.question}>
                      <AnswerBlocks items={item.answer} />
                    </QuestionCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDY PLAN */}
      {activeTab === 'studyplan' && (
        <div className="space-y-6 mgr-stagger">
          <div className="rounded-lg border border-white/10 bg-[#0d1117] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">Structured preparation plan</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Follow this order to maximize coverage</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <SectionPanel title="Study priority order" icon={Route}>
              <div className="space-y-4">
                {managerRoundStudyPlan.map((block, index) => (
                  <div key={block.title} className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-lime-200">Priority {index + 1}</p>
                    <h3 className="mt-1 text-sm font-semibold text-white">{block.title}</h3>
                    <div className="mt-3">
                      <StudyList items={block.items} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionPanel>

            <div className="space-y-5">
              <SectionPanel title="2026 threat landscape awareness" icon={AlertTriangle}>
                <StudyList items={managerRoundThreatWatch} />
              </SectionPanel>

              <SectionPanel title="Research sources used" icon={FileText}>
                <div className="grid gap-2">
                  {managerRoundSources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3 transition hover:border-lime-300/40 hover:bg-lime-300/10"
                    >
                      <h3 className="text-xs font-semibold text-white">{source.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-zinc-400">{source.whyItMatters}</p>
                    </a>
                  ))}
                </div>
              </SectionPanel>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/* ── Manager Round Inline Diagrams ────────────────────────────────── */

function MgrDiagramNetworkTopology() {
  const nodes = [
    { x: 400, y: 30, label: 'Internet', color: '#71717a' },
    { x: 400, y: 100, label: 'Edge Router', color: '#71717a' },
    { x: 400, y: 170, label: 'Perimeter Firewall', color: '#bef264' },
    { x: 200, y: 260, label: 'WAF', color: '#bef264' },
    { x: 400, y: 260, label: 'Load Balancer', color: '#a5f3fc' },
    { x: 600, y: 260, label: 'IDS / IPS', color: '#bef264' },
    { x: 300, y: 350, label: 'Web / App Server', color: '#a5f3fc' },
    { x: 500, y: 350, label: 'Web / App Server', color: '#a5f3fc' },
    { x: 400, y: 440, label: 'Database Server', color: '#fde68a' },
    { x: 400, y: 520, label: 'SIEM / Log Collector', color: '#bef264' },
  ]

  return (
    <svg viewBox="0 0 800 580" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Zone labels */}
      <rect x="140" y="230" width="520" height="65" rx="6" fill="none" stroke="rgba(190,255,71,0.15)" strokeDasharray="4 4" />
      <text x="145" y="225" fill="rgba(190,255,71,0.4)" fontSize="10" fontFamily="monospace">DMZ ZONE</text>

      <rect x="230" y="320" width="340" height="80" rx="6" fill="none" stroke="rgba(165,243,252,0.15)" strokeDasharray="4 4" />
      <text x="235" y="315" fill="rgba(165,243,252,0.4)" fontSize="10" fontFamily="monospace">APPLICATION ZONE</text>

      <rect x="320" y="410" width="160" height="60" rx="6" fill="none" stroke="rgba(253,230,138,0.15)" strokeDasharray="4 4" />
      <text x="325" y="405" fill="rgba(253,230,138,0.4)" fontSize="10" fontFamily="monospace">DATA ZONE</text>

      {/* Vertical connections (north-south) */}
      <line x1="400" y1="48" x2="400" y2="88" stroke="#52525b" strokeWidth="2" className="svg-packet-flow" />
      <line x1="400" y1="118" x2="400" y2="158" stroke="#52525b" strokeWidth="2" className="svg-packet-flow" />
      <line x1="400" y1="188" x2="200" y2="248" stroke="rgba(190,255,71,0.5)" strokeWidth="2" className="svg-packet-flow" />
      <line x1="400" y1="188" x2="400" y2="248" stroke="rgba(165,243,252,0.5)" strokeWidth="2" className="svg-packet-flow" />
      <line x1="400" y1="188" x2="600" y2="248" stroke="rgba(190,255,71,0.5)" strokeWidth="2" className="svg-packet-flow" />
      <line x1="300" y1="278" x2="300" y2="338" stroke="rgba(165,243,252,0.3)" strokeWidth="2" className="svg-packet-flow" />
      <line x1="500" y1="278" x2="500" y2="338" stroke="rgba(165,243,252,0.3)" strokeWidth="2" className="svg-packet-flow" />
      <line x1="300" y1="368" x2="400" y2="428" stroke="rgba(253,230,138,0.3)" strokeWidth="2" className="svg-packet-flow" />
      <line x1="500" y1="368" x2="400" y2="428" stroke="rgba(253,230,138,0.3)" strokeWidth="2" className="svg-packet-flow" />
      <line x1="400" y1="458" x2="400" y2="508" stroke="rgba(190,255,71,0.3)" strokeWidth="2" className="svg-packet-flow" />

      {/* East-west arrow */}
      <line x1="340" y1="355" x2="460" y2="355" stroke="rgba(252,165,165,0.5)" strokeWidth="2" strokeDasharray="6 3" className="svg-packet-flow-reverse" />
      <text x="370" y="375" fill="rgba(252,165,165,0.6)" fontSize="8" fontFamily="monospace">E-W</text>

      {/* Log feed lines to SIEM */}
      {[200, 600].map((x) => (
        <line key={x} x1={x} y1="278" x2={x < 400 ? 350 : 450} y2="520" stroke="rgba(190,255,71,0.12)" strokeWidth="1" strokeDasharray="3 5" />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <g key={i}>
          <rect x={node.x - 65} y={node.y - 14} width="130" height="28" rx="6" fill="rgba(13,17,23,0.9)" stroke={node.color} strokeWidth="1.5" opacity="0.9" />
          <text x={node.x} y={node.y + 4} textAnchor="middle" fill={node.color} fontSize="11" fontFamily="monospace" fontWeight="600">
            {node.label}
          </text>
        </g>
      ))}

      {/* North-South label */}
      <text x="720" y="200" fill="rgba(113,113,122,0.5)" fontSize="9" fontFamily="monospace" transform="rotate(90,720,200)">NORTH → SOUTH</text>
    </svg>
  )
}

function MgrDiagramTcpHandshake() {
  return (
    <svg viewBox="0 0 700 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Client and Server lines */}
      <line x1="150" y1="30" x2="150" y2="360" stroke="#3f3f46" strokeWidth="2" />
      <line x1="550" y1="30" x2="550" y2="360" stroke="#3f3f46" strokeWidth="2" />

      {/* Labels */}
      <text x="150" y="20" textAnchor="middle" fill="#bef264" fontSize="13" fontFamily="monospace" fontWeight="700">CLIENT</text>
      <text x="550" y="20" textAnchor="middle" fill="#a5f3fc" fontSize="13" fontFamily="monospace" fontWeight="700">SERVER</text>

      {/* SYN Arrow */}
      <line x1="155" y1="70" x2="545" y2="110" stroke="#bef264" strokeWidth="2" markerEnd="url(#arrowLime)" className="svg-draw-line" style={{ animationDelay: '200ms' }} />
      <text x="350" y="78" textAnchor="middle" fill="#bef264" fontSize="11" fontFamily="monospace">SYN [SEQ=100]</text>

      {/* SYN-ACK Arrow */}
      <line x1="545" y1="130" x2="155" y2="170" stroke="#a5f3fc" strokeWidth="2" markerEnd="url(#arrowCyan)" className="svg-draw-line" style={{ animationDelay: '700ms' }} />
      <text x="350" y="140" textAnchor="middle" fill="#a5f3fc" fontSize="11" fontFamily="monospace">SYN-ACK [SEQ=300, ACK=101]</text>

      {/* ACK Arrow */}
      <line x1="155" y1="190" x2="545" y2="230" stroke="#bef264" strokeWidth="2" markerEnd="url(#arrowLime)" className="svg-draw-line" style={{ animationDelay: '1200ms' }} />
      <text x="350" y="200" textAnchor="middle" fill="#bef264" fontSize="11" fontFamily="monospace">ACK [SEQ=101, ACK=301]</text>

      {/* Connection Established */}
      <rect x="230" y="248" width="240" height="28" rx="6" fill="rgba(190,255,71,0.12)" stroke="#bef264" strokeWidth="1" />
      <text x="350" y="266" textAnchor="middle" fill="#bef264" fontSize="11" fontFamily="monospace" fontWeight="600">CONNECTION ESTABLISHED</text>

      {/* FIN sequence (dimmer) */}
      <line x1="155" y1="300" x2="545" y2="320" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="350" y="298" textAnchor="middle" fill="#71717a" fontSize="9" fontFamily="monospace">FIN → ACK → FIN → ACK (connection teardown)</text>

      {/* Arrow markers */}
      <defs>
        <marker id="arrowLime" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#bef264" />
        </marker>
        <marker id="arrowCyan" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#a5f3fc" />
        </marker>
      </defs>
    </svg>
  )
}

function MgrDiagramOsiModel() {
  const osiLayers = [
    { num: 7, name: 'Application', proto: 'HTTP, DNS, FTP, SMTP', pdu: 'Data', color: '#bef264' },
    { num: 6, name: 'Presentation', proto: 'SSL/TLS, JPEG, ASCII', pdu: 'Data', color: '#bef264' },
    { num: 5, name: 'Session', proto: 'NetBIOS, RPC', pdu: 'Data', color: '#bef264' },
    { num: 4, name: 'Transport', proto: 'TCP, UDP', pdu: 'Segment', color: '#a5f3fc' },
    { num: 3, name: 'Network', proto: 'IP, ICMP, ARP', pdu: 'Packet', color: '#fde68a' },
    { num: 2, name: 'Data Link', proto: 'Ethernet, WiFi, MAC', pdu: 'Frame', color: '#fca5a5' },
    { num: 1, name: 'Physical', proto: 'Cables, Signals, Bits', pdu: 'Bits', color: '#a3a3a3' },
  ]

  const tcpipLayers = [
    { name: 'Application', maps: '7-6-5', color: '#bef264', h: 3 },
    { name: 'Transport', maps: '4', color: '#a5f3fc', h: 1 },
    { name: 'Internet', maps: '3', color: '#fde68a', h: 1 },
    { name: 'Network Access', maps: '2-1', color: '#fca5a5', h: 2 },
  ]

  const layerH = 42
  const startY = 30

  return (
    <svg viewBox="0 0 800 370" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Title */}
      <text x="200" y="20" textAnchor="middle" fill="#bef264" fontSize="12" fontFamily="monospace" fontWeight="700">OSI MODEL</text>
      <text x="600" y="20" textAnchor="middle" fill="#a5f3fc" fontSize="12" fontFamily="monospace" fontWeight="700">TCP/IP MODEL</text>

      {/* OSI layers */}
      {osiLayers.map((layer, i) => {
        const y = startY + i * layerH
        return (
          <g key={layer.num}>
            <rect x="60" y={y} width="280" height={layerH - 4} rx="4" fill="rgba(13,17,23,0.8)" stroke={layer.color} strokeWidth="1.2" opacity="0.9" />
            <text x="75" y={y + 16} fill={layer.color} fontSize="10" fontFamily="monospace" fontWeight="700">L{layer.num}</text>
            <text x="100" y={y + 16} fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="600">{layer.name}</text>
            <text x="100" y={y + 30} fill="#71717a" fontSize="9" fontFamily="monospace">{layer.proto}</text>
            <text x="320" y={y + 20} fill={layer.color} fontSize="9" fontFamily="monospace" textAnchor="end">{layer.pdu}</text>
          </g>
        )
      })}

      {/* TCP/IP layers */}
      {(() => {
        let yOffset = 0
        return tcpipLayers.map((layer) => {
          const y = startY + yOffset * layerH
          const height = layer.h * layerH - 4
          yOffset += layer.h
          return (
            <g key={layer.name}>
              <rect x="460" y={y} width="280" height={height} rx="4" fill="rgba(13,17,23,0.8)" stroke={layer.color} strokeWidth="1.2" opacity="0.9" />
              <text x="475" y={y + height / 2 + 4} fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="600">{layer.name}</text>
            </g>
          )
        })
      })()}

      {/* Mapping lines */}
      <line x1="340" y1={startY + 63} x2="460" y2={startY + 63} stroke="rgba(190,255,71,0.3)" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="340" y1={startY + layerH * 3 + 18} x2="460" y2={startY + layerH * 3 + 18} stroke="rgba(165,243,252,0.3)" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="340" y1={startY + layerH * 4 + 18} x2="460" y2={startY + layerH * 4 + 18} stroke="rgba(253,230,138,0.3)" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="340" y1={startY + layerH * 5 + 38} x2="460" y2={startY + layerH * 5 + 38} stroke="rgba(252,165,165,0.3)" strokeWidth="1" strokeDasharray="4 3" />
    </svg>
  )
}

function MgrDiagramIncidentLifecycle() {
  const stages = [
    { label: 'Preparation', sub: 'Tools, playbooks, training', angle: -90 },
    { label: 'Detection', sub: 'SIEM alerts, user reports', angle: -30 },
    { label: 'Containment', sub: 'Isolate, block, preserve', angle: 30 },
    { label: 'Eradication', sub: 'Remove malware, patch', angle: 90 },
    { label: 'Recovery', sub: 'Restore, monitor, validate', angle: 150 },
    { label: 'Lessons', sub: 'RCA, update, improve', angle: 210 },
  ]

  const cx = 350
  const cy = 200
  const radius = 145

  return (
    <svg viewBox="0 0 700 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center text */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#bef264" fontSize="12" fontFamily="monospace" fontWeight="700">NIST SP 800-61</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Incident Response</text>
      <text x={cx} y={cy + 22} textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">Lifecycle</text>

      {/* Connection arcs */}
      {stages.map((_, i) => {
        const nextI = (i + 1) % stages.length
        const rad1 = (stages[i].angle * Math.PI) / 180
        const rad2 = (stages[nextI].angle * Math.PI) / 180
        const x1 = cx + Math.cos(rad1) * (radius - 20)
        const y1 = cy + Math.sin(rad1) * (radius - 20)
        const x2 = cx + Math.cos(rad2) * (radius - 20)
        const y2 = cy + Math.sin(rad2) * (radius - 20)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(190,255,71,0.2)" strokeWidth="1.5" className="svg-packet-flow" />
        )
      })}

      {/* Stage nodes */}
      {stages.map((stage, i) => {
        const rad = (stage.angle * Math.PI) / 180
        const x = cx + Math.cos(rad) * radius
        const y = cy + Math.sin(rad) * radius
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="40" fill="rgba(13,17,23,0.9)" stroke="#bef264" strokeWidth="1.5" />
            <text x={x} y={y - 4} textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="600">{stage.label}</text>
            <text x={x} y={y + 10} textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="monospace">{stage.sub}</text>
          </g>
        )
      })}
    </svg>
  )
}

function MgrDiagramAttackFlow() {
  const stages = [
    { name: 'Recon', technique: 'T1595', color: '#a5f3fc' },
    { name: 'Weaponize', technique: 'T1587', color: '#a5f3fc' },
    { name: 'Deliver', technique: 'T1566', color: '#fde68a' },
    { name: 'Exploit', technique: 'T1190', color: '#fde68a' },
    { name: 'Install', technique: 'T1547', color: '#fca5a5' },
    { name: 'C2', technique: 'T1071', color: '#fca5a5' },
    { name: 'Actions', technique: 'T1486', color: '#f87171' },
  ]

  const startX = 40
  const stageW = 90
  const gap = 8

  return (
    <svg viewBox="0 0 750 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {stages.map((stage, i) => {
        const x = startX + i * (stageW + gap)
        return (
          <g key={i}>
            <rect x={x} y="20" width={stageW} height="50" rx="6" fill="rgba(13,17,23,0.9)" stroke={stage.color} strokeWidth="1.5" />
            <text x={x + stageW / 2} y="46" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="600">{stage.name}</text>
            <text x={x + stageW / 2} y="62" textAnchor="middle" fill={stage.color} fontSize="8" fontFamily="monospace">{stage.technique}</text>

            {/* Arrow to next */}
            {i < stages.length - 1 && (
              <line x1={x + stageW + 1} y1="45" x2={x + stageW + gap - 1} y2="45" stroke={stage.color} strokeWidth="2" markerEnd="url(#arrowKC)" />
            )}

            {/* SOC detection marker */}
            {(i === 2 || i === 3 || i === 4 || i === 5) && (
              <>
                <rect x={x + 20} y="80" width={stageW - 40} height="20" rx="4" fill="rgba(190,255,71,0.1)" stroke="rgba(190,255,71,0.3)" strokeWidth="1" />
                <text x={x + stageW / 2} y="94" textAnchor="middle" fill="#bef264" fontSize="7" fontFamily="monospace">SOC DETECT</text>
              </>
            )}
          </g>
        )
      })}

      {/* Gradient progress bar */}
      <rect x={startX} y="115" width={stages.length * (stageW + gap) - gap} height="4" rx="2" fill="url(#kcGrad)" opacity="0.4" />

      <defs>
        <marker id="arrowKC" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill="#71717a" />
        </marker>
        <linearGradient id="kcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f87171" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function MgrDiagramPhishingFlow() {
  return (
    <svg viewBox="0 0 760 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Start */}
      <rect x="300" y="10" width="160" height="32" rx="16" fill="rgba(190,255,71,0.12)" stroke="#bef264" strokeWidth="1.5" />
      <text x="380" y="30" textAnchor="middle" fill="#bef264" fontSize="11" fontFamily="monospace" fontWeight="600">Email Reported</text>

      <line x1="380" y1="42" x2="380" y2="62" stroke="#52525b" strokeWidth="1.5" />

      {/* Step 1 */}
      <rect x="290" y="62" width="180" height="30" rx="4" fill="rgba(13,17,23,0.9)" stroke="#a5f3fc" strokeWidth="1" />
      <text x="380" y="82" textAnchor="middle" fill="#a5f3fc" fontSize="10" fontFamily="monospace">Inspect Headers + Auth</text>

      <line x1="380" y1="92" x2="380" y2="112" stroke="#52525b" strokeWidth="1.5" />

      {/* Decision: SPF/DKIM/DMARC */}
      <polygon points="380,112 440,142 380,172 320,142" fill="rgba(253,230,138,0.08)" stroke="#fde68a" strokeWidth="1" />
      <text x="380" y="140" textAnchor="middle" fill="#fde68a" fontSize="9" fontFamily="monospace">SPF/DKIM</text>
      <text x="380" y="152" textAnchor="middle" fill="#fde68a" fontSize="9" fontFamily="monospace">pass?</text>

      {/* Pass branch */}
      <line x1="440" y1="142" x2="560" y2="142" stroke="#52525b" strokeWidth="1" />
      <text x="500" y="136" fill="#71717a" fontSize="8" fontFamily="monospace">PASS</text>
      <rect x="560" y="128" width="140" height="28" rx="4" fill="rgba(13,17,23,0.9)" stroke="#71717a" strokeWidth="1" />
      <text x="630" y="146" textAnchor="middle" fill="#71717a" fontSize="9" fontFamily="monospace">Check URLs + Body</text>

      {/* Fail branch */}
      <line x1="320" y1="142" x2="200" y2="142" stroke="#52525b" strokeWidth="1" />
      <text x="260" y="136" fill="#fca5a5" fontSize="8" fontFamily="monospace">FAIL</text>
      <rect x="60" y="128" width="140" height="28" rx="4" fill="rgba(252,165,165,0.08)" stroke="#fca5a5" strokeWidth="1" />
      <text x="130" y="146" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace">Flag as Suspicious</text>

      {/* Continue main flow */}
      <line x1="380" y1="172" x2="380" y2="202" stroke="#52525b" strokeWidth="1.5" />

      {/* Step 2 */}
      <rect x="290" y="202" width="180" height="30" rx="4" fill="rgba(13,17,23,0.9)" stroke="#a5f3fc" strokeWidth="1" />
      <text x="380" y="222" textAnchor="middle" fill="#a5f3fc" fontSize="10" fontFamily="monospace">Check URL Reputation</text>

      <line x1="380" y1="232" x2="380" y2="252" stroke="#52525b" strokeWidth="1.5" />

      {/* Step 3 */}
      <rect x="290" y="252" width="180" height="30" rx="4" fill="rgba(13,17,23,0.9)" stroke="#a5f3fc" strokeWidth="1" />
      <text x="380" y="272" textAnchor="middle" fill="#a5f3fc" fontSize="10" fontFamily="monospace">Scan Attachments</text>

      <line x1="380" y1="282" x2="380" y2="302" stroke="#52525b" strokeWidth="1.5" />

      {/* Decision: User clicked? */}
      <polygon points="380,302 440,332 380,362 320,332" fill="rgba(252,165,165,0.08)" stroke="#fca5a5" strokeWidth="1" />
      <text x="380" y="330" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace">User</text>
      <text x="380" y="342" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace">clicked?</text>

      {/* No click */}
      <line x1="320" y1="332" x2="140" y2="332" stroke="#52525b" strokeWidth="1" />
      <text x="230" y="326" fill="#86efac" fontSize="8" fontFamily="monospace">NO</text>
      <rect x="40" y="318" width="100" height="28" rx="14" fill="rgba(134,239,172,0.1)" stroke="#86efac" strokeWidth="1" />
      <text x="90" y="336" textAnchor="middle" fill="#86efac" fontSize="9" fontFamily="monospace">Block + Purge</text>

      {/* Clicked */}
      <line x1="440" y1="332" x2="600" y2="332" stroke="#52525b" strokeWidth="1" />
      <text x="520" y="326" fill="#fca5a5" fontSize="8" fontFamily="monospace">YES</text>
      <rect x="600" y="310" width="140" height="44" rx="6" fill="rgba(252,165,165,0.1)" stroke="#fca5a5" strokeWidth="1.5" />
      <text x="670" y="330" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace" fontWeight="600">Credential Reset</text>
      <text x="670" y="344" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace" fontWeight="600">+ Isolate Endpoint</text>

      {/* Bottom outcomes */}
      <line x1="380" y1="362" x2="380" y2="392" stroke="#52525b" strokeWidth="1" />
      <rect x="300" y="392" width="160" height="24" rx="4" fill="rgba(190,255,71,0.08)" stroke="#bef264" strokeWidth="1" />
      <text x="380" y="408" textAnchor="middle" fill="#bef264" fontSize="9" fontFamily="monospace">Document + Close Ticket</text>
    </svg>
  )
}

function ZohoSection() {
  return (
    <section className="panel-enter mx-auto w-full max-w-7xl space-y-6">
      {/* Overview Dashboard Card */}
      <div className="rounded-lg border border-white/10 bg-[#0d1117] p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200 font-semibold">Corporate CyberSecurity Profile</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Inside Zoho's Security Engineering & SOC Operations
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300">
              Zoho operates its own infrastructure stack on bare-metal servers, dogfoods its ManageEngine IT/Security product suite, and runs a public Bug Bounty program to enforce a vertically integrated, security-first posture.
            </p>
          </div>
          <div className="shrink-0 rounded-lg border border-white/10 bg-black/25 p-4 text-right">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Security Model</p>
            <p className="mt-1 text-xl font-semibold text-lime-200">Vertically Integrated</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1: Infrastructure & Sovereignty */}
        <SectionPanel title="Infrastructure & Cloud Sovereignty" icon={ServerCog}>
          <div className="space-y-4">
            <p className="text-sm leading-6 text-zinc-300">
              Unlike most SaaS companies, Zoho does not rely on public cloud providers (like AWS, GCP, or Azure). They self-host their applications to eliminate the "cloud tax" and maintain complete data sovereignty.
            </p>
            <div className="rounded-lg border border-white/10 bg-black/20 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-lime-200">Global Data Center Footprint</h4>
              <p className="text-xs text-zinc-400">
                10+ self-owned data centers: Chennai (India), Mumbai (India), US (Texas, Oregon), Europe (Ireland, Netherlands), Australia, China, Singapore, Japan.
              </p>
              <div className="h-px bg-white/10 my-2" />
              <h4 className="text-sm font-semibold text-cyan-200">Encryption & Security Audits</h4>
              <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-1">
                <li>AES-256 at-rest (using hardware-based full-disk encryption in key regions).</li>
                <li>TLS 1.2/1.3 with Perfect Forward Secrecy (PFS) in-transit.</li>
                <li>ISO 27001, ISO 27017, ISO 27018, ISO 27701 certified.</li>
                <li>SOC 1 Type II & SOC 2 Type II audited annually.</li>
                <li>HIPAA & PCI DSS compliant.</li>
              </ul>
            </div>
          </div>
        </SectionPanel>

        {/* Card 2: Incident Response (IRT) Workflow */}
        <SectionPanel title="SOC Operations & IR Lifecycle" icon={Siren}>
          <div className="space-y-4">
            <p className="text-sm leading-6 text-zinc-300">
              Zoho's Security Operations Center operates 24/7. Triage, analysis, and containment follow standard NIST/ISO protocols, using custom alert playbooks.
            </p>
            <div className="rounded-lg border border-white/10 bg-black/20 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-lime-200">Incident Severity Classification</h4>
              <div className="grid gap-2 text-xs text-zinc-400">
                <div className="flex justify-between border-b border-white/5 pb-1 gap-4">
                  <span className="font-semibold text-white shrink-0">Desktop Sprint</span>
                  <span className="text-right">Minor break/fix anomalies & bugs</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1 gap-4">
                  <span className="font-semibold text-white shrink-0">Big Bang</span>
                  <span className="text-right">Major service availability incidents</span>
                </div>
                <div className="flex justify-between pb-1 gap-4">
                  <span className="font-semibold text-rose-300 shrink-0">CyberSec</span>
                  <span className="text-right">Dedicated security incidents / threat actors</span>
                </div>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <h4 className="text-sm font-semibold text-cyan-200">Incident Response Flow</h4>
              <ol className="list-decimal pl-4 text-xs text-zinc-400 space-y-1">
                <li><strong>Triage:</strong> Verify alert true positive status in Log360 SIEM.</li>
                <li><strong>Containment:</strong> Trigger automated isolation or block user/IP.</li>
                <li><strong>Eradication:</strong> Remove threat vectors and patch software vulnerabilities.</li>
                <li><strong>Breach SLA:</strong> 72-hour regulatory breach notification commitment.</li>
                <li><strong>Post-Mortem:</strong> Document RCA (Root Cause Analysis) in Zoho Connect.</li>
              </ol>
            </div>
          </div>
        </SectionPanel>

        {/* Card 3: Dogfooding ManageEngine Products */}
        <SectionPanel title="Security Tooling (Dogfooding ManageEngine)" icon={Database}>
          <div className="space-y-4">
            <p className="text-sm leading-6 text-zinc-300">
              Zoho’s internal security teams dogfood products built by their own ManageEngine division. Highlighting this shows deep knowledge of Zoho's corporate operations.
            </p>
            <div className="grid gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-lime-200">ManageEngine Log360 (SIEM)</h4>
                  <span className="rounded-full bg-lime-300/10 px-2 py-0.5 font-mono text-[10px] text-lime-200 uppercase">Alert Triage</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Aggregates event logs across Active Directory, Linux servers, databases, and cloud products. Uses UEBA (Machine Learning) to detect abnormal behavior.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-cyan-200">ManageEngine ADAudit Plus</h4>
                  <span className="rounded-full bg-cyan-300/10 px-2 py-0.5 font-mono text-[10px] text-cyan-200 uppercase">AD Monitoring</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Tracks user logons, GPO modifications, Active Directory schema changes, and privilege escalations in real-time.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-zinc-200">Endpoint Central (EDR)</h4>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-300 uppercase">Endpoint Security</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Performs automated patching, assets tracking, file integrity monitoring, and triggers isolation commands on compromised hosts.
                </p>
              </div>
            </div>
          </div>
        </SectionPanel>

        {/* Card 4: Secure SDLC & Bug Bounty */}
        <SectionPanel title="Security-Minded Culture & SDLC" icon={BriefcaseBusiness}>
          <div className="space-y-4">
            <p className="text-sm leading-6 text-zinc-300">
              Zoho builds software using an engineering-first, secure-by-design lifecycle. They combine automated audits with crowdsourced bug bounties.
            </p>
            <div className="rounded-lg border border-white/10 bg-black/20 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-lime-200">Secure Development Standards</h4>
              <p className="text-xs text-zinc-400 leading-5">
                Every code push goes through static code analysis (SAST) and vulnerability scanning. The application framework embeds security middleware matching OWASP standards to filter XSS, SQLi, and authentication bypasses by default.
              </p>
              <div className="h-px bg-white/10 my-2" />
              <h4 className="text-sm font-semibold text-cyan-200">Crowdsourced Security (HackerOne VRP)</h4>
              <p className="text-xs text-zinc-400 leading-5">
                Zoho runs a global Vulnerability Reward Program (VRP). They actively pay cash bounties to external security researchers and maintain a public security Hall of Fame to recognize disclosures.
              </p>
              <div className="mt-2 rounded border border-lime-300/20 bg-lime-300/5 p-2 text-xs text-lime-100">
                💡 <strong>Resume Bridge:</strong> Highlight your own bug bounty findings (XSS, IDOR, Auth bypass) as practical proof that you align with Zoho's threat verification culture.
              </div>
            </div>
          </div>
        </SectionPanel>
      </div>

      {/* Zoho-Specific Interview Q&As */}
      <SectionPanel title="Zoho-Specific Interview Practice Q&A" icon={NotebookTabs}>
        <p className="mb-4 text-sm leading-6 text-zinc-400">
          Be prepared to answer these company-specific questions in Chennai technical and behavioral rounds.
        </p>
        <div className="grid gap-3 lg:grid-cols-2">
          <QuestionCard question="Why does Zoho host its systems on its own bare-metal servers rather than public cloud?">
            <AnswerBlocks
              items={[
                'Data Sovereignty: Ensures strict localized data storage compliance (GDPR, India Data Act) without third-party cloud data center dependencies.',
                'Elimination of "Cloud Tax": Avoids scaling cost spikes associated with hyperscalers (AWS/GCP/Azure) and passes the savings to customers.',
                'Total Stack Control: Controlling hardware, routers, OS configurations, software layer, and AI processing allows end-to-end security audits.',
                'Noisy Neighbors: Running bare-metal infrastructure avoids host-sharing performance anomalies.',
              ]}
            />
          </QuestionCard>
          <QuestionCard question="What ManageEngine tools does Zoho dogfood, and how do they benefit a SOC analyst?">
            <AnswerBlocks
              items={[
                'ManageEngine Log360: Acts as the central SIEM. It gathers logs from endpoints, Active Directory, databases, and network devices for threat correlation.',
                'ManageEngine ADAudit Plus: Audits Active Directory. It logs account actions, schema modifications, and logon events to track privilege escalations.',
                'Endpoint Central: Provides Endpoint Detection and Response (EDR) and patch automation to isolate hosts and push remediations.',
                'Benefits: Gives a unified pane of glass to identify, isolate, and remediate alerts from a single software ecosystem.',
              ]}
            />
          </QuestionCard>
          <QuestionCard question="Explain Zoho's incident classification levels and response workflow.">
            <AnswerBlocks
              items={[
                'Incidents are classified based on impact: Desktop Sprint (minor/development fixes), Big Bang (availability issues), and CyberSec (security threats).',
                'Response Flow: Alerts are captured in Log360 -> Triage/validation by the SOC -> Containment (user isolation via Endpoint Central) -> Eradication.',
                'Post-Incident: Conduct Root Cause Analysis (RCA) and share learnings on Zoho Connect with internal stakeholders.',
                'Regulatory SLA: Commits to a 72-hour data controller/customer notification deadline for verified breaches.',
              ]}
            />
          </QuestionCard>
          <QuestionCard question="How does your offensive security experience (bug bounty) translate to Zoho's security operations?">
            <AnswerBlocks
              items={[
                'Attacker Mindset: Knowing how SQLi, XSS, and IDOR are exploited helps me look for the exact footprints of these attacks in logs.',
                'Evidence Collection: Bug bounty reports require clean step-by-step POCs, which maps directly to writing SOC triage and incident documentation.',
                'Zoho Culture: I understand Zoho\'s products because I review and study web applications, and I respect Zoho\'s public HackerOne VRP/Hall of Fame.',
                'Fast Investigation: I know how scanners (Nmap) and proxies (Burp) look on the wire, making alert verification faster and more accurate.',
              ]}
            />
          </QuestionCard>
        </div>
      </SectionPanel>
    </section>
  )
}

function CheatSheetSection() {
  return (
    <section className="panel-enter mx-auto w-full max-w-7xl space-y-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <SectionPanel title="Night-before priority list" icon={ListChecks}>
          <div className="space-y-3">
            {nightBefore.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-zinc-300">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-lime-200" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Fast formulas" icon={BookOpen}>
          <div className="space-y-3 text-sm leading-6 text-zinc-300">
            <Formula label="TCP handshake" value="SYN, SYN-ACK, ACK" />
            <Formula label="NIST IR" value="Preparation, identification, containment, eradication, recovery, lessons learned" />
            <Formula label="SIEM correlation" value="If X and Y happen within a time window, create an alert" />
            <Formula label="Report format" value="Summary, root cause, impact, mitigation, recommendations" />
          </div>
        </SectionPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionPanel title="Ports to memorize" icon={Network}>
          <div className="grid gap-2 sm:grid-cols-2">
            {ports.map(([port, service, note]) => (
              <div key={port} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-lg font-semibold text-lime-200">{port}</span>
                  <span className="text-sm font-semibold text-white">{service}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-zinc-400">{note}</p>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Windows event IDs" icon={Activity}>
          <div className="grid gap-2 sm:grid-cols-2">
            {windowsEvents.map(([id, meaning]) => (
              <div key={id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <span className="font-mono text-lg font-semibold text-cyan-200">{id}</span>
                <p className="mt-1 text-sm text-zinc-300">{meaning}</p>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>
    </section>
  )
}

function SectionPanel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#0d1117]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-lime-200">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Metric({ icon: Icon, label, value, helper }: { icon: LucideIcon; label: string; value: string; helper: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0d1117] p-5">
      <div className="mb-4 flex items-center justify-between">
        <Icon className="h-5 w-5 text-cyan-200" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</span>
      </div>
      <p className="text-4xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-zinc-400">{helper}</p>
    </div>
  )
}

function SignalLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-xs text-zinc-500">{label}</span>
        <span className="text-right text-xs text-zinc-300">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-lime-300 to-cyan-200" />
      </div>
    </div>
  )
}

function ResumeMapping({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <h3 className="text-sm font-semibold text-lime-200">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{text}</p>
    </div>
  )
}

function SourceBadge({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2 text-lime-200">
        <CheckCircle2 className="h-4 w-4" />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-zinc-300">{text}</p>
    </div>
  )
}

function QuestionCard({ question, children }: { question: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-white/[0.03]"
        aria-expanded={open}
      >
        <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${open ? 'border-lime-300/50 bg-lime-300/15 text-lime-200' : 'border-white/10 text-zinc-500'}`}>
          {open ? <XCircle className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
        <span className="text-sm font-semibold leading-6 text-white">{question}</span>
      </button>
      {open && <div className="border-t border-white/10 px-4 pb-4 pt-3">{children}</div>}
    </article>
  )
}

function TopicCard({ topic, mastered, onToggleMastered }: { topic: Topic; mastered: boolean; onToggleMastered: () => void }) {
  const Icon = topic.icon
  const [copied, setCopied] = useState(false)
  const [studyOpen, setStudyOpen] = useState(false)
  const cheatcode = beginnerCheatCodes[topic.id]
  const studyNote = topicStudyNotes[topic.id]

  async function copyCheatcode() {
    try {
      await navigator.clipboard.writeText(`${topic.title}: ${cheatcode}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article className={`topic-card rounded-lg border bg-[#0d1117] p-5 transition hover:-translate-y-0.5 ${
      mastered ? 'border-lime-300/45 shadow-[0_0_0_1px_rgba(190,255,71,0.14)]' : 'border-white/10'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-lime-200">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">Topic {topic.number}</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{topic.title}</h3>
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] ${categoryAccent[topic.category]}`}>
          {topic.category}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-300">{topic.explanation}</p>
      <div className="mt-4 rounded-lg border border-lime-300/25 bg-lime-300/10 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime-200">Beginner cheatcode</p>
            <p className="mt-2 text-sm leading-6 text-lime-50">{cheatcode}</p>
          </div>
          <button
            type="button"
            onClick={copyCheatcode}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-lime-300/30 px-3 py-2 text-xs font-semibold text-lime-100 transition hover:bg-lime-300 hover:text-black"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm leading-6 text-cyan-50">
        <strong className="text-cyan-200">SOC use:</strong> {topic.whySoc}
      </div>

      {studyNote && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20">
          <button
            type="button"
            onClick={() => setStudyOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-white/[0.03]"
            aria-expanded={studyOpen}
          >
            <span>
              <span className="block text-sm font-semibold text-white">Deep study notes</span>
              <span className="mt-1 block text-xs leading-5 text-zinc-500">
                Beginner explanation, memorize list, SOC workflow, Zoho answer, mistakes, and practice.
              </span>
            </span>
            <ChevronRight className={`h-5 w-5 shrink-0 text-lime-200 transition-transform ${studyOpen ? 'rotate-90' : ''}`} />
          </button>
          {studyOpen && <DeepStudyNotes note={studyNote} />}
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Must know</h4>
          <ul className="space-y-2">
            {topic.checklist.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-zinc-300">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-lime-200" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Likely questions</h4>
          <ul className="space-y-2">
            {topic.interviewQuestions.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-zinc-300">
                <CircleDot className="mt-1 h-4 w-4 shrink-0 text-cyan-200" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleMastered}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition ${
          mastered
            ? 'bg-lime-300 text-black hover:bg-lime-200'
            : 'border border-white/10 bg-white/[0.04] text-white hover:border-lime-300/50'
        }`}
      >
        <CheckCircle2 className="h-4 w-4" />
        {mastered ? 'Mastered' : 'Mark as mastered'}
      </button>
    </article>
  )
}

function DeepStudyNotes({ note }: { note: import('./data/topicStudyNotes').TopicStudyNote }) {
  return (
    <div className="border-t border-white/10 p-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <StudyBlock title="Beginner explanation" tone="lime">
          <p>{note.beginner}</p>
        </StudyBlock>
        <StudyBlock title="Mental model" tone="cyan">
          <p>{note.mentalModel}</p>
        </StudyBlock>
        <StudyBlock title="Must memorize" tone="white">
          <StudyList items={note.mustMemorize} />
        </StudyBlock>
        <StudyBlock title="SOC workflow" tone="white">
          <StudyList items={note.socWorkflow} ordered />
        </StudyBlock>
        <StudyBlock title="Zoho-style answer" tone="amber">
          <p>{note.zohoAnswer}</p>
        </StudyBlock>
        <StudyBlock title="Common mistakes" tone="rose">
          <StudyList items={note.commonConfusions} />
        </StudyBlock>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-violet-300/25 bg-violet-300/10 p-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-100">Practice task</p>
          <p className="mt-2 text-sm leading-6 text-violet-50">{note.practice}</p>
        </div>
        {note.resumeBridge && (
          <div className="rounded-lg border border-lime-300/25 bg-lime-300/10 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-lime-100">Use your resume</p>
            <p className="mt-2 text-sm leading-6 text-lime-50">{note.resumeBridge}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StudyBlock({ title, tone, children }: { title: string; tone: 'lime' | 'cyan' | 'amber' | 'rose' | 'white'; children: ReactNode }) {
  const toneClasses = {
    lime: 'border-lime-300/25 bg-lime-300/10 text-lime-50',
    cyan: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-50',
    amber: 'border-amber-300/25 bg-amber-300/10 text-amber-50',
    rose: 'border-rose-300/25 bg-rose-300/10 text-rose-50',
    white: 'border-white/10 bg-white/[0.03] text-zinc-300',
  }

  return (
    <div className={`rounded-lg border p-4 text-sm leading-6 ${toneClasses[tone]}`}>
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] opacity-80">{title}</p>
      {children}
    </div>
  )
}

function StudyList({ items, ordered = false }: { items: string[]; ordered?: boolean }) {
  const listClass = 'space-y-2'
  const itemClass = 'flex gap-2 text-sm leading-6'

  if (ordered) {
    return (
      <ol className={listClass}>
        {items.map((item, index) => (
          <li key={item} className={itemClass}>
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-current/20 font-mono text-[11px]">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ul className={listClass}>
      {items.map((item) => (
        <li key={item} className={itemClass}>
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 opacity-80" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function PlaybookCard({ playbook }: { playbook: Playbook }) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#0d1117] p-5">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-lime-200">{playbook.trigger}</p>
      <h3 className="mt-2 text-xl font-semibold text-white">{playbook.title}</h3>
      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_0.8fr]">
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Response flow</h4>
          <ol className="space-y-3">
            {playbook.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-zinc-300">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-lime-300/30 bg-lime-300/10 font-mono text-xs text-lime-200">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Evidence to collect</h4>
          <div className="flex flex-wrap gap-2">
            {playbook.evidence.map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-amber-300/25 bg-amber-300/10 p-3 text-sm leading-6 text-amber-50">
            {playbook.close}
          </div>
        </div>
      </div>
    </article>
  )
}

function AnswerBlocks({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-6 text-zinc-300">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-lime-200" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-xs text-zinc-300">
      {children}
    </span>
  )
}

function Formula({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 text-zinc-200">{value}</p>
    </div>
  )
}

export default App
