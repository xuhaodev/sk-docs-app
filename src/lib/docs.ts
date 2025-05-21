import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';

const docsDirectory = path.join(process.cwd(), 'docs');

// 从 sidebar.md 获取标题映射
function getTitleMap() {
  try {
    const sidebarPath = path.join(docsDirectory, 'sidebar.md');
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
    const titleMap = new Map();

    // 使用正则表达式匹配 markdown 链接格式：[标题](文件名)
    const linkPattern = /\* \[(.*?)\]\((.*?)\)/g;
    let match;

    while ((match = linkPattern.exec(sidebarContent)) !== null) {
      const [, title, link] = match;
      const id = link.replace(/^\//, '').replace(/\.md$/, '');
      if (id) {
        titleMap.set(id, title);
      }
    }

    return titleMap;
  } catch (error) {
    console.warn('Warning: sidebar.md not found or cannot be read:', error);
    return new Map();
  }
}

export function getSortedDocsData() {
  // Get markdown file names under /docs, filtering out non-md entries
  const fileNames = fs.readdirSync(docsDirectory).filter(name => name.endsWith('.md'));
  const titleMap = getTitleMap();
  
  const allDocsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(docsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use title from sidebar.md if available
    const title = titleMap.get(id) || matterResult.data.title || id.replace(/-/g, ' ');

    return {
      id,
      title,
      ...(matterResult.data as { date?: string }),
    };
  });

  // Sort docs by date or id if date is not available
  return allDocsData.sort((a, b) => {
    if (a.date && b.date) {
      return a.date < b.date ? 1 : -1;
    }
    return a.id < b.id ? -1 : 1;
  });
}

export async function getDocData(id: string) {
  const fullPath = path.join(docsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  const titleMap = getTitleMap();

  // Get the title from sidebar.md or fallback
  const title = titleMap.get(id) || matterResult.data.title || id.replace(/-/g, ' ');

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id, title and contentHtml
  return {
    id,
    title,
    contentHtml,
    ...(matterResult.data as { date?: string }),
  };
}

export function getAllDocIds() {
  const fileNames = fs.readdirSync(docsDirectory).filter(name => name.endsWith('.md'));
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}
