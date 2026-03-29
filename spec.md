# SNGCE College Management

## Current State
Chatbot uses Groq (llama-3.3-70b-versatile) via `groqApi.ts` with a static system prompt. The system prompt has general SNGCE info but no timetable, events, or attendance calculation logic. The ChatbotWidget does not pass user role or student-specific data to the chatbot.

## Requested Changes (Diff)

### Add
- Comprehensive class timetable (period-wise, day-wise) for B.Tech semesters in the system prompt
- Upcoming events and fests data (college fest, tech fests, cultural events) in the system prompt
- Attendance calculation instructions: given current attendance % and total classes held, calculate classes needed to reach 75%
- Role-aware chatbot context: pass current user role (student/staff/admin) and student ID into the Groq API call so the AI can personalize responses
- Quick chip suggestions relevant to each role (students see attendance/timetable chips, staff see student management chips, admin see admin chips)
- Helper function `calcClassesNeeded(attended, total)` that calculates how many more classes needed to reach 75% — this gets injected into messages when attendance context is detected
- Staff-specific features: the AI should help staff understand how to enter marks/attendance and navigate to their dashboard
- Admin-specific features: the AI should help admin manage courses/fees/faculty

### Modify
- `groqApi.ts`: Update `callGroq` to accept optional `userContext` (role, studentId, attendanceData) and inject it as additional system context; expand system prompt with timetable, events, and attendance calculation rules
- `ChatbotWidget.tsx`: Read auth context (role, studentId) and pass to callGroq; show role-specific quick chips on first open

### Remove
- Nothing removed

## Implementation Plan
1. Update `groqApi.ts`:
   - Expand SYSTEM_PROMPT with: full period-wise timetable (Mon-Sat, 8 periods), events/fests calendar, attendance calculation formula, role-specific guidance
   - Update `callGroq` signature to accept optional `userContext: { role, studentId, attendanceData }`
   - Inject userContext as a dynamic system message after the main prompt
2. Update `ChatbotWidget.tsx`:
   - Import useAuth to get role, studentId
   - Pass userContext to callGroq
   - Show role-specific quick chips: students get ["My Timetable", "Attendance status", "Upcoming exams", "College fests"], staff get ["Enter attendance", "Enter marks", "Student records", "Timetable"], admin get ["Manage courses", "Add faculty", "View classified", "Fee structure"]
