import JSZip from "jszip";

import appTsx from "../App.tsx?raw";
import backendDts from "../backend.d.ts?raw";
import backendTs from "../backend.ts?raw";
import chatbotWidgetTsx from "../components/ChatbotWidget.tsx?raw";
import layoutTsx from "../components/Layout.tsx?raw";
import navbarTsx from "../components/Navbar.tsx?raw";
import configTs from "../config.ts?raw";
import authContextTsx from "../contexts/AuthContext.tsx?raw";
import themeContextTsx from "../contexts/ThemeContext.tsx?raw";
import useMobileTsx from "../hooks/use-mobile.tsx?raw";
import useActorTs from "../hooks/useActor.ts?raw";
import useQueriesTs from "../hooks/useQueries.ts?raw";
import indexCss from "../index.css?raw";
import libUtilsTs from "../lib/utils.ts?raw";
import mainTsx from "../main.tsx?raw";
import adminDashboardTsx from "../pages/AdminDashboard.tsx?raw";
import classifiedPageTsx from "../pages/ClassifiedPage.tsx?raw";
import coursesPageTsx from "../pages/CoursesPage.tsx?raw";
import facultyPageTsx from "../pages/FacultyPage.tsx?raw";
import feesPageTsx from "../pages/FeesPage.tsx?raw";
import homePageTsx from "../pages/HomePage.tsx?raw";
import loginPageTsx from "../pages/LoginPage.tsx?raw";
import splashPageTsx from "../pages/SplashPage.tsx?raw";
import staffDashboardTsx from "../pages/StaffDashboard.tsx?raw";
import studentDashboardTsx from "../pages/StudentDashboard.tsx?raw";
import chatEngineTsx from "./chatEngine.ts?raw";
import geminiApiTs from "./geminiApi.ts?raw";
import groqApiTs from "./groqApi.ts?raw";
import pollinationsApiTs from "./pollinationsApi.ts?raw";

const BACKEND_MAIN_MO = `import Array "mo:core/Array";
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

  public query ({ caller }) func getStudentRecord(studentId : Text) : async AcademicRecord {
    if (not canAccessStudentRecord(caller, studentId)) {
      Runtime.trap("Unauthorized");
    };
    switch (academicRecordsStore.get(studentId)) {
      case (?record) { record };
      case (null) { Runtime.trap("Student record not found") };
    };
  };
};
`;

const BACKEND_ACCESS_CONTROL_MO = `import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  public func initState() : AccessControlState {
    {
      var adminAssigned = false;
      userRoles = Map.empty<Principal, UserRole>();
    };
  };

  public func initialize(state : AccessControlState, caller : Principal, adminToken : Text, userProvidedToken : Text) {
    if (caller.isAnonymous()) { return };
    switch (state.userRoles.get(caller)) {
      case (?_) {};
      case (null) {
        if (not state.adminAssigned and userProvidedToken == adminToken) {
          state.userRoles.add(caller, #admin);
          state.adminAssigned := true;
        } else {
          state.userRoles.add(caller, #user);
        };
      };
    };
  };

  public func isAdmin(state : AccessControlState, caller : Principal) : Bool {
    switch (state.userRoles.get(caller)) {
      case (?(#admin)) { true };
      case (_) { false };
    };
  };

  public func hasPermission(state : AccessControlState, caller : Principal, requiredRole : UserRole) : Bool {
    let userRole = switch (state.userRoles.get(caller)) {
      case (?role) { role };
      case (null) { #guest };
    };
    if (userRole == #admin or requiredRole == #guest) { true } else {
      userRole == requiredRole;
    };
  };

  public func getUserRole(state : AccessControlState, caller : Principal) : UserRole {
    if (caller.isAnonymous()) { return #guest };
    switch (state.userRoles.get(caller)) {
      case (?role) { role };
      case (null) { Runtime.trap("User is not registered") };
    };
  };

  public func assignRole(state : AccessControlState, caller : Principal, user : Principal, role : UserRole) {
    if (not isAdmin(state, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign user roles");
    };
    state.userRoles.add(user, role);
  };
};
`;

const BACKEND_MIXIN_AUTHORIZATION_MO = `import AccessControl "./access-control";
import Prim "mo:prim";
import Runtime "mo:core/Runtime";

mixin (accessControlState : AccessControl.AccessControlState) {
  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) {
        Runtime.trap("CAFFEINE_ADMIN_TOKEN environment variable is not set");
      };
      case (?adminToken) {
        AccessControl.initialize(accessControlState, caller, adminToken, userSecret);
      };
    };
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
`;

export async function downloadSourceCodeZip(): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder("SNGCE_Source_Code")!;

  const backend = root.folder("backend")!;
  backend.file("main.mo", BACKEND_MAIN_MO);
  const auth = backend.folder("authorization")!;
  auth.file("access-control.mo", BACKEND_ACCESS_CONTROL_MO);
  auth.file("MixinAuthorization.mo", BACKEND_MIXIN_AUTHORIZATION_MO);

  const frontend = root.folder("frontend")!;
  frontend.file("index.css", indexCss);

  const src = frontend.folder("src")!;
  src.file("main.tsx", mainTsx);
  src.file("App.tsx", appTsx);
  src.file("index.css", indexCss);
  src.file("config.ts", configTs);
  src.file("backend.d.ts", backendDts);
  src.file("backend.ts", backendTs);

  const contexts = src.folder("contexts")!;
  contexts.file("AuthContext.tsx", authContextTsx);
  contexts.file("ThemeContext.tsx", themeContextTsx);

  const pages = src.folder("pages")!;
  pages.file("HomePage.tsx", homePageTsx);
  pages.file("LoginPage.tsx", loginPageTsx);
  pages.file("SplashPage.tsx", splashPageTsx);
  pages.file("StudentDashboard.tsx", studentDashboardTsx);
  pages.file("StaffDashboard.tsx", staffDashboardTsx);
  pages.file("AdminDashboard.tsx", adminDashboardTsx);
  pages.file("CoursesPage.tsx", coursesPageTsx);
  pages.file("FeesPage.tsx", feesPageTsx);
  pages.file("FacultyPage.tsx", facultyPageTsx);
  pages.file("ClassifiedPage.tsx", classifiedPageTsx);

  const components = src.folder("components")!;
  components.file("ChatbotWidget.tsx", chatbotWidgetTsx);
  components.file("Navbar.tsx", navbarTsx);
  components.file("Layout.tsx", layoutTsx);

  const hooks = src.folder("hooks")!;
  hooks.file("useActor.ts", useActorTs);
  hooks.file("useQueries.ts", useQueriesTs);
  hooks.file("use-mobile.tsx", useMobileTsx);

  const utils = src.folder("utils")!;
  utils.file("groqApi.ts", groqApiTs);
  utils.file("chatEngine.ts", chatEngineTsx);
  utils.file("geminiApi.ts", geminiApiTs);
  utils.file("pollinationsApi.ts", pollinationsApiTs);

  const lib = src.folder("lib")!;
  lib.file("utils.ts", libUtilsTs);

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "SNGCE_Source_Code.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
