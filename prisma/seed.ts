import { PrismaClient } from '@prisma/client';
import { creditCardArticles } from '../src/data/articles/credit-cards';
import { bankingArticles } from '../src/data/articles/banking';
import { investingArticles } from '../src/data/articles/investing';
import { insuranceArticles } from '../src/data/articles/insurance';

const prisma = new PrismaClient();

const allStaticArticles = [
  ...creditCardArticles,
  ...bankingArticles,
  ...investingArticles,
  ...insuranceArticles,
];

function serializeArticleToHtml(article: any): string {
  let html = '';
  
  // Introduction
  html += `<p class="intro-text">${article.introduction}</p>\n\n`;
  
  // Sections
  for (const section of article.sections) {
    html += `<section id="${section.id}">\n`;
    html += `  <h2>${section.title}</h2>\n`;
    for (const block of section.content) {
      if (block.type === 'paragraph') {
        html += `  <p>${block.text}</p>\n`;
      } else if (block.type === 'list') {
        html += `  <ul>\n`;
        for (const item of block.items || []) {
          html += `    <li>${item}</li>\n`;
        }
        html += `  </ul>\n`;
      } else if (block.type === 'table') {
        html += `  <div class="table-wrapper">\n`;
        html += `    <table>\n`;
        if (block.headers && block.headers.length > 0) {
          html += `      <thead>\n        <tr>\n`;
          for (const header of block.headers) {
            html += `          <th>${header}</th>\n`;
          }
          html += `        </tr>\n      </thead>\n`;
        }
        if (block.rows && block.rows.length > 0) {
          html += `      <tbody>\n`;
          for (const row of block.rows) {
            html += `        <tr>\n`;
            for (const cell of row) {
              html += `          <td>${cell}</td>\n`;
            }
            html += `        </tr>\n`;
          }
          html += `      </tbody>\n`;
        }
        html += `    </table>\n  </div>\n`;
      } else if (block.type === 'callout') {
        html += `  <div class="callout callout-${block.calloutType || 'info'}">\n`;
        html += `    <p>${block.text}</p>\n`;
        html += `  </div>\n`;
      }
    }
    html += `</section>\n\n`;
  }
  
  // FAQs
  if (article.faqs && article.faqs.length > 0) {
    html += `<section id="faq" class="faq-section">\n`;
    html += `  <h2>Frequently Asked Questions</h2>\n`;
    for (const faq of article.faqs) {
      html += `  <div class="faq-item">\n`;
      html += `    <h3 class="faq-question">${faq.question}</h3>\n`;
      html += `    <p class="faq-answer">${faq.answer}</p>\n`;
      html += `  </div>\n`;
    }
    html += `</section>\n`;
  }
  
  return html;
}

async function main() {
  console.log('Seeding articles...');

  for (const staticArt of allStaticArticles) {
    const contentHtml = serializeArticleToHtml(staticArt);
    
    await prisma.article.upsert({
      where: { slug: staticArt.slug },
      update: {},
      create: {
        slug: staticArt.slug,
        category: staticArt.category,
        title: staticArt.title,
        metaTitle: staticArt.seoTitle,
        metaDescription: staticArt.metaDescription,
        excerpt: staticArt.metaDescription, // Use metaDescription as excerpt
        content: contentHtml,
        imageUrl: staticArt.featuredImage,
        published: true,
        authorSlug: staticArt.author.slug,
        createdAt: new Date(staticArt.publishDate),
      },
    });
  }

  console.log('All articles seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
