import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentServices } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";

const createAppointment = catchAsync(async(req: Request & {user?: IJWTPayload}, res:Response, ) =>{
  const user = req.user
  const result = await AppointmentServices.createAppointment(user as IJWTPayload, req.body)

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Appointment created Successfully",
    data: result
  })
})

export const AppointmentController = {
  createAppointment
}