import vetModel from '../../../DB/models/vet.model.js';
import serviceModel from '../../../DB/models/service.model.js';
import petModel from '../../../DB/models/pet.model.js';
import couponModel from '../../../DB/models/coupon.model.js';
import appointmentModel from '../../../DB/models/appointment.model.js';
import userModel from '../../../DB/models/user.model.js';
import { sendEmail } from '../../utils/sendEmail.js';


export const createAppointment = async(req,res)=>{
    const {vetId, serviceId, petId, appointmentDate, couponCode, phoneNumber} = req.body; 

    req.body.appointmentDate = new Date(appointmentDate);

    const vet = await vetModel.findById(vetId);
    if(!vet){
        return res.status(404).json({message:"vet not found"});
    }

    const service = await serviceModel.findById(serviceId);
    if(!service){
        return res.status(404).json({message:"service not found"});
    }

    const pet = await petModel.findOne({_id:petId, userId:req.id});
    if(!pet){
        return res.status(404).json({message:"pet not found"});
    }

    const availableAppointments = vet.availableAppointments.map(date => new Date(date).getTime());
    const appointmentTimestamp = new Date(appointmentDate).getTime();

    if(!availableAppointments.includes(appointmentTimestamp)){
        return res.status(404).json({message:"appointment not available"});
    }

        if(couponCode){
        const coupon = await couponModel.findOne({name:couponCode});
        if(!coupon){
            return res.status(404).json({message:"coupon not found"});
        }

        if(coupon.expireDate <= new Date()){
            return res.status(400).json({message:"this coupon has expired"});
        }

        if(coupon.usedBy.includes(req.id)){
            return res.status(400).json({message:"coupon already used"});
        }

        req.body.coupon=coupon; 
    }

    
    const user = await userModel.findById(req.id);

    if(!req.body.phoneNumber){
        req.body.phoneNumber = user.phone;
    }


    const appointment = await appointmentModel.create({
        userId:req.id,
        vetId,
        serviceId,
        petId,
        appointmentDate,
        couponCode:couponCode ?? '',
        phoneNumber:req.body.phoneNumber,
        finalPrice: service.price * (1 - ((req.body.coupon?.value || 0)/100)),
    });

    if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},
            {
                $addToSet:{
                    usedBy:req.id
                }
            }
        );
    }

    await vetModel.updateOne({_id:vetId},
        {
            $pull:{
                availableAppointments:appointmentDate
            }
        }
    );

        return res.status(201).json({message:"success",appointment});

    
}

export const getAppointments = async(req,res)=>{
    const appointments = await appointmentModel.find({userId:req.id})
    .populate("vetId","vetName contact")
    .populate("serviceId","name price")
    .populate("petId","petName petType");

    return res.status(200).json({message:"success",appointments});
}

export const changeStatus = async(req,res)=>{

    const {id} = req.params;
    const appointment = await appointmentModel.findById(id);

    if(!appointment){
        return res.status(404).json({message:"appointment not found"});
    }

    if(appointment.status == 'confirmed'){
        return res.status(400).json({message:"can not cancel this appointment"});
    }

  
    appointment.status = req.body.status;
    appointment.updatedBy = req.id; 
    await appointment.save();

    if(appointment.status == 'cancelled'){
            await vetModel.updateOne({_id:appointment.vetId},
        {
            $push:{
                availableAppointments:appointment.appointmentDate
            }
        }
    );
    }

      if(appointment.status == 'confirmed'){
        const user = await userModel.findById(appointment.userId);
        const vet = await vetModel.findById(appointment.vetId);
        const service = await serviceModel.findById(appointment.serviceId);
        
        const html = `
        <div>
        <h1>Welcome ${user.userName}</h1>
        <h2>Your Appointment Has Been confirmed</h2>
        <p>Date: ${appointment.appointmentDate}</p>
        <p>Vet: ${vet.vetName}</p>
        <p>Service: ${service.name}</p>
        <p>Location: ${vet.contact.address}</p>
        <p>Phone: ${vet.contact.phone}</p>
        <p>Thank You For Choosing <strong>VetCare</strong></p>
        </div>`;

        await sendEmail(user.email,"Appointment Confirmation",html)
        

    }


    if(appointment.couponCode){
        await couponModel.updateOne({name: appointment.couponCode},
            {
                $pull:{
                    usedBy:req.id
                }
            }
        );
    }
    
    return res.status(200).json({message:"success"});
}

export const removeAppointment = async(req,res)=>{
    const {id} = req.params; 

    const appointment = await appointmentModel.findById(id);

    if(!appointment){
        return res.status(404).json({message:"appointment not found"});
    }

    if(appointment.userId.toString() !== req.id){
        return res.status(403).json({message:"not authorized"});
    }

    if(appointment.status === 'confirmed'){
        return res.status(400).json({message:"can not remove confirmed appointment"});      
    }

    
    if(appointment.couponCode){
        await couponModel.updateOne({name: appointment.couponCode},
            {
                $pull:{
                    usedBy:req.id
                }
            }
        );
    } 
    
    await vetModel.updateOne(
        {_id: appointment.vetId},
        {$push: {availableAppointments:appointment.appointmentDate}}
    );

    await appointmentModel.deleteOne({_id:id});

    return res.status(200).json({message:"appointment removed successsfully"});
}


