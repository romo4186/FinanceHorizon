import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

interface ArticleImport {
  url: string;
  title: string;
  description: string;
  keywords: { word: string; volume: number; difficulty: number; type: string }[];
}

async function main() {
  const csvPath = path.join(__dirname, '..', 'financehorizon_tech_-_keyword_strategy.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at:', csvPath);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  // Skip header line
  const dataLines = lines.slice(1);
  
  const articlesMap = new Map<string, ArticleImport>();

  for (const line of dataLines) {
    if (!line.trim()) continue;
    const parts = parseCSVLine(line);
    if (parts.length < 4) continue;

    const [url, rawTitle, description, keyword, keywordType, volumeStr, diffStr] = parts;
    if (!url || !url.startsWith('http')) continue;

    // Clean title (remove " | Finance Horizon" if present)
    let cleanTitle = rawTitle;
    if (cleanTitle.endsWith('| Finance Horizon')) {
      cleanTitle = cleanTitle.substring(0, cleanTitle.length - 17).trim();
    } else if (cleanTitle.endsWith('| FinanceHorizon')) {
      cleanTitle = cleanTitle.substring(0, cleanTitle.length - 16).trim();
    }

    const volume = parseInt(volumeStr, 10) || 0;
    const difficulty = parseInt(diffStr, 10) || 0;

    if (!articlesMap.has(url)) {
      articlesMap.set(url, {
        url,
        title: cleanTitle,
        description,
        keywords: []
      });
    }

    const article = articlesMap.get(url)!;
    if (keyword) {
      article.keywords.push({
        word: keyword,
        volume,
        difficulty,
        type: keywordType
      });
    }
  }

  console.log(`Found ${articlesMap.size} unique articles to import.`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const [url, item] of articlesMap.entries()) {
    try {
      // Parse category and slug from URL
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const segments = pathname.split('/').filter(Boolean);

      let category = 'credit-cards';
      let slug = '';

      if (segments.length >= 2) {
        category = segments[0];
        slug = segments[segments.length - 1];
      } else if (segments.length === 1) {
        slug = segments[0];
      } else {
        console.warn(`Skipping invalid URL path structure: ${url}`);
        skippedCount++;
        continue;
      }

      // Format keywords as HTML list for article content
      const sortedKeywords = [...item.keywords].sort((a, b) => b.volume - a.volume);
      
      let htmlContent = '<h2>Keywords to Target</h2>\n<ul>\n';
      for (const kw of sortedKeywords) {
        htmlContent += `  <li><strong>${kw.word}</strong> (Type: ${kw.type}, Volume: ${kw.volume}, Difficulty: ${kw.difficulty})</li>\n`;
      }
      htmlContent += '</ul>\n';

      // Check if slug already exists to prevent duplicate key errors
      const existing = await prisma.article.findUnique({
        where: { slug }
      });

      if (existing) {
        console.log(`Article with slug "${slug}" already exists. Skipping.`);
        skippedCount++;
        continue;
      }

      await prisma.article.create({
        data: {
          slug,
          category,
          title: item.title,
          metaTitle: `${item.title} | Finance Horizon`,
          metaDescription: item.description,
          excerpt: item.description,
          content: htmlContent,
          published: false, // Must be draft
          authorSlug: 'sarah-jenkins' // Default author slug
        }
      });
      createdCount++;
    } catch (err) {
      console.error(`Error importing article ${url}:`, err);
      skippedCount++;
    }
  }

  console.log(`Import finished. Created: ${createdCount}, Skipped: ${skippedCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
