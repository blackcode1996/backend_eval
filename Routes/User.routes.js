const express=require("express")

const {UserModel}=require("../Models/User.model")

const jwt=require("jsonwebtoken")

const bcrypt=require("bcrypt")
const { PostModel } = require("../Models/Posts.model")

const userRouter=express.Router()

require("dotenv").config()

userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city}=req.body
    const existUser=await UserModel.findOne({email:email})

    try {
        if(existUser){
            res.status(403).send({"msg":"User already exist, please login"})
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(hash){
                    const user=new UserModel({name,email,gender,password:hash,age,city})
                    await user.save()
                    res.status(200).send({"msg":"New user has been added"})
                }
            })
        }
    } catch (error) {
        res.send(400).status(error.message)
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await UserModel.find({email})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                    let token=jwt.sign({userID:user[0]._id},process.env.secret_key)
                    res.status(200).send({"msg":"Logged in","token":token})
                }else{
                    res.status(400).send({"msg":"wrong cred"})
                }
            })
        }
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})



module.exports={
    userRouter
}