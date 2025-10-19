import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse"
import { DoctorScheduleService } from "./doctorSchedule.service"
import { IJWTPayload } from "../../types/common"

const insertIntoDB = catchAsync(async (req: Request & {user?:IJWTPayload}, res:Response) =>{
  const user = req.user;

  const result = await DoctorScheduleService.insertIntoDB(user as IJWTPayload, req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message:"Schedule Deleted Successfully",
    data: result
  })
}) 

export const DoctorScheduleController ={
  insertIntoDB
}