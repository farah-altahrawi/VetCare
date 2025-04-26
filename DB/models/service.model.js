import { Schema , model , mongoose, Types} from "mongoose";

const serviceSchema = new Schema (
    {
        name:{
            type:String,
            required:true,
            unique:true,
            trim: true,
        },
        description:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        duration:{
            type:Number,
            required:true,
        },
        available:{
            type:Boolean,
            default:true,
            required:true,
        },
        slug: {
            type:String,
            required:true,
        },
        mainImage: {
            type: Object,
            required:true,
        },
        subImages: [
            {
                type: Object,
            },
        ],
        createdBy: {
            type: Types.ObjectId,
            ref:'User',
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const serviceModel = mongoose.model.Service || model('Service',serviceSchema);
export default serviceModel; 