import Layout from "../components/layout";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { getChapterNavLinks } from "../lib/chapters";

export default function Home({ links }) {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>
      <div></div>
      <div className={styles.chapters}>
        <h2>Available Chapters</h2>
        <ul>
          {links.map((link) => {
            return (
              <li key={link.chapterSlug}>
                <a href={`/${link.chapterSlug}`}>{link.title}</a>
              </li>
            );
          })}
        </ul>
      </div>
      <div></div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const links = getChapterNavLinks();
  return {
    props: {
      links: links,
    },
  };
}
