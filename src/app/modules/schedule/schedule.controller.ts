import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import pick from "../../helper/pick";
import { queryFilterableFields, queryOptionalFields } from "../../shared/queryFields";
import { IJWTPayload } from "../../types/common";

const insertIntoDB = catchAsync(async(req:Request, res:Response) =>{
  const result = await ScheduleService.insertIntoDB(req.body)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message:"Schedule Created Successfully",
    data: result
  })
})

const scheduleForDoctor = catchAsync(async (req: Request & {user?: IJWTPayload}, res:Response) =>{
  const options = pick(req.query, queryOptionalFields)
  const filter = pick(req.query, queryFilterableFields)

  const user = req.user

  const result = await ScheduleService.schedulesForDoctor(user as IJWTPayload, filter, options)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message:"Schedule Created Successfully",
    meta: result.meta,
    data: result.data
  })
})

const deleteScheduleFromDB = catchAsync(async (req: Request, res:Response) =>{
  const result = await ScheduleService.deleteScheduleFromDB(req.params.id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message:"Schedule Deleted Successfully",
    data: result
  })
}) 

export const ScheduleController ={
  insertIntoDB,
  scheduleForDoctor,
  deleteScheduleFromDB
}