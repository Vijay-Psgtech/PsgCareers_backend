const mongoose = require('mongoose');
const Counter = require('./Counter');

const userSchema = new mongoose.Schema({
    userId : {type:String, unique:true},
    first_name:{type:String},
    last_name:{type:String},
    mobile:{type:Number, required:true},
    email:{type:String, unique:true, lowercase: true, trim: true},
    password: { type: String },
    confirm_password: {type: String},
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    institution : { type: String },
    jobCategory : { type: String},
    about : { type: String },
    role:{type:String,enum:['user','admin','superadmin'],default:'user'},
    location: { type: String },
    photo: { type: String }, // path to uploaded image
    passwordChangeCount: {
        type: Number,
        default: 0,
    },
    loginHistory: [
        {
        ip: String,
        userAgent: String,
        timestamp: { type: Date, default: Date.now },
        },
    ],
});

//Auto-generate userId before Saving
userSchema.pre('save', async function(next){
    if(this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.userId = `UID-${String(counter.seq).padStart(4, '0')}`;
    }
    next();
});

// ✅ Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User',userSchema);
