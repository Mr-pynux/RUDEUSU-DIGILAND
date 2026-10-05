import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const seedCodes: Record<string, string[]> = {
  "gemini-pro-12-months": [
    "GEM-7K2P-9DQM-XT4A",
    "GEM-2P9K-QW3N-88MJ",
    "GEM-XR41-TT5R-91XQ",
    "GEM-MLW2-KD83-PP7N",
    "GEM-QW9S-4NDK-2RFA",
  ],
  "chatgpt-plus-1-month": [
    "GPT-3HQ8-LMD2-77XA",
    "GPT-9KWM-2PTR-5NBQ",
    "GPT-XQ47-2LMW-TT5R",
    "GPT-88MJ-7HK2-9DQM",
  ],
  "iptv-premium-12-months": [
    "IPTV-91XQ-2LMW-TT5R",
    "IPTV-4NDK-2RFA-88MJ",
    "IPTV-7HK2-9DQM-XQ41",
  ],
};

async function main() {
  for (const [slug, codes] of Object.entries(seedCodes)) {
    const product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      console.log(`skip (not found): ${slug}`);
      continue;
    }
    let added = 0;
    for (const value of codes) {
      const exists = await db.code.findUnique({
        where: { productId_value: { productId: product.id, value } },
      });
      if (!exists) {
        await db.code.create({ data: { value, productId: product.id } });
        added++;
      }
    }
    console.log(`${slug}: +${added} codes`);
  }
  console.log("done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
