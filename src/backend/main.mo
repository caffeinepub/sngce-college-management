import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat8 "mo:core/Nat8";
import Float "mo:core/Float";
import Char "mo:core/Char";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Nat16 "mo:core/Nat16";
import Nat32 "mo:core/Nat32";
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

  module FeeStructure {
    public func compare(fee1 : FeeStructure, fee2 : FeeStructure) : Order.Order {
      switch (Text.compare(fee1.course.branch, fee2.course.branch)) {
        case (#equal) { Float.compare(fee1.yearSemesterBreakdown[0].amount, fee2.yearSemesterBreakdown[0].amount) };
        case (order) { order };
      };
    };
  };

  type FacultyMember = {
    name : Text;
    qualification : Text;
    subjectsTaught : [Text];
    department : Text;
  };

  module FacultyMember {
    public func compare(fac1 : FacultyMember, fac2 : FacultyMember) : Order.Order {
      switch (Text.compare(fac1.department, fac2.department)) {
        case (#equal) { Text.compare(fac1.name, fac2.name) };
        case (order) { order };
      };
    };
  };

  type Student = {
    studentId : Text;
    firstName : Text;
    lastName : Text;
    department : Text;
    degree : Degree;
  };

  module Student {
    public func compare(stu1 : Student, stu2 : Student) : Order.Order {
      Text.compare(stu1.lastName, stu2.lastName);
    };
  };

  type Subject = {
    subjectId : Text;
    name : Text;
    code : Text;
    year : Nat;
    semester : Nat;
    department : Text;
  };

  module Subject {
    public func compare(subj1 : Subject, subj2 : Subject) : Order.Order {
      switch (Text.compare(subj1.department, subj2.department)) {
        case (#equal) { Text.compare(subj1.name, subj2.name) };
        case (order) { order };
      };
    };
  };

  type Attendance = {
    subjectId : Text;
    percentage : Float;
  };

  module Attendance {
    public func compare(att1 : Attendance, att2 : Attendance) : Order.Order {
      Float.compare(att1.percentage, att2.percentage);
    };
  };

  type Marks = {
    subjectId : Text;
    examType : Text;
    marks : Int;
  };

  module Marks {
    public func compare(m1 : Marks, m2 : Marks) : Order.Order {
      Int.compare(m1.marks, m2.marks);
    };
  };

  type Exam = {
    examId : Text;
    subjectId : Text;
    examType : Text;
    date : Time.Time;
  };

  module Exam {
    public func compare(exam1 : Exam, exam2 : Exam) : Order.Order {
      Int.compare(exam1.date, exam2.date);
    };
  };

  type FeesDue = {
    amount : Float;
    dueDate : Time.Time;
    yearSemester : Text;
  };

  module FeesDue {
    public func compare(f1 : FeesDue, f2 : FeesDue) : Order.Order {
      Float.compare(f1.amount, f2.amount);
    };
  };

  type AcademicRecord = {
    student : Student;
    subjects : [Subject];
    attendance : [Attendance];
    marks : [Marks];
    exams : [Exam];
    feesDue : [FeesDue];
  };

  module AcademicRecord {
    public func compare(rec1 : AcademicRecord, rec2 : AcademicRecord) : Order.Order {
      Student.compare(rec1.student, rec2.student);
    };
  };

  type FAQEntry = {
    keywords : [Text];
    response : Text;
  };

  module FAQEntry {
    public func compare(faq1 : FAQEntry, faq2 : FAQEntry) : Order.Order {
      Text.compare(faq1.keywords[0], faq2.keywords[0]);
    };
  };

  let courses : [Course] = [
    { branch = "Computer Science Engineering"; degree = #bTech; durationYears = 4 },
    { branch = "Mechanical Engineering"; degree = #bTech; durationYears = 4 },
    { branch = "Electrical and Electronics Engineering"; degree = #bTech; durationYears = 4 },
    { branch = "Electronics and Communication Engineering"; degree = #bTech; durationYears = 4 },
    { branch = "Civil Engineering"; degree = #bTech; durationYears = 4 },
    { branch = "Naval Architecture and Ship Building"; degree = #bTech; durationYears = 4 },
    { branch = "Artificial Intelligence and Cyber Security"; degree = #bTech; durationYears = 4 },
    { branch = "Computer Applications"; degree = #mba; durationYears = 2 },
    { branch = "Management Studies"; degree = #mba; durationYears = 2 },
    { branch = "Electrical Engineering"; degree = #mTech; durationYears = 2 },
  ];

  let feeStructures : [FeeStructure] = [
    {
      course = courses[0];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 80000.0 },
        { yearOrSemester = "Year 2"; amount = 80000.0 },
        { yearOrSemester = "Year 3"; amount = 75000.0 },
        { yearOrSemester = "Year 4"; amount = 75000.0 },
      ];
    },
    {
      course = courses[1];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 78000.0 },
        { yearOrSemester = "Year 2"; amount = 78000.0 },
        { yearOrSemester = "Year 3"; amount = 76000.0 },
        { yearOrSemester = "Year 4"; amount = 76000.0 },
      ];
    },
    {
      course = courses[2];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 82000.0 },
        { yearOrSemester = "Year 2"; amount = 82000.0 },
        { yearOrSemester = "Year 3"; amount = 80000.0 },
        { yearOrSemester = "Year 4"; amount = 80000.0 },
      ];
    },
    {
      course = courses[9];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 120000.0 },
        { yearOrSemester = "Year 2"; amount = 120000.0 },
      ];
    },
    {
      course = courses[8];
      yearSemesterBreakdown = [
        { yearOrSemester = "Year 1"; amount = 95000.0 },
        { yearOrSemester = "Year 2"; amount = 95000.0 },
      ];
    },
  ];

  let facultyDirectory : [FacultyMember] = [
    { name = "Alice Thomas"; qualification = "PhD (CSE)"; subjectsTaught = ["Data Structures", "Algorithms"]; department = "Computer Science" },
    { name = "Rajesh Kumar"; qualification = "MTech (Mechanical)"; subjectsTaught = ["Thermodynamics", "Fluid Mechanics"]; department = "Mechanical Engineering" },
    { name = "Nisha Pillai"; qualification = "MBA (Finance)"; subjectsTaught = ["Managerial Economics", "Accounting"]; department = "Business Administration" },
  ];

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

  func contains(text : Text, substring : Text) : Bool {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    switch (profile.studentId) {
      case (?studentId) { studentPrincipalMap.add(caller, studentId) };
      case (null) {};
    };
  };

  public query ({ caller }) func getAllCourses() : async [Course] {
    courses;
  };

  public query ({ caller }) func getAllFeeStructures() : async [FeeStructure] {
    feeStructures.sort<FeeStructure>();
  };

  public query ({ caller }) func getFeeStructureByCourse(course : Course) : async FeeStructure {
    switch (feeStructures.find(func(f) { f.course == course })) {
      case (?structure) { structure };
      case (null) { { course; yearSemesterBreakdown = [] } };
    };
  };

  public query ({ caller }) func getFacultyDirectory() : async [FacultyMember] {
    facultyDirectory.sort<FacultyMember>();
  };

  public query ({ caller }) func getFacultyByDepartment(department : Text) : async [FacultyMember] {
    facultyDirectory.filter(func(f) { f.department == department }).sort<FacultyMember>();
  };

  public shared ({ caller }) func addOrUpdateAcademicRecord(studentId : Text, record : AcademicRecord) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only staff can add or update records");
    };
    academicRecordsStore.add(studentId, record);
  };

  public query ({ caller }) func getAllAcademicRecords() : async [AcademicRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only staff can view all records");
    };
    academicRecordsStore.values().toArray().sort<AcademicRecord>();
  };

  public query ({ caller }) func getStudentRecord(studentId : Text) : async AcademicRecord {
    if (not canAccessStudentRecord(caller, studentId)) {
      Runtime.trap("Unauthorized: You can only view your own record or you must be staff");
    };
    switch (academicRecordsStore.get(studentId)) {
      case (?record) { record };
      case (null) { Runtime.trap("Student record not found") };
    };
  };

  public query ({ caller }) func getOwnRecord() : async AcademicRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access records");
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

  public query ({ caller }) func getSubjectsByDepartment(department : Text) : async [Subject] {
    let records = academicRecordsStore.values().toArray();
    let subjectsList = records.foldLeft(
      [] : [Subject],
      func(acc, record) { acc.concat(record.subjects) },
    );
    subjectsList.filter(func(s) { s.department == department }).sort<Subject>();
  };

  public query ({ caller }) func getAttendanceByStudent(studentId : Text) : async [Attendance] {
    if (not canAccessStudentRecord(caller, studentId)) {
      Runtime.trap("Unauthorized: You can only view your own attendance or you must be staff");
    };
    switch (academicRecordsStore.get(studentId)) {
      case (?record) { record.attendance.sort<Attendance>() };
      case (null) { Runtime.trap("Student record not found") };
    };
  };

  public query ({ caller }) func getMarksByStudent(studentId : Text) : async [Marks] {
    if (not canAccessStudentRecord(caller, studentId)) {
      Runtime.trap("Unauthorized: You can only view your own marks or you must be staff");
    };
    switch (academicRecordsStore.get(studentId)) {
      case (?record) { record.marks.sort<Marks>() };
      case (null) { Runtime.trap("Student record not found") };
    };
  };

  public query ({ caller }) func getExamTimetableByDepartment(department : Text) : async [Exam] {
    let records = academicRecordsStore.values().toArray();
    let examsList = records.foldLeft(
      [] : [Exam],
      func(acc, record) { acc.concat(record.exams) },
    );
    examsList.filter(func(e) { e.subjectId == department }).sort<Exam>();
  };

  public query ({ caller }) func getFeesDueByStudent(studentId : Text) : async [FeesDue] {
    if (not canAccessStudentRecord(caller, studentId)) {
      Runtime.trap("Unauthorized: You can only view your own fees or you must be staff");
    };
    switch (academicRecordsStore.get(studentId)) {
      case (?record) { record.feesDue.sort<FeesDue>() };
      case (null) { Runtime.trap("Student record not found") };
    };
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
      subjects = subjectsList.filter(func(s) { s.department == department }).sort<Subject>();
    };
  };

  let faqEntries : [FAQEntry] = [
    {
      keywords = ["admissions", "admission process"];
      response = "The admission process for SNGCE includes submitting an application form, entrance exam (if applicable), followed by a personal interview.";
    },
    {
      keywords = ["fees", "fee structure"];
      response = "Fee structure varies by course. Check the 'Fees Structure' section for detailed breakdown.";
    },
    {
      keywords = ["contact", "contact information"];
      response = "You can contact SNGCE at: Phone: 0484-2597800 (30 Lines), Email: info@sngce.ac.in";
    },
  ];

  public query ({ caller }) func getFAQEntries() : async [FAQEntry] {
    faqEntries.sort<FAQEntry>();
  };

  public query ({ caller }) func getChatbotResponse(message : Text) : async Text {
    let normalizedMessage = normalize(message);
    func findFaqEntry(faq : FAQEntry) : Bool {
      func keywordMatches(keyword : Text) : Bool {
        contains(normalize(normalizedMessage), normalize(keyword));
      };
      switch (faq.keywords.find(keywordMatches)) {
        case (?_) { true };
        case (null) { false };
      };
    };
    switch (faqEntries.find(findFaqEntry)) {
      case (?entry) { entry.response };
      case (null) {
        "Sorry, I didn't understand your question. Please try using different keywords or ask a specific query related to SNGCE.";
      };
    };
  };
};
