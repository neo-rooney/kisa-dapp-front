import { WalletContextProvider } from "@/contexts/WalletContext/WalletContext";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";

function App() {
  return (
    <WalletContextProvider>
      <RouterProvider router={router} />
    </WalletContextProvider>
  );
}

export default App;
