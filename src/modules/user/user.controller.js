import userModel from "../../../DB/models/user.model.js";

export const getAllUsers = async (req,res)=>{

        const users = await userModel.find({role:"user"}).select('-password');
        if(users.length === 0){
            return res.status(200).json({message:"No Users Found",users});
        }
        return res.status(200).json({message:"success",users});
}

export const getUser = async (req,res)=>{
        const {id} = req.params;
    
        const user = await userModel.findById(id).select('-password');
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        return res.status(200).json({message:"success",user});
    
}

export const changeStatus = async (req,res)=>{
    const {id} = req.params;
    const {status} = req.body; 
    const user = await userModel.findById(id);

    if(!user){
        return res.status(404).json({message:"user not found"});
    }

    if(user.role !== 'user'){
        return res.status(403).json({message:"you can change status for users"})
    }

    if( !['active','not_active'].includes(status)){
        return res.status(400).json({message:"Invalid Status"});
    }

    user.status = status;
    await user.save();
    
    return res.status(200).json({message:"success"});
}

export const removeUser = async (req,res)=>{

    const {id} = req.params;
    const user = await userModel.findOneAndDelete({_id:id, role:'user'});

    if(!user){
        return res.status(404).json({message:"user not found or not user"});
    }

    return res.status(200).json({message:"success"});
}