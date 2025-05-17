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
    console.log("appointment:", appointment);


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

    return res.status(201).json({message:"Review created successfully"});

}

export const remove = async(req,res)=>{
        const {id} = req.params;

        const review = await reviewModel.findOneAndDelete({_id:id, createdBy:req.id});
    
        if(!review){
            return res.status(404).json({message:"review not found"});
        }
    
        return res.status(200).json({message:"Review removed successfully"});
    
}


export const update = async (req,res)=>{

    const {id} = req.params;
    const {comment,rating} = req.body;

    const review = await reviewModel.findOne({_id:id,createdBy:req.id});

    if(!review){
        return res.status(404).json({message:"review not found"});
    }

    if(comment){
        review.comment = comment;
    }
    if(rating){
        review.rating = rating;
    }
    await review.save();

    return res.status(200).json({message:"Review updated successfully"});
}