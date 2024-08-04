import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { marked } from "marked";
import FloatingNav from "@/app/components/FloatingNav";
import { Session } from "next-auth";
import getAuthSession from "@/app/utils/getAuthSession";
import themeColors from "@/app/utils/themeColors";
import formatDate from "@/app/utils/formatDate";
import { WavyBackground } from "./components/WavyBackground";

export default async function Home() {
  const session: Session | null = await getAuthSession();
  const posts = getPosts();

  return (
    <WavyBackground className={`min-h-screen text-gray-900 dark:text-gray-200`}>
      <FloatingNav session={session} />
      <header className="text-center pt-8">
        <Logo />
      </header>
      <main className="container mx-auto px-4 py-8 pb-24 sm:pb-28">
        <section>
          {posts.map((post) => (
            <BlogPreview
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              slug={post.slug}
              date={post.date}
            />
          ))}
        </section>
      </main>
    </WavyBackground>
  );
}

function getPosts() {
  const postsDirectory = path.join(process.cwd(), "public/posts");
  const filenames = fs.readdirSync(postsDirectory).reverse();

  return filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ""),
      title: data.title,
      excerpt: content.substring(0, 300) + "...",
      date: data.date,
    };
  });
}

const Logo = () => {
  return (
    <div className="inline-flex items-center space-x-2">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
        Anthony Umbriac&lsquo;s Blog
      </h1>
    </div>
  );
};

type BlogPreviewProps = {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
};

const BlogPreview = ({ title, excerpt, slug, date }: BlogPreviewProps) => {
  return (
    <Link href={`/posts/${slug}`}>
      <article
        className={`bg-white ${themeColors.fgColor} p-4 shadow-sm rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer mb-6 relative`}
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
          {formatDate(date)}
        </p>
        <div
          className="text-lg sm:text-base text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: marked(excerpt) }}
        />
      </article>
    </Link>
  );
};
