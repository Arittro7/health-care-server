import  httpStatus  from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentServices } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import pick from '../../helper/pick';
import { appointmentFilterableFields } from './appointment.constant';

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

const getMyAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, ["status", "paymentStatus"])
    const user = req.user;
    const result = await AppointmentServices.getMyAppointment(user as IJWTPayload, fillters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment fetched successfully!",
        data: result
    })
})

const updateAppointmentStatus = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const result = await AppointmentServices.updateAppointmentStatus(id, status, user as IJWTPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment updated successfully!",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, appointmentFilterableFields)
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await AppointmentServices.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Appointment retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  updateAppointmentStatus,
  getAllFromDB
}