import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FarmCaster Base',
    short_name: 'FarmCaster',
    description: 'A decentralized farming game on Base.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0052ff',
    icons: [
      { src: '/images/icon.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/icon.png', sizes: '512x512', type: 'image/png' }
    ],
  }
}
