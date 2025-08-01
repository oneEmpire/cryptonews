import type React from "react"
import "@/app/globals.css"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Suspense } from "react"
import { GoogleAnalytics } from "@/components/google-analytics"
import { AuthClientProvider } from "@/context/AuthClientProvider"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: {
    default: "CryptoFlow - Real-Time Crypto News & Market Intelligence",
    template: "%s | CryptoFlow",
  },
  description:
    "Your premier source for cryptocurrency news, new token listings, airdrops, DeFi updates, and blockchain market intelligence. Stay ahead with real-time crypto insights.",
  keywords: [
    "cryptocurrency news",
    "crypto market news",
    "new token listings",
    "crypto airdrops",
    "DeFi news",
    "blockchain news",
    "NFT updates",
    "crypto analysis",
    "market intelligence",
    "bitcoin news",
    "ethereum news",
    "altcoin news",
    "crypto trading",
    "blockchain technology",
    "web3 news",
    "crypto market trends",
  ],
  authors: [{ name: "CryptoFlow Editorial Team" }],
  creator: "CryptoFlow",
  publisher: "CryptoFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "en-GB": "/en-GB",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news",
    siteName: "CryptoFlow",
    title: "CryptoFlow - Real-Time Crypto News & Market Intelligence",
    description:
      "Your premier source for cryptocurrency news, new token listings, airdrops, and blockchain market intelligence.",
    images: [
      {
        url: "/og-crypto-image.jpg",
        width: 1200,
        height: 630,
        alt: "CryptoFlow - Real-Time Crypto News & Market Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoFlow - Real-Time Crypto News & Market Intelligence",
    description:
      "Your premier source for cryptocurrency news, new token listings, airdrops, and blockchain market intelligence.",
    site: "@cryptoflownews",
    creator: "@cryptoflownews",
    images: ["/twitter-crypto-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/crypto-favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/crypto-favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/crypto-apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/crypto-safari-pinned-tab.svg",
        color: "#06b6d4",
      },
    ],
  },
  manifest: "/crypto-site.webmanifest",
  category: "cryptocurrency",
  classification: "Cryptocurrency News",
  referrer: "origin-when-cross-origin",
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CryptoFlow",
  },
  applicationName: "CryptoFlow",
  generator: "Next.js",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/crypto-browserconfig.xml",
    "msapplication-TileColor": "#06b6d4",
    "msapplication-tap-highlight": "no",
    "google-site-verification": "your-crypto-site-verification-code",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={jetbrainsMono.variable}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.coingecko.com" />
        <link rel="preconnect" href="https://api.coinmarketcap.com" />

        {/* DNS prefetch for crypto-related domains */}
        <link rel="dns-prefetch" href="//coinmarketcap.com" />
        <link rel="dns-prefetch" href="//coingecko.com" />
        <link rel="dns-prefetch" href="//binance.com" />
        <link rel="dns-prefetch" href="//coinbase.com" />
        <link rel="dns-prefetch" href="//twitter.com" />
        <link rel="dns-prefetch" href="//telegram.org" />
        <link rel="dns-prefetch" href="//discord.com" />
        <link rel="dns-prefetch" href="//reddit.com" />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CryptoFlow",
              url: process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news",
              logo: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/crypto-logo.png`,
              description:
                "Your premier source for cryptocurrency news, new token listings, airdrops, and blockchain market intelligence.",
              foundingDate: "2024",
              industry: "Cryptocurrency News and Information",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Editorial",
                email: "editorial@cryptoflow.news",
              },
              sameAs: [
                "https://twitter.com/cryptoflownews",
                "https://t.me/cryptoflownews",
                "https://discord.gg/cryptoflow",
                "https://reddit.com/r/cryptoflow",
                "https://youtube.com/@cryptoflownews",
              ],
              potentialAction: {
                "@type": "SearchAction",
                target: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
              knowsAbout: [
                "Cryptocurrency",
                "Blockchain Technology",
                "DeFi",
                "NFTs",
                "Token Listings",
                "Airdrops",
                "Market Analysis",
                "Web3",
              ],
            }),
          }}
        />

        {/* Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CryptoFlow",
              url: process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news",
              description:
                "Your premier source for cryptocurrency news, new token listings, airdrops, and blockchain market intelligence.",
              inLanguage: "en-US",
              isAccessibleForFree: true,
              audience: {
                "@type": "Audience",
                audienceType: "Cryptocurrency Enthusiasts, Traders, and Investors",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "CryptoFlow",
                logo: {
                  "@type": "ImageObject",
                  url: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/crypto-logo.png`,
                },
              },
              mainEntity: {
                "@type": "ItemList",
                name: "Cryptocurrency News Categories",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "New Listings",
                    description: "Latest cryptocurrency token listings and launches",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Airdrops",
                    description: "Free cryptocurrency airdrops and token distributions",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "DeFi News",
                    description: "Decentralized Finance updates and developments",
                  },
                  {
                    "@type": "ListItem",
                    position: 4,
                    name: "NFT Updates",
                    description: "Non-Fungible Token news and marketplace updates",
                  },
                  {
                    "@type": "ListItem",
                    position: 5,
                    name: "Market Analysis",
                    description: "Cryptocurrency market trends and technical analysis",
                  },
                ],
              },
            }),
          }}
        />

        {/* Crypto-specific structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              name: "CryptoFlow",
              url: process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news",
              logo: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/crypto-logo.png`,
              description: "Premier cryptocurrency news and market intelligence platform",
              foundingDate: "2024",
              diversityPolicy: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/diversity-policy`,
              ethicsPolicy: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/ethics-policy`,
              masthead: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/about`,
              missionCoveragePrioritiesPolicy: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/coverage-policy`,
              publishingPrinciples: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/publishing-principles`,
              actionableFeedbackPolicy: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/feedback-policy`,
              correctionsPolicy: `${process.env.NEXT_PUBLIC_API_URL || "https://cryptoflow.news"}/corrections-policy`,
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthClientProvider>
            <Suspense fallback={null}>
              <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <Header />
                <main className="flex-1 relative">
                  {/* Subtle grid pattern overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                  <div className="relative z-10">{children}</div>
                </main>
              </div>
            </Suspense>
          </AuthClientProvider>
        </ThemeProvider>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/crypto-sw.js')
                    .then(function(registration) {
                      console.log('CryptoFlow SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('CryptoFlow SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID} />}

        {/* Crypto market data preload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Preload crypto market data
              if (typeof window !== 'undefined') {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';
                document.head.appendChild(link);
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
