import { Schema , model , mongoose, Types } from "mongoose";

const vetSchema = new Schema (
    {
        vetName:{
            type:String,
            required:true,
            min: 3,
            max: 50,
        },
        image: {
            type: Object,
        },
        contact: {
            phone: {
                type: String,
                required:true,
            },
            address: {
                type: String,
                required:true,
            },
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
        availableAppointments: [{
            type: Date,
        }],
        userId:{
            type: Types.ObjectId,
            required:true,
            ref:'User',
        },

    },
    {
        timestamps: true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true},
    }
);

vetSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'vetId'
});

const vetModel = mongoose.model.Vet || model('Vet', vetSchema);
export default vetModel; 