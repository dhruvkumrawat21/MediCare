import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import { cancelAppointment, confirmPayment, createAppointment, getAppointmentByDoctor, getAppointmentByPatient, getAppointments, getRegisterUserCount, getStats, updateAppointment } from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAppointments);
appointmentRouter.get("/confirm", confirmPayment);
appointmentRouter.get("/stats/summary", getStats);


//authentic Routes
appointmentRouter.post('/', clerkMiddleware(), requireAuth(), createAppointment);
appointmentRouter.get("/me", clerkMiddleware(), requireAuth(), getAppointmentByPatient);

appointmentRouter.get("/doctor/:doctorId", getAppointmentByDoctor);

appointmentRouter.post("/:id/cancel", cancelAppointment);
appointmentRouter.get('/paitents/count', getRegisterUserCount);
appointmentRouter.put("/:id", updateAppointment);

export default appointmentRouter;
