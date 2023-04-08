const mongoose=require("mongoose")

const UserSchema=mongoose.Schema({
    name:{type:String},
    gender:{type:String},
    dob:{type:String},
    email:{type:String},
    mobile:{type:Number},
    address:{type:String},
    initialBalance:{type:Number},
    adharNo:{type:Number},
    panNo:{type:String},
    amount:{type:Number}

})

const UserModel=mongoose.model("user",UserSchema)

module.exports={
    UserModel
}