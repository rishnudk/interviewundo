import { createHighlighter, type Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export async function getShikiHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['one-dark-pro'],
      langs: ['javascript'],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(code: string): Promise<string> {
  const highlighter = await getShikiHighlighter();
  return highlighter.codeToHtml(code, {
    lang: 'javascript',
    theme: 'one-dark-pro',
  });
}

export async function highlightCodesBatch(codes: string[]): Promise<string[]> {
  const highlighter = await getShikiHighlighter();
  return codes.map((code) =>
    highlighter.codeToHtml(code, {
      lang: 'javascript',
      theme: 'one-dark-pro',
    }),
  );
}
