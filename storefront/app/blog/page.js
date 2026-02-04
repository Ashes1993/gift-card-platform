import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";
import { Calendar, User, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "وبلاگ و مقالات آموزشی | فروشگاه نکست لایسنس",
  description:
    "جدیدترین مقالات و آموزش‌های تخصصی درباره گیفت کارت‌ها و پرداخت‌های ارزی.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="bg-gray-50 min-h-screen py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">
            وبلاگ آموزشی
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            راهنماهای خرید، آموزش‌های ردیم کد و اخبار دنیای پرداخت
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-1"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full bg-gray-200">
                <Image
                  src={
                    post.meta.coverImage ||
                    "https://dummyimage.com/600x400/eee/aaa"
                  }
                  alt={post.meta.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.meta.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{post.meta.author}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.meta.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {post.meta.description}
                </p>

                <div className="mt-auto flex items-center text-blue-600 text-sm font-semibold">
                  ادامه مطلب
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
