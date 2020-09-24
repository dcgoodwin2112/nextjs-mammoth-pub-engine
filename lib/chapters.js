import path from "path";
import mammoth from "mammoth";
import slugify from "slugify";
import glob from "glob";

export function getChapterSlugs() {
  return glob
    .sync(`docs/**/*.docx`)
    .filter((fn) => !fn.includes(`~$`))
    .map((fn) => {
      const parts = fn.split(`/`);
      return {
        params: {
          chapterSlug: getSlug(parts.pop()),
        },
      };
    });
}

export function getCompareChapterSlugs() {
  const compareSlugs = glob
    .sync(`docs/**/*.docx`)
    .filter((fn) => !fn.includes(`/~$`))
    .map((fn) => {
      const parts = fn.split(`/`);
      return getSlug(parts.pop());
    });
  const compareSlugArray = [];
  for (let i = 0; i < compareSlugs.length; i++) {
    for (let j = 0; j < compareSlugs.length; j++) {
      if (i != j) {
        const result = [compareSlugs[i], compareSlugs[j]];
        compareSlugArray.push({ params: { chapterSlug: result } });
      }
    }
  }
  for (let i = 0; i < compareSlugs.length; i++) {
    for (let j = 0; j < compareSlugs.length; j++) {
      for (let k = 0; k < compareSlugs.length; k++) {
        let result = [i, j, k];
        if (new Set(result).size == 3) {
          result = [compareSlugs[i], compareSlugs[j], compareSlugs[k]];
          compareSlugArray.push({ params: { chapterSlug: result } });
        }
      }
    }
  }
  return compareSlugArray;
}

export function getChapterNavLinks() {
  const files = getChapterMetadata();
  return files
    .filter((chapter) => !chapter.isPrevVersion)
    .map((chapter) => {
      return {
        title: removeDocx(chapter.title),
        chapterSlug: getSlug(chapter.slug),
      };
    });
}

export async function getChapterContent(chapterSlug) {
  const chapterMeta = getChapterMetadata();
  const chapter = chapterMeta.find((chapter) => chapter.slug == chapterSlug);
  const options = {
    styleMap: [
      `p[style-name='Subtitle'] => h2.section-title`,
      `u => em.underline`
  ],
  };
  const html = await mammoth.convertToHtml({ path: chapter.filePath }, options);
  const sectionsMatch = [
    ...html.value.matchAll(/<h2 class="section-title">[^<>]*<\/h2>/g),
  ];
  const sections = sectionsMatch.map((section, idx) => {
    const title = section[0]
      .replace(`<h2 class="section-title">`, ``)
      .replace(`</h2>`, ``);
    const slug = `${idx}-${getSlug(title)}`;
    html.value = html.value.replace(
      section[0],
      section[0].replace(`<h2 class`, `<h2 id="${slug}" class`)
    );
    return {
      slug: slug,
      title: title,
    };
  });
  chapter.sections = sections ? sections : ``;
  chapter.html = {
    __html: html.value,
  };
  return chapter;
}

export function getChapterMetadata() {
  const files = getChapterFiles();
  return (
    files
      // Parse chapter metadata from file name and path.
      .map((fp) => {
        const parts = fp.split(`/`);
        const fileName = parts.pop();
        const title = removeDocx(fileName);
        const slug = getSlug(fileName);
        const isPrevVersion = fp.includes(`previous_version`);
        // Match chapter number string in file path.
        const chapterMatch = fp.match(/Chapter\s[0-9]{1,6}/);
        const chapter = chapterMatch
          ? chapterMatch.pop().replace(`Chapter `, ``)
          : ``;
        // Match date string in file path.
        const dateMatch = fileName.match(
          /\[[0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2}\]/
        );
        const version = dateMatch
          ? dateMatch.pop().replace(`[`, ``).replace(`]`, ``)
          : `current`;
        return {
          filePath: fp,
          fileName: fileName,
          title: title,
          slug: slug,
          isPrevVersion: isPrevVersion,
          chapter: chapter,
          version: version,
        };
      })
      // sort by chapter number
      .sort((c1, c2) => c1.chapter - c2.chapter)
      // Find prev and next chapters for current chapter.
      .map((chapter, idx, array) => {
        // Find the closest prev chapter that is a current version.
        let prev = ``;
        for (let i = idx - 1; i >= 0; i--) {
          if (array[i].chapter < chapter.chapter && !array[i].isPrevVersion) {
            prev = array[i].slug;
            break;
          }
        }
        chapter.prev = prev;

        // Find the closest next chapter that is a current version.
        let next = ``;
        for (let i = idx + 1; i < array.length; i++) {
          if (array[i].chapter > chapter.chapter && !array[i].isPrevVersion) {
            next = array[i].slug;
            break;
          }
        }
        chapter.next = next;
        return chapter;
        // Find other versions of same chapter
      })
      .map((chapter, idx, array) => {
        chapter.versions = array
          .map((c, i, a) => {
            if (idx != i && chapter.chapter == c.chapter) {
              return {
                title: c.title,
                slug: c.slug,
                version: c.version,
              };
            }
          })
          .filter((versions) => versions !== undefined);
        return chapter;
      })
  );
}

//Utility functions
function removeDocx(fn) {
  return fn.replace(/\.docx/, ``);
}

function getSlug(fn) {
  return slugify(removeDocx(fn), { lower: true });
}

function getChapterFiles() {
  const docDir = path.join(process.cwd(), `docs`);
  return glob.sync(`${docDir}/**/*.docx`).filter((fp) => !fp.includes(`/~$`));
}
