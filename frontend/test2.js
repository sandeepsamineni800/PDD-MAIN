const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const domains = await prisma.domain.findMany({
      where: {
        members: {
          some: {
            status: 'ACCEPTED'
          }
        }
      }
    });
    console.log('OK', domains.length);
  } catch (err) {
    console.error('ERROR', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
