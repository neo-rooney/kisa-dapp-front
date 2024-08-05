import { Outlet } from "react-router-dom";
import { PATHS } from "./paths";
import VendingMachinePage from "@/pages/VedingMachine";

export const authRoutes = [
  {
    element: <Outlet />,
    children: [
      {
        path: PATHS.VENDING,
        element: <VendingMachinePage />,
      },
    ],
  },
];
