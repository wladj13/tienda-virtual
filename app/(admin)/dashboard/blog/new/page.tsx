import { BlogPostForm } from '@/components/admin/BlogPostForm';

export default function NewBlogPostPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Nueva entrada</h1>
        <p className="text-sm text-slate-500 mt-1">Crea una nueva entrada de blog</p>
      </div>
      <BlogPostForm />
    </div>
  );
}
