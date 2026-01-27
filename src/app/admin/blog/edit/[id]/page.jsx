import { notFound } from "next/navigation";
import BlogForm from "@/components/BlogForm";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const fetchBlog = async (id) => {
  const prisma = await getPrisma();
  return prisma.blog.findUnique({
    where: { id },
  });
};

export const metadata = {
  title: "Edit Blog Post",
};

export default async function EditBlogPage(props) {
  const params = await props?.params;
  const id = params?.id;
  if (!id) {
    notFound();
  }

  const blog = await fetchBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <section className="admin-panel">
      <BlogForm mode="edit" initialData={blog} />
    </section>
  );
}
