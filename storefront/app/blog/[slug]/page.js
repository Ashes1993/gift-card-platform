import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import Markdown from "react-markdown"; // <--- CHANGED
import remarkGfm from "remark-gfm"; // <--- CHANGED
import { Calendar, User, ChevronRight } from "lucide-react";

// 1. Generate Static Params (SSG)
export async function generateStaticParams() {
  const posts = getPostSlugs();
  return posts.map((post) => ({
    slug: post.replace(/\.mdx$/, ""),
  }));
}

// 2. Dynamic Metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: `${post.meta.title} | گیفت کارت`,
    description: post.meta.description,
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return (
    <article className="min-h-screen bg-white pb-24 pt-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/blog" className="hover:text-blue-600">
            وبلاگ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 line-clamp-1">{post.meta.title}</span>
        </div>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <Calendar className="h-3.5 w-3.5" /> {post.meta.date}
            </span>
            <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <User className="h-3.5 w-3.5" /> {post.meta.author}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 sm:text-4xl leading-tight">
            {post.meta.title}
          </h1>
        </header>

        {/* Cover Image */}
        {post.meta.coverImage && (
          <div className="relative mb-12 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
            <Image
              src={post.meta.coverImage}
              alt={post.meta.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content Body */}
        <div
          dir="rtl"
          className="prose prose-lg prose-blue max-w-none text-justify leading-loose text-gray-700 prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:rounded-xl"
        >
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Override standard HTML <img> with Next.js <Image />
              img: (props) => (
                <div className="relative my-8 h-64 w-full overflow-hidden rounded-xl sm:h-96">
                  <Image
                    src={props.src}
                    alt={props.alt || "Article Image"}
                    fill
                    className="object-cover"
                  />
                </div>
              ),
              // You can add more overrides here (e.g. custom links)
            }}
          >
            {post.content}
          </Markdown>
        </div>
      </div>
    </article>
  );
}
