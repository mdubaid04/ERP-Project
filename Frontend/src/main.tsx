import { createRoot } from "react-dom/client";
import Router from "./routes/routes.tsx";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Provider } from "react-redux";
import store from "./app/store";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Toaster position="top-right" />
    <RouterProvider router={Router}></RouterProvider>
  </Provider>,
);
