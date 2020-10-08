const mongoose =require('mongoose')
const Product=require('../models/productModel')

module.exports=async(orderItems)=>{
 
    let idsQty=[]
    Array.prototype.forEach.call(orderItems,function(item){
        
        idsQty.push({product:mongoose.Types.ObjectId(item.product),qty:item.qty})
    })
    Array.prototype.forEach.call(idsQty,async(item)=>{
        const product=await Product.findByIdAndUpdate(item.product,{$inc:{countInStock:-1*(item.qty)}})
    })
  
}