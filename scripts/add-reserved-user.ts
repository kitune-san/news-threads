// usage: npx env-cmd -f .env.local tsx scripts/add-reserved-user.ts

import { PrismaClient } from '@/prisma/generated/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.createMany({
      data: [
        { userName: 'null'},
        { userName: 'nul'},
        { userName: 'undefined'},
        { userName: 'undefine'},
        { userName: 'undef'},
        { userName: 'user'},
        { userName: 'root'},
        { userName: 'admin'},
        { userName: 'administrator'},
        { userName: 'supervisor'},
        { userName: 'anonymous'},
        { userName: 'anonymous-coward'},
        { userName: 'anonymous_coward'},
      ],
    })
    console.log(user)
  }
  
  main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })