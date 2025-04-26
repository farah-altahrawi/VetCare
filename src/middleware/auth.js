import userModel from "../../DB/models/user.model.js";
import jwt from 'jsonwebtoken';


export const auth = (accessRoles = [])=>{

    return async(req,res,next)=>{
        const {token} = req.headers;

        if(!token){
            return res.status(400).json({message:"invalid auth"});
        }

        const decoded = jwt.verify(token,process.env.LOGINSIGNAL);

        const user = await userModel.findById(decoded.id);

        if(!accessRoles.includes(user.role)){
            return res.status(400).json({message:"not auth user"});
        }

        req.id = decoded.id;
        next();

    }
}