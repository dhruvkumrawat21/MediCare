import express from "express";
import { clerkMiddleware } from '@clerk/express'
import cors from 'cors';
import 'dotenv/config';
import { urlencoded } from "body-parser";
import { connectDB } from "./config/db.js";
import doctorRouter from "./routes/doctorRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import appointmentRouter from "./routes/appiontmentRouter.js";
import serviceAppointmentRouter from "./routes/serviceAppointmentRouter.js";

const app = express();
const PORT = 4000;

const allowedOrigins = [
    "https://medicare-frontend-yi0l.onrender.com",
    "https://medicare-admin-4ccd.onrender.com",
]


//Middlewares 
app.use(cors(
    {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true)
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
));
app.use(clerkMiddleware());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));



//DB
connectDB();



//Routes
app.use("/api/doctors", doctorRouter);
app.use("/api/services", serviceRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/service-appointments", serviceAppointmentRouter)

app.get("/", (req, res) => {
    res.send("Api Working ");
})

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`)
})