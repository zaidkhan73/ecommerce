import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    status:{
        type:String,
        enum:['pending','confirmed','processing','delivered','canceled'],
        default:'pending'
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    order_address:{
        type:String,
        required:true
    },
    products:[{
        product_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        },
        price:{
            type:Number,
            required:true
        }
    }],

    total_price:{
        type:Number,
        required:true
    },

    payment_method:{
        type:String,
        enum:['cash_on_delivery','online_payment'],
        required:true
    },
    payment_status:{
        type:String,
        enum:['pending','paid'],
        default:'pending'
    },
}
,{
    timestamps:true
})

export const Notification = mongoose.model("Notification",notificationSchema)