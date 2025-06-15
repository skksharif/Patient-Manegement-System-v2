const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
app.use(cors());
const connectDB = require('./config/db');
connectDB();

const adminRoutes = require("./routes/adminRoutes");
const patientRoutes = require("./routes/patientRoutes");
const visitRoutes = require("./routes/visitRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");


app.use(express.json());

app.post('/',(req,res)=>{
    console.log(req.body);
    res.json({message : "Its Begining"});
})

app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/admin",adminRoutes);
app.use("/api/patients",patientRoutes);
app.use("/api/visits",visitRoutes);
app.use("/api/enquiries", enquiryRoutes);


app.listen(process.env.PORT,(err)=>{
    if(err){
        console.log(err.message);
        return;
    }
    console.log("http://localhost:5000");
})