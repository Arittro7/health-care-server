import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { authService } from "./auth.service";

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  needPasswordChange?: boolean;
}


const login = catchAsync(async(req: Request, res: Response) : Promise<void>=>{
  const result:LoginResult = await authService.login(req.body)

  const {accessToken, refreshToken, needPasswordChange} = result

  res.cookie("accessToken", accessToken,{
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 //millisecond * 60 = 60 second * 60 = 60 minute or 1h
  })

  res.cookie("refreshToken", refreshToken,{
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 90 //ms * 60 = 60 sec * 60 = 60 m * 24 = 1d * 90 = 90 day
  })
  
  sendResponse(res, {
    statusCode:201,
    success:true,
    message:"User Login Successfully",
    data: {
      needPasswordChange
    }
  })
})

export const authController = {
  login
}