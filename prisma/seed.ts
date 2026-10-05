import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const categories = [
  { slug: "ai-subscriptions", name: "AI Subscriptions", tagline: "Gemini Pro, GPT Plus, Claude & more", emoji: "🤖", sortOrder: 1 },
  { slug: "iptv-streaming", name: "IPTV & Streaming", tagline: "Live TV, movies & series subscriptions", emoji: "📺", sortOrder: 2 },
  { slug: "music-premium", name: "Music Premium", tagline: "Spotify, YouTube Music & more", emoji: "🎧", sortOrder: 3 },
  { slug: "gaming", name: "Gaming & Top-ups", tagline: "Game passes, wallets & Nitro", emoji: "🎮", sortOrder: 4 },
  { slug: "software-keys", name: "Software Keys", tagline: "Windows, Office & pro tools", emoji: "🔑", sortOrder: 5 },
  { slug: "creator-tools", name: "Creator Tools", tagline: "Design, edit & publish like a pro", emoji: "🎨", sortOrder: 6 },
];

type P = {
  slug: string; title: string; brand: string; cat: string;
  short: string; desc: string; features: string[]; requirements?: string;
  price: number; oldPrice?: number; emoji: string; gradient: string;
  badge?: string; stock: number; sold: number; rating: number; ratingCount: number;
  seller: string; sellerRating: number; sellerSales: number; codePrefix: string;
  instructions: string;
};

