# OpsMind AI — Design Document

## Overview

OpsMind AI is an AI-powered internal enterprise document assistant that helps employees ask questions from company documents including SOPs, HR policies, operations manuals, and other uploaded PDFs. The system functions as "ChatGPT for company documents" with a clean, professional interface designed to feel like a trusted workplace portal rather than a flashy AI product.

## Design Philosophy

OpsMind AI should look and feel like a real company portal used inside an organization. The interface must be:

- **Simple** — Easy to understand and navigate
- **Familiar** — Recognizable workplace patterns
- **Trustworthy** — Professional and reliable
- **Accessible** — Usable by employees of all age groups and technical abilities

The design prioritizes calm, clean, and practical interfaces over decorative AI visuals, analytics dashboards, or futuristic aesthetics.

## Visual Design Principles

### What to Include

- Flat panels with subtle gray borders
- Minimal shadows and slight corner radius
- Professional blue accent color
- Neutral backgrounds
- Clean readable typography
- Simple icons only where useful
- Light mode as default with dark mode toggle

### What to Avoid

- Glow effects and glassmorphism
- Heavy gradients and over-rounded cards
- Heavy shadows and decorative AI visuals
- Fake analytics, charts, and KPI cards
- Suggestion cards and too many icons
- Cluttered dashboard layouts

### Color Direction

**Light Mode:**
- Background: very light gray or off-white
- Panels: white
- Borders: soft gray
- Primary accent: professional blue
- Text: near-black or dark gray
- Muted text: neutral gray

**Dark Mode:**
- Background: dark neutral gray
- Panels: slightly lighter dark gray
- Borders: muted gray
- Primary accent: soft blue
- Text: white or light gray
- Muted text: gray

## Layout Structure

The application uses a consistent shell across all pages inspired by Claude's workspace structure:

- **Collapsible left sidebar** — Navigation and core actions
- **Main workspace** — Primary content area
- **Collapsible right panel** — Contextual workspace information
- **Minimal top navbar** — Current context and utilities

### Left Sidebar

The sidebar is collapsible and contains:

- OpsMind AI logo/name at the top
- Home
- New Chat
- Chat History
- Documents
- Settings
- Logout (directly above Profile)
- Profile (always at the very bottom)

**Profile Behavior:**

Clicking Profile opens a basic profile details view containing:
- Name
- Email
- Avatar placeholder
- Role
- Department

### Top Navbar

The navbar must remain minimal and contain only:
- Current page title or context
- Notification icon
- Help icon

### Right Collapsible Panel

The right panel behaves like Claude's artifacts panel and displays contextual workspace information such as:

- Sources used in an answer
- Document preview
- Selected chat preview
- Recently used documents
- Last opened chat
- Workspace context

The panel should support the user's task without causing distraction.

## Screen Designs

### Screen 1 — Portal Home

**Purpose:** The first screen employees see when opening OpsMind AI. Should feel like a calm company portal home.

**Layout:**
- Collapsible left sidebar
- Main center workspace
- Collapsible right workspace panel
- Minimal top navbar

**Main Content:**

- Heading: "Welcome to OpsMind AI"
- Subheading: "Ask questions from your company documents and review previous conversations."
- Large ask input area in the center
  - Placeholder: "Ask a question from company documents…"
  - Primary action button: "Ask OpsMind"
  - Secondary action button: "Upload Documents"

**Recent Chats Section:**

Below the ask area, display recent chats as a clean list (not cards):
- Chat title or question title
- Modified date/time
- Small open arrow or action
- Link: "View all chat history"

Do not show suggestion cards.

**Right Panel on Home:**

Title: "Workspace"

May display:
- Recently used documents
- Last opened chat
- Quick document access
- Optional file pin/drop area

Keep minimal.

### Screen 2 — Chat Workspace

**Purpose:** The main question-answer experience.

**Layout:**
- Same collapsible left sidebar
- Same minimal top navbar
- Main chat workspace
- Collapsible right sources panel
- Sticky input bar at the bottom

**Main Chat Area:**

