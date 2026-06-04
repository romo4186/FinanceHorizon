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

function getWordCount(text: string): number {
  const cleanText = text.replace(/<[^>]*>/g, ' ');
  return cleanText.trim().split(/\s+/).filter(w => w.length > 0).length;
}

const ARTICLE_EXPANSIONS = [
  studentCards,
  cashBack,
  travelCards,
  utilization,
  improveCredit,
  onlineBanks,
  hysa,
  checkingSavings,
  fdic,
  bankBonuses,
  etfs,
  iras,
  sp500,
  startInvesting,
  dividend,
  autoInsurance,
  cheapCar,
  lifeInsurance,
  homeowners,
  healthInsurance,
];

console.log('--- Word Count Checker ---');
for (const art of ARTICLE_EXPANSIONS) {
  let expandedContentHtml = '';
  expandedContentHtml += `<p class="intro-text">${art.intro}</p>\n\n`;
  expandedContentHtml += art.sectionsHtml;
  expandedContentHtml += `\n<section id="faq" class="faq-section">\n`;
  expandedContentHtml += `  <h2>Frequently Asked Questions</h2>\n`;
  for (const faq of art.faqs) {
    expandedContentHtml += `  <div class="faq-item">\n`;
    expandedContentHtml += `    <h3 class="faq-question">${faq.q}</h3>\n`;
    expandedContentHtml += `    <p class="faq-answer">${faq.a}</p>\n`;
    expandedContentHtml += `  </div>\n`;
  }
  expandedContentHtml += `</section>\n`;

  const wc = getWordCount(expandedContentHtml);
  console.log(`Slug: ${art.slug} -> Word Count: ${wc} (${wc >= 2000 && wc <= 2500 ? 'PASS' : 'FAIL - ' + (2000 - wc) + ' short'})`);
}
