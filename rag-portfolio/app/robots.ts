import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/chat/'], // Скрываем служебные страницы от индексации
    },
    sitemap: 'https://stasrybakov.ru/sitemap.xml',
  }
}