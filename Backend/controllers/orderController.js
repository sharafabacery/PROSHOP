const asyncHandler = require('express-async-handler')
const Order=require('../models/orderModel')
const decreaseQty=require('../utils/decreaseQty')
const addOrderItems=asyncHandler(async(req,res)=>{
    const{orderItems,shippingAddress,paymentMethod,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body
    if (orderItems && orderItems.length===0) {
        res.status(400)
        throw new Error('No Order item')
        
    }else{
        decreaseQty(orderItems)
        const order=new Order({
            orderItems,shippingAddress,paymentMethod,itemsPrice,taxPrice,shippingPrice,totalPrice,
            user:req.user._id
        })
        const createdOrder=await order.save()
        res.status(201).json(createdOrder)
    }
})
const getOrderBtId=asyncHandler(async(req,res)=>{
    //get order by id and account information
   const order=await Order.findById(req.params.id).populate('user','name email')
   if (order) {
       res.json(order)
   }else{
       res.status(404)
       throw new Error('Order Not Found')
   }
})
const updateOrderToPaid=asyncHandler(async(req,res)=>{
    //get order by id and account information
   const order=await Order.findById(req.params.id)
   if (order) {
       order.isPaid=true
       order.paidAt=Date.now()
       order.paymentResult={
           id:req.body.id,
           status:req.body.status,
           update_time:req.body.update_time,
           email:req.body.payer.email_address
       }
       const updatedOrder=await order.save()
       res.json(updatedOrder)
   }else{
       res.status(404)
       throw new Error('Order Not Found')
   }
})
const getmyOrders=asyncHandler(async(req,res)=>{
    //get order by id and account information
   const orders=await Order.find({user:req.user._id})
   res.json(orders)
})
const getAllOrders=asyncHandler(async(req,res)=>{
    //get order by id and account information
   const orders=await Order.find({}).populate('user','id name')
   res.json(orders)
})
const updateOrderToDelivered=asyncHandler(async(req,res)=>{
    //get order by id and account information
   const order=await Order.findById(req.params.id)
   if (order) {
       order.isDelivered=true
       order.deliveredAt=Date.now()
      
       const updatedOrder=await order.save()
       res.json(updatedOrder)
   }else{
       res.status(404)
       throw new Error('Order Not Found')
   }
})
module.exports={addOrderItems,getOrderBtId,updateOrderToPaid,getmyOrders,getAllOrders,updateOrderToDelivered}