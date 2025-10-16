import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { prisma } from "../../shared/prisma";
import pick from "../../helper/pick";
import { userFilterableFields, userOptionalFields } from "./user.constant";

const createPatient = catchAsync(async(req: Request, res: Response)=>{
  const result = await userServices.createPatient(req)
  
  sendResponse(res, {
    statusCode:201,
    success:true,
    message:"🏥Patient Created Successfully",
    data: result
  })
})

const createAdmin = catchAsync(async(req: Request, res: Response)=>{
  const result = await userServices.createAdmin(req)
  
  sendResponse(res, {
    statusCode:201,
    success:true,
    message:"🧑🏻‍💼Admin Created Successfully",
    data: result
  })
})

const createDoctor = catchAsync(async(req: Request, res: Response)=>{
  const result = await userServices.createDoctor(req)
  
  sendResponse(res, {
    statusCode:201,
    success:true,
    message:"👨🏻‍⚕️Doctor Created Successfully",
    data: result
  })
})

const getAllUser = catchAsync(async(req:Request, res: Response) => {
  const options = pick(req.query, userOptionalFields)
  const filters = pick(req.query, userFilterableFields)
  
  const result = await userServices.getAllUser(filters, options)

  sendResponse(res, {
    statusCode:200,
    success:true,
    message:"All User retrieve successfully",
    meta: result.meta,
    data: result.data
  })
})

export const userController = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllUser
}