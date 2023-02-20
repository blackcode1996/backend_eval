const express=require("express")

const {PostModel}=require("../Models/Posts.model")

const PostRouter=express.Router()

PostRouter.get("/",async(req,res)=>{
    let user=req.body.user
    try{     
        const posts=await PostModel.find({user})
        res.send(posts)
    }catch(error){
        res.send(error.message)
    }
})

PostRouter.post("/create",async(req,res)=>{
    try {
        const payload=req.body;
        const post=new PostModel(payload)
        await post.save()
        console.log(post)
        res.send({"msg":"Post Created"})
    } catch (error) {
        res.send({"msg":error.message})
    }
   
})

module.exports={
    PostRouter
}