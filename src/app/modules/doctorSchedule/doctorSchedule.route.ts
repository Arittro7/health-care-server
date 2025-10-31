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

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    DoctorScheduleController.getAllFromDB
);

router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedule
)


router.delete(
    '/:id',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.deleteFromDB
);



export const doctorScheduleRoutes = router