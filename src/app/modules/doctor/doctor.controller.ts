import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import sendResponse from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constant";

const getAllFromDB = catchAsync(async(req:Request, res:Response) =>{
  const options =pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
  const filter = pick(req.query, doctorFilterableFields) 

  const result = await DoctorService.getAllFromDB(filter, options)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor fetched successfully!",
    meta:result.meta,
    data: result.data
  })
})

const updateIntoDB = catchAsync(async(req:Request, res:Response) =>{
  const {id} = req.params
  const result = await DoctorService.updateIntoDB(id, req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor Updated successfully!",
    data: result
  })
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor retrieval successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor deleted successfully',
        data: result,
    });
});

// AI suggestion
const getAISuggestion = catchAsync(async(req:Request, res:Response) =>{

 const result = await DoctorService.getAISuggestion(req.body)

 sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'AI suggestion fetched successfully',
        data: result,
    });
})

export const DoctorController = {
  getAllFromDB,
  updateIntoDB,
  getByIdFromDB,
  deleteFromDB,
  getAISuggestion
}