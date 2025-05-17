import vetModel from "../../../DB/models/vet.model.js";
import userModel from "../../../DB/models/user.model.js";

export const getAllVets = async (req,res)=>{

        const vets = await vetModel.find({}).select('vetName contact availableTimes');
        if(vets.length === 0){
            return res.status(200).json({message:"No Vets Found",vets});
        }
        return res.status(200).json({message:"success",vets});
}

export const getActiveVets = async (req,res)=>{

    const vets = await vetModel.find({}).populate('userId', 'status');
    const activeVets = vets.filter(vet => vet.userId?.status === 'active');
    if(activeVets.length === 0){
        return res.status(200).json({message:"No Vets Found",vets:activeVets});
    }
    return res.status(200).json({message:"success",vets});
}

export const getVet = async (req,res)=>{
        const {id} = req.params;
    
        const vet = await vetModel.findById(id).select('-password').populate('reviews');
        if(!vet){
            return res.status(404).json({message:"Vet Not Found"});
        }
        return res.status(200).json({message:"success",vet});
    
}

export const addAvailableAppointments = async(req,res)=>{
    const {availableAppointments} = req.body;

    const vet = await vetModel.findOne({userId:req.id});

    if(!vet){
        return res.status(404).json({message:"vet nou found"});
    }

    for (const date of availableAppointments){
        vet.availableAppointments.push(new Date(date));
    }
    await vet.save();

    return res.status(200).json({message:"Appointment added successfully",vet});


}

export const updateVet = async(req,res)=>{

        const userId = req.id;
        const {contact,availableTimes,availableAppointments} = req.body;
    
        const vet = await vetModel.findOne({userId});
    
        if(!vet){
            return res.status(404).json({message:"vet not found"});
        }
    
        if(contact){
            vet.contact = contact;
        }
        if(availableTimes){
           vet.availableTimes = availableTimes;
        }
        if(availableAppointments){
            vet.availableAppointments = availableAppointments;
        }
        await vet.save();
    
        return res.status(200).json({message:"Vet updated successfully"});
    
}