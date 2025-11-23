import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    category_description:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

export const Category = mongoose.model("Category",categorySchema)