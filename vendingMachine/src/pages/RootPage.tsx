import { MetamaskConnector } from "@/components/MetamaskConnector";
import styles from "./RootPage.module.css";

const RootPage = () => {
  return (
    <main className={styles.container}>
      <MetamaskConnector />
    </main>
  );
};

export default RootPage;
