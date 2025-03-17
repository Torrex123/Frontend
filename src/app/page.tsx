import styles from "./page.module.css";
import Link from "next/link";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar/>
    </div>
  );
}
