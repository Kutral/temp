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

### Milestone 9: Focus Music — Embedded Lofi YouTube Live Stream
- Added a third "Focus Music" tab to the Wellness section with a distinctive purple gradient active state.
- **Vinyl Record Visual**: Spinning vinyl disc with concentric groove rings, center label, and ambient glow that animates when music is playing.
- **Waveform Bars**: 32 animated audio bars with staggered delay that bounce when the stream is active.
- **Audio-First Design**: Compact YouTube iframe (80px height) for audio playback, plus an expanded 16:9 video view below for visual engagement.
- **Info Card**: "Why Focus Music?" card with 4 benefit tiles (Reduces anxiety, Boosts focus, Masks noise, Flow state) with hover micro-animations.
- Embedded YouTube live stream: [Lofi Hip Hop Radio](https://www.youtube.com/live/YmQ7jRgf4f0) with autoplay on user interaction.
- Fully responsive for mobile viewports with scaled vinyl and 2-column tip grid.

### Milestone 10: Persistent Wellness Tools, Custom Audio Controls, and Stats Reset
- **Background Playback Preservation**: Refactored the core application layout from React conditional rendering to CSS-based visibility toggling (`display: none` / `display: block`). This keeps the Pomodoro timer and Focus Music iframe mounted in the DOM, allowing music to play and the timer to count down continuously when navigating across different sections of the dashboard.
- **YouTube IFrame API Integration**: Integrated the official YouTube Player API to create a unified audio-first control system. Replaced the static iframe with custom glassmorphism player controls (play/pause toggle, interactive volume slider, and instant mute).
- **Pomodoro Stats Reset**: Added a dedicated reset action for session tracking (Focus Today, Cycle Progress, Completed Cycles) to allow clearing logs and starting fresh.
- **GitHub Pages Deployment Verification**: Successfully pushed code changes to `main` and verified that the automatic GitHub Actions workflow built and deployed the live app to [https://kutral.github.io/temp/](https://kutral.github.io/temp/).

### Milestone 11: Custom YouTube URL Playback Support
- **Custom URL Input**: Added a text input field within the Focus Music controller to let users paste any standard YouTube or `youtu.be` URL.
- **Dynamic ID Extraction**: Implemented regex patterns and a robust parsing function (`extractYoutubeId`) supporting standard URLs, share links, custom embed URLs, and `/live/` streams (e.g. `youtube.com/live/VIDEO_ID`).
- **Robust Fallback Parsing**: Added query-parameter stripping and a fallback search pattern to extract 11-character alphanumeric strings, allowing users to paste a video ID with parameters directly (e.g. `tRsQsTMvPNg?si=...`).
- **Unified Control Integration**: Integrated the dynamically parsed video ID into the custom YouTube IFrame API wrapper, ensuring that custom URLs support volume controls, play/pause, and mute.
- **Push-to-Deploy Verification**: Pushed the updates to the repository to trigger the automated GitHub Actions deployment.


