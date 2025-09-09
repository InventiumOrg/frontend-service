/* eslint-disable react-refresh/only-export-components */
import paths, { rootPaths } from "./paths";
import { Suspense, lazy } from "react";
import { Outlet, createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "layouts/main-layout";
import Splash from "components/loader/Splash";
import PageLoader from "components/loader/PageLoader";
import AuthLayout from "layouts/auth-layout";
import { useAuth, useClerk } from "@clerk/clerk-react";

const App = lazy(() => import("App"));
const Dashboard = lazy(() => import("pages/dashboard/Dashboard"));
const Signin = lazy(() => import("pages/authentication/Signin"));
const Signup = lazy(() => import("pages/authentication/Signup"));
const Inventory = lazy(() => import("pages/inventory/Main"));
const Catelogue = lazy(() => import("pages/inventory/Catelogue"));

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const clerk = useClerk();
  if (!isLoaded) {
    return <PageLoader />;
  }

  if (!isSignedIn) {
    clerk.redirectToSignIn();
    return null;
  }

  return <>{children}</>;
};

// Public Route wrapper component (for auth pages)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <PageLoader />;
  }

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: "/",
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              index: true,
              element: <Dashboard />
            },
            {
              path: "/inventory/explore",
              index: true,
              element: <Inventory />
            },
            {
              path: "/inventory/catelogue",
              index: true,
              element: <Catelogue/>
            },
          ],
        },
        {
          path: rootPaths.authRoot,
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            {
              path: paths.signin,
              element: <Signin />,
            },
            {
              path: paths.signup,
              element: <Signup />,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: "/inventium",
  },
);

export default router;
