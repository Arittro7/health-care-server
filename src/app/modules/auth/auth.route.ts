import { authController } from './auth.controller';
import express from "express"

const router = express.Router()

router.post("/login", authController.login
)

export const authRoutes = router