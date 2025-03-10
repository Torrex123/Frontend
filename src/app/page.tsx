import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
       <nav className={styles.navigation}>
          <img src="/Avicol.png" alt="logo" style={{ width: '240px', cursor: 'pointer' }} />
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/">Playground</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/">Challenges</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/">Literature</Link>
            </li>
          </ul>
        </nav>
    </div>
  );
}
