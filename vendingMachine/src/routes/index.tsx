import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth";
import { guestRoutes } from "./guest";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  ...guestRoutes,
  ...authRoutes,
  { path: "*", element: <NotFoundPage /> },
]);
