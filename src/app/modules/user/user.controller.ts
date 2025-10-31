import  httpStatus  from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import { userFilterableFields, userOptionalFields } from "./user.constant";
import { IJWTPayload } from "../../types/common";

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

const getMyProfile = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user;

    const result = await userServices.getMyProfile(user as IJWTPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});

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

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await userServices.changeProfileStatus(id, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
});

const updateMyProfile = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user;

    const result = await userServices.updateMyProfile(user as IJWTPayload, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile updated!",
        data: result
    })
});

export const userController = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllUser,
  getMyProfile,
  changeProfileStatus,
  updateMyProfile
}