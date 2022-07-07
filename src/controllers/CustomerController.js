const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const getIndex = async (req, res)=>{  
  const customer = await prisma.customer.findMany({
    select:{
      firstname:true,
      lastname:true,
      email:true,
      _count:true,
      chatsRooms:true
    },
  })
  res.status(200).json(customer)
}

module.exports = {getIndex}