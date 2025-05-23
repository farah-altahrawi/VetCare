import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../utils/sendEmail.js";
import jwt from 'jsonwebtoken';
import { customAlphabet, nanoid } from 'nanoid';
import vetModel from "../../../DB/models/vet.model.js";


export const register = async (req,res,next)=>{

    const { userName, email, password, role } = req.body; 

    const user = await userModel.findOne({email});

    if (user) {
        return res.status(404).json({message:"email already registered"});

    }
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));

    const createdUser = await userModel.create({userName, email, role,
        password:hashedPassword});

    console.log(email);

    if (role === 'vet'){
        const {contact, availableTimes} = req.body; 
        /*const createdVet = */ 
        await vetModel.create({userId:createdUser._id,vetName:userName, contact, availableTimes/*, status: 'not_active'*/});
        await userModel.updateOne({_id: createdUser._id},{$set: {status:'not_active'}});
 
    }

    const token = jwt.sign({email},process.env.CONFIRMEMAILSIGNAL);

    const html = `
    <div>
    <h1>Welcome ${userName}</h1>
    <h2>Confirm Email</h2>
    <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}">confirm your email </a>
    </div>`;

    await sendEmail(email,"confirm email",html)

        const finalUser = await userModel.findById(createdUser._id);
        return res.status(201).json({message:"Registered successfully",user:finalUser});
        /*return res.status(201).json({message:"success",user:createdUser});*/
    
}


export const confirmEmail = async (req,res)=>{
    const {token} = req.params;
    const decoded = jwt.verify(token, process.env.CONFIRMEMAILSIGNAL);
    await userModel.findOneAndUpdate({email:decoded.email},{confirmEmail:true});
    return res.status(200).json({message:"Email confirmed successfully"});

}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({message:"invalid data"});
    }

    if(!user.confirmEmail){
        return res.status(400).json({message:"please confirm your email"});
    }

    if(user.status == 'not_active'){
        return res.status(400).json({message:"your account is blocked"});
    }

    const match = await bcrypt.compare(password,user.password);

    if(!match){
        return res.status(400).json({message:"invalid data"});
    }

    const token = jwt.sign({id:user._id,userName:user,role:user.role},process.env.LOGINSIGNAL);

    return res.status(200).json({message:"Logged in successfully",token});

}

export const sendCode = async(req,res)=>{
    const {email} = req.body;
    const code = customAlphabet('1234567890abcdefABCDF',4)();

    const user = await userModel.findOneAndUpdate({email},{sendCode:code});
    const html = `<h2>code is ${code}</h2>`;
    await sendEmail(email,"reset password",html);

    return res.status(200).json({message:"Code sent"});
}

export const resetPassword = async(req,res)=>{
    const {code,email,password} = req.body; 
    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({message:"not registerd account"});
    }

    if(user.sendCode != code){
        return res.status(400).json({message:"invalid code"});
    }

    const hashedPassword = await bcrypt.hash(password,parseInt(process.env.SALT_ROUND));

    user.password = hashedPassword;
    user.sendCode = null;
    await user.save();

    return res.status(200).json({message:"Password reset successfully"});
}

