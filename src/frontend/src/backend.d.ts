import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FAQEntry {
    keywords: Array<string>;
    response: string;
}
export interface UserProfile {
    studentId?: string;
    name: string;
    role: string;
}
export type Time = bigint;
export interface Attendance {
    subjectId: string;
    percentage: number;
}
export interface Marks {
    marks: bigint;
    subjectId: string;
    examType: string;
}
export interface AcademicRecord {
    marks: Array<Marks>;
    subjects: Array<Subject>;
    feesDue: Array<FeesDue>;
    exams: Array<Exam>;
    attendance: Array<Attendance>;
    student: Student;
}
export interface FeeStructure {
    yearSemesterBreakdown: Array<{
        yearOrSemester: string;
        amount: number;
    }>;
    course: Course;
}
export interface Course {
    branch: string;
    durationYears: number;
    degree: Degree;
}
export interface Exam {
    date: Time;
    subjectId: string;
    examId: string;
    examType: string;
}
export interface FacultyMember {
    name: string;
    subjectsTaught: Array<string>;
    department: string;
    qualification: string;
}
export interface FeesDue {
    dueDate: Time;
    yearSemester: string;
    amount: number;
}
export interface Subject {
    semester: bigint;
    code: string;
    name: string;
    year: bigint;
    subjectId: string;
    department: string;
}
export interface Student {
    studentId: string;
    degree: Degree;
    department: string;
    lastName: string;
    firstName: string;
}
export interface AdminCourse {
    branch: string;
    degree: string;
    durationYears: bigint;
    intake: bigint;
}
export interface AdminFeeBreakdown {
    yearOrSemester: string;
    amount: number;
}
export interface AdminFeeEntry {
    courseBranch: string;
    yearSemesterBreakdown: Array<AdminFeeBreakdown>;
}
export interface AdminFacultyMember {
    name: string;
    qualification: string;
    designation: string;
    subjectsTaught: Array<string>;
    department: string;
}
export interface ClassifiedDoc {
    id: string;
    title: string;
    category: string;
    content: string;
    uniquePassword: string;
    createdAt: string;
}
export interface AttendanceRecord {
    studentId: string;
    name: string;
    present: boolean;
}
export interface ClassAttendanceSession {
    id: string;
    department: string;
    year: string;
    subject: string;
    date: string;
    savedAt: string;
    records: Array<AttendanceRecord>;
}
export enum Degree {
    mba = "mba",
    bTech = "bTech",
    mTech = "mTech"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdminCourse(course: AdminCourse): Promise<void>;
    addAdminFaculty(member: AdminFacultyMember): Promise<void>;
    addOrUpdateAcademicRecord(studentId: string, record: AcademicRecord): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAdminCourses(): Promise<Array<AdminCourse>>;
    getAdminFacultyList(): Promise<Array<AdminFacultyMember>>;
    getAdminFeeEntries(): Promise<Array<AdminFeeEntry>>;
    getAllAcademicRecords(): Promise<Array<AcademicRecord>>;
    getAllCourses(): Promise<Array<Course>>;
    getAllFeeStructures(): Promise<Array<FeeStructure>>;
    getAttendanceByStudent(studentId: string): Promise<Array<Attendance>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatbotResponse(message: string): Promise<string>;
    getDepartmentInfo(department: string): Promise<{
        courses: Array<Course>;
        subjects: Array<Subject>;
        faculty: Array<FacultyMember>;
    }>;
    getExamTimetableByDepartment(department: string): Promise<Array<Exam>>;
    getFAQEntries(): Promise<Array<FAQEntry>>;
    getFacultyByDepartment(department: string): Promise<Array<FacultyMember>>;
    getFacultyDirectory(): Promise<Array<FacultyMember>>;
    getFeeStructureByCourse(course: Course): Promise<FeeStructure>;
    getFeesDueByStudent(studentId: string): Promise<Array<FeesDue>>;
    getMarksByStudent(studentId: string): Promise<Array<Marks>>;
    getOwnRecord(): Promise<AcademicRecord>;
    getStudentRecord(studentId: string): Promise<AcademicRecord>;
    getSubjectsByDepartment(department: string): Promise<Array<Subject>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeAdminCourse(branch: string): Promise<void>;
    removeAdminFaculty(name: string, department: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    upsertAdminFeeEntry(entry: AdminFeeEntry): Promise<void>;
    getClassifiedDocs(): Promise<Array<ClassifiedDoc>>;
    addClassifiedDoc(doc: ClassifiedDoc): Promise<void>;
    removeClassifiedDoc(id: string): Promise<void>;
    getAttendanceSessions(): Promise<Array<ClassAttendanceSession>>;
    getSessionsByDepartmentYear(department: string, year: string): Promise<Array<ClassAttendanceSession>>;
    addAttendanceSession(session: ClassAttendanceSession): Promise<void>;
}
