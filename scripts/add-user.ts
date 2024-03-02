import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const saltRounds = 10;
    const PlaintextPassword = 'password';
    const pass = await bcrypt.hash(PlaintextPassword, saltRounds);
    const user = await prisma.user.create({
      data: {
        userName: 'admin',
        password: pass,
      },
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