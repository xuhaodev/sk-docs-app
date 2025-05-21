import { getDocData, getAllDocIds } from '@/lib/docs';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const docData = await getDocData(resolvedParams.slug);
  if (!docData) {
    return {};
  }
  return {
    title: docData.title,
  };
}

export async function generateStaticParams() {
  const paths = getAllDocIds();
  return paths.map(path => ({ slug: path.params.slug }));
}

export default async function DocPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const docData = await getDocData(resolvedParams.slug);

  if (!docData) {
    notFound();
  }

  return (
    <article className="prose prose-slate lg:prose-lg mx-auto dark:prose-invert">
      {docData.title && (
        <h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
          {docData.title}
        </h1>
      )}
      {docData.date && (
        <p className="text-sm text-[var(--foreground)]/60 mb-8">
          {new Date(docData.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      )}
      <div 
        className="prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground)]/90 
                 prose-a:text-[var(--link-color)] prose-a:no-underline hover:prose-a:text-[var(--link-hover)]
                 prose-strong:text-[var(--foreground)] prose-code:text-[var(--foreground)]
                 prose-pre:bg-[var(--code-bg)] prose-pre:border prose-pre:border-[var(--sidebar-border)]
                 prose-blockquote:border-l-[var(--sidebar-border)] prose-blockquote:text-[var(--foreground)]/80
                 prose-code:before:hidden prose-code:after:hidden
                 [&_*]:transition-colors [&_*]:duration-150"
        dangerouslySetInnerHTML={{ __html: docData.contentHtml }} 
      />
    </article>
  );
}
