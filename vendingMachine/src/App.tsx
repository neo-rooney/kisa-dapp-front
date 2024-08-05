import { MetamaskConnector } from "@/components/MetamaskConnector";
import styles from "./App.module.css";
import { WalletContextProvider } from "@/contexts/WalletContext/WalletContext";

function App() {
  return (
    <WalletContextProvider>
      <main className={styles.container}>
        <MetamaskConnector />
      </main>
    </WalletContextProvider>
  );
}

export default App;
