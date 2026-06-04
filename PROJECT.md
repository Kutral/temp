# Project Milestones: Zoho SOC Analyst Interview Prep Console

A personalized interactive console built for Chennai SOC Analyst interview preparation.

## Project Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS & CSS Variables
- **Icons**: Lucide React
- **Data Modules**: Comprehensive study guide, playbooks, resume mappings, and flashcards

---

## Completed Milestones

### Milestone 1: Core Dashboard & Navigation Setup
- Created interactive SPA skeleton.
- Set up a clean sidebar layout for desktop and a bottom navigation system for mobile.
- Installed Lucide icons and Tailwind styles to create a premium, dark-mode cybersecurity dashboard interface.

### Milestone 2: Console Polish & Interactive Prep Features
- Added resume-driven candidate details, including bug bounty experience, Vel Tech Vel Tech Chennai B.Tech CSE details, and Zoho school incubation details.
- Integrated the interactive 60-second study drill cards with answer reveal mechanics.
- Built a searchable/filterable 24-topic map.
- Implemented local mastery tracking (saved in localStorage).
- Organized technical and HR question banks.

### Milestone 3: Comprehensive Study Guide Content Expansion
- Replaced the simple summaries with a textbook-grade, all-in-one study guide database in [topicStudyNotes.ts](file:///C:/Users/eswar/Downloads/Kimi_Agent_SOC%20Analyst%20Interview%20Guide/app/src/data/topicStudyNotes.ts).
- Expanded all 24 topics with rich details:
  - Deep-dive explanations and analogies.
  - Commands syntax (Linux log pipes, Nmap flags, Wireshark filters).
  - Event ID breakdowns (Windows Security & Sysmon).
  - Protocol specifications (Kerberos, DNS records, SMTP authentication).
  - Zoho-specific cultural questions (custom scripting focus).
- Validated compile compatibility with TypeScript (`npm run build`) and quality (`npm run lint`).

### Milestone 4: Corporate Cybersecurity & SOC Profile Section
- Added a dedicated "About Zoho" section detailing Zoho's corporate cybersecurity posture, global data center footprint, compliance certifications, and 24/7 SOC workflows.
- Structured data on internal security tooling (dogfooding ManageEngine Log360 SIEM, ADAudit Plus, Endpoint Central).
- Tailored interview strategy drills connecting Kutraleeswaran's bug bounty and secure B.Tech Java project background to Zoho's VRP/HackerOne program.
- Configured responsiveness updates, including grid styling extensions on bottom navigation bars for mobile views.
- Validated all builds and style rules using ESLint and TypeScript compilation with zero errors.

### Milestone 5: Manager Round Content & Interface Overhaul
- Completely redesigned the Manager Round section into an interactive, 7-tab command center with premium styling.
- Created 6 highly detailed inline SVG diagrams (Data Center Architecture, TCP Handshake, OSI vs TCP/IP, NIST Incident Response Lifecycle, Cyber Kill Chain, Phishing Flow) featuring custom CSS packet-flows, draw-lines, and pulse animations.
- Expanded study material with 8 new technical domains, 4 architecture flows, 5 incident scenarios, and 4 question groups.
- Built a localized domain-mastery tracking system that updates overall progress in real-time, persisting via `localStorage`.
- Verified type correctness with zero compile or lint warnings.

### Milestone 6: Resume Deep-Dive Integration
- Analyzed the candidate's resume to generate over 50 deep technical and situational questions.
- Grouped the questions into 5 specific domains: Networking Fundamentals, Web Application Security & Bug Bounty, Development & Secure Coding, Core Concepts & Internship Experience, and Scenario-Based (Managerial).
- Created a new `ResumeQuestionsSection` UI with interactive accordions and premium responsive design.
- Verified functionality across both desktop and mobile viewports via the automated browser auditor.
- Ensured zero compile or lint warnings during integration.

### Milestone 7: Focus & Breathe — Pomodoro Timer + Box Breathing Module
- Added a new "Focus & Breathe" section with Pomodoro Timer and Box Breathing modules accessible from the sidebar/mobile nav.
- **Pomodoro Timer**: SVG circular progress ring with minute ticks, configurable focus/break durations, session tracking, browser Notification API integration, audible chime on completion, and persistent settings via localStorage.
- **Box Breathing**: Animated 4-phase breathing exercise (Inhale → Hold → Exhale → Hold, 4 seconds each) with a traveling dot around a box path, scaling breath orb with easeInOutCubic easing, countdown timer, cycle counter, and phase progress bar.
- Both modules include Web Audio API sound feedback, responsive mobile layout, and dynamic page title updates during focus sessions.
- Created dedicated component ([WellnessSection.tsx](file:///c:/Users/eswar/Downloads/Kimi_Agent_SOC%20Analyst%20Interview%20Guide/app/src/pages/WellnessSection.tsx)) and stylesheet ([Wellness.css](file:///c:/Users/eswar/Downloads/Kimi_Agent_SOC%20Analyst%20Interview%20Guide/app/src/pages/Wellness.css)).
- Integrated into existing navigation with HeartPulse icon from Lucide.
- Verified TypeScript compilation with zero errors.

### Milestone 8: Automated GitHub Pages Deployment
- Configured repository deployment pipeline to publish updates to GitHub Pages on every push to the `main` branch.
- Validated Vite asset bundling and resolved asset path compatibility via relative path settings (`base: './'`) in `vite.config.ts`.
- Verified execution of the GitHub Actions workflow to successfully compile TypeScript, build production assets, and deploy the application to [https://kutral.github.io/temp/](https://kutral.github.io/temp/).
