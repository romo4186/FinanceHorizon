import { Article } from '../../types';
import { creditCardArticles } from './credit-cards';
import { bankingArticles } from './banking';
import { investingArticles } from './investing';
import { insuranceArticles } from './insurance';

export const articles: Article[] = [
  ...creditCardArticles,
  ...bankingArticles,
  ...investingArticles,
  ...insuranceArticles
];
