import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

/**
 * Demo Gmail accounts for ACCOUNT-delivery products (Gemini Pro & other AI).
 * These are what the buyer receives as "Gmail / password" after payment.
 */
const seedAccounts: Record<string, { email: string; password: string; extra?: string }[]> = {
  "gemini-pro-12-months": [
    { email: "rudeusu.gem01@gmail.com", password: "Gm#92kQzLx4", extra: "Recovery: rudeusu.recovery@gmail.com" },
    { email: "rudeusu.gem02@gmail.com", password: "Gm#71pWnVb8", extra: "Recovery: rudeusu.recovery@gmail.com" },
    { email: "rudeusu.gem03@gmail.com", password: "Gm#48mTrJs2", extra: "Recovery: rudeusu.recovery@gmail.com" },
    { email: "rudeusu.gem04@gmail.com", password: "Gm#36cXyHd9", extra: "Recovery: rudeusu.recovery@gmail.com" },
  ],
  "chatgpt-plus-1-month": [
    { email: "rudeusu.gpt01@gmail.com", password: "Gp#65rBkMw3" },
    { email: "rudeusu.gpt02@gmail.com", password: "Gp#29sNqFx7" },
    { email: "rudeusu.gpt03@gmail.com", password: "Gp#84jLpZt5" },
  ],
  "claude-pro-1-month": [
    { email: "rudeusu.claude01@gmail.com", password: "Cl#53wKdRm8" },
    { email: "rudeusu.claude02@gmail.com", password: "Cl#27vHsGn6" },
  ],
};

async function main() {
  // Make sure the ACCOUNT products use ACCOUNT delivery
  for (const slug of Object.keys(seedAccounts)) {
    const product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      console.log(`skip (not found): ${slug}`);
      continue;
    }
    if (product.deliveryKind !== "ACCOUNT") {
      await db.product.update({ where: { slug }, data: { deliveryKind: "ACCOUNT" } });
      console.log(`${slug}: deliveryKind -> ACCOUNT`);
    }
    let added = 0;
    for (const acc of seedAccounts[slug]) {
      const exists = await db.account.findUnique({
        where: { productId_email: { productId: product.id, email: acc.email } },
      });
      if (!exists) {
        await db.account.create({
          data: {
            email: acc.email,
            password: acc.password,
            extra: acc.extra ?? "",
            productId: product.id,
          },
        });
        added++;
      }
    }
    console.log(`${slug}: +${added} accounts`);
  }
  console.log("done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
