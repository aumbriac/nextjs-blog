import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { NextResponse } from "next/server";

export function GET(_, { params }) {
  const { slug } = params;

  const postsDirectory = path.join(process.cwd(), "public/posts");
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const post = {
    frontmatter: data,
    content: marked(content),
  };

  return NextResponse.json(post);
}
