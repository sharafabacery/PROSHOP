const express=require('express')
const router=express.Router()
const{getProducts,getProductById,deleteProductById, createProduct, updateProduct,creatProductReview,getTopProducts}=require('../controllers/productController')
const {protect,isAdmin} =require('../middleware/authMiddleware')

router.route('/').get(getProducts).post(protect,isAdmin,createProduct)
router.route('/:id/reviews').post(protect,creatProductReview)
router.route('/top').get(getTopProducts)
router.route('/:id').get(getProductById).delete(protect,isAdmin,deleteProductById).put(protect,isAdmin,updateProduct)


module.exports=router