const products: P[] = [
  {
    slug: "gemini-pro-12-months", title: "Google Gemini Pro — 12 Months (Personal Plan)", brand: "Google Gemini",
    cat: "ai-subscriptions",
    short: "Full Gemini Pro (2.5 Pro, Deep Research, Veo, 2TB storage) activated on YOUR own Google account for 12 months.",
    desc: "Upgrade your personal Google account to Gemini Pro for a full year. You keep your own email, history, and files — no shared accounts. The plan includes access to Gemini 2.5 Pro, Deep Research, Veo 2 video generation, NotebookLM Plus, Gemini in Gmail & Docs, and 2 TB of Google One storage. Activation is done via an official invitation link sent to your email within minutes of purchase. Works worldwide, including regions where Gemini Advanced is normally expensive.",
    features: [
      "Gemini 2.5 Pro model with 1M token context",
      "Deep Research & Veo 2 video generation",
      "NotebookLM Plus included",
      "2 TB Google One storage",
      "Gemini in Gmail, Docs, Sheets & Vids",
      "Activated on your own Google account",
      "12 months full warranty — replacement or refund",
    ],
    requirements: "A free Google account. Not compatible with Workspace accounts managed by a company/school.",
    price: 19.99, oldPrice: 21.99, emoji: "✨", gradient: "from-violet-500 via-fuchsia-500 to-rose-400",
    badge: "BESTSELLER", stock: 47, sold: 3812, rating: 4.9, ratingCount: 1243,
    seller: "DigilandVault", sellerRating: 4.9, sellerSales: 21874, codePrefix: "GEM",
    instructions: "1. After payment you will receive an activation link + code.\n2. Open the link, sign in with YOUR Google account and enter the code.\n3. Gemini Pro status appears within 5 minutes. Warranty: 12 months.",
  },
  {
    slug: "chatgpt-plus-1-month", title: "ChatGPT Plus — 1 Month (Upgrade on Your Account)", brand: "OpenAI",
    cat: "ai-subscriptions",
    short: "GPT-5 thinking, Sora, advanced voice & higher limits — upgraded directly on your own OpenAI account.",
    desc: "We upgrade your personal OpenAI account to ChatGPT Plus for 30 days. You provide nothing but your activation code — simply redeem it on the upgrade page while logged into your account. Enjoy GPT-5 with thinking mode, unlimited GPT-5 mini, Sora video generation, advanced voice mode, priority access at peak times, and advanced data analysis. The subscription starts from the moment of redemption, not from purchase, so nothing is wasted.",
    features: [
      "GPT-5 with extended thinking mode",
      "Sora video generation included",
      "Advanced voice mode",
      "5x higher message limits",
      "Priority access at peak hours",
      "Redeem on your own account — 100% private",
      "30-day replacement warranty",
    ],
    requirements: "A free OpenAI/ChatGPT account with payment method section available.",
    price: 14.49, oldPrice: 20.0, emoji: "🧠", gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    badge: "HOT", stock: 63, sold: 5210, rating: 4.8, ratingCount: 1987,
    seller: "AIKeyHub", sellerRating: 4.8, sellerSales: 34120, codePrefix: "GPT",
    instructions: "1. Log in to chatgpt.com with your account.\n2. Go to Settings → Subscription → Redeem code.\n3. Enter the code you received. Plus activates instantly.",
  },
  {
    slug: "claude-pro-1-month", title: "Claude Pro — 1 Month (Anthropic)", brand: "Anthropic",
    cat: "ai-subscriptions",
    short: "Claude Sonnet 4.5 with higher limits, Projects & priority access on your own account.",
    desc: "Get Claude Pro for 30 days activated on your personal Anthropic account. Claude Pro gives you 5x the usage of the free tier, access to the latest Claude Sonnet 4.5 model, Projects for organizing your work, priority access during high-traffic periods, and early access to new features. Perfect for coding, long document analysis and writing. Code redemption takes less than two minutes and works worldwide.",
    features: [
      "Claude Sonnet 4.5 — latest model",
      "5x more usage vs free tier",
      "Projects & Artifacts included",
      "Priority access at peak times",
      "Early access to new features",
      "Redeem on your own account",
      "30-day replacement warranty",
    ],
    price: 12.99, oldPrice: 20.0, emoji: "📝", gradient: "from-orange-400 via-amber-500 to-yellow-400",
    stock: 38, sold: 1740, rating: 4.7, ratingCount: 512,
    seller: "AIKeyHub", sellerRating: 4.8, sellerSales: 34120, codePrefix: "CLD",
    instructions: "1. Log in at claude.ai.\n2. Open Settings → Billing → Redeem code.\n3. Paste your code. Pro activates immediately.",
  },
  {
    slug: "perplexity-pro-12-months", title: "Perplexity AI Pro — 12 Months", brand: "Perplexity",
    cat: "ai-subscriptions",
    short: "Unlimited Pro searches, GPT-5 & Claude inside Perplexity, on your own account for 12 months.",
    desc: "Perplexity Pro unlocks unlimited fast Pro searches, choice of frontier models (GPT-5, Claude Sonnet, Grok), Deep Research, Labs for building small apps, and file uploads with unlimited daily queries. The 12-month plan is activated on your own account through an official redeem link — no password sharing, nothing to install. Works on web, iOS and Android, and includes $5/month API credits.",
    features: [
      "Unlimited Pro searches",
      "Switch between GPT-5, Claude & Grok",
      "Deep Research & Labs",
      "$5/month API credits included",
      "12 months on your own account",
      "Works on web, iOS & Android",
    ],
    price: 24.99, oldPrice: 40.0, emoji: "🔎", gradient: "from-cyan-500 via-sky-500 to-blue-500",
    badge: "DEAL -37%", stock: 25, sold: 640, rating: 4.8, ratingCount: 178,
    seller: "DigilandVault", sellerRating: 4.9, sellerSales: 21874, codePrefix: "PPLX",
    instructions: "1. Receive your redeem link + code.\n2. Log in at perplexity.ai and open Settings → Redemption.\n3. Enter the code. Pro lasts 12 months from activation.",
  },
  {
    slug: "midjourney-standard-1-month", title: "Midjourney Standard — 1 Month (15h Fast GPU)", brand: "Midjourney",
    cat: "ai-subscriptions",
    short: "Unlimited Relax generations, 15h fast GPU time & stealth on your own Discord-linked plan.",
    desc: "Full Midjourney Standard plan for 30 days: unlimited Relax image generations, 15 hours of Fast GPU time, up to 3 concurrent Fast jobs, unlimited Relax jobs, and image stealth mode. Redemption happens on your own Midjourney account via an official code, so your gallery, styles and references all stay yours. Ideal for designers, marketers and AI artists who need volume generation.",
    features: [
      "Unlimited Relax generations",
      "15 h Fast GPU time per month",
      "3 concurrent Fast jobs",
      "Stealth mode for private images",
      "Own-account redemption",
      "30-day replacement warranty",
    ],
    price: 27.99, oldPrice: 30.0, emoji: "🎨", gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    stock: 14, sold: 388, rating: 4.6, ratingCount: 96,
    seller: "PixelTrade", sellerRating: 4.7, sellerSales: 8420, codePrefix: "MJ",
    instructions: "1. Log in at midjourney.com.\n2. Open Subscribe → Redeem code.\n3. Paste the code and confirm the Standard plan.",
  },
  {
    slug: "iptv-premium-12-months", title: "IPTV Premium — 12 Months · 24,000+ Channels 4K", brand: "RudeStream TV",
    cat: "iptv-streaming",
    short: "24,000+ live channels + 120,000 VOD in 4K/FHD. Works on Smart TV, Firestick, Android, iOS, PC & MAG.",
    desc: "Our flagship IPTV subscription: over 24,000 live channels from Europe, North America, LATAM, Asia and the MENA region, plus a 120,000-title video-on-demand library updated daily. Streams run on anti-freeze load-balanced servers in 4K / FHD / HD. One subscription works on Smart TV (Smart IPTV, Duplex), Amazon Firestick, Android TV & phones, iPhone, Windows, macOS, MAG and Enigma2. You receive your personal M3U playlist + Xtream Codes login instantly after payment. Free 24-hour trial available on request before purchase.",
    features: [
      "24,000+ live channels worldwide",
      "120,000+ movies & series VOD",
      "4K / FHD / HD anti-freeze servers",
      "EPG (TV guide) included",
      "Works on 5 device types simultaneously configurable",
      "Instant delivery: M3U + Xtream Codes",
      "Free 24h trial on request",
      "Full 12-month warranty with free replacement",
    ],
    requirements: "Any IPTV player app and a stable 15 Mbps+ internet connection.",
    price: 49.99, oldPrice: 79.99, emoji: "📡", gradient: "from-emerald-500 via-lime-500 to-yellow-400",
    badge: "HOT", stock: 120, sold: 9034, rating: 4.9, ratingCount: 3210,
    seller: "StreamKing", sellerRating: 4.9, sellerSales: 15230, codePrefix: "IPTV",
    instructions: "1. Receive your M3U link & Xtream Codes login instantly.\n2. Paste them into any IPTV player (Smart IPTV, TiviMate, IPTV Smarters...).\n3. Enjoy 12 months of TV. Support available 24/7 in chat.",
  },
  {
    slug: "iptv-premium-6-months", title: "IPTV Premium — 6 Months · 24,000+ Channels", brand: "RudeStream TV",
    cat: "iptv-streaming",
    short: "Same 24,000+ channel & VOD network, 6-month term. Perfect to test the full experience.",
    desc: "The 6-month edition of our premium IPTV service. Identical channel list, VOD library and 4K anti-freeze servers as the 12-month plan — just half the term. Great if you want to try the service before committing to a year, or if you split a year with a friend. Delivered instantly as M3U playlist + Xtream Codes with EPG and full support until expiry.",
    features: [
      "24,000+ live channels",
      "120,000+ VOD titles",
      "4K / FHD anti-freeze servers",
      "EPG included",
      "Instant M3U + Xtream delivery",
      "6-month free replacement warranty",
    ],
    price: 29.99, oldPrice: 44.99, emoji: "📺", gradient: "from-teal-500 via-emerald-500 to-green-400",
    stock: 85, sold: 2411, rating: 4.8, ratingCount: 806,
    seller: "StreamKing", sellerRating: 4.9, sellerSales: 15230, codePrefix: "IPTV6",
    instructions: "1. Receive your M3U link & Xtream Codes instantly.\n2. Add them to your IPTV player.\n3. Watch for 6 months. 24/7 support included.",
  },
  {
    slug: "netflix-premium-1-month", title: "Netflix Premium 4K UHD — 1 Month (Private Profile)", brand: "Netflix",
    cat: "iptv-streaming",
    short: "Premium 4K plan with your own PIN-protected profile on a guaranteed-working slot.",
    desc: "One month of Netflix Premium 4K UHD on a private, PIN-protected profile of a dedicated Premium slot. You get your own profile name and PIN — nobody else can touch your watch history. Dolby Vision & Dolby Atmos supported where available. If anything stops working during your month, the seller replaces the slot within hours, 24/7. Delivery is instant and automated.",
    features: [
      "4K UHD + HDR + Dolby Atmos",
      "Private PIN-protected profile",
      "Watch on TV, phone, tablet & laptop",
      "Instant automated delivery",
      "24/7 replacement guarantee",
    ],
    price: 6.99, oldPrice: 11.99, emoji: "🍿", gradient: "from-red-600 via-rose-600 to-pink-600",
    stock: 40, sold: 7742, rating: 4.7, ratingCount: 1944,
    seller: "StreamKing", sellerRating: 4.9, sellerSales: 15230, codePrefix: "NFLX",
    instructions: "1. Receive slot link + profile PIN instantly.\n2. Log in, choose your profile, enjoy.\n3. Any issue → message seller for instant replacement.",
  },
  {
    slug: "spotify-premium-12-months", title: "Spotify Premium — 12 Months (Your Own Account)", brand: "Spotify",
    cat: "music-premium",
    short: "Ad-free music, offline downloads & very high audio on your own Spotify account for a year.",
    desc: "Upgrade your personal Spotify account to Premium for 12 months via an official redeem code. Keep all your playlists, followers and listening history. Enjoy ad-free listening, unlimited skips, offline downloads on 5 devices, and very high audio quality. The term stacks on top of any remaining Premium time you already have. Works in all countries where Spotify Premium is available.",
    features: [
      "Ad-free unlimited music",
      "Offline downloads on 5 devices",
      "Very high audio quality",
      "Keeps your playlists & history",
      "Time stacks with existing Premium",
      "12-month warranty",
    ],
    requirements: "A Spotify account. Some countries may require the account to be 1+ month old.",
    price: 26.99, oldPrice: 35.88, emoji: "🎵", gradient: "from-green-500 via-emerald-500 to-teal-500",
    badge: "BESTSELLER", stock: 52, sold: 4467, rating: 4.9, ratingCount: 1102,
    seller: "DigilandVault", sellerRating: 4.9, sellerSales: 21874, codePrefix: "SPT",
    instructions: "1. Log in at spotify.com/redeem.\n2. Paste your code and confirm.\n3. Premium 12 months applied instantly.",
  },
  {
    slug: "youtube-premium-4-months", title: "YouTube Premium + Music — 4 Months (Own Account)", brand: "Google",
    cat: "music-premium",
    short: "Ad-free YouTube, background play, downloads & YouTube Music on your personal Google account.",
    desc: "Four months of YouTube Premium activated on your own Google account through an official invitation. No ads anywhere on YouTube, background playback on mobile, full video downloads for offline, and YouTube Music Premium included. The subscription is joined as a family-member style invite on your own email — everything stays private, and the term applies exactly from activation day.",
    features: [
      "Zero ads on all of YouTube",
      "Background & picture-in-picture play",
      "Offline downloads",
      "YouTube Music Premium included",
      "Activated on your own Google account",
      "4-month warranty",
    ],
    price: 12.99, oldPrice: 23.96, emoji: "▶️", gradient: "from-red-500 via-orange-500 to-amber-400",
    badge: "DEAL -46%", stock: 33, sold: 1980, rating: 4.8, ratingCount: 421,
    seller: "DigilandVault", sellerRating: 4.9, sellerSales: 21874, codePrefix: "YTP",
    instructions: "1. Receive your invite link + code.\n2. Open the link signed in with your Google account.\n3. Accept the invite — Premium starts instantly.",
  },
  {
    slug: "discord-nitro-12-months", title: "Discord Nitro — 12 Months (Full Nitro, Not Basic)", brand: "Discord",
    cat: "gaming",
    short: "Full Nitro: 500MB uploads, HD streaming, 2 server boosts, custom emoji & profile — code redeem.",
    desc: "Genuine Discord Nitro for 12 months, redeemed with an official code on your own account. Includes 500 MB upload limit, HD 1080p/60fps screen streaming, 2 Server Boosts, custom Discord tag, animated avatar & banner, custom emojis everywhere, super reactions and longer messages. The code works on any account in any region and can also be gifted to a friend.",
    features: [
      "500 MB file uploads",
      "HD 1080p/60fps streaming",
      "2 Server Boosts every month",
      "Animated avatar, banner & profile theme",
      "Custom emoji everywhere",
      "Official code — redeem on your own account",
      "12-month warranty",
    ],
    price: 34.99, oldPrice: 99.88, emoji: "🎮", gradient: "from-indigo-400 via-purple-500 to-fuchsia-500",
    badge: "DEAL -65%", stock: 29, sold: 3126, rating: 4.9, ratingCount: 867,
    seller: "PixelTrade", sellerRating: 4.7, sellerSales: 8420, codePrefix: "NITRO",
    instructions: "1. Open discord.com/billing/promotions.\n2. Log in to your Discord account.\n3. Paste the code — Nitro 12 months activates instantly.",
  },
  {
    slug: "xbox-game-pass-ultimate-3-months", title: "Xbox Game Pass Ultimate — 3 Months + EA Play", brand: "Xbox",
    cat: "gaming",
    short: "500+ games on console, PC & cloud, day-one releases, EA Play and Xbox Live Gold included.",
    desc: "Three months of Xbox Game Pass Ultimate — the all-in-one membership. Play 500+ high-quality games on Xbox Series X|S, Windows PC and via cloud streaming on phone, browser or TV. Includes day-one releases of all first-party titles, EA Play membership, Xbox Live Gold, and member discounts up to 50%. Delivered as an official 25-character code that you redeem on your own Microsoft account in seconds.",
    features: [
      "500+ games on console, PC & cloud",
      "Day-one first-party releases",
      "EA Play included",
      "Xbox Live Gold included",
      "Cloud gaming on mobile & browser",
      "Official 25-character code",
    ],
    requirements: "A Microsoft account. Region must allow Game Pass Ultimate redemption.",
    price: 27.99, oldPrice: 49.99, emoji: "🕹️", gradient: "from-green-600 via-emerald-600 to-teal-500",
    stock: 21, sold: 1544, rating: 4.7, ratingCount: 389,
    seller: "KeyForge", sellerRating: 4.8, sellerSales: 12040, codePrefix: "XGPU",
    instructions: "1. Go to xbox.com/redeemcode (or Microsoft Store → Redeem).\n2. Sign in and paste the 25-character code.\n3. Ultimate converts instantly for 3 months.",
  },
  {
    slug: "steam-wallet-50-usd", title: "Steam Wallet Gift Card — $50 (Global)", brand: "Steam",
    cat: "gaming",
    short: "Top up any Steam account with $50 wallet credit. Digital code, instant delivery.",
    desc: "A $50 Steam Wallet code delivered instantly as a digital code. Works on any Steam account — the code adds exactly $50 in wallet funds usable for games, DLC, market items and software. Global usage: the code is issued in USD and Steam automatically converts it to your wallet currency at the current rate. Perfect as a gift or to catch a sale. All codes are photographed as proof of authenticity before delivery.",
    features: [
      "$50 Steam wallet credit",
      "Global — auto-converts to your currency",
      "Works for games, DLC & Market",
      "Instant digital delivery",
      "Great as a gift",
    ],
    price: 51.99, emoji: "💳", gradient: "from-slate-600 via-slate-500 to-zinc-400",
    stock: 60, sold: 2890, rating: 4.8, ratingCount: 733,
    seller: "KeyForge", sellerRating: 4.8, sellerSales: 12040, codePrefix: "STEAM50",
    instructions: "1. Open steamcommunity.com or the Steam client.\n2. Go to your account details → Add funds → Redeem a Steam Gift Card.\n3. Paste the code. $50 lands in your wallet.",
  },
  {
    slug: "windows-11-pro-key", title: "Windows 11 Pro — Lifetime Retail Key (1 PC)", brand: "Microsoft",
    cat: "software-keys",
    short: "Genuine lifetime activation of Windows 11 Pro (also upgrades Win 10 Pro / Home). Instant key.",
    desc: "A genuine Windows 11 Pro retail license for one PC — lifetime validity with free minor updates. The key upgrades Windows 10 Home/Pro and fresh installs alike, and passes official activation & genuine checks. Digital delivery within seconds of purchase, with a step-by-step activation guide and remote help if needed. Bind the key to your Microsoft account for easy reactivation after hardware changes.",
    features: [
      "Lifetime activation — 1 PC",
      "Upgrades Win 10 Home/Pro to 11 Pro",
      "Passes official genuine checks",
      "BitLocker, Hyper-V, RDP & Group Policy",
      "Instant digital delivery",
      "Activation guide + free remote help",
    ],
    requirements: "Windows 10/11 installed (any edition), internet connection for activation.",
    price: 8.99, oldPrice: 24.99, emoji: "🪟", gradient: "from-sky-600 via-cyan-600 to-teal-500",
    badge: "HOT", stock: 200, sold: 11245, rating: 4.8, ratingCount: 4021,
    seller: "KeyForge", sellerRating: 4.8, sellerSales: 12040, codePrefix: "WIN11",
    instructions: "1. Press Win+R, type 'slui' and press Enter.\n2. Click 'Change product key'.\n3. Paste your key — Windows 11 Pro activates online.",
  },
  {
    slug: "office-365-proplus-1-year", title: "Microsoft 365 Apps — 1 Year (5 Devices, 1TB OneDrive)", brand: "Microsoft",
    cat: "software-keys",
    short: "Word, Excel, PowerPoint, Outlook & 1TB OneDrive on 5 devices for 12 months on your own account.",
    desc: "A 12-month Microsoft 365 Apps subscription attached to your personal Microsoft account — not a cracked copy. Includes desktop & mobile Word, Excel, PowerPoint, Outlook, OneNote and Access (PC), plus 1 TB of OneDrive cloud storage. Valid on up to 5 devices simultaneously (Windows, macOS, iOS, Android). You redeem the code yourself, so the subscription is fully private and renewals show up in your own account.",
    features: [
      "Word, Excel, PowerPoint, Outlook & more",
      "1 TB OneDrive cloud storage",
      "5 devices simultaneously",
      "Windows, macOS, iOS & Android",
      "Redeemed on your own Microsoft account",
      "12-month warranty",
    ],
    price: 15.99, oldPrice: 39.99, emoji: "📊", gradient: "from-orange-500 via-red-500 to-rose-500",
    badge: "DEAL -60%", stock: 44, sold: 2098, rating: 4.7, ratingCount: 566,
    seller: "KeyForge", sellerRating: 4.8, sellerSales: 12040, codePrefix: "M365",
    instructions: "1. Go to microsoft365.com/redeem.\n2. Sign in with your Microsoft account.\n3. Enter the code and follow the wizard — done in 2 minutes.",
  },
  {
    slug: "canva-pro-12-months", title: "Canva Pro — 12 Months (Your Own Email)", brand: "Canva",
    cat: "creator-tools",
    short: "Premium templates, Background Remover, Magic Studio AI & 1TB cloud on your own Canva account.",
    desc: "Twelve months of Canva Pro on your personal email via team invite or official code. Unlocks the full content library (100M+ photos, videos, audio), Magic Studio AI tools (Magic Write, Magic Edit, Magic Design), Background Remover, Brand Kits, 1 TB of cloud storage, and one-click resize for every format. You keep your existing designs and teams. Ideal for freelancers, students and social media managers.",
    features: [
      "100M+ premium photos, videos & audio",
      "Magic Studio AI suite",
      "One-click Background Remover",
      "Brand Kits & content planner",
      "1 TB cloud storage",
      "Activated on your own email",
      "12-month warranty",
    ],
    price: 11.99, oldPrice: 119.99, emoji: "🖌️", gradient: "from-fuchsia-500 via-purple-500 to-violet-600",
    badge: "DEAL -90%", stock: 70, sold: 3911, rating: 4.9, ratingCount: 912,
    seller: "DigilandVault", sellerRating: 4.9, sellerSales: 21874, codePrefix: "CNV",
    instructions: "1. Send your Canva email to the auto-instructions (or use the redeem code).\n2. Accept the Pro invite that arrives.\n3. Canva Pro is live for 12 months.",
  },
  {
    slug: "capcut-pro-1-month", title: "CapCut Pro — 1 Month (Global)", brand: "CapCut",
    cat: "creator-tools",
    short: "4K export, pro effects, auto captions & cloud space on your own account — no watermark.",
    desc: "One month of CapCut Pro on your own account with all premium tools unlocked: watermark-free 4K exports, the full effect & transition library, auto captions with translation, smart retouch, background removal, priority cloud rendering and 100 GB cloud storage. Works on mobile, desktop and web with one subscription. Delivered as an official redeem code or invite, within minutes.",
    features: [
      "Watermark-free 4K export",
      "Full premium effects & transitions",
      "Auto captions + translation",
      "Background removal & smart retouch",
      "100 GB cloud storage",
      "Mobile + desktop + web",
      "30-day replacement warranty",
    ],
    price: 4.99, oldPrice: 9.99, emoji: "🎬", gradient: "from-zinc-700 via-neutral-600 to-stone-500",
    stock: 55, sold: 1276, rating: 4.6, ratingCount: 204,
    seller: "PixelTrade", sellerRating: 4.7, sellerSales: 8420, codePrefix: "CCPRO",
    instructions: "1. Log in at capcut.com on web or open the app.\n2. Open Pro subscription → Redeem code / accept invite.\n3. Pro features unlock instantly.",
  },
];

