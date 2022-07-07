const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient()

const login = async (req,res,next) => {
  const customer = await prisma.customer.findFirst({
    where:{
      email:req.body.email
    }
  })
  const merchant = await prisma.customer.findFirst({
    where:{
      email:req.body.email
    }
  })
  try {
    var token
    if (customer) {  
      if (bcrypt.compareSync(req.body.password,customer.password)) {        
        token = jwt.sign({
          id:customer.id,
          name:customer.firstname+" "+customer.lastname,
          email:customer.email
        },process.env.TOKEN_SECRET_JWT,{expiresIn:"1h"})
      }else{
        res.status(500).json({
          data : null,
          message: "Password tidak sesuai"
        })  
      }    
    }else if(merchant){
      if (bcrypt.compareSync(req.body.password,merchant.password)) {    
        token = jwt.sign({
          id:merchant.id,
          name:merchant.firstname+" "+merchant.lastname,
          email:merchant.email
        },process.env.TOKEN_SECRET_JWT,{expiresIn:"1h"})
      }else{
        res.status(500).json({
          data : null,
          message: "Password tidak sesuai"
        })  
      }
    }else{
      res.status(404).json({
        data : null,
        message: "Akun Tidak ditemukan"
      })
    }
    var user = customer ? customer : merchant;
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }).status(200).json({
      success:true,
      token:token,
      data:{
        user:user,        
      }
    }) 
  } catch (error) {
    return next(error);
  }  
}

const logout = (req,res)=>{
  return res.clearCookie('access_token').status(200).json({message:"Sukses Logout"})
}

// const refreshToken = (req,res){

// }

module.exports = {login,logout}