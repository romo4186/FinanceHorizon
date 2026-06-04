import { PrismaClient } from '@prisma/client';
import * as studentCards from './articles_data/best-credit-cards-students-2026';
import * as cashBack from './articles_data/best-cash-back-credit-cards';
import * as travelCards from './articles_data/best-travel-credit-cards';
import * as utilization from './articles_data/credit-utilization-explained';
import * as improveCredit from './articles_data/how-to-improve-credit-score';
import * as onlineBanks from './articles_data/best-online-banks-america';
import * as hysa from './articles_data/best-high-yield-savings-accounts';
import * as checkingSavings from './articles_data/checking-vs-savings-accounts';
import * as fdic from './articles_data/how-fdic-insurance-works';
import * as bankBonuses from './articles_data/best-bank-bonuses-this-month';
import * as etfs from './articles_data/best-etfs-beginners';
import * as iras from './articles_data/roth-ira-vs-traditional-ira';
import * as sp500 from './articles_data/sp-500-investing-explained';
import * as startInvesting from './articles_data/how-to-start-investing-100';
import * as dividend from './articles_data/dividend-investing-guide';
import * as autoInsurance from './articles_data/best-auto-insurance-companies';
import * as cheapCar from './articles_data/cheapest-car-insurance-options';
import * as lifeInsurance from './articles_data/how-life-insurance-works';
import * as homeowners from './articles_data/homeowners-insurance-explained';
import * as healthInsurance from './articles_data/health-insurance-basics';

const prisma = new PrismaClient();

// Helper to count words
function getWordCount(text: string): number {
  const cleanText = text.replace(/<[^>]*>/g, ' ');
  return cleanText.trim().split(/\s+/).filter(w => w.length > 0).length;
}

const ARTICLE_EXPANSIONS: Record<string, { slug: string; intro: string; sectionsHtml: string; faqs: Array<{q: string, a: string}> }> = {
  [studentCards.slug]: studentCards,
  [cashBack.slug]: cashBack,
  [travelCards.slug]: travelCards,
  [utilization.slug]: utilization,
  [improveCredit.slug]: improveCredit,
  [onlineBanks.slug]: onlineBanks,
  [hysa.slug]: hysa,
  [checkingSavings.slug]: checkingSavings,
  [fdic.slug]: fdic,
  [bankBonuses.slug]: bankBonuses,
  [etfs.slug]: etfs,
  [iras.slug]: iras,
  [sp500.slug]: sp500,
  [startInvesting.slug]: startInvesting,
  [dividend.slug]: dividend,
  [autoInsurance.slug]: autoInsurance,
  [cheapCar.slug]: cheapCar,
  [lifeInsurance.slug]: lifeInsurance,
  [homeowners.slug]: homeowners,
  [healthInsurance.slug]: healthInsurance,
};

async function main() {
  console.log('Starting article content expansion verification (Target: 2000-2500 words per article)...');

  // Fetch current articles from database
  const currentArticles = await prisma.article.findMany();
  console.log(`Found ${currentArticles.length} articles in database.`);

  const errors: string[] = [];

  for (const art of currentArticles) {
    const expansion = ARTICLE_EXPANSIONS[art.slug];
    if (!expansion) {
      console.log(`[WARNING] No custom expansion module found for slug: "${art.slug}". Skipping.`);
      continue;
    }

    // Assemble rich content HTML
    let expandedContentHtml = '';
    
    // Intro
    expandedContentHtml += `<p class="intro-text">${expansion.intro}</p>\n\n`;
    
    // Core HTML body
    expandedContentHtml += expansion.sectionsHtml;

    // FAQ Section
    expandedContentHtml += `\n<section id="faq" class="faq-section">\n`;
    expandedContentHtml += `  <h2>Frequently Asked Questions</h2>\n`;
    for (const faq of expansion.faqs) {
      expandedContentHtml += `  <div class="faq-item">\n`;
      expandedContentHtml += `    <h3 class="faq-question">${faq.q}</h3>\n`;
      expandedContentHtml += `    <p class="faq-answer">${faq.a}</p>\n`;
      expandedContentHtml += `  </div>\n`;
    }
    expandedContentHtml += `</section>\n`;

    const wordCount = getWordCount(expandedContentHtml);
    console.log(`Slug "${art.slug}": words = ${wordCount}`);

    // Assert word count limits
    if (wordCount < 2000 || wordCount > 2500) {
      errors.push(`Article "${art.slug}" has ${wordCount} words, which is outside the required 2000-2500 range.`);
    }

    // Update in database
    await prisma.article.update({
      where: { id: art.id },
      data: {
        excerpt: art.metaDescription || '',
        content: expandedContentHtml
      }
    });
  }

  if (errors.length > 0) {
    console.error('\n[ERROR] Word count assertions failed for the following articles:');
    errors.forEach(err => console.error(`  - ${err}`));
    throw new Error('Word count boundaries violated. Check articles and correct text length.');
  }

  console.log('\n[SUCCESS] All articles updated in PostgreSQL database with compliant 2000-2500 word counts!');
}

main()
  .catch((e) => {
    console.error('Error during article expansion execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
