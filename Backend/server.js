const path=require('path')
const express=require('express')
const dotenv=require('dotenv')
const morgan=require('morgan')
const colors=require('colors')
const connectDB=require('./config/db')
const productRouter=require('./routes/productRoute')
const userRouter=require('./routes/userRoute')
const orderRouter=require('./routes/orderRoute')
const uploadRouter=require('./routes/uploadRoute')

const {notFound,errorHandler}=require('./middleware/errorMiddleware')
dotenv.config()
connectDB()
const app=express()
app.use(express.json())
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

app.use('/api/products',productRouter)
app.use('/api/users',userRouter)
app.use('/api/orders',orderRouter)
app.use('/api/upload',uploadRouter)

app.get('/api/config/paypal',(req,res)=>res.send(process.env.PAYPAL_CLIENT_ID))
if (process.env.NODE_ENV==='production') {
    app.use(express.static(path.join(__dirname,'/frontend/build')))
    app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'frontend','build','index.html')))
}else{
    app.get('/',(req,res)=>{
        res.send('API is Running')
    })
    
}
app.use('/uploads',express.static(path.join(path.resolve(),'/uploads')))
// /api/not exist
app.use(notFound)
app.use(errorHandler)
const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.underline)
})