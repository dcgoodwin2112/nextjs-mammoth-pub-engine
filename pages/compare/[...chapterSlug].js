import Layout from "../../components/layout";
import Nav from "../../components/nav";
import {
  getChapterContent,
  getCompareChapterSlugs,
  getChapterNavLinks,
} from "../../lib/chapters.js";

export default function ChapterCompare({
  chapter1,
  chapter2,
  chapter3,
  navLinks,
  chapterSlug,
}) {
  return (
    <Layout compareGrid={true} backSlug={chapterSlug[0]}>
      <div dangerouslySetInnerHTML={chapter1.html} />
      {chapter2 && <div dangerouslySetInnerHTML={chapter2.html} />}
      {!chapter3 ? (
        <Nav
          links={navLinks}
          header="Compare Another"
          position="left"
          type="compareThirdNav"
          chapterSlug={chapter1.slug}
          chapterSlug2={chapter2.slug}
        />
      ) : (
        <div dangerouslySetInnerHTML={chapter3.html} />
      )}
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const navLinks = getChapterNavLinks();
  const chapter1 = params.chapterSlug[0]
    ? await getChapterContent(params.chapterSlug[0])
    : ``;
  const chapter2 = params.chapterSlug[1]
    ? await getChapterContent(params.chapterSlug[1])
    : ``;
  const chapter3 = params.chapterSlug[2]
    ? await getChapterContent(params.chapterSlug[2])
    : ``;
  return {
    props: {
      chapterSlug: params.chapterSlug,
      navLinks: navLinks,
      chapter1: chapter1,
      chapter2: chapter2,
      chapter3: chapter3,
    },
  };
}

export async function getStaticPaths() {
  const paths = getCompareChapterSlugs();
  return {
    paths,
    fallback: false,
  };
}
