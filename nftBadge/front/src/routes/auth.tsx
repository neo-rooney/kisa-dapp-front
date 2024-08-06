import { Outlet } from "react-router-dom";
import { PATHS } from "./paths";
import VendingMachinePage from "@/pages/VedingMachine";
import AdminPage from "@/pages/AdminPage";

export const authRoutes = [
  {
    element: <Outlet />,
    children: [
      {
        path: PATHS.VENDING,
        element: <VendingMachinePage />,
      },
      {
        path: PATHS.ADMIN,
        element: <AdminPage />,
      },
    ],
  },
];
