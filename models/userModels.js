const mongoose = require('mongoose');
const Counter = require('./Counter');

const userSchema = new mongoose.Schema({
    userId : {type:String, unique:true},
    first_name:{type:String},
    last_name:{type:String},
    mobile:{type:Number, required:true},
    email:{type:String, unique:true},
    password: { type: String },
    confirm_password: {type: String},
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    role:{type:String,enum:['user','admin'],default:'user'}
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
})

module.exports = mongoose.model('User',userSchema);
