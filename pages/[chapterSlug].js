import {useEffect, useState} from 'react';
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import Nav from "../components/nav";
import {
  getChapterSlugs,
  getChapterNavLinks,
  getChapterContent,
} from "../lib/chapters";
import styles from "../styles/[chapterSlug].module.css";

export default function chapter({
  html,
  title,
  navLinks,
  sections,
  versions,
  chapterSlug,
  prev,
  next,
}) {

  const [navPos, setNavPos] = useState("navTop");

  useEffect(() => {
    window.addEventListener("scroll", (e) => {
      window.scrollY >= 25
        ? setNavPos("navScroll")
        : setNavPos("navTop");
    });
  }, []);
  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="lgrid">
        <div className={`${styles[navPos]}`}>
          <Nav
            links={navLinks}
            header="Chapters"
            position="right"
            type="chapterNav"
            chapterSlug={chapterSlug}
          />
          {versions.length != 0 && (
            <Nav
              links={versions}
              header="Versions"
              position="right"
              type="versionNav"
              chapterSlug={chapterSlug}
            />
          )}
        </div>
      </div>
      <div className={styles.content} dangerouslySetInnerHTML={html} />
      <div className="rgrid">
        <div className={`${styles[navPos]}`}>
          <Nav
            links={sections}
            header="Sections"
            position="left"
            type="sectionNav"
            chapterSlug={chapterSlug}
          />
          <Nav
            links={navLinks}
            header="Compare"
            position="left"
            type="compareNav"
            chapterSlug={chapterSlug}
          />
        </div>
      </div>
      {prev && (
        <div className={`${styles.prevNext} ${styles.prev}`}>
          <Link href={`/${prev}`}>
            <a>Prev</a>
          </Link>
        </div>
      )}
      {next && (
        <div className={`${styles.prevNext} ${styles.next}`}>
          <Link href={`/${next}`}>
            <a>Next</a>
          </Link>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const content = await getChapterContent(params.chapterSlug);
  const navLinks = getChapterNavLinks();
  return {
    props: {
      ...content,
      chapterSlug: params.chapterSlug,
      navLinks: navLinks,
    },
  };
}

export async function getStaticPaths() {
  const paths = getChapterSlugs();
  return {
    paths,
    fallback: false,
  };
}
