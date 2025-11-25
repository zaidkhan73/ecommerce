import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    product_description:{
        type:String,
        required:true
    },
    product_price:{
        type:Number,
        required:true
    },
    final_price:{
        type:Number,
        required:true
    },
    product_image: [
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }
],

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


productSchema.pre("save", function (next) {
  if (this.inventory_quantity === 0) {
    this.status = "out_of_stock";
  } else {
    this.status = "in_stock";
  }
  next();
});


productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  let qty =
    update.inventory_quantity ??
    update.$set?.inventory_quantity;

  if (qty !== undefined) {
    // ensure $set exists
    if (!update.$set) update.$set = {};

    if (qty === 0) {
      update.$set.status = "out_of_stock";
    } else if (qty > 0) {
      update.$set.status = "in_stock";
    }
  }

  next();
});



export const Product = mongoose.model("Product",productSchema)