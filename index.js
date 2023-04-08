const express=require("express")

const connection=require("./db")

const {userRouter}=require("./Routes/user.route.js")

const cors=require("cors")


const app=express()


app.use(express.json())
app.use(cors())

app.use("/user",userRouter)



app.get("/",(req,res)=>{
    let initialData=`Welcome to backend 🥳.`
    res.send(initialData)
})

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("connected to database")
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is runing at port ${process.env.port}`)
})