const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const roles = await prisma.domainMember.findMany({
      where: { pendingRole: { not: null } }
    });
    console.log('Pending roles:', roles);
  } catch (err) {
    console.error('ERROR', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
