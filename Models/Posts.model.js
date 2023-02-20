const mongoose=require("mongoose")

const PostSchema=mongoose.Schema({
    title: String,
    body: String,
    device: String,
    no_if_comments: Number,
    user:String

})

const PostModel=mongoose.model("post",PostSchema)

module.exports={
    PostModel
}