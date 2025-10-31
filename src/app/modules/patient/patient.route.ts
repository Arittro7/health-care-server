import express from 'express';
import { PatientController } from './patient.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
    '/',
    PatientController.getAllFromDB
);

router.get(
    '/:id',
    PatientController.getByIdFromDB
);


router.delete(
    '/soft/:id',
    PatientController.softDelete
);

router.patch(
    '/',
    auth(UserRole.PATIENT),
    PatientController.updateIntoDB
);


export const PatientRoutes = router;