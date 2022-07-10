const { PrismaClient } = require("@prisma/client")
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()
const isLogin = async (token)=>{
    try{
        var data = jwt.verify(token, process.env.TOKEN_SECRET_JWT)
        const customer = await prisma.customer.findFirst({
            select:{
                id:true,
                firstname:true,
                lastname:true,
                email:true
            },      
            where:{
                email:data.email
            }
        })
        const merchant = await prisma.merchant.findFirst({
            select:{
                id:true,
                firstname:true,
                lastname:true,
                email:true
            },      
            where:{
                email:data.email
            }
        })
        if (customer) {
            customer['role'] = "customer" 
        }else{
            merchant['role'] = "merchant" 
        }
        var user = customer ? customer : merchant        
        return user
    }catch(error){        
        return error
    }
}

module.exports = {isLogin}