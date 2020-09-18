import Link from "next/link";

export default function Nav({ navLinks }) {
  const links = navLinks.map((link) => {
    return (
      <li>
        <Link href={`/${link.chapterSlug}`}>
          <a>{link.title}</a>
        </Link>
      </li>
    );
  });
  return (
    <nav>
      <ul>{links}</ul>
    </nav>
  );
}
