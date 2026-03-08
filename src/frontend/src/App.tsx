import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ClassifiedPage } from "./pages/ClassifiedPage";
import { CoursesPage } from "./pages/CoursesPage";
import { FacultyPage } from "./pages/FacultyPage";
import { FeesPage } from "./pages/FeesPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SplashPage } from "./pages/SplashPage";
import { StaffDashboard } from "./pages/StaffDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";

// Root route
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

// Splash
const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SplashPage,
});

// Layout route (wraps pages with navbar + chatbot)
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

// Home
const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/home",
  component: HomePage,
});

// Courses
const coursesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/courses",
  component: CoursesPage,
});

// Fees
const feesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/fees",
  component: FeesPage,
});

// Faculty
const facultyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/faculty",
  component: FacultyPage,
});

// Login
const loginRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/login",
  component: LoginPage,
});

// Student dashboard
const studentDashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/student-dashboard",
  component: StudentDashboard,
});

// Staff dashboard
const staffDashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/staff-dashboard",
  component: StaffDashboard,
});

// Admin dashboard
const adminDashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/admin-dashboard",
  component: AdminDashboard,
});

// Classified page
const classifiedRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/classified",
  component: ClassifiedPage,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  splashRoute,
  layoutRoute.addChildren([
    homeRoute,
    coursesRoute,
    feesRoute,
    facultyRoute,
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
