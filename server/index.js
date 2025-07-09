const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
// OR allow specific origin:
app.use(cors({
  origin: 'https://www.adminpa.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.options('*', cors({
  origin: 'https://www.adminpa.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const connectDB = require('./config/db');
connectDB();

const adminRoutes = require("./routes/adminRoutes");
const patientRoutes = require("./routes/patientRoutes");
const visitRoutes = require("./routes/visitRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const upcomingRoutes = require('./routes/upcomingRoutes');



app.use(express.json());

app.post('/',(req,res)=>{
    console.log(req.body);
    res.json({message : "Its Begining"});
})
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/admin",adminRoutes);
app.use("/api/patients",patientRoutes);
app.use("/api/visits",visitRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/upcoming", upcomingRoutes);


app.listen(process.env.PORT,(err)=>{
    if(err){
        console.log(err.message);
        return;
    }
    console.log("http://localhost:5000");
})