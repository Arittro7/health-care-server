import  express  from 'express';
import { DoctorScheduleController } from './doctorSchedule.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { doctorScheduleValidation } from './doctorSchedule.validation';

const router = express.Router()

router.post("/",
  auth(UserRole.DOCTOR),
  validateRequest(doctorScheduleValidation.createDoctorScheduleValidationSchema),
  DoctorScheduleController.insertIntoDB )


export const doctorScheduleRoutes = router