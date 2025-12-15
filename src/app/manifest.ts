import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FarmCaster Base',
    short_name: 'FarmCaster',
    description: 'A decentralized farming game on Base. Plant seeds, water them, and harvest rewards gasless.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0052ff',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
