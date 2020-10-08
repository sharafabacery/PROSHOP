const express=require('express')
const router=express.Router()
const{addOrderItems,getOrderBtId,updateOrderToPaid,getmyOrders,getAllOrders,updateOrderToDelivered}=require('../controllers/orderController')
const {protect,isAdmin} =require('../middleware/authMiddleware')

router.route('/').post(protect,addOrderItems).get(protect,isAdmin,getAllOrders)
router.route('/myorders').get(protect,getmyOrders)
router.route('/:id').get(protect,getOrderBtId)
router.route('/:id/pay').put(protect,updateOrderToPaid)
router.route('/:id/deliver').put(protect,isAdmin,updateOrderToDelivered)



module.exports=router