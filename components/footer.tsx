import Link from "next/link"
import { Twitter, Send, Github, Linkedin, Mail, Phone, MapPin, TrendingUp, Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-16 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CryptoFlow
              </h3>
              <span className="text-xs text-slate-500 font-mono">BETA</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your premier source for cryptocurrency news, market intelligence, and blockchain insights. Stay ahead of
              the crypto revolution with real-time updates and expert analysis.
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-4 pt-2">
              <Link
                href="https://twitter.com/cryptoflownews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-cyan-400 transition-colors duration-200 p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://t.me/cryptoflownews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-cyan-400 transition-colors duration-200 p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50"
                aria-label="Join our Telegram"
              >
                <Send className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/cryptoflow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-cyan-400 transition-colors duration-200 p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50"
                aria-label="Follow us on GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com/company/cryptoflow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-cyan-400 transition-colors duration-200 p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Crypto Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-200 flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              Crypto Categories
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/new-listings"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  New Token Listings
                </Link>
              </li>
              <li>
                <Link
                  href="/airdrops"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Airdrops & Rewards
                </Link>
              </li>
              <li>
                <Link
                  href="/defi"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  DeFi Protocols
                </Link>
              </li>
              <li>
                <Link
                  href="/nfts"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  NFT Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Market Coverage */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-200 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-400" />
              Market Coverage
            </h4>
            <ul className="space-y-3">
              <li className="text-slate-400 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                <span className="font-mono">Global Markets</span>
              </li>
              <li className="text-slate-400 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" />
                <span className="font-mono">Major Exchanges</span>
              </li>
              <li className="text-slate-400 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                <span className="font-mono">Layer 1 & 2</span>
              </li>
              <li className="text-slate-400 text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full" />
                <span className="font-mono">Emerging Chains</span>
              </li>
            </ul>
          </div>

          {/* Connect & Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-200">Connect With Us</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/newsletter"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <Mail className="h-4 w-4 group-hover:text-cyan-400" />
                  Newsletter
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                >
                  <Phone className="h-4 w-4 group-hover:text-cyan-400" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-semibold mb-2 text-slate-200 flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              Stay Updated
            </h4>
            <p className="text-slate-400 text-sm mb-4">Get the latest crypto insights delivered to your inbox</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm backdrop-blur-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-slate-500 text-sm font-mono">&copy; 2024 CryptoFlow. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-slate-500 hover:text-cyan-400 transition-colors duration-200 text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-slate-500 hover:text-cyan-400 transition-colors duration-200 text-sm">
              Privacy Policy
            </Link>
            <Link
              href="/sitemap.xml"
              className="text-slate-500 hover:text-cyan-400 transition-colors duration-200 text-sm"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
