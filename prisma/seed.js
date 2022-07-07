const {PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient();

async function main(){
  const customer = await prisma.customer.create({
    data:{
      firstname: "Asep",
      lastname : "Suryana",
      email : "asep@gmail.com",
      password: bcrypt.hashSync('12345678', 10)
    }
  })

  const merchant = await prisma.merchant.create({
    data:{
      firstname: "Budi",
      lastname : "Santoso",
      email : "budi@gmail.com",
      password: bcrypt.hashSync('12345678', 10),
      storeName : 'Budi Komputer'
    }
  })
}
main()