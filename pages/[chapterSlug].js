import Head from "next/head";
import Link from "next/link";
import Nav from "../components/nav";
import {
  getChapterSlugs,
  getChapterNavLinks,
  getChapterContent,
} from "../lib/chapters";

export default function chapter({ html, navLinks, prev, next }) {
  return (
    <div className="container">
      <Nav navLinks={navLinks} />
      <div className="content-container" dangerouslySetInnerHTML={html} />
      {prev && (
        <Link href={`/${prev}`}>
          <a>Prev</a>
        </Link>
      )}
      {next && (
        <Link href={`/${next}`}>
          <a>Next</a>
        </Link>
      )}
    </div>
  );
}

export async function getStaticProps({ params }) {
  const content = await getChapterContent(params);
  const navLinks = getChapterNavLinks();
  return {
    props: {
      ...content,
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
