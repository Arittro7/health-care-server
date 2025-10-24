import express from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { scheduleRoutes } from '../modules/schedule/schedule.route';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.routes';
import { DoctorRoutes } from '../modules/doctor/doctor.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { PatientRoutes } from '../modules/patient/patient.route';


const router = express.Router();

const moduleRoutes = [
    
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/schedule',
        route: scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/doctor',
        route: DoctorRoutes
    },
    {
        path: '/patient',
        route: PatientRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;