import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import { getBaseUrl } from "@/lib/base-url";
import "@/styles/blog.css";

const fetchBlogs = async (searchParams) => {
  const baseUrl = await getBaseUrl();
  const queryString = new URLSearchParams(searchParams).toString();
  const separator = queryString ? "?" : "";
  const res = await fetch(`${baseUrl}/api/blog${separator}${queryString}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
};

export const metadata = {
  title: "Blog",
  description: "Latest posts across every site using this shared template.",
};

export default async function BlogPage({ searchParams }) {
  const params = (await searchParams) || {};
  const resolvedParams = { ...params };
  const page = Number(resolvedParams.page) || 1;
  const searchQuery = resolvedParams.search || "";

  let data;
  try {
    data = await fetchBlogs({ ...resolvedParams, page });
  } catch (error) {
    console.error(error);
    data = { data: [], pagination: { page: 1, totalPages: 1, limit: 0, total: 0 } };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" role="main">
        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Stories & Updates</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Blog</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Search by title, keywords, or tags. Everything is backed by Prisma and PostgreSQL.
          </p>
        </header>

        {/* Search Form */}
        <form className="max-w-2xl mx-auto mb-12" action="/blog" method="GET" role="search" aria-label="Blog search">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="search"
              name="search"
              placeholder="Search title, content, or tags..."
              defaultValue={searchQuery}
              aria-label="Search blog posts"
              className="flex-1 w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
            <button 
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>

        {/* Blog Grid */}
        {data?.data?.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {data.data.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-600 text-lg">No posts yet. Head to the admin area to create one.</p>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination?.totalPages > 1 && (
          <nav className="flex justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: data.pagination.totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === data.pagination.page;
              const paramsClone = new URLSearchParams(resolvedParams);
              paramsClone.set("page", pageNumber.toString());

              return (
                <Link 
                  key={pageNumber} 
                  href={`/blog?${paramsClone.toString()}`} 
                  aria-current={isActive ? "page" : undefined}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </nav>
        )}
      </main>
    </div>
  );
}
