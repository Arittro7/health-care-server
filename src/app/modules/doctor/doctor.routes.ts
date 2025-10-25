import express from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.get(
    "/",
    DoctorController.getAllFromDB
)
// AI Route
router.post("/suggestion", DoctorController.getAISuggestion)

router.patch(
    "/:id",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    DoctorController.updateIntoDB
);

router.get('/:id', DoctorController.getByIdFromDB);

router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    DoctorController.deleteFromDB
);


export const DoctorRoutes = router;