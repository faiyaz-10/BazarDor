import type { Category, MarketPrice, Product } from "@/lib/types";

const configuredApiBase =
  process.env.BAZARDOR_API_BASE?.trim() ||
  "https://api.api-store.workers.dev/api/bazardor";
let apiBaseUrl: URL;
try {
  apiBaseUrl = new URL(configuredApiBase);
} catch {
  throw new Error("BAZARDOR_API_BASE must be an absolute HTTP or HTTPS URL.");
}
if (
  !["http:", "https:"].includes(apiBaseUrl.protocol) ||
  apiBaseUrl.search ||
  apiBaseUrl.hash
) {
  throw new Error(
    "BAZARDOR_API_BASE must be an HTTP or HTTPS URL without query parameters or a fragment.",
  );
}
const API_BASE = configuredApiBase.replace(/\/+$/, "");

const additionalFallbackProducts: Product[] = [
  {
    id: "21",
    slug: "swarnomashuri-rice",
    name: "স্বর্ণমাছি চাল",
    emoji: "🍚",
    unit: "প্রতি কেজি",
    category: "চাল",
    categorySlug: "chal",
    price: 148,
    minPrice: 140,
    maxPrice: 158,
    averagePrice: 148,
    change: 2.6,
    description: "দৈনন্দিন রান্নার জন্য জনপ্রিয় চাল।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 145 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 148 },
    ],
  },
  {
    id: "22",
    slug: "batam-side-rice",
    name: "বাটাম সাইড চাল",
    emoji: "🍚",
    unit: "প্রতি কেজি",
    category: "চাল",
    categorySlug: "chal",
    price: 66,
    minPrice: 59,
    maxPrice: 73,
    averagePrice: 66,
    change: 0.5,
    description: "গতকালের তুলনায় আজ দাম বেড়েছে · ২ টাকা।",
    markets: [
      {
        bazar: "মাঠ বাজার",
        location: "ময়মনসিংহ",
        price: 61,
        minPrice: 59,
        maxPrice: 65,
        averagePrice: 61,
      },
      {
        bazar: "সদর বাজার",
        location: "রাজশাহী",
        price: 63,
        minPrice: 60,
        maxPrice: 66,
        averagePrice: 63,
      },
      {
        bazar: "বাজারহাটি",
        location: "খুলনা",
        price: 63.5,
        minPrice: 60,
        maxPrice: 67,
        averagePrice: 63.5,
      },
      {
        bazar: "বাসুরহাট বাজার",
        location: "রাজশাহী",
        price: 64,
        minPrice: 60,
        maxPrice: 68,
        averagePrice: 64,
      },
      {
        bazar: "চৌক বাজার",
        location: "ময়মনসিংহ",
        price: 64.5,
        minPrice: 60,
        maxPrice: 69,
        averagePrice: 64.5,
      },
      {
        bazar: "আগ্রাবাদী বাজার",
        location: "চট্টগ্রাম",
        price: 65,
        minPrice: 61,
        maxPrice: 69,
        averagePrice: 65,
      },
      {
        bazar: "ডবলমুরিং বাজার",
        location: "খুলনা",
        price: 65.5,
        minPrice: 62,
        maxPrice: 69,
        averagePrice: 65.5,
      },
      {
        bazar: "চৌহাটা বাজার",
        location: "সিলেট",
        price: 66,
        minPrice: 60,
        maxPrice: 75,
        averagePrice: 66,
      },
      {
        bazar: "গ্রীন মার্কেট, মিরপুর",
        location: "ঢাকা",
        price: 67.5,
        minPrice: 64,
        maxPrice: 75,
        averagePrice: 67.5,
      },
      {
        bazar: "চন্দ্রঘোনা বাজার",
        location: "চট্টগ্রাম",
        price: 66,
        minPrice: 60,
        maxPrice: 70,
        averagePrice: 66,
      },
      {
        bazar: "আসমান বাজার",
        location: "সিলেট",
        price: 68.5,
        minPrice: 64,
        maxPrice: 70,
        averagePrice: 68.5,
      },
      {
        bazar: "কারওয়ান বাজার",
        location: "ঢাকা",
        price: 69,
        minPrice: 65,
        maxPrice: 73,
        averagePrice: 69,
      },
    ],
  },
  {
    id: "23",
    slug: "chola",
    name: "ছোলা",
    emoji: "🫘",
    unit: "প্রতি কেজি",
    category: "ডাল",
    categorySlug: "dal",
    price: 105,
    minPrice: 95,
    maxPrice: 115,
    averagePrice: 105,
    change: -2.1,
    description: "নাশতা ও রান্নায় ব্যবহৃত ডালজাতীয় পণ্য।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 102 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 105 },
    ],
  },
  {
    id: "24",
    slug: "palm-oil",
    name: "পাম তেল",
    emoji: "🫙",
    unit: "প্রতি লিটার",
    category: "তেল",
    categorySlug: "tel",
    price: 168,
    minPrice: 160,
    maxPrice: 178,
    averagePrice: 168,
    change: 1.0,
    description: "রান্নায় ব্যবহৃত ভোজ্য তেল।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 165 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 168 },
    ],
  },
  {
    id: "25",
    slug: "tilapia-fish",
    name: "তেলাপিয়া মাছ",
    emoji: "🐟",
    unit: "প্রতি কেজি",
    category: "মাছ",
    categorySlug: "machh",
    price: 280,
    minPrice: 250,
    maxPrice: 310,
    averagePrice: 280,
    change: 0,
    description: "পরিচিত মিঠাপানির মাছ।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 275 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 280 },
    ],
  },
  {
    id: "26",
    slug: "katla-fish",
    name: "কাতলা মাছ",
    emoji: "🐟",
    unit: "প্রতি কেজি",
    category: "মাছ",
    categorySlug: "machh",
    price: 420,
    minPrice: 380,
    maxPrice: 460,
    averagePrice: 420,
    change: -0.8,
    description: "বাংলাদেশের জনপ্রিয় বড় মিঠাপানির মাছ।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 410 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 420 },
    ],
  },
  {
    id: "27",
    slug: "shrimp",
    name: "চিংড়ি মাছ",
    emoji: "🦐",
    unit: "প্রতি কেজি",
    category: "মাছ",
    categorySlug: "machh",
    price: 650,
    minPrice: 580,
    maxPrice: 720,
    averagePrice: 650,
    change: 1.6,
    description: "আকার ও প্রজাতিভেদে দামের পার্থক্য হয়।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 640 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 650 },
    ],
  },
  {
    id: "28",
    slug: "beef",
    name: "গরুর মাংস",
    emoji: "🥩",
    unit: "প্রতি কেজি",
    category: "মাংস",
    categorySlug: "mangsho",
    price: 790,
    minPrice: 750,
    maxPrice: 850,
    averagePrice: 790,
    change: -1.4,
    description: "স্থানীয় বাজারে গরুর মাংসের সম্ভাব্য খুচরা দাম।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 780 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 790 },
    ],
  },
  {
    id: "29",
    slug: "mutton",
    name: "খাসির মাংস",
    emoji: "🍖",
    unit: "প্রতি কেজি",
    category: "মাংস",
    categorySlug: "mangsho",
    price: 1190,
    minPrice: 1100,
    maxPrice: 1300,
    averagePrice: 1190,
    change: 0.9,
    description: "মাংসের মান ও বাজারভেদে দাম পরিবর্তিত হয়।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 1180 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 1190 },
    ],
  },
  {
    id: "30",
    slug: "milk",
    name: "দুধ",
    emoji: "🥛",
    unit: "প্রতি লিটার",
    category: "ডিম ও দুধ",
    categorySlug: "dim-o-dudh",
    price: 102,
    minPrice: 90,
    maxPrice: 115,
    averagePrice: 102,
    change: 2.0,
    description: "দৈনন্দিন ব্যবহারের তরল দুধের সম্ভাব্য দাম।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 100 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 102 },
    ],
  },
];

