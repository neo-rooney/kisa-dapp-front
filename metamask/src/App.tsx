import { MetamaskConnector } from "@/components/MetamaskConnector";
import styles from "./App.module.css";

function App() {
  return (
    <main className={styles.container}>
      <MetamaskConnector />
    </main>
  );
}

export default App;
