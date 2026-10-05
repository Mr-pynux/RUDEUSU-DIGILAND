import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const email = "omar.khaled.test@gmail.com";
  const orders = await db.order.findMany({ where: { buyerEmail: email } });
  for (const o of orders) {
    await db.emailLog.deleteMany({ where: { orderId: o.id } });
    // free allocated accounts/codes
    await db.account.updateMany({ where: { orderShortId: o.shortId }, data: { sold: false, orderShortId: null } });
    await db.code.updateMany({ where: { orderShortId: o.shortId }, data: { sold: false, orderShortId: null } });
    await db.product.updateMany({ where: { slug: "gemini-pro-12-months" }, data: { stock: { increment: 1 }, sold: { decrement: 1 } } });
  }
  await db.order.deleteMany({ where: { buyerEmail: email } });
  console.log("cleanup t4 browser test done, removed", orders.length, "orders");
}
main().finally(() => db.$disconnect());