const fallbackProducts: Product[] = [
  {
    id: "1",
    slug: "miniket-chal",
    name: "মিনিকেট চাল",
    emoji: "🍚",
    unit: "প্রতি কেজি",
    category: "চাল",
    categorySlug: "chal",
    price: 99,
    minPrice: 94,
    maxPrice: 106,
    averagePrice: 99,
    change: -2.9,
    description: "পরিবারের দৈনন্দিন খাবারের জন্য জনপ্রিয় সরু চাল।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 98 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 102 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 99 },
    ],
  },
  {
    id: "2",
    slug: "najirshail-chal",
    name: "নাজির চাল",
    emoji: "🍚",
    unit: "প্রতি কেজি",
    category: "চাল",
    categorySlug: "chal",
    price: 75,
    minPrice: 70,
    maxPrice: 80,
    averagePrice: 75,
    change: 0,
    description: "সুগন্ধি ও ঝরঝরে ভাতের জন্য পরিচিত চাল।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 73 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 77 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 75 },
    ],
  },
  {
    id: "3",
    slug: "atta",
    name: "আটা",
    emoji: "🌾",
    unit: "প্রতি কেজি",
    category: "চাল ও শস্য",
    categorySlug: "chal-o-shossho",
    price: 48,
    minPrice: 43,
    maxPrice: 52,
    averagePrice: 48,
    change: -1.2,
    description: "রুটি ও নাশতার জন্য দৈনন্দিন গমের আটা।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 46 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 50 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 48 },
    ],
  },
  {
    id: "4",
    slug: "mosur-dal",
    name: "মসুর ডাল",
    emoji: "🫘",
    unit: "প্রতি কেজি",
    category: "ডাল",
    categorySlug: "dal",
    price: 125,
    minPrice: 118,
    maxPrice: 135,
    averagePrice: 126,
    change: 3.2,
    description: "প্রোটিনসমৃদ্ধ পরিচিত মসুর ডাল।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 120 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 130 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 125 },
    ],
  },
  {
    id: "5",
    slug: "soybean-oil",
    name: "সয়াবিন তেল",
    emoji: "🫗",
    unit: "প্রতি লিটার",
    category: "তেল",
    categorySlug: "tel",
    price: 170,
    minPrice: 165,
    maxPrice: 175,
    averagePrice: 170,
    change: 0,
    description: "রান্নায় ব্যবহৃত বোতলজাত সয়াবিন তেল।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 168 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 172 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 170 },
    ],
  },
  {
    id: "6",
    slug: "potato",
    name: "আলু",
    emoji: "🥔",
    unit: "প্রতি কেজি",
    category: "সবজি",
    categorySlug: "shobji",
    price: 35,
    minPrice: 30,
    maxPrice: 40,
    averagePrice: 35,
    change: -4.5,
    description: "প্রতিদিনের রান্নার বহুল ব্যবহৃত সবজি।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 32 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 38 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 35 },
    ],
  },
  {
    id: "7",
    slug: "onion",
    name: "দেশি পেঁয়াজ",
    emoji: "🧅",
    unit: "প্রতি কেজি",
    category: "সবজি",
    categorySlug: "shobji",
    price: 65,
    minPrice: 58,
    maxPrice: 72,
    averagePrice: 65,
    change: -2.9,
    description: "দেশি পেঁয়াজ, রান্নার গুরুত্বপূর্ণ উপকরণ।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 60 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 68 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 67 },
    ],
  },
  {
    id: "8",
    slug: "green-chili",
    name: "কাঁচা মরিচ",
    emoji: "🌶️",
    unit: "প্রতি কেজি",
    category: "সবজি",
    categorySlug: "shobji",
    price: 110,
    minPrice: 90,
    maxPrice: 130,
    averagePrice: 110,
    change: 5.7,
    description: "ঝাল ও স্বাদের জন্য ব্যবহৃত তাজা কাঁচা মরিচ।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 100 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 120 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 110 },
    ],
  },
  {
    id: "9",
    slug: "tomato",
    name: "টমেটো",
    emoji: "🍅",
    unit: "প্রতি কেজি",
    category: "সবজি",
    categorySlug: "shobji",
    price: 80,
    minPrice: 70,
    maxPrice: 95,
    averagePrice: 82,
    change: 2.8,
    description: "সালাদ ও রান্নার জন্য তাজা টমেটো।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 75 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 85 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 80 },
    ],
  },
  {
    id: "10",
    slug: "egg",
    name: "ফার্মের ডিম",
    emoji: "🥚",
    unit: "প্রতি ডজন",
    category: "ডিম ও দুধ",
    categorySlug: "dim-o-dudh",
    price: 150,
    minPrice: 145,
    maxPrice: 160,
    averagePrice: 151,
    change: -1.8,
    description: "প্রোটিনের পরিচিত ও সহজলভ্য উৎস।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 148 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 155 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 148 },
    ],
  },
  {
    id: "11",
    slug: "broiler-chicken",
    name: "ব্রয়লার মুরগি",
    emoji: "🍗",
    unit: "প্রতি কেজি",
    category: "মাংস",
    categorySlug: "mangsho",
    price: 185,
    minPrice: 175,
    maxPrice: 195,
    averagePrice: 185,
    change: 1.1,
    description: "দৈনন্দিন খাবারের জন্য ব্রয়লার মুরগি।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 180 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 190 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 185 },
    ],
  },
  {
    id: "12",
    slug: "ilish",
    name: "ইলিশ মাছ",
    emoji: "🐟",
    unit: "প্রতি কেজি",
    category: "মাছ",
    categorySlug: "machh",
    price: 1200,
    minPrice: 1000,
    maxPrice: 1500,
    averagePrice: 1220,
    change: 3.9,
    description: "মৌসুম ও আকারভেদে দাম পরিবর্তনশীল জনপ্রিয় মাছ।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 1150 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 1300 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 1150 },
    ],
  },
  {
    id: "13",
    slug: "roshun",
    name: "রসুন",
    emoji: "🧄",
    unit: "প্রতি কেজি",
    category: "মসলা",
    categorySlug: "moshla",
    price: 190,
    minPrice: 175,
    maxPrice: 210,
    averagePrice: 192,
    change: 2.4,
    description: "রান্নার স্বাদ ও ঘ্রাণ বাড়াতে ব্যবহৃত মসলা।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 185 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 195 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 190 },
    ],
  },
  {
    id: "14",
    slug: "ada",
    name: "আদা",
    emoji: "🫚",
    unit: "প্রতি কেজি",
    category: "মসলা",
    categorySlug: "moshla",
    price: 240,
    minPrice: 220,
    maxPrice: 260,
    averagePrice: 240,
    change: -3.3,
    description: "রান্না ও পানীয়ে ব্যবহৃত সুগন্ধি মসলা।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 230 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 250 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 240 },
    ],
  },
  {
    id: "15",
    slug: "cucumber",
    name: "শসা",
    emoji: "🥒",
    unit: "প্রতি কেজি",
    category: "সবজি",
    categorySlug: "shobji",
    price: 50,
    minPrice: 40,
    maxPrice: 60,
    averagePrice: 50,
    change: -2.2,
    description: "সালাদে জনপ্রিয় সতেজ সবজি।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 45 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 55 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 50 },
    ],
  },
  {
    id: "16",
    slug: "eggplant",
    name: "বেগুন",
    emoji: "🍆",
    unit: "প্রতি কেজি",
    category: "সবজি",
    categorySlug: "shobji",
    price: 60,
    minPrice: 50,
    maxPrice: 70,
    averagePrice: 60,
    change: 1.7,
    description: "ভাজি ও ভর্তার জন্য পরিচিত সবজি।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 55 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 65 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 60 },
    ],
  },
  {
    id: "17",
    slug: "sugar",
    name: "চিনি",
    emoji: "🧂",
    unit: "প্রতি কেজি",
    category: "নিত্যপণ্য",
    categorySlug: "nitto-ponno",
    price: 135,
    minPrice: 130,
    maxPrice: 140,
    averagePrice: 135,
    change: 0,
    description: "চা, মিষ্টি ও রান্নায় ব্যবহৃত চিনি।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 132 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 138 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 135 },
    ],
  },
  {
    id: "18",
    slug: "green-papaya",
    name: "কাঁচা পেঁপে",
    emoji: "🥬",
    unit: "প্রতি কেজি",
    category: "সবজি",
    categorySlug: "shobji",
    price: 40,
    minPrice: 35,
    maxPrice: 45,
    averagePrice: 40,
    change: -1.6,
    description: "সবজি ও তরকারিতে ব্যবহৃত কাঁচা পেঁপে।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 38 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 42 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 40 },
    ],
  },
  {
    id: "19",
    slug: "ruhi-fish",
    name: "রুই মাছ",
    emoji: "🐟",
    unit: "প্রতি কেজি",
    category: "মাছ",
    categorySlug: "machh",
    price: 320,
    minPrice: 290,
    maxPrice: 350,
    averagePrice: 320,
    change: 0.8,
    description: "দেশের পরিচিত মিঠাপানির মাছ।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 310 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 330 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 320 },
    ],
  },
  {
    id: "20",
    slug: "lentil-mung",
    name: "মুগ ডাল",
    emoji: "🫘",
    unit: "প্রতি কেজি",
    category: "ডাল",
    categorySlug: "dal",
    price: 145,
    minPrice: 135,
    maxPrice: 155,
    averagePrice: 145,
    change: 2.6,
    description: "পুষ্টিকর মুগ ডাল, বিভিন্ন রান্নায় ব্যবহৃত।",
    markets: [
      { bazar: "কারওয়ান বাজার", location: "ঢাকা", price: 140 },
      { bazar: "মিরপুর ১ বাজার", location: "ঢাকা", price: 150 },
      { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price: 145 },
    ],
  },
  ...additionalFallbackProducts,
];

