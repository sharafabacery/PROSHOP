const express=require('express')
const router=express.Router()
const{authUser,getUserProfile,registerUser,updataUserProfile, getUsers, deleteUserById,getUserById,updateUser}=require('../controllers/userController')
const {protect,isAdmin} =require('../middleware/authMiddleware')

router.route('/').post(registerUser).get(protect,isAdmin,getUsers)
router.post('/login',authUser)
router.route('/profile').get(protect,getUserProfile).put(protect,updataUserProfile)
router.route('/:id').delete(protect,isAdmin,deleteUserById).get(protect,isAdmin,getUserById).put(protect,isAdmin,updateUser)

module.exports=router

