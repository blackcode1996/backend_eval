const express = require("express");

const { UserModel } = require("../Models/user.model");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const { authenticate } = require("../Middleware/authenticate.middleware");

const userRouter = express.Router();

userRouter.post("/openAccount", async (req, res) => {
  const {
    name,
    gender,
    dob,
    email,
    mobile,
    address,
    initialBalance,
    adharNo,
    panNo,
  } = req.body;

  const existUser = await UserModel.findOne({
    name,
    gender,
    dob,
    email,
    mobile,
    address,
    initialBalance,
    adharNo,
    panNo,
  });

  try {
    if (existUser) {
      res.status(403).send({ msg: "Account already exist" });
    } else {
      const user = new UserModel({
        name,
        gender,
        dob,
        email,
        mobile,
        address,
        initialBalance,
        adharNo,
        panNo,
      });
      await user.save();
      res.status(200).send({ msg: "Account Created" });
    }
  } catch (error) {
    res.send(400).status(error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      let token = jwt.sign({ userID: user._id }, process.env.secret_key);
      res.status(200).send({ msg: "Logged in", token: token, user });
    }else{
        res.send({msg:"Please provide right crediantials"})
    }
  } catch (error) {
    res.send(400).status({ msg: error.message });
  }
});

userRouter.patch('/updateKYC', authenticate, async (req, res) => {
    try {
      const userId = req.user.userID; 
      const payload = req.body;
  
  
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        payload,
        { new: true }
      );
  
      res.send({ "msg": "User updated successfully", "user": updatedUser });
    } catch (error) {
      res.send({ "msg": error.message });
    }
});

userRouter.patch('/depositMoney',authenticate,async(req,res)=>{
    try {
        const userID=req.user.userID;
        const {amount}=req.body

        const updateUser=await UserModel.findOneAndUpdate({_id:userID},{amount:amount},{new:true})

        res.send(({"msg":"Amount Credited","user":updateUser}))
    } catch (error) {
        res.send({"msg":error.message})
    }
})

userRouter.patch('/withdrawMoney', authenticate, async (req, res) => {
    try {
      const userID = req.user.userID;
      const { amount } = req.body;
  
      const user = await UserModel.findById(userID);
      if (!user) {
        return res.send({ msg: "User not found" });
      }
  
      const currentAmount = user.amount;
      if (currentAmount < amount) {
        return res.send({ msg: "Insufficient balance" });
      }
  
      const newAmount = currentAmount - amount;
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userID },
        { amount: newAmount },
        { new: true }
      );
  
      res.send({ msg: "Amount debited", user: updatedUser });
    } catch (error) {
      res.send({ msg: error.message });
    }
  });
  
  userRouter.patch('/transferMoney', authenticate, async (req, res) => {
    try {
      const userID = req.user.userID;
      const { toName, email, panNo, amount } = req.body;
  

      const user = await UserModel.findById(userID);
      if (!user) {
        return res.send({ msg: "User not found" });
      }
      const currentAmount = user.amount;
      if (currentAmount < amount) {
        return res.send({ msg: "Insufficient balance" });
      }
  

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userID },
        { $inc: { amount: -amount } },
        { new: true }
      );
  
 
      const recipientUser = await UserModel.findOne({ $or: [{ email }, { panNo }] });
      if (!recipientUser) {
        return res.send({ msg: "Recipient user not found" });
      }
  

      const updatedRecipientUser = await UserModel.findOneAndUpdate(
        { _id: recipientUser._id },
        { $inc: { amount } },
        { new: true }
      );
  
      res.send({
        msg: "Money transferred successfully",
        sender: updatedUser,
        recipient: updatedRecipientUser,
      });
    } catch (error) {
      res.send({ msg: error.message });
    }
  });
  
  userRouter.get('/printStatement',authenticate,async(req,res)=>{

    try {
        const userID = req.user.userID;
        let user=await UserModel.find({_id:userID})
        res.send(user)
    } catch (error) {
        res.send({"msg":error.message})
    }
  
  })

  userRouter.delete('/closeAccount',authenticate,async(req,res)=>{

    try {
        const userID = req.user.userID;
        let user=await UserModel.findByIdAndDelete({_id:userID})
        res.send({msg:"Account Deleted"})
    } catch (error) {
        res.send({"msg":error.message})
    }
  
  })


module.exports = {
  userRouter,
};
