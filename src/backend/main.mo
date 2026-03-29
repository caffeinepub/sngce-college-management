import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import Char "mo:core/Char";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Nat16 "mo:core/Nat16";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let academicRecordsStore = Map.empty<Text, AcademicRecord>();
  let studentPrincipalMap = Map.empty<Principal, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public type UserProfile = {
    name : Text;
    role : Text;
    studentId : ?Text;
  };

  type Degree = {
    #bTech;
    #mTech;
    #mba;
  };

  module Degree {
    public func toText(degree : Degree) : Text {
      switch (degree) {
        case (#bTech) { "BTech" };
        case (#mTech) { "MTech" };
        case (#mba) { "MBA" };
      };
    };
  };

  let s1 = Nat16.fromNat(1);
  let s2 = Nat16.fromNat(2);
  let s8 = Nat16.fromNat(8);

  type Course = {
    branch : Text;
    degree : Degree;
    durationYears : Nat16;
  };

  type FeeStructure = {
    course : Course;
    yearSemesterBreakdown : [{ yearOrSemester : Text; amount : Float }];
  };

  type FacultyMember = {
    name : Text;
    qualification : Text;
    subjectsTaught : [Text];
    department : Text;
  };

  type Student = {
    studentId : Text;
    firstName : Text;
    lastName : Text;
    department : Text;
    degree : Degree;
  };

  type Subject = {
    subjectId : Text;
    name : Text;
    code : Text;
    year : Nat;
    semester : Nat;
    department : Text;
  };

  type Attendance = {
    subjectId : Text;
    percentage : Float;
  };

  type Marks = {
    subjectId : Text;
    examType : Text;
    marks : Int;
  };

  type Exam = {
    examId : Text;
    subjectId : Text;
    examType : Text;
    date : Time.Time;
  };

  type FeesDue = {
    amount : Float;
    dueDate : Time.Time;
    yearSemester : Text;
  };

  type AcademicRecord = {
    student : Student;
    subjects : [Subject];
    attendance : [Attendance];
    marks : [Marks];
    exams : [Exam];
    feesDue : [FeesDue];
  };

  type FAQEntry = {
    keywords : [Text];
    response : Text;
  };

  let courses : [Course] = [
    { branch = "Computer Science Engineering"; degree = #bTech; durationYears = Nat16.fromNat(4) },
    { branch = "Mechanical Engineering"; degree = #bTech; durationYears = Nat16.fromNat(4) },
    { branch = "Electrical and Electronics Engineering"; degree = #bTech; durationYears = Nat16.fromNat(4) },
    { branch = "Electronics and Communication Engineering"; degree = #bTech; durationYears = Nat16.fromNat(4) },
    { branch = "Civil Engineering"; degree = #bTech; durationYears = Nat16.fromNat(4) },
    { branch = "Naval Architecture and Ship Building"; degree = #bTech; durationYears = Nat16.fromNat(4) },
    { branch = "Artificial Intelligence and Cyber Security"; degree = #bTech; durationYears = Nat16.fromNat(4) },
    { branch = "Computer Applications"; degree = #mba; durationYears = Nat16.fromNat(2) },
    { branch = "Management Studies"; degree = #mba; durationYears = Nat16.fromNat(2) },
    { branch = "Electrical Engineering"; degree = #mTech; durationYears = Nat16.fromNat(2) },
  ];

  let feeStructures : [FeeStructure] = [
    {
      course = courses[0];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 112950.0 },
        { yearOrSemester = "Year 2"; amount = 112950.0 },
        { yearOrSemester = "Year 3"; amount = 112950.0 },
        { yearOrSemester = "Year 4"; amount = 112950.0 },
      ];
    },
    {
      course = courses[1];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 112950.0 },
        { yearOrSemester = "Year 2"; amount = 112950.0 },
        { yearOrSemester = "Year 3"; amount = 112950.0 },
        { yearOrSemester = "Year 4"; amount = 112950.0 },
      ];
    },
    {
      course = courses[5];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 125000.0 },
        { yearOrSemester = "Year 2"; amount = 125000.0 },
        { yearOrSemester = "Year 3"; amount = 125000.0 },
        { yearOrSemester = "Year 4"; amount = 125000.0 },
      ];
    },
    {
      course = courses[9];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 140000.0 },
        { yearOrSemester = "Year 2"; amount = 140000.0 },
      ];
    },
    {
      course = courses[8];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 95000.0 },
        { yearOrSemester = "Year 2"; amount = 95000.0 },
      ];
    },
    {
      course = courses[7];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 90000.0 },
        { yearOrSemester = "Year 2"; amount = 90000.0 },
      ];
    },
  ];

  let facultyDirectory : [FacultyMember] = [
    { name = "Dr. Suresh Kumar"; qualification = "PhD (Mathematics)"; subjectsTaught = ["Engineering Mathematics", "Calculus"]; department = "Science & Humanities" },
    { name = "Dr. Priya Nair"; qualification = "PhD (Physics)"; subjectsTaught = ["Engineering Physics", "Optics"]; department = "Science & Humanities" },
    { name = "Prof. Anitha Raj"; qualification = "MSc (Chemistry)"; subjectsTaught = ["Engineering Chemistry"]; department = "Science & Humanities" },
    { name = "Dr. Rajesh Menon"; qualification = "PhD (CSE)"; subjectsTaught = ["Data Structures", "Algorithms", "DBMS"]; department = "Computer Science" },
    { name = "Ms. Nisha Pillai"; qualification = "MTech (CSE)"; subjectsTaught = ["Operating Systems", "Computer Networks"]; department = "Computer Science" },
    { name = "Mr. Arun Thomas"; qualification = "MTech (CSE)"; subjectsTaught = ["Web Technologies", "Cloud Computing"]; department = "Computer Science" },
    { name = "Dr. Santhosh P"; qualification = "PhD (EEE)"; subjectsTaught = ["Power Systems", "Electrical Machines"]; department = "Electrical & Electronics" },
    { name = "Ms. Divya Krishnan"; qualification = "MTech (Power Electronics)"; subjectsTaught = ["Power Electronics", "Control Systems"]; department = "Electrical & Electronics" },
    { name = "Dr. Manoj Kumar"; qualification = "PhD (Mechanical)"; subjectsTaught = ["Thermodynamics", "Fluid Mechanics"]; department = "Mechanical Engineering" },
    { name = "Mr. Vivek S"; qualification = "MTech (Manufacturing)"; subjectsTaught = ["Manufacturing Technology", "Machine Design"]; department = "Mechanical Engineering" },
    { name = "Dr. Jayakumar P"; qualification = "PhD (Naval Architecture)"; subjectsTaught = ["Ship Design", "Marine Hydrodynamics"]; department = "Naval Architecture" },
    { name = "Dr. Aswathy R"; qualification = "PhD (Civil)"; subjectsTaught = ["Structural Engineering", "Concrete Technology"]; department = "Civil Engineering" },
    { name = "Mr. Sreejith V"; qualification = "MTech (AI)"; subjectsTaught = ["Machine Learning", "Deep Learning"]; department = "AI & Cyber Security" },
  ];

  public type AdminCourse = {
    branch : Text;
    degree : Text;
    durationYears : Nat;
    intake : Nat;
  };

  public type AdminFeeEntry = {
    courseBranch : Text;
    yearSemesterBreakdown : [{ yearOrSemester : Text; amount : Float }];
  };

  public type AdminFacultyMember = {
    name : Text;
    qualification : Text;
    designation : Text;
    subjectsTaught : [Text];
    department : Text;
  };

  stable var adminCourses : [AdminCourse] = [];
  stable var adminFeeEntries : [AdminFeeEntry] = [];
  stable var adminFacultyList : [AdminFacultyMember] = [];

  func canAccessStudentRecord(caller : Principal, studentId : Text) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    switch (studentPrincipalMap.get(caller)) {
      case (?callerStudentId) { callerStudentId == studentId };
      case (null) { false };
    };
  };

  func normalize(text : Text) : Text {
    let lower = text.map(
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32(c.toNat32() + 32);
        } else {
          c;
        };
      }
    );
    let chars = lower.toArray();
    let filtered = chars.map(func(c) { c }).filter(
      func(c) { c != ' ' and c != '?' and c != '.' and c != ',' }
    );
    Text.fromArray(filtered);
  };

  func equalsIgnoreCase(text1 : Text, text2 : Text) : Bool {
    normalize(text1) == normalize(text2);
  };

  func textContains(text : Text, substring : Text) : Bool {
    let textArray = text.toArray();
    let substringArray = substring.toArray();
    let textLen = textArray.size();
    let substringLen = substringArray.size();
    if (substringLen == 0 or substringLen > textLen) {
      return false;
    };
    func isSubstringAt(index : Nat) : Bool {
      func checkChar(pos : Nat) : Bool {
        if (pos == substringLen) { return true };
        if (not equalsIgnoreCase(Text.fromArray([textArray[index + pos]]), Text.fromArray([substringArray[pos]]))) {
          return false;
        };
        checkChar(pos + 1);
      };
      checkChar(0);
    };
    func checkIndex(index : Nat) : Bool {
      if (index > textLen - substringLen) { return false };
      if (isSubstringAt(index)) { return true };
      checkIndex(index + 1);
    };
    checkIndex(0);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    userProfiles.add(caller, profile);
    switch (profile.studentId) {
      case (?studentId) { studentPrincipalMap.add(caller, studentId) };
      case (null) {};
    };
  };

  public query func getAllCourses() : async [Course] {
    courses;
  };

  public query func getAllFeeStructures() : async [FeeStructure] {
    feeStructures;
  };

  public query func getFeeStructureByCourse(course : Course) : async FeeStructure {
    switch (feeStructures.find(func(f) { f.course == course })) {
      case (?structure) { structure };
      case (null) { { course; yearSemesterBreakdown = [] } };
    };
  };

  public query func getFacultyDirectory() : async [FacultyMember] {
    facultyDirectory;
  };

  public query func getFacultyByDepartment(department : Text) : async [FacultyMember] {
    facultyDirectory.filter(func(f) { f.department == department });
  };

  public query func getAdminCourses() : async [AdminCourse] {
    adminCourses;
  };

  public shared ({ caller }) func addAdminCourse(course : AdminCourse) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can add courses");
    };
    adminCourses := adminCourses.concat([course]);
  };

  public shared ({ caller }) func removeAdminCourse(branch : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can remove courses");
    };
    adminCourses := adminCourses.filter(func(c) { c.branch != branch });
  };

  public query func getAdminFeeEntries() : async [AdminFeeEntry] {
    adminFeeEntries;
  };

  public shared ({ caller }) func upsertAdminFeeEntry(entry : AdminFeeEntry) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update fees");
    };
    let existing = adminFeeEntries.find(func(f) { f.courseBranch == entry.courseBranch });
    switch (existing) {
      case (?_) {
        adminFeeEntries := adminFeeEntries.map(func(f) {
          if (f.courseBranch == entry.courseBranch) { entry } else { f }
        });
      };
      case (null) {
        adminFeeEntries := adminFeeEntries.concat([entry]);
      };
    };
  };

  public query func getAdminFacultyList() : async [AdminFacultyMember] {
    adminFacultyList;
  };

  public shared ({ caller }) func addAdminFaculty(member : AdminFacultyMember) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can add faculty");
    };
    adminFacultyList := adminFacultyList.concat([member]);
  };

  public shared ({ caller }) func removeAdminFaculty(name : Text, department : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can remove faculty");
    };
    adminFacultyList := adminFacultyList.filter(func(f) {
      not (f.name == name and f.department == department)
    });
  };

  public shared ({ caller }) func addOrUpdateAcademicRecord(studentId : Text, record : AcademicRecord) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can add records");
    };
    academicRecordsStore.add(studentId, record);
  };

  public query ({ caller }) func getAllAcademicRecords() : async [AcademicRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view all records");
    };
    academicRecordsStore.values().toArray();
  };

  public query ({ caller }) func getStudentRecord(studentId : Text) : async AcademicRecord {
    if (not canAccessStudentRecord(caller, studentId)) {
      Runtime.trap("Unauthorized");
    };
    switch (academicRecordsStore.get(studentId)) {
      case (?record) { record };
      case (null) { Runtime.trap("Student record not found") };
    };
  };

  public query ({ caller }) func getOwnRecord() : async AcademicRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (studentPrincipalMap.get(caller)) {
      case (?studentId) {
        switch (academicRecordsStore.get(studentId)) {
          case (?record) { record };
          case (null) { Runtime.trap("Student record not found") };
        };
      };
      case (null) { Runtime.trap("No student ID associated with this user") };
    };
  };

  public query ({ caller }) func getAttendanceByStudent(studentId : Text) : async [Attendance] {
    if (not canAccessStudentRecord(caller, studentId)) {
      Runtime.trap("Unauthorized");
    };
    switch (academicRecordsStore.get(studentId)) {
      case (?record) { record.attendance };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getMarksByStudent(studentId : Text) : async [Marks] {
    if (not canAccessStudentRecord(caller, studentId)) {
      Runtime.trap("Unauthorized");
    };
    switch (academicRecordsStore.get(studentId)) {
      case (?record) { record.marks };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getSubjectsByDepartment(department : Text) : async [Subject] {
    let records = academicRecordsStore.values().toArray();
    let subjectsList = records.foldLeft(
      [] : [Subject],
      func(acc, record) { acc.concat(record.subjects) },
    );
    subjectsList.filter(func(s) { s.department == department });
  };

  public query ({ caller }) func getFeesDueByStudent(studentId : Text) : async [FeesDue] {
    if (not canAccessStudentRecord(caller, studentId)) {
      Runtime.trap("Unauthorized");
    };
    switch (academicRecordsStore.get(studentId)) {
      case (?record) { record.feesDue };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getExamTimetableByDepartment(department : Text) : async [Exam] {
    let records = academicRecordsStore.values().toArray();
    let examsList = records.foldLeft(
      [] : [Exam],
      func(acc, record) { acc.concat(record.exams) },
    );
    examsList.filter(func(e) { e.subjectId == department });
  };

  public query ({ caller }) func getDepartmentInfo(department : Text) : async {
    courses : [Course];
    faculty : [FacultyMember];
    subjects : [Subject];
  } {
    let records = academicRecordsStore.values().toArray();
    let subjectsList = records.foldLeft(
      [] : [Subject],
      func(acc, record) { acc.concat(record.subjects) },
    );
    {
      courses = courses.filter(func(c) { c.branch == department });
      faculty = facultyDirectory.filter(func(f) { f.department == department });
      subjects = subjectsList.filter(func(s) { s.department == department });
    };
  };

  let faqEntries : [FAQEntry] = [
    {
      keywords = ["admissions", "admission process"];
      response = "The admission process for SNGCE includes submitting an application form, entrance exam (if applicable), followed by a personal interview.";
    },
    {
      keywords = ["fees", "fee structure"];
      response = "Fee structure varies by course. B.Tech fees are approximately Rs.1,12,950/year. Naval Architecture is Rs.1,25,000/year. M.Tech is Rs.1,40,000/year.";
    },
    {
      keywords = ["contact", "contact information"];
      response = "You can contact SNGCE at: Phone: 0484-2597800 (30 Lines), Email: info@sngce.ac.in";
    },
  ];

  public query func getFAQEntries() : async [FAQEntry] {
    faqEntries;
  };

  public query func getChatbotResponse(message : Text) : async Text {
    let normalizedMessage = normalize(message);
    func findFaqEntry(faq : FAQEntry) : Bool {
      func keywordMatches(keyword : Text) : Bool {
        textContains(normalizedMessage, normalize(keyword));
      };
      switch (faq.keywords.find(keywordMatches)) {
        case (?_) { true };
        case (null) { false };
      };
    };
    switch (faqEntries.find(findFaqEntry)) {
      case (?entry) { entry.response };
      case (null) {
        "I can help you with SNGCE admissions, fees, courses, faculty and placement information.";
      };
    };
  };
};
