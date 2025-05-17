import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../utils/sendEmail.js";
import jwt from 'jsonwebtoken';
import { customAlphabet, nanoid } from 'nanoid';

export const getAllAdmins = async (req,res)=>{

    const admins = await userModel.find({role:'admin'});

    if(!admins || admins.length === 0){
        return res.status(404).json({message:"No Admins Found"});
    }
    return res.status(200).json({message:"success",admins});
}

export const addAdmin = async (req,res)=>{

    const {userName, email, password, role} = req.body;
    const admin = await userModel.findOne({email});

    if(admin){
        return res.status(404).json({message:"Admin Already Added"});
    }

    if(role!=='admin' && role!=='superadmin'){
        return res.status(404).json({message:"Invalid Role"});
    }
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));

    const createdAdmin = await userModel.create({userName, email, role,
        password:hashedPassword});

    const token = jwt.sign({email},process.env.CONFIRMEMAILSIGNAL);

        const html = `
        <div>
        <h1>Welcome ${userName}</h1>
        <h2>Confirm Email</h2>
        <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}">confirm your email </a>
        </div>`;
    
        await sendEmail(email,"confirm email",html)
        
            return res.status(201).json({message:"Admin created successfully",user:createdAdmin});
}

export const updateAdmin = async (req,res)=>{

        const {id} = req.params;
        const {userName,email,password,role} = req.body;
    
        const updatedAdmin = await userModel.findById(id);
    
        if(!updatedAdmin){
            return res.status(404).json({message:"admin not found"});
        }
    
        updatedAdmin.userName = userName;
        updatedAdmin.email = email;
        updatedAdmin.password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
        updatedAdmin.role = role;
        await updatedAdmin.save();
    
        return res.status(200).json({message:"Admin updated successfully"});
    
}

export const removeAdmin = async (req,res)=>{
    const {id} = req.params;
    const admin = await userModel.findByIdAndDelete(id);

    if(!admin){
        return res.status(404).json({message:"admin not found"});
    }

    return res.status(200).json({message:"Admin removed successfully"});
}

export const changeAdminStatus = async (req,res)=>{
    const {id} = req.params;
    const {status} = req.body; 
    const admin = await userModel.findById(id);

    if(!admin){
        return res.status(404).json({message:"admin not found"});
    }

    if( !['active','not_active'].includes(status)){
        return res.status(400).json({message:"Invalid Status"});
    }

    admin.status = req.body.status;
    await admin.save();
    
    return res.status(200).json({message:"Status changed successfully"});
}