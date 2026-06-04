import { Author } from '../types';

export const authors: { [slug: string]: Author } = {
  'sarah-jenkins': {
    name: 'Sarah Jenkins, CFP®',
    slug: 'sarah-jenkins',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    role: 'Senior Credit Card Analyst',
    credentials: 'Certified Financial Planner (CFP®) with 10+ years of experience in consumer credit and personal debt strategy.',
    bio: 'Sarah Jenkins is a veteran personal finance writer and Certified Financial Planner specializing in credit cards, debt optimization, and rewards strategies. Her work helps millions of readers build credit, maximize travel rewards, and make smarter spending decisions.',
    socials: {
      twitter: 'https://twitter.com/sarahjenkins_cfp',
      linkedin: 'https://linkedin.com/in/sarah-jenkins-finance'
    }
  },
  'david-vance': {
    name: 'David Vance, CFA',
    slug: 'david-vance',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
    role: 'Investing & Retirement Editor',
    credentials: 'Chartered Financial Analyst (CFA) with a background in portfolio management and retail investment advisory.',
    bio: 'David Vance is a Chartered Financial Analyst and former asset manager. He covers long-term investing, index funds, retirement plans (Roth IRAs and 401ks), and stock market basics, providing actionable insights for building wealth.',
    socials: {
      twitter: 'https://twitter.com/dvance_cfa',
      linkedin: 'https://linkedin.com/in/david-vance-invest'
    }
  },
  'amanda-ross': {
    name: 'Amanda Ross, ChFC®',
    slug: 'amanda-ross',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
    role: 'Banking & Cash Management Editor',
    credentials: 'Chartered Financial Consultant (ChFC®) specializing in personal cash flow systems and yield optimization.',
    bio: 'Amanda Ross is a banking expert and Chartered Financial Consultant. She reviews high-yield savings accounts, banking bonuses, checking options, and online cash management tools to help readers earn the highest return on their liquid funds.',
    socials: {
      twitter: 'https://twitter.com/aross_banking',
      linkedin: 'https://linkedin.com/in/amanda-ross-money'
    }
  },
  'marcus-thorne': {
    name: 'Marcus Thorne, CPCU®',
    slug: 'marcus-thorne',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    role: 'Insurance & Risk Strategy Analyst',
    credentials: 'Chartered Property Casualty Underwriter (CPCU®) with 15 years in insurance brokerage and product design.',
    bio: 'Marcus Thorne is an insurance analyst with over 15 years of industry experience. He demystifies auto, home, life, and health insurance, comparing coverage options and premium savings tactics to help families protect their assets without overpaying.',
    socials: {
      twitter: 'https://twitter.com/mthorne_insure',
      linkedin: 'https://linkedin.com/in/marcus-thorne-risk'
    }
  }
};
