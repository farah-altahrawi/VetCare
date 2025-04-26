import { Schema, model, mongoose } from "mongoose";

const petSchema = new Schema(
  {
    petName: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    userId:{
        type: Types.ObjectId,
        required:true,
        ref:'User',
    },
    petType: {
      type: String,
      required: true,
      enum: ["Dog", "Cat", "Bird", "Other"],
    },
    age: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    medicalHistory: {
      type: String,
    },
    image: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const petModel = mongoose.model.Pet || model("Pet", petSchema);
export default petModel;
