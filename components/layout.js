import { useEffect, useState } from "react";
import Link from 'next/link'
import styles from "../styles/layout.module.css";

function Layout({ backSlug, compareGrid, children }) {
  const [headerPos, setHeaderPos] = useState("headerTop");

  useEffect(() => {
    window.addEventListener("scroll", (e) => {
      window.scrollY >= 85 ? setHeaderPos("headerScroll") : setHeaderPos("headerTop");
    });
  }, []);

  const gridStyles = (compareGrid) ? `${styles.grid} ${styles.compareGrid}` : styles.grid;

  return (
    <div className={styles.layout}>
      <header className={`${styles.header} ${styles[headerPos]}`} role="banner">
        { backSlug &&
          <BackButton backSlug={backSlug} headerPos={headerPos} />
        }
        <h1 className={styles.siteName}>
          <em>NC</em> Rh<span className={styles.gold}>y</span>mes
        </h1>
      </header>
      <div className={gridStyles}>{children}</div>
      <footer className={styles.footer}>
        &copy; NC Rhymes {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default Layout;

function BackButton({backSlug, headerPos}) {
  return (
    <Link href={`/${backSlug}`}><a className={`${styles.backButton} ${(headerPos == 'headerScroll' ? styles.backButtonScroll : '')}`}>Back to Chapter</a></Link>
  );
}
