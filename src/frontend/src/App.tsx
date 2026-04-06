import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdmissionsPage } from "./pages/AdmissionsPage";
import { ClassifiedPage } from "./pages/ClassifiedPage";
import { CoursesPage } from "./pages/CoursesPage";
import { FacultyPage } from "./pages/FacultyPage";
import { FeesPage } from "./pages/FeesPage";
import { HomePage } from "./pages/HomePage";
import { KTUPage } from "./pages/KTUPage";
import { LoginPage } from "./pages/LoginPage";
import { PlacementsPage } from "./pages/PlacementsPage";
import { SplashPage } from "./pages/SplashPage";
import { StaffDashboard } from "./pages/StaffDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";

const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <ThemeProvider>
        <Outlet />
        <Toaster richColors />
      </ThemeProvider>
    </AuthProvider>
  ),
});

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SplashPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/home",
  component: HomePage,
});

const coursesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/courses",
  component: CoursesPage,
});

const feesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/fees",
  component: FeesPage,
});

const facultyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/faculty",
  component: FacultyPage,
});

const ktuRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/ktu",
  component: KTUPage,
});

const placementsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/placements",
  component: PlacementsPage,
});

const admissionsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/admissions",
  component: AdmissionsPage,
});

const loginRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/login",
  component: LoginPage,
});

const studentDashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/student-dashboard",
  component: StudentDashboard,
});

const staffDashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/staff-dashboard",
  component: StaffDashboard,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/admin-dashboard",
  component: AdminDashboard,
});

const classifiedRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/classified",
  component: ClassifiedPage,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  layoutRoute.addChildren([
    homeRoute,
    coursesRoute,
    feesRoute,
    facultyRoute,
    ktuRoute,
    placementsRoute,
    admissionsRoute,
    loginRoute,
    studentDashboardRoute,
    staffDashboardRoute,
    adminDashboardRoute,
    classifiedRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
