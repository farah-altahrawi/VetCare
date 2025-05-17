import couponModel from "../../../DB/models/coupon.model.js"


export const createCoupon = async(req,res)=>{

    if(await couponModel.findOne({name:req.body.name})){
        return res.status(409).json({message:"coupon already exists"});
    }

    req.body.expireDate = new Date(req.body.expireDate);
    req.body.createdBy = req.id;
    req.body.updatedBy = req.id;

    const coupon = await couponModel.create(req.body);

    return res.status(201).json({message:"Coupon created successfully",coupon});
}

export const getCoupon = async(req,res)=>{

    const coupons = await couponModel.find({});
    return res.status(200).json({message:"success",coupons});

}

export const updateCoupon = async(req,res)=>{
    
        const {id} = req.params;
        //const {name} = req.body;
    
        const coupon = await couponModel.findById(id);
    
        if(!coupon){
            return res.status(404).json({message:"coupon not found"});
        }
    
        //coupon.name = name;
        coupon.value = req.body.value;
        coupon.expireDate = new Date(req.body.expireDate);
        coupon.updatedBy = req.id;
        await coupon.save();
    
        return res.status(200).json({message:"Coupon updated successfully"});
}

export const removeCoupon = async (req,res)=>{

    const {id} = req.params;
    const coupon = await couponModel.findByIdAndDelete(id);

    if(!coupon){
        return res.status(404).json({message:"coupon not found"});
    }

    return res.status(200).json({message:"Coupon removed successfully"});
}




