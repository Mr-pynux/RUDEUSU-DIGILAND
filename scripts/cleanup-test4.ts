import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const email = "buyer.test.4@gmail.com";
  // delete emails tied to the test orders
  const orders = await db.order.findMany({ where: { buyerEmail: email } });
  for (const o of orders) {
    await db.emailLog.deleteMany({ where: { orderId: o.id } });
  }
  // free the allocated key again
  await db.code.updateMany({ where: { orderShortId: "RD-3H2K-X36H" }, data: { sold: false, orderShortId: null } });
  // restore product counters
  await db.product.update({ where: { slug: "iptv-premium-12-months" }, data: { stock: { increment: 1 }, sold: { decrement: 1 } } });
  // delete the test order
  await db.order.deleteMany({ where: { buyerEmail: email } });
  console.log("cleanup task4 done");
}
main().finally(() => db.$disconnect());
