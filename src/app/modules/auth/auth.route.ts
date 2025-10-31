import { UserRole } from '@prisma/client';
import { authController } from './auth.controller';
import express from "express"
import auth from '../../middlewares/auth';

const router = express.Router()

router.get(
    "/me",
    authController.getMe
)

router.post("/login", authController.login
)

router.post(
    '/refresh-token',
    authController.refreshToken
)

router.post(
    '/change-password',
    auth(
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
    ),
    authController.changePassword
);

router.post(
    '/forgot-password',
    authController.forgotPassword
);

router.post(
    '/reset-password',
    authController.resetPassword
)

export const authRoutes = router