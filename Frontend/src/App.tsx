import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks.ts";
import { checkAuth } from "./features/auth/authSlice.ts";
import { RouterProvider } from "react-router-dom";
import Router from "./routes/routes.tsx";
import { HashLoader } from "react-spinners";
function App() {
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  if (isLoading) {
    return (
      <HashLoader
        size={90}
        color="#1149ec"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }
  return <RouterProvider router={Router}></RouterProvider>;

  // return (
  //   <>
  //     {/* <DashboardLayout /> */}

  //     <AdminDashboard />
  //   </>
  // );
}

export default App;
