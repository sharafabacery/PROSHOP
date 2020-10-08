const asyncHandler = require('express-async-handler')
const User=require('../models/userModel')

const genrateToken=require('../utils/genrateToken')

const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
     
    const user=await User.findOne({email})

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:genrateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error('Invalid email or password')
    }
   
})

const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password}=req.body
     
    const userExists=await User.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user=await User.create({name,email,password})

    if (user) {
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:genrateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
   
})


const getUserProfile=asyncHandler(async(req,res)=>{
    
    const user=await User.findById(req.user._id)

    if (user) {
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        })
    }else{
        res.status(404)
        throw new Error('User Not Found')
    }
    
   
})
const updataUserProfile=asyncHandler(async(req,res)=>{
    
    const user=await User.findById(req.user._id)

    if (user) {
        user.name=req.body.name || req.user.name
        user.email=req.body.email || req.user.email
       if (req.body.password) {
           user.password=req.body.password
       }
       const updateduser=await user.save()
       res.json({
        _id:updateduser._id,
        name:updateduser.name,
        email:updateduser.email,
        isAdmin:updateduser.isAdmin,
        token:genrateToken(user._id)
    })
    }else{
        res.status(404)
        throw new Error('User Not Found')
    }
    
   
})

const getUsers=asyncHandler(async(req,res)=>{
    
    const users=await User.find({})

    if (users) {
        res.json(users)
    }else{
        res.status(404)
        throw new Error('User Not Found')
    }
    
   
})

const deleteUserById=asyncHandler(async(req,res)=>{
    
    const user=await User.findById(req.params.id)

    if (user) {
        await user.remove()
        res.json({message:'User removed'})
    }else{
        res.status(404)
        throw new Error('user not found')
    }
    
   
})

const getUserById=asyncHandler(async(req,res)=>{
    
    const user=await User.findById(req.params.id).select('-password')

    if (user) {
        
        res.json(user)
    }else{
        res.status(404)
        throw new Error('user not found')
    }
    
   
})
const updateUser=asyncHandler(async(req,res)=>{
    
    const user=await User.findById(req.params.id)

    if (user) {
        user.name=req.body.name || user.name
        user.email=req.body.email || user.email
        
        user.isAdmin=req.body.isAdmin 
        const updateduser=await user.save()
       res.json({
        _id:updateduser._id,
        name:updateduser.name,
        email:updateduser.email,
        isAdmin:updateduser.isAdmin
    })
    }else{
        res.status(404)
        throw new Error('User Not Found')
    }
    
   
})
module.exports={authUser,getUserProfile,registerUser,updataUserProfile,getUsers,deleteUserById,getUserById,updateUser}