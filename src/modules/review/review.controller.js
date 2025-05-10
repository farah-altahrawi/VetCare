import appointmentModel from '../../../DB/models/appointment.model.js';
import reviewModel from '../../../DB/models/review.model.js';

export const create = async(req,res)=>{
    
    const userId = req.id;
    const {id} = req.params;
    const {comment,rating} = req.body;

    const appointment = await appointmentModel.findOne({
        userId:userId,
        status:'completed',
        _id:id
    });

    if(!appointment){
        return res.status(400).json({message:"can not review this vet"});
    }

    const review = await reviewModel.create({
        comment,
        rating,
        vetId:appointment.vetId,
        createdBy:userId
    });

    if(!review){
        return res.status(400).json({message:"error while adding review"});
    }

    return res.status(201).json({message:"success"});

}