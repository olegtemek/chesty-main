import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const accessKeys = await prisma.accessKey.createMany({
    data: [{ key: 'test' }, { key: 'test2' }],
  });

  console.log({ accessKeys });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
