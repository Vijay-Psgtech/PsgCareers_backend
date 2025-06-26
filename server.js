const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import your route modules
const authRoutes = require('./routes/authRoutes.js');
const jobPostRoutes = require('./routes/jobPostRoutes.js');
const personalDetailsRoutes = require('./routes/personalDetailsRoutes.js');
const educationRoutes = require('./routes/educationRoutes.js');
const workExperienceRoutes = require('./routes/workExperienceRoutes.js');
const dropDownRoutes = require('./routes/dropDownRoutes.js');
const applicationRoutes = require('./routes/ApplicationRoutes.js');
const otherDetailsRoutes = require('./routes/otherDetailsRoutes.js');
const researchRoutes = require('./routes/researchRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const visitorRoutes = require('./routes/visitors');

// Use routes
app.use('/api/auth',authRoutes);
app.use('/api/jobPost',jobPostRoutes);
app.use('/api/personalDetails', personalDetailsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/workExperience',workExperienceRoutes);
app.use('/api/dropDown',dropDownRoutes);
app.use('/api/applications',applicationRoutes);
app.use('/api/otherDetails', otherDetailsRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/visitors', visitorRoutes);


/*MongoDB connection*/
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('✅ Server running on http://localhost:'+process.env.PORT)
    })
})
.catch(err=>console.error('MongoDB error'+err));