import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import VerifyOtp from "../pages/auth/VerifyOtp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtp />,
      },
    ],
  },
]);

export default router;
