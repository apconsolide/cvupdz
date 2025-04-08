import { lazy, Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import RoleBasedRoute from "./components/layout/RoleBasedRoute";
import RequireAuth from "./components/auth/RequireAuth";
import Login from "./pages/Login";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Training = lazy(() => import("./pages/Training"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminTrainingSessions = lazy(
  () => import("./pages/AdminTrainingSessions"),
);
const SessionManagement = lazy(() => import("./pages/SessionManagement"));
const ChromeExtension = lazy(() => import("./pages/ChromeExtension"));
const CVBuilder = lazy(() => import("./pages/CVBuilder"));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep"));
const LinkedInEnhancement = lazy(() => import("./pages/LinkedInEnhancement"));
const DesignSystemPage = lazy(() => import("./pages/DesignSystemPage"));

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center bg-cvup-blue">
            <div className="text-cvup-gold text-xl">Loading...</div>
          </div>
        }
      >
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/training"
              element={
                <RequireAuth>
                  <Training />
                </RequireAuth>
              }
            />

            {/* Routes that require supervisor or admin permissions */}
            <Route
              element={
                <RoleBasedRoute requiredPermission="canManageTrainingSessions" />
              }
            >
              <Route
                path="/session-management"
                element={<SessionManagement />}
              />
            </Route>

            <Route
              path="/chrome-extension"
              element={
                <RequireAuth>
                  <ChromeExtension />
                </RequireAuth>
              }
            />
            <Route
              path="/cv-builder"
              element={
                <RequireAuth>
                  <CVBuilder />
                </RequireAuth>
              }
            />
            <Route
              path="/interview-prep"
              element={
                <RequireAuth>
                  <InterviewPrep />
                </RequireAuth>
              }
            />
            <Route
              path="/linkedin"
              element={
                <RequireAuth>
                  <LinkedInEnhancement />
                </RequireAuth>
              }
            />

            {/* Admin-only routes */}
            <Route
              element={
                <RoleBasedRoute requiredPermission="canAccessAdminPanel" />
              }
            >
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route
                path="/admin/training-sessions"
                element={<AdminTrainingSessions />}
              />
              <Route path="/design-system" element={<DesignSystemPage />} />
            </Route>

            {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
          </Routes>
          {import.meta.env.VITE_TEMPO && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
