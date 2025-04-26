import { Schema , model , mongoose, Types} from "mongoose";

const reviewSchema = new Schema (
    {
        comment:{
            type:String,
            required:true,
            min: 3,
            max: 50,
        },
        rating: {
            type:Number,
            required:true,
            min: 1,
            max: 5,
        },      
        createdBy: {
            type: Types.ObjectId,
            ref:'User',
            required:true,
        },
        productId:{
            type: Types.ObjectId,
            ref:'Product',
            required:true,
        }
    },
    {
        timestamps: true,
    }
);

const reviewModel = mongoose.model.Review || model('Review',reviewSchema);
export default reviewModel; 