- User question
- AI answer below it
  - Label above answer: "Answer from company documents"
  - Readable, spacious, easy to understand
- Bottom input placeholder: "Ask another question…"

**Sources:**

Sources appear below each answer and inside the right panel.

Each source includes:
- PDF file name
- Section or chunk label
- Confidence percentage
- Short evidence snippet

Sources should feel like proof, not decoration.

**Required UX Improvements:**

1. **Auto-scroll to bottom** — When a new message appears, chat automatically scrolls to the latest message

2. **Copy answer button** — Each AI answer has a copy button that copies the answer to clipboard

3. **Regenerate answer button** — Each AI answer has a regenerate button to re-run the same question if the user is not satisfied

**Error States:**

Include clean error states for:
- **Network failure:** "Something went wrong. Please try again." with a Retry button
- **Invalid input:** "Please enter a question before submitting."
- **No relevant result:** "No relevant information was found in the uploaded documents."

### Screen 3 — Chat History

**Purpose:** Allows employees to refer to old conversations.

**Layout:**
- Same collapsible left sidebar
- Same minimal top navbar
- Main history list
- Collapsible right preview panel

**Main Content:**

- Page title: "Chat History"
- Search field placeholder: "Search previous chats…"
- Chats grouped by:
  - Today
  - This week
  - Older

**Chat Row Details:**
- Question title
- Date/time
- Short answer preview

**Right Preview Panel:**

When a chat is selected, display:
- Question
- Short answer preview
- Sources used
- Button: "Open full chat"

### Screen 4 — Documents

**Purpose:** Upload and manage company documents.

**Layout:**
- Same collapsible left sidebar
- Same minimal top navbar
- Main document area
- Collapsible right document preview panel

**Main Content:**

- Page title: "Documents"
- Upload text: "Upload SOPs, policies, and internal documents."
- Upload button: "Choose PDF files"
- Upload area supports drag-and-drop

**Document Table/List:**

Columns:
- File name
- Uploaded on
- Status
- Actions

**Status Values:**
- Processing
- Ready
- Failed

**Processing Tracker:**

For documents that are processing, show a simple inline progress tracker:

PDF uploaded → Text extracted → Chunks created → Ready to search

Do not show analytics, charts, or statistics.

**Right Document Panel:**

Displays:
- Selected document preview
- File details
- Processing status if needed

### Screen 5 — Settings

**Purpose:** Manage basic user preferences. Keep simple and realistic.

**Settings Sections:**

**1. Appearance**
- Light mode
- Dark mode

**2. Profile**
- Name
- Email
- Avatar placeholder
- Role
- Department

**3. Answer Preferences**
- Answer length: Brief / Detailed
- Show sources: On / Off
- Regenerate confirmation: On / Off

**4. Role-Based Preferences**

Roles:
- Employee
- Manager
- HR
- Operations
- Admin

Role-based preferences may affect:
- Default answer detail level
- Document priority
- Visibility of advanced source details
- Whether document previews open by default

**5. Notifications**
- Enable notifications
- Document processing alerts
- System alerts

**6. Accessibility / Comfort**
- Font size
- Comfortable spacing
- High contrast mode

## Navigation Flows

### Ask Flow
Home → Ask Question → Chat Workspace → View Answer → View Sources → Continue Chat

### Upload Flow
Home → Upload Documents → Documents Page → Processing → Ready to Search

### History Flow
Home → Chat History → Select Old Chat → Preview Chat → Open Full Chat

### Settings Flow
Sidebar → Settings → Update Preferences

## Main Features

- Asking questions from company documents
- Reading AI-generated answers
- Viewing sources used for answers
- Accessing old chats
- Uploading and managing documents
- Basic profile management
- Basic settings configuration
- Light and dark mode toggle
- Copy answer functionality
- Regenerate answer functionality
- Auto-scroll chat behavior
- Clean error handling

## Design Goal

The interface should make users and judges feel: **"This looks like a real enterprise tool."**

The UI must be:
- Clean
- Practical
- Trustworthy
- Easy to understand
- Not overdesigned
- Not cluttered
- Ready for workplace use