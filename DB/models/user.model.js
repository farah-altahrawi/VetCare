import { Schema , model , mongoose } from "mongoose";

const userSchema = new Schema (
    {
        userName:{
            type:String,
            required:true,
            min: 3,
            max: 50,
        },
        email: {
            type:String,
            required:true,
            unique: true,
        },
        password: {
            type:String,
            required:true,
            min: 4,
        },
        image: {
            type: Object,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        confirmEmail: {
            type: Boolean,
            default: false,
        },
        gender: {
            type: String,
            enum: ['Male','Female'],
        },
        status: {
            type: String,
            default:'active',
            enum: ['active','not_active'],
        },
      
        role: {
            type: String,
            default:'user',
            enum: ['superadmin','admin','user','vet'],
        },
        sendCode: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model.User || model('User', userSchema);
export default userModel; 