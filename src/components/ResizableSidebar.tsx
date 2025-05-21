'use client';

import Link from 'next/link';
import { type DocData } from '@/lib/types';

interface ResizableSidebarProps {
  docs: DocData[];
}

export default function ResizableSidebar({ docs }: ResizableSidebarProps) {
  return (
    <aside className="group fixed top-0 left-0 h-full bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] overflow-hidden flex"
           style={{ width: 'clamp(200px, var(--sidebar-width, 256px), 600px)' }}>
      <div className="flex-1 p-6 overflow-y-auto min-w-[200px]">
        <h2 className="text-xl font-semibold mb-6 text-[var(--foreground)]">Documentation</h2>
        <nav>
          <ul className="space-y-1">
            {docs.map(({ id, title }) => (
              <li key={id}>
                <Link
                  href={`/${id}`}
                  className="block px-3 py-2 rounded-md text-[var(--foreground)]/80 
                           hover:bg-[var(--hover-bg)] hover:text-[var(--link-color)]
                           transition-all duration-150 ease-in-out"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="resize-handler w-1 hover:w-2 cursor-col-resize bg-[var(--sidebar-border)] hover:bg-[var(--link-color)] transition-all"
           onMouseDown={(e) => {
             e.preventDefault();
             const html = document.documentElement;
             const sidebar = e.currentTarget.parentElement;
             const startX = e.pageX;
             const startWidth = sidebar?.getBoundingClientRect().width || 256;

             function onMouseMove(e: MouseEvent) {
               if (sidebar) {
                 const width = Math.max(200, Math.min(600, startWidth + e.pageX - startX));
                 html.style.setProperty('--sidebar-width', `${width}px`);
               }
             }

             function onMouseUp() {
               document.removeEventListener('mousemove', onMouseMove);
               document.removeEventListener('mouseup', onMouseUp);
               document.body.classList.remove('resize-x');
             }

             document.body.classList.add('resize-x');
             document.addEventListener('mousemove', onMouseMove);
             document.addEventListener('mouseup', onMouseUp);
           }}
      />
    </aside>
  );
}
