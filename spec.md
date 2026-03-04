# SNGCE College Management App

## Current State

The app is a full-stack college management portal for Sree Narayana Gurukulam College of Engineering (SNGCE). It includes:

- **SplashPage**: Apple-style welcome animation
- **HomePage**: Hero + quick nav cards + stats + footer with SNGCE branding
- **CoursesPage**: Lists all B.Tech/M.Tech/MBA/MCA programs
- **FeesPage**: Year-wise fee breakdown per program
- **FacultyPage**: Faculty directory organized by department
- **LoginPage**: Demo login for students (STU001-STU003) and staff (STAFF001-STAFF002) with credential selection
- **StudentDashboard**: Attendance, marks, timetable, fees due per student
- **StaffDashboard**: Edit/add student academic records
- **ChatbotWidget**: Floating AI chatbot powered by Gemini 2.0 Flash + local fallback engine
- **Layout**: Navbar with dark/light toggle, chatbot integrated
- **AuthContext**: localStorage-based auth for demo accounts
- **ThemeContext**: Dark/light mode toggle

The last deployment failed. The previous build succeeded (Version 5 was deployed) so code should be largely intact.

## Requested Changes (Diff)

### Add
- Nothing new requested — this is a retry of the previous failed deployment

### Modify
- Ensure all existing files are correct and ready to build
- Verify no broken imports or missing files

### Remove
- Nothing

## Implementation Plan

1. Audit existing frontend source files for any issues (broken imports, missing files, TypeScript errors)
2. Verify backend.d.ts and all page/component files are consistent
3. Run frontend build to confirm everything compiles
4. Deploy
