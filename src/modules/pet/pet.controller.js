import petModel from "../../../DB/models/pet.model.js";


export const addPet = async (req,res)=>{

    const {petName,petType,age,weight,medicalHistory} = req.body; 
    const userId = req.id;


    const newPet = await petModel.create({userId:userId,...req.body});


    return res.status(201).json({message:"Pet added successfully",newPet});
}

export const getAllPets = async (req,res)=>{

        const userId = req.id;

        const pets = await petModel.find({userId});
        if(pets.length === 0){
            return res.status(200).json({message:"No Pets Added",pets});
        }
        return res.status(200).json({message:"success",pets});
}

export const getPetInfo = async (req,res)=>{
        const {id} = req.params;
    
        const pet = await petModel.findOne({_id:id, userId:req.id});
        if(!pet){
            return res.status(404).json({message:"Pet Not Found"});
        }
        return res.status(200).json({message:"success",pet});
    
}

export const updatePet = async (req,res)=>{

    const {id} = req.params;
    const {petName,petType,age,weight,medicalHistory} = req.body;

    const pet = await petModel.findOne({_id:id,userId:req.id});

    if(!pet){
        return res.status(404).json({message:"pet not found"});
    }

    pet.petName = petName;
    pet.petType = petType;
    pet.age = age;
    pet.weight = weight;
    pet.medicalHistory = medicalHistory;
    await pet.save();

    return res.status(200).json({message:"Pet updated successfully"});
}

export const removePet = async (req,res)=>{

    const {id} = req.params;
    const pet = await petModel.findOneAndDelete({_id:id, userId:req.id});

    if(!pet){
        return res.status(404).json({message:"pet not found"});
    }

    return res.status(200).json({message:"Pet removed successfully"});
}
