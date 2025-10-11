import  bcrypt  from 'bcryptjs';
import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import jwt from 'jsonwebtoken'
import config from '../../../config';
import { jwtHelper } from '../../helper/jwtHelper';

const login = async(payload: {email:string, password:string})=>{
  const user = await prisma.user.findUniqueOrThrow({
    where:{
      email:payload.email,
      status:UserStatus.ACTIVE
    }
  })

  const isCorrectPassword = await bcrypt.compare(payload.password, user.password)
  if(!isCorrectPassword){
    throw new Error("Password is Incorrect")
  }

  const accessToken = jwtHelper.generateToken({email: user.email, role: user.role}, config.jwt_secret as string, "1h")

  const refreshToken = jwtHelper.generateToken({email: user.email, role: user.role}, config.jwt_secret as string, "90d")

  return {
    accessToken,
    refreshToken
  }
}

export const authService={
  login
}
