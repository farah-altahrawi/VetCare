import { Schema, model, mongoose, Types } from "mongoose";

const appointmentSchema = new Schema(
  {
    petId: {
      type: Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    vetId: {
      type: Types.ObjectId,
      ref: "Vet",
      required: true,
    },
    serviceId: {
      type: Types.ObjectId,
      ref: "Service",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
     phoneNumber:{
      type:Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "completed", "cancelled"],
    },
    couponCode: {
      type: String,
    },
    finalPrice: {
      type:Number,
    },
    note:String,
    updatedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model.Appointment || model("Appointment", appointmentSchema);
export default appointmentModel;
