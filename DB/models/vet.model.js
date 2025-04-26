import { Schema , model , mongoose } from "mongoose";

const vetSchema = new Schema (
    {
        vetName:{
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
        image: {
            type: Object,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        status: {
            type: String,
            default:'active',
            enum: ['active','not_active'],
        },
        availableTimes: [{
            day: {
            type: String,
            required: true, 
        },
        startTime: {
            type: String,
            required: true, 
            },
        endTime: {
            type: String,
            required: true, 
            },
        }],

    },
    {
        timestamps: true,
    }
);

const vetModel = mongoose.model.Vet || model('Vet', vetSchema);
export default vetModel; 