import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/nav.module.css";

export default function Nav({ links, header, position, type, chapterSlug }) {
  const [navCollapse, setNavCollapse] = useState("open");

  const handleClick = (e) => {
    e.preventDefault();
    const state = navCollapse == "open" ? "closed" : "open";
    setNavCollapse(state);
  };

  const sideLinks = links
    .filter((link) => {
      return type == "compareNav" && link.chapterSlug == chapterSlug
        ? false
        : true;
    })
    .map((link) => {
      switch (type) {
        case "chapterNav":
          return (
            <ChapterLink
              key={link.chapterSlug}
              slug={link.chapterSlug}
              title={link.title}
            />
          );
        case "sectionNav":
          return (
            <SectionLink
              key={link.chapterSlug}
              slug={link.slug}
              title={link.title}
            />
          );
        case "versionNav":
          return (
            <VersionLink
              key={link.chapterSlug}
              slug={link.slug}
              title={link.title}
              version={link.version}
            />
          );
        case "compareNav":
          return (
            <CompareLink
              key={link.chapterSlug}
              slug={link.chapterSlug}
              title={link.title}
              chapterSlug={chapterSlug}
            />
          );
        default:
          break;
      }
    });

  return (
    <div className={styles.navContainer}>
      <NavHeader
        position={position}
        isCollapsed={navCollapse == "closed" ? true : false}
        handleClick={handleClick}
      >
        {header}
      </NavHeader>
      <nav className={`${styles.nav} ${styles[navCollapse]}`}>
        <ul className={`${styles.menu} ${styles.menuLink} ${styles[position]}`}>
          {sideLinks}
        </ul>
      </nav>
    </div>
  );
}

function ChapterLink({ title, slug }) {
  return (
    <Link href={`/${slug}`}>
      <a>{title}</a>
    </Link>
  );
}

function SectionLink({ title, slug }) {
  return <a href={`#${slug}`}>{title}</a>;
}

function VersionLink({ title, slug, version }) {
  return (
    <Link href={`/${slug}`}>
      <a>
        {title}
        {version == "current" ? `[current]` : ``}
      </a>
    </Link>
  );
}

function CompareLink({ title, slug, chapterSlug }) {
  return (
    <Link href={`/compare/${chapterSlug}/${slug}`}>
      <a>{title}</a>
    </Link>
  );
}

function NavHeader({ position, isCollapsed, children, handleClick }) {
  const navCollapsed = isCollapsed ? "closed" : "open";
  return (
    <h3 className={`${styles.header} ${styles[position]}`} onClick={handleClick}>
      {position == `left` && <CollapseIcon isCollapsed={isCollapsed} />}
      {children}
      {position == `right` && <CollapseIcon isCollapsed={isCollapsed} />}
    </h3>
  );
}

function CollapseIcon({ isCollapsed }) {
  return (
    <span className={styles.collapseIcon}>{isCollapsed ? ` + ` : ` - `}</span>
  );
}
