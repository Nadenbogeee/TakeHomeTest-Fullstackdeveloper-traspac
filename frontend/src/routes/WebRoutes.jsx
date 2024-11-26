import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const WebRoutes = () => {
  const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
  const RegisterPage = lazy(() => import("../pages/Login/RegisterPage"));
  const UploadImagePage = lazy(() => import("../pages/UploadImagePage"));
  const MainPage = lazy(() => import("../pages/MainPage"));

  return (
    <>
      <Routes>
        <Route
          element={
            <Suspense fallback="Please wait a sec">
              <LoginPage />
            </Suspense>
          }
          path="/"
        />
        <Route
          element={
            <Suspense fallback="Please wait a sec">
              <RegisterPage />
            </Suspense>
          }
          path="/register"
        />
        <Route
          element={
            <Suspense fallback="Please wait a sec">
              <UploadImagePage />
            </Suspense>
          }
          path="/add-image"
        />
        <Route
          element={
            <Suspense fallback="Please wait a sec">
              <MainPage />
            </Suspense>
          }
          path="/mainpage"
        />
      </Routes>
    </>
  );
};

export default WebRoutes;
