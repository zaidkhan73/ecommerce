import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    product_description:{
        type:String,
        required:true
    },
    product_price:{
        type:Number,
        required:true
    },
    product_image:{
        type:String,
    },
    status:{
        type:String,
        enum:['in_stock','out_of_stock'],
        default:'in_stock'
    },
    product_rating:{
        type:Number,
        default:0
    },
    product_discount:{
        type:Number,
        default:0
    },
    inventory_quantity:{
        type:Number,
        required:true,
        default:0
    },
    product_category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    }

},{
    timestamps:true
})

export const Product = mongoose.model("Product",productSchema)