export const fallbackCategories: Category[] = [
  { name: "সব পণ্য", slug: "all", emoji: "🧺" },
  { name: "সবজি", slug: "shobji", emoji: "🥬" },
  { name: "চাল", slug: "chal", emoji: "🍚" },
  { name: "ডাল", slug: "dal", emoji: "🫘" },
  { name: "মাছ", slug: "machh", emoji: "🐟" },
  { name: "মাংস", slug: "mangsho", emoji: "🍗" },
  { name: "তেল", slug: "tel", emoji: "🫗" },
  { name: "মসলা", slug: "moshla", emoji: "🌶️" },
  { name: "ডিম ও দুধ", slug: "dim-o-dudh", emoji: "🥚" },
  { name: "নিত্যপণ্য", slug: "nitto-ponno", emoji: "🧂" },
];

function object(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}
function first(obj: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys)
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "")
      return obj[key];
  return undefined;
}
function str(value: unknown, fallback: string): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}
function number(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const converted = value
      .replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)))
      .replace(/[^\d.-]/g, "");
    const n = Number(converted);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}
function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-\u0980-\u09ff]/g, "")
    .replace(/-+/g, "-");
}
function decodeIdentifier(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
function categoryDetails(raw: unknown): { name: string; slug: string } {
  const o = object(raw);
  const rawName =
    typeof raw === "string"
      ? raw
      : str(
          first(o, ["name", "title", "categoryName", "category_name", "label"]),
          "অন্যান্য",
        );
  const rawSlug =
    typeof raw === "string"
      ? slugify(raw)
      : str(
          first(o, ["slug", "categorySlug", "category_slug"]),
          slugify(rawName),
        );
  const known = fallbackCategories.find(
    (category) =>
      category.slug === rawSlug ||
      slugify(category.name) === rawSlug ||
      category.name === rawName,
  );
  return known
    ? { name: known.name, slug: known.slug }
    : { name: rawName, slug: rawSlug };
}
function mapProduct(raw: unknown, index: number): Product | null {
  const o = object(raw);
  const name = str(
    first(o, [
      "name",
      "title",
      "product_name",
      "productName",
      "bn_name",
      "name_bn",
      "product",
    ]),
    "",
  ).trim();
  if (!name) return null;
  const id = str(
    first(o, ["id", "_id", "productId", "product_id"]),
    String(index + 1),
  );
  const cat = categoryDetails(
    first(o, ["category", "categoryName", "category_name", "type"]),
  );
  const price = number(
    first(o, [
      "price",
      "currentPrice",
      "current_price",
      "todayPrice",
      "today_price",
      "averagePrice",
      "average_price",
      "retail_price",
    ]),
    0,
  );
  const minPrice = number(
    first(o, ["minPrice", "min_price", "minimumPrice", "minimum_price"]),
    price,
  );
  const maxPrice = number(
    first(o, ["maxPrice", "max_price", "maximumPrice", "maximum_price"]),
    price,
  );
  const change = number(
    first(o, [
      "change",
      "changePercent",
      "change_percent",
      "priceChange",
      "price_change",
      "percentageChange",
      "percentage_change",
      "price_change_percentage",
      "change_percentage",
      "trend",
    ]),
    0,
  );
  const marketRaw = first(o, [
    "markets",
    "bazaars",
    "bazars",
    "marketPrices",
    "market_prices",
    "market_wise_price",
    "bazaar_prices",
  ]);
  const markets: MarketPrice[] = Array.isArray(marketRaw)
    ? marketRaw.map((item, i) => {
        const m = object(item);
        const marketPrice = number(
          first(m, [
            "price",
            "currentPrice",
            "current_price",
            "averagePrice",
            "average_price",
            "avgPrice",
            "avg_price",
          ]),
          price,
        );
        const minValue = first(m, [
          "minPrice",
          "min_price",
          "minimumPrice",
          "minimum_price",
          "lowest",
          "low",
        ]);
        const maxValue = first(m, [
          "maxPrice",
          "max_price",
          "maximumPrice",
          "maximum_price",
          "highest",
          "high",
        ]);
        const averageValue = first(m, [
          "averagePrice",
          "average_price",
          "avgPrice",
          "avg_price",
          "mean",
        ]);
        return {
          bazar: str(
            first(m, [
              "bazar",
              "market",
              "market_name",
              "bazar_name",
              "name",
              "title",
            ]),
            `স্থানীয় বাজার ${i + 1}`,
          ),
          location: str(
            first(m, ["location", "district", "city", "address"]),
            "বাংলাদেশ",
          ),
          price: marketPrice,
          ...(minValue !== undefined
            ? { minPrice: number(minValue, marketPrice) }
            : {}),
          ...(maxValue !== undefined
            ? { maxPrice: number(maxValue, marketPrice) }
            : {}),
          ...(averageValue !== undefined
            ? { averagePrice: number(averageValue, marketPrice) }
            : {}),
        };
      })
    : [];
  const fixedSlug = str(first(o, ["slug", "productSlug"]), slugify(name));
  return {
    id,
    slug: fixedSlug,
    name,
    emoji: str(first(o, ["emoji", "icon", "symbol"]), emojiFor(cat.slug, name)),
    unit: str(
      first(o, ["unit", "unitName", "unit_name", "measurement"]),
      "প্রতি কেজি",
    ),
    category: cat.name,
    categorySlug: cat.slug,
    price,
    minPrice,
    maxPrice,
    averagePrice: number(
      first(o, ["averagePrice", "average_price", "avgPrice", "avg_price"]),
      price,
    ),
    change,
    description: str(
      first(o, ["description", "details", "summary"]),
      `${name} পণ্যের বাজারদর ও বিভিন্ন বাজারের দামের তুলনা দেখুন।`,
    ),
    markets: markets.length
      ? markets
      : [
          { bazar: "কারওয়ান বাজার", location: "ঢাকা", price },
          { bazar: "রিয়াজউদ্দিন বাজার", location: "চট্টগ্রাম", price },
        ],
  };
}
function emojiFor(category: string, name: string): string {
  const n = name.toLowerCase();
  if (/চাল|rice/.test(n) || category.includes("chal")) return "🍚";
  if (/ডাল|lentil/.test(n) || category.includes("dal")) return "🫘";
  if (/মাছ|fish|ইলিশ|রুই/.test(n) || category.includes("machh")) return "🐟";
  if (/মুরগি|মাংস|chicken|meat/.test(n) || category.includes("mangsho"))
    return "🍗";
  if (/ডিম|egg/.test(n)) return "🥚";
  if (/আলু|potato/.test(n)) return "🥔";
  if (/পেঁয়াজ|পেঁয়াজ|onion/.test(n)) return "🧅";
  if (/মরিচ|chili/.test(n)) return "🌶️";
  if (/রসুন|garlic/.test(n)) return "🧄";
  if (/আদা|ginger/.test(n)) return "🫚";
  if (/তেল|oil/.test(n)) return "🫗";
  return "🥬";
}
function unwrapList(value: unknown): unknown[] {
  return extractList(value) ?? [];
}
function extractList(value: unknown): unknown[] | null {
  if (Array.isArray(value)) return value;
  const o = object(value);
  for (const key of ["data", "products", "result", "items", "categories"]) {
    const found = o[key];
    if (Array.isArray(found)) return found;
    if (found && typeof found === "object") {
      const nested = extractList(found);
      if (nested) return nested;
    }
  }
  return null;
}
async function fetchJson(url: string): Promise<unknown | null> {
  const result = await fetchApiJson(url);
  return result.ok ? result.payload : null;
}
type ApiJsonResult = { ok: true; payload: unknown } | { ok: false };
async function fetchApiJson(url: string): Promise<ApiJsonResult> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
      headers: { accept: "application/json" },
    });
    if (!response.ok) return { ok: false };
    return { ok: true, payload: (await response.json()) as unknown };
  } catch {
    return { ok: false };
  }
}
function findProduct(
  products: Product[],
  identifier: string,
): Product | undefined {
  return products.find(
    (product) =>
      product.slug === identifier ||
      product.id === identifier ||
      slugify(product.name) === identifier,
  );
}
function mapCategories(payload: unknown): Category[] {
  return unwrapList(payload)
    .map((item): Category | null => {
      if (typeof item === "string")
        return {
          name: item,
          slug: slugify(item),
          emoji: emojiFor(slugify(item), item),
        };
      const o = object(item);
      const name = str(
        first(o, ["name", "title", "categoryName", "category_name", "label"]),
        "",
      ).trim();
      if (!name) return null;
      const slug = str(
        first(o, ["slug", "categorySlug", "category_slug"]),
        slugify(name),
      );
      return {
        name,
        slug,
        emoji: str(first(o, ["emoji", "icon"]), emojiFor(slug, name)),
      };
    })
    .filter((item): item is Category => item !== null);
}
function findCategory(
  categories: Category[],
  identifier: string,
): Category | undefined {
  return categories.find(
    (category) => category.slug === identifier || category.name === identifier,
  );
}
function categoriesFromProducts(products: Product[]): Category[] {
  const derived = new Map<string, Category>();
  for (const product of products) {
    derived.set(product.categorySlug, {
      name: product.category,
      slug: product.categorySlug,
      emoji: emojiFor(product.categorySlug, product.category),
    });
  }
  return Array.from(derived.values());
}
async function remoteProducts(): Promise<Product[]> {
  const payload = await fetchJson(`${API_BASE}/products`);
  const list = payload
    ? unwrapList(payload)
        .map(mapProduct)
        .filter((item): item is Product => item !== null)
    : [];
  if (list.length) return list;
  return fallbackProducts;
}
export async function getProducts(): Promise<Product[]> {
  return remoteProducts();
}
export async function getProduct(
  slugOrId: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  return findProduct(products, decodeIdentifier(slugOrId));
}
export type ProductLookup =
  | { status: "found"; product: Product }
  | { status: "not-found" }
  | { status: "unavailable" };
