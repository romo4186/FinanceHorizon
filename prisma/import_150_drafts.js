const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AUTHORS = ['sarah-jenkins', 'david-vance', 'amanda-ross', 'marcus-thorne'];
const VALID_CATEGORIES = new Set(['credit-cards', 'banking', 'investing', 'insurance']);

function parseCSVLine(line) {
  const result = [];
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

function toTitleCase(str) {
  const exceptions = new Set([
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 
    'for', 'from', 'in', 'into', 'of', 'off', 'onto', 'out', 'over', 'up', 'with', 'vs'
  ]);
  
  return str
    .split(' ')
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && exceptions.has(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

async function main() {
  console.log('1. Cleaning up existing draft articles in the database...');
  const deleteResult = await prisma.article.deleteMany({
    where: { published: false }
  });
  console.log(`Deleted ${deleteResult.count} existing drafts.`);

  console.log('2. Parsing keyword strategy CSV...');
  const csvPath = path.join(__dirname, '..', 'financehorizon_tech_-_keyword_strategy.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at:', csvPath);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const dataLines = lines.slice(1);

  // Group keywords by category
  const categoryKeywords = {
    'credit-cards': [],
    'banking': [],
    'investing': [],
    'insurance': []
  };

  for (const line of dataLines) {
    if (!line.trim()) continue;
    const parts = parseCSVLine(line);
    if (parts.length < 8) continue;

    const [url, title, desc, keyword, kwType, volumeStr, diffStr, intent] = parts;
    if (!url || !keyword) continue;

    try {
      const urlObj = new URL(url);
      const segments = urlObj.pathname.split('/').filter(Boolean);
      if (segments.length === 0) continue;

      const category = segments[0];
      if (!VALID_CATEGORIES.has(category)) continue;

      const volume = parseInt(volumeStr, 10) || 0;
      const difficulty = parseInt(diffStr, 10) || 0;

      categoryKeywords[category].push({
        keyword: keyword.trim(),
        volume,
        difficulty,
        intent: intent.trim(),
        description: desc.trim() || `Learn about ${keyword.trim()} on Finance Horizon.`
      });
    } catch (e) {
      // Ignore invalid URLs
    }
  }

  // Deduplicate and select top keywords for each category
  const draftsToCreate = [];

  for (const category of Object.keys(categoryKeywords)) {
    const seenKeywords = new Set();
    const uniqueList = [];

    // Sort by search volume descending
    categoryKeywords[category].sort((a, b) => b.volume - a.volume);

    for (const kwObj of categoryKeywords[category]) {
      const normalized = kwObj.keyword.toLowerCase();
      if (seenKeywords.has(normalized)) continue;
      seenKeywords.add(normalized);
      uniqueList.push(kwObj);
    }

    // Take top 38 keywords from each category to make ~150 varied drafts
    const top38 = uniqueList.slice(0, 38);
    console.log(`Category "${category}": selected ${top38.length} unique keywords.`);
    
    top38.forEach(item => {
      draftsToCreate.push({
        category,
        ...item
      });
    });
  }

  console.log(`Total draft articles selected: ${draftsToCreate.length}`);

  // Get existing slugs in the database to avoid collision
  const existingArticles = await prisma.article.findMany({
    select: { slug: true }
  });
  const existingSlugs = new Set(existingArticles.map(a => a.slug));

  let createdCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < draftsToCreate.length; i++) {
    const item = draftsToCreate[i];
    
    // Generate slug from keyword
    let slug = item.keyword
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // If slug exists in published articles, skip it
    if (existingSlugs.has(slug)) {
      skippedCount++;
      continue;
    }

    // Generate optimized Title
    let rawTitle = toTitleCase(item.keyword);
    let h1Title = rawTitle;
    let metaTitle = `${rawTitle} | Finance Horizon`;

    if (item.intent.includes('commercial')) {
      if (!rawTitle.toLowerCase().includes('best') && !rawTitle.toLowerCase().includes('top')) {
        h1Title = `Best ${rawTitle} of 2026: Compare & Save`;
      } else {
        h1Title = `${rawTitle} of 2026: Compare Rates`;
      }
    } else if (item.intent.includes('informational')) {
      if (rawTitle.toLowerCase().startsWith('what') || rawTitle.toLowerCase().startsWith('how') || rawTitle.toLowerCase().startsWith('is')) {
        h1Title = `${rawTitle}: A Simple Guide`;
      } else {
        h1Title = `How to Understand ${rawTitle}: A Beginner's Guide`;
      }
    }

    metaTitle = `${h1Title} | Finance Horizon`;
    if (metaTitle.length > 65) {
      metaTitle = `${h1Title.substring(0, 50)}... | Finance Horizon`;
    }

    // Assign author sequentially to distribute work evenly
    const authorSlug = AUTHORS[i % AUTHORS.length];

    // Generate HTML draft content
    const htmlContent = `
<p class="intro-text">This is a draft guide covering <strong>${item.keyword}</strong>. As one of our personal finance editorial pillars, this article is designed to provide comprehensive, fact-checked, and reliable information matching ${item.intent} search intent.</p>

<section id="overview">
  <h2>Overview & Key Insights</h2>
  <p>In this guide, we will analyze the key components of ${item.keyword}, helping you make informed financial decisions. Our editorial team is currently developing this content in partnership with certified experts.</p>
</section>

<section id="keywords">
  <h2>Target SEO Parameters</h2>
  <ul>
    <li><strong>Primary Keyword:</strong> ${item.keyword}</li>
    <li><strong>Search Intent:</strong> ${item.intent}</li>
    <li><strong>Monthly Search Volume:</strong> ${item.volume}</li>
    <li><strong>Keyword Difficulty:</strong> ${item.difficulty}/100</li>
  </ul>
</section>
    `.trim();

    await prisma.article.create({
      data: {
        slug,
        category: item.category,
        title: h1Title,
        metaTitle,
        metaDescription: item.description,
        excerpt: item.description,
        content: htmlContent,
        published: false, // Must be draft
        authorSlug
      }
    });

    existingSlugs.add(slug);
    createdCount++;
  }

  console.log(`Draft generation completed. Created: ${createdCount}, Skipped/Duplicates: ${skippedCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