const reviewsBySlug: Record<string, { author: string; rating: number; comment: string }[]> = {
  "gemini-pro-12-months": [
    { author: "Marcus T.", rating: 5, comment: "Activated on my Gmail in 3 minutes. Deep Research alone is worth 10x this price. Seller answered my question at 2am." },
    { author: "Elena V.", rating: 5, comment: "Was skeptical about 'own account' but it's real — my storage jumped to 2TB and Gemini shows Pro badge. 3 months, zero issues." },
    { author: "Jayden R.", rating: 4, comment: "Took 25 min to arrive because of weekend queue but support replied instantly. Everything works." },
    { author: "Sofia M.", rating: 5, comment: "Second purchase here. My dad's account also upgraded. Warranty makes it risk-free." },
  ],
  "chatgpt-plus-1-month": [
    { author: "Andre K.", rating: 5, comment: "Code redeemed in 30 seconds. GPT-5 thinking is insane for coding. Cheapest Plus I found." },
    { author: "Priya S.", rating: 5, comment: "Bought 4 times already for the family. Always instant." },
    { author: "Tom W.", rating: 4, comment: "Works exactly as described. Wish I could stack 2 codes at once, seller says yes next time." },
  ],
  "iptv-premium-12-months": [
    { author: "Diego F.", rating: 5, comment: "24k channels is not marketing — every league I wanted is here, 4K stable even on match days. TiviMate + EPG works perfect." },
    { author: "Amira H.", rating: 5, comment: "Trial first, then bought a year for the whole family. Firestick setup took 5 minutes with their guide." },
    { author: "Lucas B.", rating: 4, comment: "One channel froze during F1, contacted support and they fixed the server in an hour. Great service overall." },
    { author: "Nikola P.", rating: 5, comment: "Replaced my $80/mo cable bill. VOD has movies still in cinemas. Crazy value." },
  ],
  "spotify-premium-12-months": [
    { author: "Chloe D.", rating: 5, comment: "Redeemed on my own account, kept all playlists. Stacked on my remaining 2 months." },
    { author: "Ivan G.", rating: 5, comment: "Instant code, official redeem page, 12 months for the price of 9. No brainer." },
  ],
  "discord-nitro-12-months": [
    { author: "Kevin O.", rating: 5, comment: "Full Nitro not basic, 2 boosts arrived on my server. Saved me $65." },
    { author: "Lena Z.", rating: 5, comment: "Gifted to my brother, he redeemed in UK, I bought in DE — works anywhere." },
  ],
  "windows-11-pro-key": [
    { author: "Robert M.", rating: 5, comment: "Upgraded Win10 Home to 11 Pro in one step. Activated online instantly, already 6 months." },
    { author: "Hana Y.", rating: 4, comment: "Key arrived in seconds. Activation failed first time but their guide fixed it (slui method)." },
    { author: "Peter S.", rating: 5, comment: "Built a new PC, bound the license to my MS account. Reactivated after I swapped the motherboard. Perfect." },
  ],
  "netflix-premium-1-month": [
    { author: "Alba R.", rating: 5, comment: "Got my own PIN profile, 4K works on Bravia TV. Replaced a broken slot within 2 hours once — great support." },
    { author: "Marta L.", rating: 4, comment: "Works fine. Would love 3-month option." },
  ],
  "canva-pro-12-months": [
    { author: "Florencia G.", rating: 5, comment: "-90% vs official price, my own email, all Magic Studio tools. My whole agency switched." },
    { author: "Daniel N.", rating: 5, comment: "Invite accepted, Pro badge visible immediately. Background remover is unlimited." },
  ],
  "youtube-premium-4-months": [
    { author: "Oliver B.", rating: 5, comment: "4 months cheaper than 1 official month. Invite flow took 1 minute on my main Google account." },
  ],
  "perplexity-pro-12-months": [
    { author: "Sarah L.", rating: 5, comment: "Switched between GPT-5 and Claude inside Perplexity — real deal, $5 API credits confirmed." },
    { author: "Miguel A.", rating: 5, comment: "Deep Research replaced 2 subscriptions for me. 12 months for the price of 7." },
  ],
  "claude-pro-1-month": [
    { author: "Ethan C.", rating: 5, comment: "Sonnet 4.5 limit is huge for my startup codebase. Redeemed on claude.ai settings, took a minute." },
  ],
  "xbox-game-pass-ultimate-3-months": [
    { author: "Chris D.", rating: 5, comment: "25-char code redeemed instantly, converted my Gold correctly. Starfield day one!" },
  ],
  "midjourney-standard-1-month": [
    { author: "Yuki T.", rating: 4, comment: "Unlimited relax is real. Fast hours show correctly. Stealth mode works on my gallery." },
  ],
  "office-365-proplus-1-year": [
    { author: "Ingrid F.", rating: 5, comment: "Redeemed on microsoft365.com/redeem, 1TB OneDrive appeared right away. Legit subscription." },
  ],
  "capcut-pro-1-month": [
    { author: "Aisha B.", rating: 5, comment: "4K no watermark export unlocked right after redeeming. Perfect for my TikTok work." },
  ],
  "steam-wallet-50-usd": [
    { author: "Georgi S.", rating: 5, comment: "Converted to EUR wallet automatically. Code with photo proof, bought a game 2 min later." },
  ],
  "iptv-premium-6-months": [
    { author: "Franz W.", rating: 5, comment: "Split a year with a friend — two 6-month lines for one price. Channels identical to 12-month plan." },
  ],
};

