import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://team-schedule-sub.vercel.app'
  
  // Popular team pages for better SEO
  const popularTeams = [
    'miami-heat',
    'miami-dolphins', 
    'miami-hurricanes',
    'lakers',
    'warriors',
    'celtics',
    'bulls',
    'knicks',
    'patriots',
    'cowboys',
    'packers',
    'steelers'
  ]

  const teamUrls = popularTeams.map((team) => ({
    url: `${baseUrl}/team/${team}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...teamUrls,
  ]
}
