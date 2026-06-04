/**
 * Strips HTML tags using regex to accurately count words in a piece of content.
 */
export function getWordCount(htmlContent: string): number {
  if (!htmlContent) return 0;
  const strippedText = htmlContent.replace(/<[^>]*>/g, ' ');
  const words = strippedText.trim().split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}
