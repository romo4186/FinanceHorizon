'use server';

import { searchArticles } from '@/lib/content';
import { Article } from '@/types';

export async function querySearch(query: string): Promise<Article[]> {
  try {
    return await searchArticles(query);
  } catch (error) {
    console.error('Failed to perform server search:', error);
    return [];
  }
}