export async function lookupProduct(slugOrId: string): Promise<ProductLookup> {
  const identifier = decodeIdentifier(slugOrId);
  const result = await fetchApiJson(`${API_BASE}/products`);
  if (result.ok) {
    const rawProducts = extractList(result.payload);
    if (!rawProducts) {
      const fallback = findProduct(fallbackProducts, identifier);
      return fallback
        ? { status: "found", product: fallback }
        : { status: "unavailable" };
    }
    const remote = rawProducts
      .map(mapProduct)
      .filter((product): product is Product => product !== null);
    if (remote.length) {
      const product = findProduct(remote, identifier);
      return product ? { status: "found", product } : { status: "not-found" };
    }
    const fallback = findProduct(fallbackProducts, identifier);
    if (fallback) return { status: "found", product: fallback };
    return rawProducts.length
      ? { status: "unavailable" }
      : { status: "not-found" };
  }
  const fallback = findProduct(fallbackProducts, identifier);
  return fallback
    ? { status: "found", product: fallback }
    : { status: "unavailable" };
}
export type CategoryLookup =
  | { status: "found"; category: Category }
  | { status: "not-found" }
  | { status: "unavailable" };
export async function lookupCategory(slug: string): Promise<CategoryLookup> {
  const identifier = decodeIdentifier(slug);
  const fallback = findCategory(fallbackCategories, identifier);
  if (fallback) return { status: "found", category: fallback };

  const categoryResult = await fetchApiJson(`${API_BASE}/categories`);
  if (categoryResult.ok) {
    const remoteCategories = mapCategories(categoryResult.payload);
    if (remoteCategories.length) {
      const category = findCategory(remoteCategories, identifier);
      return category ? { status: "found", category } : { status: "not-found" };
    }
  }

  const productsResult = await fetchApiJson(`${API_BASE}/products`);
  if (productsResult.ok) {
    const rawProducts = extractList(productsResult.payload);
    if (!rawProducts) return { status: "unavailable" };
    const remoteProducts = rawProducts
      .map(mapProduct)
      .filter((product): product is Product => product !== null);
    if (rawProducts.length && !remoteProducts.length) {
      return { status: "unavailable" };
    }
    const categories = remoteProducts.length
      ? categoriesFromProducts(remoteProducts)
      : fallbackCategories;
    const category = findCategory(categories, identifier);
    return category ? { status: "found", category } : { status: "not-found" };
  }

  return { status: "unavailable" };
}
export async function getProductsByCategory(slug: string): Promise<Product[]> {
  if (slug === "all" || slug === "সব-পণ্য") return getProducts();
  const payload = await fetchJson(
    `${API_BASE}/products?category=${encodeURIComponent(slug)}`,
  );
  const remote = payload
    ? unwrapList(payload)
        .map(mapProduct)
        .filter((item): item is Product => item !== null)
    : [];
  if (remote.length) return remote;
  const products = await getProducts();
  const category = fallbackCategories.find(
    (c) => c.slug === slug || slugify(c.name) === slug,
  );
  return products.filter(
    (p) =>
      p.categorySlug === slug ||
      slugify(p.category) === slug ||
      (category && p.categorySlug === category.slug),
  );
}
export async function getCategories(): Promise<Category[]> {
  const payload = await fetchJson(`${API_BASE}/categories`);
  const remote = payload ? mapCategories(payload) : [];
  if (remote.length)
    return [
      { name: "সব পণ্য", slug: "all", emoji: "🧺" },
      ...remote.filter((c) => c.slug !== "all"),
    ];
  const products = await getProducts();
  return [
    { name: "সব পণ্য", slug: "all", emoji: "🧺" },
    ...categoriesFromProducts(products),
  ];
}
export function fallbackCatalog(): Product[] {
  return fallbackProducts;
}
