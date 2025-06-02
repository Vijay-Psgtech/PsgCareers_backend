const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Import your route modules
const authRoutes = require('./routes/authRoutes.js');
const jobPostRoutes = require('./routes/jobPostRoutes.js');
const dropDownRoutes = require('./routes/dropDownRoutes.js');

app.use('/api/auth',authRoutes);
app.use('/api/jobPost',jobPostRoutes);
app.use('/api/dropDown',dropDownRoutes);


/*MongoDB connection*/
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('✅ Server running on http://localhost:'+process.env.PORT)
    })
})
.catch(err=>console.error('MongoDB error'+err));