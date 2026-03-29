# SNGCE College Management

## Current State
- Admin dashboard: only manages classified documents (add/delete with passwords)
- Staff dashboard: view-only academic data, no data entry
- Backend: courses, feeStructures, facultyDirectory are immutable `let` arrays; no admin mutation APIs; attendance/marks stored inside AcademicRecord per student but only writable via full record replacement

## Requested Changes (Diff)

### Add
- Backend: mutable courses list (var), admin APIs: addCourse, removeCourse
- Backend: mutable feeStructures list (var), admin API: updateFeeStructure (upsert by course branch)
- Backend: mutable facultyDirectory list (var), admin APIs: addFaculty, removeFaculty (by name+department)
- Backend: dedicated staff APIs: updateStudentAttendance(studentId, subjectId, percentage), updateStudentMarks(studentId, subjectId, examType, marks), addStudent(student record)
- Admin dashboard: new tabs for Course Management, Fee Management, Faculty Management
- Staff dashboard: new sections for entering attendance and marks per student/subject

### Modify
- Backend: change courses, feeStructures, facultyDirectory from `let` to `var` arrays
- Backend: addOrUpdateAcademicRecord restricted to staff role (not just admin)
- AdminDashboard: add tab navigation (Classified | Courses | Fees | Faculty)
- StaffDashboard: add tab for Attendance & Marks entry

### Remove
- Nothing removed

## Implementation Plan
1. Update Motoko backend:
   - Make courses, feeStructures, facultyDirectory `var` arrays
   - Add addCourse, removeCourse (admin only)
   - Add upsertFeeStructure (admin only)
   - Add addFaculty, removeFaculty (admin only)
   - Add updateStudentAttendance and updateStudentMarks (staff/admin)
   - Add listStudents query for staff to select students
2. Update AdminDashboard with tabbed UI:
   - Tab 1: Classified (existing)
   - Tab 2: Courses (list + add form + remove button)
   - Tab 3: Fees (list + edit year-wise amounts per course)
   - Tab 4: Faculty (list + add form + remove button)
3. Update StaffDashboard:
   - Add Attendance tab: select student, subject, enter percentage
   - Add Marks tab: select student, subject, exam type, enter marks
   - Data stored in localStorage keyed by studentId (since demo logins don't use Principal-based backend auth)
