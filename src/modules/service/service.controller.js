import serviceModel from "../../../DB/models/service.model.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";


export const getAllServices = async (req,res)=>{

        const services = await serviceModel.find({}).select('name description price duration');
        if(services.length === 0){
            return res.status(200).json({message:"No Services Found",services});
        }
        return res.status(200).json({message:"success",services});
}

export const createService = async (req,res)=>{
    const {name,description,price,duration,available} = req.body; 

    req.body.slug=slugify(name);


    const {secure_url, public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path
        ,{folder:`${process.env.APP_NAME}/services/${name}`}
    );

    req.body.subImages = [];
    if(req.files.subImages){
        for(const file of req.files.subImages){
            const {secure_url,public_id} = await cloudinary.uploader.upload(file.path
                ,{folder:`${process.env.APP_NAME}/services/${name}/subImages`}
            );
            req.body.subImages.push({secure_url, public_id});
        }
    }

    req.body.mainImage = {secure_url, public_id};
    req.body.createdBy = req.id;
    req.body.updatedBy = req.id;

    const service = await serviceModel.create(req.body);
    return res.status(201).json({message:"Service created successfully",service});
}

export const getServiceDetails = async (req,res)=>{
        const {id} = req.params;
    
        const service = await serviceModel.findById(id);
        if(!service){
            return res.status(404).json({message:"Service Not Found"});
        }
        return res.status(200).json({message:"success",service});
    
}

export const updateService = async (req,res)=>{

    const {id} = req.params;
    const {name,description,price,available,duration} = req.body;
    const userId = req.id;

    const service = await serviceModel.findById(id);

    if(!service){
        return res.status(404).json({message:"service not found"});
    }

    service.name = name;
    service.description = description;
    service.price = price;
    service.available = available;
    service.duration = duration;
    service.updatedBy = userId;
    service.slug = slugify(name);
    service.status = req.body.status;


    if(req.files?.mainImage?.length>0){
        await cloudinary.uploader.destroy(service.mainImage.public_id);

        const {secure_url, public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path
        ,{folder:`${process.env.APP_NAME}/services/${service.name}`}
    );
    service.mainImage = {secure_url, public_id};
    }

    if(req.files?.subImages?.length>0){
        for(const image of service.subImages){
          await cloudinary.uploader.destroy(image.public_id);
        }

    service.subImages = [];

    for(const file of req.files.subImages){
        const {secure_url,public_id} = await cloudinary.uploader.upload(file.path
        ,{folder:`${process.env.APP_NAME}/services/${service.name}/subImages`}
    );
         service.subImages.push({secure_url, public_id});
    }
    }

    await service.save();



    return res.status(200).json({message:"Service updated successfully"});
}

export const removeService = async (req,res)=>{

    const {id} = req.params;
    const service = await serviceModel.findById(id);

    if(!service){
        return res.status(404).json({message:"service not found"});
    }

    await cloudinary.uploader.destroy(service.mainImage.public_id);

    if(service.subImages?.length>0){
        for(const image of service.subImages){
          await cloudinary.uploader.destroy(image.public_id);
    }
}

    await serviceModel.findByIdAndDelete(id);
    return res.status(200).json({message:"Service removed successfully"});
}
