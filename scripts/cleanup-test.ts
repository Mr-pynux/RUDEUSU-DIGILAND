import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  await db.order.deleteMany({ where: { buyerEmail: "test@digiland.dev" } });
  // restore stock: add back what the test consumed
  await db.product.update({ where: { slug: "gemini-pro-12-months" }, data: { stock: { increment: 1 } } });
  await db.product.update({ where: { slug: "iptv-premium-12-months" }, data: { stock: { increment: 2 } } });
  console.log("cleanup done");
}
main().finally(() => db.$disconnect());
