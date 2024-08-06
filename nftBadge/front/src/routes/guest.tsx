import RootPage from "@/pages/RootPage";
import { PATHS } from "@/routes/paths";
import { Outlet } from "react-router-dom";

export const guestRoutes = [
  {
    element: <Outlet />,
    children: [
      {
        path: PATHS.ROOT,
        element: <RootPage />,
      },
    ],
  },
];
