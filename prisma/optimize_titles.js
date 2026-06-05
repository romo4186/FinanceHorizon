const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const OPTIMIZED_DATA = {
  'best-balance-transfer-credit-cards-of-2026-escape-high-interest-debt': {
    title: 'Best Balance Transfer Credit Cards of 2026: Escape High-Interest Debt',
    metaTitle: 'Best Balance Transfer Credit Cards of 2026 | Finance Horizon',
    metaDescription: 'Discover the best balance transfer credit cards of 2026. Compare 0% intro APR offers, fees, and transfer limits to pay off debt faster.'
  },
  'best-high-yield-savings-accounts': {
    title: 'Best High-Yield Savings Accounts of 2026: Compare APY & Rates',
    metaTitle: 'Best High-Yield Savings Accounts of 2026 | Finance Horizon',
    metaDescription: 'Find the top high yield savings accounts (HYSA) of 2026. Compare interest rates, APY, minimum deposits, and security features to grow your emergency fund.'
  },
  'best-cash-back-credit-cards': {
    title: 'Best Cash Back Credit Cards of 2026: Maximize Daily Rewards',
    metaTitle: 'Best Cash Back Credit Cards of 2026 | Finance Horizon',
    metaDescription: 'Find the best cash back credit cards of 2026. Compare flat-rate rewards, rotating category rewards, and welcome bonuses to maximize your cash back.'
  },
  'how-fdic-insurance-works': {
    title: 'How FDIC Insurance Works: Is Your Bank Account Safe?',
    metaTitle: 'How FDIC Insurance Works & Coverage Limits | Finance Horizon',
    metaDescription: 'Understand how FDIC deposit insurance protects your savings. Learn about coverage limits, joint accounts, and how to keep your money safe.'
  },
  'sp-500-investing-explained': {
    title: 'S&P 500 Investing Explained: A Beginner\'s Guide to Wealth Building',
    metaTitle: 'S&P 500 Investing Explained: How to Start | Finance Horizon',
    metaDescription: 'Learn how to invest in the S&P 500 index. Understand the risks, returns, and the best index funds to start building long-term wealth.'
  },
  'best-bank-bonuses-this-month': {
    title: 'Best Bank Bonuses of 2026: Earn Free Cash to Open an Account',
    metaTitle: 'Best Bank Bonuses & Promotions This Month | Finance Horizon',
    metaDescription: 'Compare the best checking and savings account promotions this month. Learn how to qualify for bank bonuses and earn free cash.'
  },
  'dividend-investing-guide': {
    title: 'Dividend Investing Guide: How to Build a Passive Income Stream',
    metaTitle: 'Dividend Investing Guide for Beginners | Finance Horizon',
    metaDescription: 'Learn the basics of dividend investing. Discover how to identify high-quality dividend stocks, reinvest payouts, and build a passive income portfolio.'
  },
  'homeowners-insurance-explained': {
    title: 'Homeowners Insurance Explained: What is Covered by Your Policy?',
    metaTitle: 'Homeowners Insurance Explained: A Complete Guide | Finance Horizon',
    metaDescription: 'Demystify homeowners insurance. Learn what policies cover, the difference between actual cash value and replacement cost, and how to shop for coverage.'
  },
  'how-to-improve-credit-score': {
    title: 'How to Improve Your Credit Score Fast: 7 Actionable Steps',
    metaTitle: 'How to Improve Your Credit Score Fast | Finance Horizon',
    metaDescription: 'Boost your credit rating with our step-by-step guide. Learn about payment history, credit utilization, and quick strategies to increase your score.'
  },
  'how-to-start-investing-100': {
    title: 'How to Start Investing with Just $100: A Step-by-Step Guide',
    metaTitle: 'How to Start Investing with $100 | Finance Horizon',
    metaDescription: 'Think you need a fortune to invest? Learn how to start building wealth with just $100 using fractional shares, index funds, and robo-advisors.'
  },
  'best-online-banks-america': {
    title: 'Best Online Banks in America for 2026: Compare APY & Fees',
    metaTitle: 'Best Online Banks in America 2026 | Finance Horizon',
    metaDescription: 'Discover the best online banks in America. Compare APY rates, customer service, fee structures, and mobile app tools to find the perfect fit.'
  },
  'best-credit-cards-students-2026': {
    title: 'Best Credit Cards for College Students in 2026: Build Credit Fast',
    metaTitle: 'Best Credit Cards for Students in 2026 | Finance Horizon',
    metaDescription: 'Kickstart your financial journey. Compare the best student credit cards of 2026, offering cash back rewards, no annual fees, and credit-building tools.'
  },
  'roth-ira-vs-traditional-ira': {
    title: 'Roth IRA vs. Traditional IRA: Which Account Is Best for You?',
    metaTitle: 'Roth IRA vs Traditional IRA Comparison Guide | Finance Horizon',
    metaDescription: 'Compare Roth and Traditional IRAs side-by-side. Understand tax advantages, contribution limits, and withdrawal rules to pick your ideal retirement tool.'
  },
  'credit-utilization-explained': {
    title: 'Credit Utilization Explained: The Secret to a High Credit Score',
    metaTitle: 'Credit Utilization Ratio Explained | Finance Horizon',
    metaDescription: 'Learn what credit utilization is, why it makes up 30% of your credit score, and how keeping your balance below 10% can boost your rating.'
  },
  'best-travel-credit-cards': {
    title: 'Best Travel Credit Cards of 2026: Fly and Stay for Free',
    metaTitle: 'Best Travel Credit Cards of 2026 | Finance Horizon',
    metaDescription: 'Maximize your adventures. Compare the best travel rewards credit cards of 2026, including points, sign-up bonuses, and airport lounge access.'
  },
  'cheapest-car-insurance-options': {
    title: 'Cheapest Car Insurance Options: How to Lower Your Premiums',
    metaTitle: 'How to Find Cheap Car Insurance Options | Finance Horizon',
    metaDescription: 'Save money on auto insurance. Compare options, discover hidden discounts, and learn how to lower your premiums without sacrificing necessary coverage.'
  },
  'how-life-insurance-works': {
    title: 'How Life Insurance Works: Term vs. Whole Life Explained',
    metaTitle: 'How Life Insurance Works: A Simple Guide | Finance Horizon',
    metaDescription: 'Understand the essentials of life insurance. Compare term vs. whole life insurance, coverage needs, and how payouts protect your family\'s future.'
  },
  'health-insurance-basics': {
    title: 'Health Insurance Basics: A Simple Guide to Terms, Deductibles & Copays',
    metaTitle: 'Health Insurance Basics & Terms Explained | Finance Horizon',
    metaDescription: 'Confused by health insurance? Learn about deductibles, copays, out-of-pocket maximums, and how to choose the right coverage option.'
  },
  'checking-vs-savings-accounts': {
    title: 'Checking vs. Savings Accounts: How to Manage Your Money',
    metaTitle: 'Checking vs Savings Accounts Comparison | Finance Horizon',
    metaDescription: 'Learn the distinct roles of checking and savings accounts. Find out how to automate transfers, avoid bank fees, and maximize interest earnings.'
  },
  'best-auto-insurance-companies': {
    title: 'Best Auto Insurance Companies of 2026: Compare Quotes & Save',
    metaTitle: 'Best Auto Insurance Companies of 2026 | Finance Horizon',
    metaDescription: 'Compare the nation\'s top-rated auto insurance providers. Evaluate customer service, claims processes, financial stability, and cost options.'
  },
  'best-etfs-beginners': {
    title: 'Best ETFs for Beginners to Build Wealth in 2026',
    metaTitle: 'Best ETFs for Beginners 2026 | Finance Horizon',
    metaDescription: 'Beginner-friendly exchange-traded funds (ETFs) to start investing. Learn how index ETFs simplify diversification and cut investing costs.'
  },
  'insurance': {
    title: 'Insurance Guides & Reviews: Compare Quotes and Save',
    metaTitle: 'Insurance Guides & Reviews | Finance Horizon',
    metaDescription: 'Expert guides and insurance company reviews. Learn how to compare and shop for auto, home, renters, life, and health insurance.'
  },
  'credit-cards': {
    title: 'Credit Cards Guides & Reviews: Find the Perfect Card',
    metaTitle: 'Credit Cards Guides & Reviews | Finance Horizon',
    metaDescription: 'Find your next credit card. Compare cash back, travel rewards, student, balance transfer, and low APR credit card offers from top issuers.'
  },
  'banking': {
    title: 'Banking Guides & Reviews: High-Yield Accounts & Loans',
    metaTitle: 'Banking Guides & Reviews | Finance Horizon',
    metaDescription: 'Smarter money management. Expert banking reviews, high-yield savings accounts comparisons, bank bonus reviews, and cash flow tips.'
  },
  'investing': {
    title: 'Investing Guides & Reviews: Wealth Building & Retirement',
    metaTitle: 'Investing Guides & Reviews | Finance Horizon',
    metaDescription: 'Beginner-friendly investing guides. Learn about Roth IRAs, S&P 500 index funds, dividend investing, ETFs, and passive income building.'
  },
  'editorial-policy': {
    title: 'Editorial Policy: Our Standards & Fact-Checking Procedures',
    metaTitle: 'Editorial Policy | Finance Horizon',
    metaDescription: 'Read the editorial standards of Finance Horizon. Learn about our fact-checking procedures, correction policies, and our commitment to financial E-E-A-T.'
  },
  'sarah-jenkins': {
    title: 'Sarah Jenkins, CFP®: Personal Finance Expert Profile',
    metaTitle: 'Sarah Jenkins, CFP® | Finance Horizon',
    metaDescription: 'Meet Sarah Jenkins, CFP®. Read her articles, bio, credentials, and editorial contributions on banking, credit cards, and retirement planning.'
  }
};

async function main() {
  console.log('Starting DB Title and Meta optimization run...');
  let updatedCount = 0;

  for (const [slug, data] of Object.entries(OPTIMIZED_DATA)) {
    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (article) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          title: data.title,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          excerpt: data.metaDescription
        }
      });
      console.log(`Updated [${slug}]: "${data.title}"`);
      updatedCount++;
    } else {
      console.warn(`Article [${slug}] not found in database.`);
    }
  }

  console.log(`Optimization finished. Updated ${updatedCount} articles/pages.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
