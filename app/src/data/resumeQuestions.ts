import { Network, Bug, Code2, GraduationCap, BriefcaseBusiness } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ResumeQuestionCategory = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  questions: {
    q: string;
    a: string;
  }[];
};

export const resumeQuestionsData: ResumeQuestionCategory[] = [
  {
    id: 'networking',
    title: 'Networking Fundamentals',
    icon: Network,
    description: 'Based on your CCNA, Cisco Cybersecurity Essentials, and specialization in Networking & Cybersecurity.',
    questions: [
      {
        q: 'Your resume mentions CCNA and knowledge of TCP/IP and OSI Models. Can you explain how data encapsulates from the Application layer down to the Physical layer in the OSI model?',
        a: 'Data encapsulation begins at the Application, Presentation, and Session layers where data is generated. At the Transport layer, it becomes a Segment (with source/destination ports). At the Network layer, it becomes a Packet (with source/destination IP addresses). At the Data Link layer, it becomes a Frame (with MAC addresses). Finally, at the Physical layer, it is transmitted as bits (0s and 1s) over the medium.'
      },
      {
        q: 'You have hands-on experience with Nmap. Which TCP flags are set during an Nmap SYN Stealth scan (-sS), and how does it evade some firewalls?',
        a: 'A SYN scan (-sS) sets only the SYN flag. If the port is open, the target responds with SYN-ACK. The scanner then sends an RST to tear down the connection before a full three-way handshake completes. It can evade older stateless firewalls and logging mechanisms that only log fully established connections (which require the final ACK).'
      },
      {
        q: 'As a SOC analyst, if you see a spike in DNS traffic from a single internal host to an external IP, what attack vectors might you suspect based on your networking knowledge?',
        a: 'A massive spike in DNS queries often indicates DNS Tunneling (used for data exfiltration or command-and-control communication), DNS amplification attacks (if the host is part of a botnet), or a compromised host attempting to resolve a large number of randomly generated domains (DGA) used by malware.'
      },
      {
        q: 'Explain the difference between TCP and UDP from a security monitoring perspective. Which is harder to trace and why?',
        a: 'TCP is connection-oriented, requiring a three-way handshake, making it stateful and easier to monitor for anomalies (like out-of-state packets). UDP is connectionless and stateless. UDP is harder to trace and monitor because it lacks sequence numbers and built-in acknowledgments, making it frequently used for spoofed attacks like DDoS amplification (NTP, DNS).'
      },
      {
        q: 'Your resume lists Firewalls, Routing & Switching. In an enterprise network, what is the difference between a stateful firewall and a Web Application Firewall (WAF)?',
        a: 'A stateful firewall operates at Layers 3 and 4, tracking the state of active connections and allowing traffic based on IP addresses, ports, and connection states. A WAF operates at Layer 7 (Application Layer) specifically analyzing HTTP/HTTPS traffic for web-based attacks like SQLi, XSS, and anomalies based on signatures or behavioral analysis.'
      },
      {
        q: 'How would you differentiate Public IP vs. Private IP in an incident investigation?',
        a: 'Private IPs (RFC 1918 addresses like 10.x.x.x, 172.16.x.x, 192.168.x.x) are non-routable on the internet and identify internal hosts behind NAT. In an investigation, identifying the internal Private IP helps pinpoint the compromised machine, while the Public IP identifies the external attacker or the NAT gateway through which internal traffic exited.'
      },
      {
        q: 'If a user reports they cannot access an internal web application (HTTP/S), what troubleshooting steps would you take applying the OSI model?',
        a: 'I would start from the bottom: Layer 1/2 (Check physical connection/VLAN/MAC), Layer 3 (Ping the server IP to check routing/reachability), Layer 4 (Telnet/nc to the specific port like 80/443 to check if a firewall is blocking it), and finally Layer 7 (Check HTTP response codes, DNS resolution, and SSL/TLS certificates).'
      },
      {
        q: 'You are familiar with Wireshark. What display filter would you use to find all HTTP traffic containing a specific compromised domain?',
        a: 'I would use `http.host == "compromised-domain.com"` or `http contains "compromised-domain.com"`. For HTTPS, since the payload is encrypted, I would look at the SNI (Server Name Indication) in the TLS handshake using `tls.handshake.extensions_server_name == "compromised-domain.com"`.'
      },
      {
        q: 'What is a Data Center network topology, and how does it differ from a standard campus network in terms of security?',
        a: 'Data center topologies (like Spine-Leaf) are designed for high throughput and east-west traffic (server-to-server). Security in a data center requires microsegmentation (often using software-defined networking) to prevent lateral movement, whereas campus networks focus on north-south traffic (user-to-internet) and endpoint security.'
      },
      {
        q: 'What is the purpose of ARP, and what does an ARP spoofing attack look like in Wireshark?',
        a: 'ARP resolves Layer 3 IP addresses to Layer 2 MAC addresses. An ARP spoofing (or poisoning) attack would show up in Wireshark as a high volume of gratuitous ARP replies, or multiple different IP addresses resolving to the same MAC address, indicating an attacker is positioning themselves for a Man-in-the-Middle (MitM) attack.'
      }
    ]
  },
  {
    id: 'bugbounty',
    title: 'Web Application Security & Bug Bounty',
    icon: Bug,
    description: 'Based on your Bug Bounty Research, OWASP Top 10, Web App Pentesting, and tools like Burp Suite.',
    questions: [
      {
        q: 'Your resume states you found real-world XSS vulnerabilities. Explain the difference between Reflected, Stored, and DOM-based XSS, and how a SOC analyst would detect them in web logs.',
        a: 'Reflected XSS occurs when a payload is immediately bounced back in an error or search result; SOC can detect this by seeing script tags in URL parameters in access logs. Stored XSS is saved in the database and served to victims; logs might show the initial malicious POST request. DOM-based XSS happens entirely in the client-side JavaScript; it is often invisible to server logs unless the payload is sent in the URI (not after the # fragment).'
      },
      {
        q: 'You reported IDOR vulnerabilities. How would you explain IDOR to a non-technical manager, and how can a SOC detect an automated IDOR attack?',
        a: 'IDOR (Insecure Direct Object Reference) is like having a hotel room key that miraculously opens every other room just by changing the room number. A SOC can detect it by monitoring for high-frequency requests from a single user session accessing sequential or predictable resource IDs (e.g., /api/user/101, /api/user/102) accompanied by 200 OK or 403 Forbidden responses depending on authorization checks.'
      },
      {
        q: 'How did you use Burp Suite to intercept and analyze HTTP traffic? What specific features did you use most?',
        a: 'I configured my browser proxy to route traffic through Burp Suite. I heavily used the Proxy tab to pause, inspect, and modify HTTP requests (headers, cookies, parameters) before they hit the server. I used the Repeater to manually test and tweak payloads for vulnerabilities like SQLi or XSS, and the Intruder for fuzzing parameters and testing rate-limiting or authentication bypass.'
      },
      {
        q: 'You mentioned Authentication flaws. Can you describe a specific authentication bypass technique you tested or mitigated?',
        a: 'One common flaw is weak session management or missing brute-force protection. Another is improper token validation where manipulating a JWT (JSON Web Token), such as changing the algorithm to "none" or tampering with the payload without proper signature verification, allows privilege escalation. Mitigation involves enforcing strong signature checks, short expiration times, and strict password policies.'
      },
      {
        q: 'If a WAF blocks your Bug Bounty payload, how do you typically try to bypass it? (And conversely, how should a SOC respond to evasion attempts?)',
        a: 'To bypass a WAF, attackers use encoding (URL, Hex, Base64), obfuscation (adding null bytes, chunked transfer encoding), or manipulating HTTP headers (like X-Forwarded-For). A SOC should ensure the WAF normalizes data before inspection, uses behavioral baselining rather than just signature matching, and correlates WAF alerts with backend application logs.'
      },
      {
        q: 'Based on the OWASP Top 10, what is Broken Access Control, and why is it so prevalent?',
        a: 'Broken Access Control occurs when a user can act outside their intended permissions (e.g., a standard user accessing admin panels or IDOR). It is prevalent because access control rules must be implemented in code manually for every endpoint and action; there is no universal plug-and-play defense, making human error highly likely.'
      },
      {
        q: 'As someone who does Web App Pentesting, how do you differentiate between a vulnerability scan and a penetration test?',
        a: 'A vulnerability scan is automated, utilizing tools to identify known signatures of vulnerabilities quickly. A penetration test is a manual, goal-oriented process where a tester chains multiple vulnerabilities, logic flaws, and misconfigurations to achieve a specific objective (like data exfiltration or RCE), mimicking a real-world attacker.'
      },
      {
        q: 'Explain CSRF (Cross-Site Request Forgery) and how modern web applications defend against it.',
        a: 'CSRF forces an authenticated user\'s browser to execute an unwanted action on a trusted site without their knowledge. Modern defenses include using anti-CSRF tokens (unique, unpredictable tokens validated on the server for state-changing requests), enforcing the SameSite attribute on cookies, and requiring re-authentication for sensitive actions.'
      },
      {
        q: 'You mentioned documenting findings with proof-of-concept evidence. What critical elements must be included in a good vulnerability report for a SOC or Dev team?',
        a: 'A report must include a clear description, CVSS score/severity, a step-by-step reproducible Proof of Concept (PoC) with screenshots or HTTP requests/responses, the business impact, and actionable remediation guidance. This maps perfectly to SOC incident reports which require context, evidence, and mitigation steps.'
      },
      {
        q: 'If you see an alert for "Directory Traversal / Path Traversal," what exactly is the attacker trying to do, and what payload would you look for?',
        a: 'The attacker is attempting to read arbitrary files on the server that are outside the web root directory. I would look for payloads containing `../` or `..%2f` (URL encoded) targeting endpoints that load files, aiming for sensitive files like `/etc/passwd` on Linux or `C:\\Windows\\win.ini` on Windows.'
      },
      {
        q: 'How does Server-Side Request Forgery (SSRF) work, and why is it particularly dangerous in cloud environments?',
        a: 'SSRF occurs when an attacker forces a server to make HTTP requests on their behalf. In cloud environments (like AWS/Azure/GCP), it is highly dangerous because the server can query the internal cloud metadata service (e.g., `169.254.169.254`) to extract temporary IAM credentials, potentially leading to full cloud environment compromise.'
      },
      {
        q: 'You are familiar with Linux CLI. If you need to quickly search a massive Apache access log for an IP address trying SQL injection, what bash command would you use?',
        a: 'I would use `grep`: `grep "192.168.1.50" access.log | grep -iE "select|union|insert|drop"` or `awk` to filter specific fields. For counting occurrences, `awk \'{print $1}\' access.log | sort | uniq -c | sort -nr` is great for identifying top talkers.'
      },
      {
        q: 'What is a reverse shell, and how does it bypass traditional inbound firewall rules?',
        a: 'A reverse shell is a payload that forces the compromised target to initiate an outbound connection back to the attacker\'s listening machine. Because stateful firewalls generally allow outbound traffic (like HTTP/HTTPS or DNS) and implicitly trust internal connections initiating outward, the reverse shell easily bypasses inbound blocking rules.'
      },
      {
        q: 'Explain the concept of "Defense in Depth" in the context of web application security.',
        a: 'Defense in depth is applying multiple layers of security controls so that if one fails, others remain to thwart the attack. For a web app, this means using a WAF (perimeter), strict input validation (application layer), PreparedStatements for database queries (data layer), least privilege service accounts (OS layer), and robust logging/monitoring (visibility).'
      },
      {
        q: 'How would you differentiate between a false positive and a true positive when a WAF alerts on an SQL injection attempt?',
        a: 'I would examine the HTTP request and the corresponding application backend logs. If the WAF flagged a legitimate user input (e.g., a surname like "O\'Connor") because of a signature match, it\'s a false positive. If the payload contains obvious syntax like `' + "UNION SELECT NULL--" + '` and the backend logged an SQL syntax error or executed it, it\'s a true positive.'
      }
    ]
  },
  {
    id: 'development',
    title: 'Development & Secure Coding',
    description: 'Based on the Knowledge Nexus (Library Management System) project, Java, SQL, and APIs.',
    icon: Code2,
    questions: [
      {
        q: 'In your Knowledge Nexus project, you used PreparedStatements to defend against SQL Injection. How exactly does a PreparedStatement prevent SQLi compared to standard string concatenation?',
        a: 'PreparedStatements (parameterized queries) pre-compile the SQL query structure on the database server before user input is inserted. The database treats the user input strictly as data/literal values, not executable code. Even if the input contains malicious SQL commands like `\' OR 1=1 --`, it is evaluated purely as a string, completely neutralizing the attack.'
      },
      {
        q: 'You implemented secure authentication and role-based access control (RBAC). What are the key considerations when implementing RBAC to ensure security?',
        a: 'Key considerations include enforcing the principle of least privilege (giving users only the access they need), checking permissions on the server-side for every single request (never relying on hidden UI elements), securely managing sessions (invalidating them on logout or timeout), and separating administrative endpoints from standard user endpoints.'
      },
      {
        q: 'Your resume mentions designing RESTful APIs with strict server-side input validation. Why is server-side validation critical even if you have client-side validation?',
        a: 'Client-side validation is solely for user experience and can be easily bypassed using tools like Burp Suite, cURL, or by simply disabling JavaScript. Server-side validation is the actual security boundary that ensures data integrity, type checking, and boundary checking before the application processes it or writes to the database.'
      },
      {
        q: 'What are the main differences between Java Servlets and JSP, and how did you use them securely in your architecture?',
        a: 'Servlets are Java classes that handle HTTP requests and business logic (the Controller), while JSP (JavaServer Pages) is an HTML-centric technology used for presenting data (the View). Securing them involved using Servlets to process and sanitize input, managing sessions securely, and ensuring JSP output was properly encoded to prevent Cross-Site Scripting (XSS).'
      },
      {
        q: 'When connecting a Java application to a MySQL database, what security measures should be taken regarding the database credentials?',
        a: 'Database credentials should never be hardcoded in the source code. They should be stored in secure environment variables, a secure vault, or encrypted configuration files. Additionally, the database user should have least privilege access (e.g., only SELECT/INSERT/UPDATE on specific tables, not database admin rights).'
      },
      {
        q: 'What is a SQL Injection "Blind" attack, and how is it different from an Error-based or Union-based SQLi?',
        a: 'In Error-based or Union-based SQLi, the database returns the results of the malicious query or detailed error messages directly to the web page. In a Blind SQLi, the application does not return data or errors. The attacker must infer information by asking true/false questions (Boolean-based) or measuring how long the server takes to respond (Time-based).'
      },
      {
        q: 'You mention applying defense-in-depth principles across the full application stack. Give an example of how you implemented this in Knowledge Nexus.',
        a: 'At the perimeter, we validated all incoming API requests. At the application tier, we implemented RBAC to ensure users only accessed authorized functions. At the data tier, we used PreparedStatements for all queries. Finally, we ensured secure password storage using strong hashing algorithms (like bcrypt) instead of plain text.'
      },
      {
        q: 'If a vulnerability scanner flags your REST API for lacking rate limiting, what is the risk, and how would you fix it?',
        a: 'The risk is that attackers can perform brute-force attacks against authentication endpoints, scrape data rapidly, or cause a Denial of Service (DoS) by overwhelming the server. I would fix it by implementing token bucket or leaky bucket algorithms at the API gateway or application level to restrict the number of requests an IP or user token can make within a timeframe.'
      },
      {
        q: 'How do you securely handle session management in a Java Servlet application to prevent Session Hijacking?',
        a: 'Secure session management requires generating cryptographically strong, random session IDs. The session cookie must have the `HttpOnly` flag (so JavaScript cannot access it, mitigating XSS theft), the `Secure` flag (so it is only sent over HTTPS), and a proper timeout policy (absolute timeout and idle timeout) to invalidate old sessions.'
      },
      {
        q: 'What is the most secure way to store user passwords in a MySQL database?',
        a: 'Passwords should never be stored in plain text or encrypted with reversible algorithms. They must be hashed using a strong, slow cryptographic hash function like Argon2, bcrypt, or PBKDF2, combined with a unique, randomly generated salt for every user to defend against rainbow table attacks.'
      }
    ]
  },
  {
    id: 'internship',
    title: 'Core Concepts & Internship Experience',
    description: 'Based on Zoho School for Graduate Studies, Core Java, OOP, SOLID principles, and DSA.',
    icon: GraduationCap,
    questions: [
      {
        q: 'During your Zoho internship, you built strong analytical debugging and root-cause analysis skills. Walk me through your systematic problem-solving approach when code breaks.',
        a: 'I start by reproducing the issue and examining the exact error logs or stack traces. Next, I isolate the problematic component using breakpoints or strategic logging. I analyze the state of variables right before the crash, formulate a hypothesis on why it failed, apply a fix, and then test extensively to ensure I solved the root cause, not just patched the symptom.'
      },
      {
        q: 'How does your experience with root-cause analysis in software development translate directly to incident triage as a SOC Analyst?',
        a: 'Both require a methodical approach. In software, a bug is an anomaly; in a SOC, a security alert is an anomaly. My ability to read stack traces translates to reading packet captures and logs. Finding the root cause of a bug is identical to tracing an attack path back to the initial vector, ensuring we patch the vulnerability and not just block an IP.'
      },
      {
        q: 'What are the SOLID principles, and can you give an example of how you applied one during your internship?',
        a: 'SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. For example, I applied the Single Responsibility Principle (SRP) by ensuring a class that handled database connections didn\'t also contain business logic for user authentication, making the code more modular, testable, and secure.'
      },
      {
        q: 'You participated in code reviews to identify logic flaws. What security-specific flaws do you look for when reviewing someone else\'s Java code?',
        a: 'I look for hardcoded credentials, missing input validation or sanitization, improper exception handling that might leak stack traces to the user, the use of string concatenation instead of PreparedStatements for SQL, and missing authorization checks before executing sensitive functions.'
      },
      {
        q: 'How does a strong foundation in Data Structures and Algorithms (DSA) help in a cybersecurity role?',
        a: 'DSA teaches optimal processing of large datasets. In a SOC, we deal with massive volumes of logs. Understanding how search algorithms, hash maps, and tree structures work helps in writing efficient SIEM queries, understanding how malware obfuscates data, and recognizing algorithmic complexity attacks (like ReDoS - Regular Expression Denial of Service).'
      },
      {
        q: 'Explain the four pillars of Object-Oriented Programming (OOP).',
        a: '1. Encapsulation: Bundling data and methods that operate on that data within one unit, hiding internal state. 2. Abstraction: Hiding complex implementation details and showing only essential features. 3. Inheritance: Creating new classes from existing ones to promote code reusability. 4. Polymorphism: Allowing objects of different classes to be treated as objects of a common superclass.'
      },
      {
        q: 'What is the difference between a Checked and Unchecked Exception in Java, and why is proper exception handling critical for security?',
        a: 'Checked exceptions are checked at compile-time (e.g., IOException), forcing the developer to handle them. Unchecked exceptions occur at runtime (e.g., NullPointerException). Proper handling is critical because unhandled exceptions can crash the application (DoS) or leak sensitive system information (stack traces) to attackers.'
      },
      {
        q: 'During your intensive real-world application development training, how did you handle version control and collaboration?',
        a: 'We used Git for version control. We followed standard branching strategies, committing small, logical chunks of code with descriptive messages. Collaboration involved creating Pull Requests (PRs), conducting peer code reviews to ensure quality and security standards, and resolving merge conflicts systematically.'
      },
      {
        q: 'What do you consider the most challenging bug you debugged during your internship, and what was the root cause?',
        a: '(Prepare a personal example for this). Generally, a good answer involves a race condition, a memory leak, or a logical flaw in a complex loop. For instance, debugging a NullPointerException that only occurred under specific load conditions, where the root cause was an uninitialized variable in an asynchronous thread.'
      },
      {
        q: 'Why did you choose to transition from a development-heavy internship to a SOC Analyst role?',
        a: 'While I deeply enjoyed building applications, my bug bounty experience ignited a passion for defending them. Understanding how software is built gives me an edge in understanding how it breaks or is exploited. A SOC role allows me to apply my analytical debugging skills to real-time threat hunting and incident response, which is where my true passion lies.'
      }
    ]
  },
  {
    id: 'behavioral',
    title: 'Scenario-Based & Behavioral (Managerial)',
    description: 'Specific to the Managerial Round expectations (OWASP, tools, culture, triage).',
    icon: BriefcaseBusiness,
    questions: [
      {
        q: 'Imagine you are on shift in the SOC. You receive a high-severity alert for an SQL Injection attack, but simultaneously, the CEO reports their laptop is locked by Ransomware. How do you prioritize?',
        a: 'I would immediately prioritize the Ransomware on the CEO\'s laptop. Ransomware has immediate, devastating impact (data loss, lateral movement) and the CEO has high-level access. I would disconnect the laptop from the network immediately to contain it, escalate to the Incident Response team, and then immediately pivot to analyze the SQLi alert to determine if it was successful or blocked by the WAF.'
      },
      {
        q: 'A developer asks you to open a port on the firewall so they can access a server from home. What is your response?',
        a: 'I would politely decline and explain the security risks of exposing internal servers directly to the internet. Instead, I would guide them to use the approved secure access methods, such as connecting via the corporate VPN or a Zero-Trust Network Access (ZTNA) gateway, and ensure they authenticate with Multi-Factor Authentication (MFA).'
      },
      {
        q: 'We use several proprietary tools at Zoho. While you have experience with Burp Suite and Nmap, how quickly can you adapt to our internal SIEM and EDR solutions?',
        a: 'My foundation in networking, Linux CLI, and web application security is tool-agnostic. Because I understand the underlying protocols (TCP/IP, HTTP) and attack methodologies, learning a new SIEM or EDR is just a matter of learning the specific query syntax and UI. During my Zoho internship, I proved my ability to rapidly absorb complex concepts, so I am confident I can ramp up very quickly.'
      },
      {
        q: 'SOC Analysts often face alert fatigue. How do you maintain focus and attention to detail when reviewing hundreds of similar logs?',
        a: 'I rely on my analytical skills to identify patterns. If I see repetitive false positives, I proactively document them and suggest tuning the detection rules to reduce the noise. I also treat every alert as a puzzle; my background in root-cause analysis trained me to look deeper than the surface level, ensuring I don\'t become complacent.'
      },
      {
        q: 'You find a critical vulnerability in one of Zoho\'s internal applications during a shift. The development team is resistant to fixing it immediately because they are pushing a major release. How do you handle this?',
        a: 'I would communicate the risk clearly, using CVSS metrics and a practical Proof of Concept to demonstrate the business impact, just as I did in my bug bounty reports. I would seek a compromise, such as applying a temporary WAF rule or strict monitoring to mitigate the risk until they can patch the code. If the risk is unacceptable, I would escalate the issue through the proper management channels.'
      }
    ]
  }
];
