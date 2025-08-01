/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://health-watch-sooty.vercel.app", // Your actual deployed URL
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // If you want to exclude private/admin pages
  exclude: ["/admin", "/dashboard"],

  // Add dynamic category pages
  additionalPaths: async (config) => {
    const categories = [
      "public-health",
      "disease-prevention",
      "nutrition",
      "mental-health",
      "healthcare",
      "research",
    ]

    return categories.map((category) => ({
      loc: `/${category}`, // This assumes your route is /app/[category]
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }))
  },
}
