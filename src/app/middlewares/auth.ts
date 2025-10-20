import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express"
import { jwtHelper } from "../helper/jwtHelper"
import config from "../../config"
import APIError from "../errors/APIError"

const auth = (...roles: string[]) => {
  return async(req: Request & {user?: any}, res: Response, next: NextFunction) =>{
    try {
      const token = req.cookies.accessToken

      if(!token){
        throw new APIError(httpStatus.UNAUTHORIZED,"No Token Found")
      }

      const verifyUser = jwtHelper.verifyToken(token, config.jwt_secret as string)

      req.user = verifyUser

      if(roles.length && !roles.includes(verifyUser.role)){
        throw new APIError(httpStatus.UNAUTHORIZED,"You are not authorized")
      }

      next()

    } catch (error) {
      next(error)
    }
  }
}

export default auth