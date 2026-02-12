import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Testing Prisma connection...')

  const complaint = await prisma.complaint.create({
    data: {
      title: 'Test',
      body: 'Test body',
      authorName: 'John',
      category: 'roads',
      location: 'Main St',
    },
  })

  console.log('Created complaint:', complaint)

  const all = await prisma.complaint.findMany()
  console.log('All complaints:', all)

  await prisma.complaint.deleteMany()
  console.log('Deleted all complaints')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
