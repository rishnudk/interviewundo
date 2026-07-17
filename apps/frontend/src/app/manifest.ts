import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'interviewUndo — Master Technical Interviews',
    short_name: 'interviewUndo',
    description:
      'A premium coding prep platform with interactive workspace, real-time code executions, and AI-powered feedback.',
    start_url: '/',
    display: 'standalone',
    background_color: '#060608', // Matches UI background
    theme_color: '#8B5CF6', // Violet accent
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
