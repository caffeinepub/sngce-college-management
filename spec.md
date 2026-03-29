# SNGCE College Management

## Current State
Fresh workspace -- full rebuild required.

## Requested Changes (Diff)

### Add
- Full SNGCE College Management app with all previously built features
- AI chatbot powered by Pollinations AI (free, no API key required)
- Student, staff, and admin portals with demo logins
- Real SNGCE data: courses, fees, faculty, placements, recruiters
- Classified info system (admin sets password, staff views with password)
- Campus background image from https://sngce.ac.in/user/images/college1.jpg
- Liquid glass / glassmorphism UI with dark/light mode
- Apple-style animated splash screen

### Modify
- Chatbot: replace Gemini API with Pollinations AI (https://text.pollinations.ai/) -- free, no key needed

### Remove
- Nothing (fresh build)

## Implementation Plan
1. Backend: Motoko actor for user auth, academic records, classified docs access control
2. Frontend: React app with TanStack Router, glassmorphism UI, campus background
3. Chatbot: calls https://text.pollinations.ai/{prompt}?model=openai (GET) or POST to https://text.pollinations.ai/ with messages array
4. Pages: Home (chatbot prominent), Login, Courses, Fees, Faculty, Student Dashboard, Staff Dashboard, Admin Dashboard, Classified Info
5. Demo logins: STU001/pass123, STAFF001/pass123, ADMIN001/admin123