async function main() {
  console.log("Seeding RUDEUSU DIGILAND marketplace...");

  await db.review.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.order.deleteMany();

  const catIds: Record<string, string> = {};
  for (const c of categories) {
    const createdCat = await db.category.create({ data: c });
    catIds[createdCat.slug] = createdCat.id;
  }

  for (const p of products) {
    const cat = categories.find((c) => c.slug === p.cat)!;
    const created = await db.product.create({
      data: {
        slug: p.slug,
        title: p.title,
        brand: p.brand,
        shortDescription: p.short,
        description: p.desc,
        features: p.features.join("\n"),
        requirements: p.requirements ?? "",
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        emoji: p.emoji,
        gradient: p.gradient,
        badge: p.badge ?? null,
        stock: p.stock,
        sold: p.sold,
        rating: p.rating,
        ratingCount: p.ratingCount,
        sellerName: p.seller,
        sellerRating: p.sellerRating,
        sellerSales: p.sellerSales,
        codePrefix: p.codePrefix,
        instructions: p.instructions,
        categoryId: catIds[cat.slug],
      },
    });

    const reviews = reviewsBySlug[p.slug] ?? [];
    for (const r of reviews) {
      await db.review.create({
        data: {
          productId: created.id,
          author: r.author,
          rating: r.rating,
          comment: r.comment,
        },
      });
    }
  }

  const counts = await db.product.count();
  console.log(`Seeded ${counts} products across ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
