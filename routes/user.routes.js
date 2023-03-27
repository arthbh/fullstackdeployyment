const express=require("express")
const userRouter=express.Router();
const {UserModel}=require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt=require("bcrypt")

// registration
userRouter.post("/register",async(req,res)=> {
    // const payload=req.body
    const {email,password,location,age}=req.body
    try {
        // HASHED PASSWORD
        bcrypt.hash(password, 5, async(err, hash)=> {
            const user=new UserModel({email,password:hash,location,age})
            await user.save()
            res.status(200).send({"msg":"Registration done!"})
        });//

        // const user=new UserModel(payload)
        // await user.save()
        // res.status(200).send({"msg":"Registration done!"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

// login(authentication)
userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password, (err, result) => {
                if(result){
                    res.status(200).send({"msg":"Login successfull!","token":jwt.sign({"userID":user._id},"masai")})
                } else {
                    res.status(400).send({"msg":"Wrong Credentials"})
                }
            });
        }
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})

// userRouter.get("/details",(req,res)=> {
//     const token=req.headers.authorization
//     //verifying token
//     jwt.verify(token, 'shhhhh',(err, decoded)=> {
//         decoded?res.status(200).send("User Details"):res.status(400).send({"msg":err.message})
//       });
//     //   const {token}=req.query
//     // if(token=="abc@123"){
//     //     res.status(200).send("User Details")
//     // } else {
//     //     res.status(400).send("error")
//     // }
// })

// userRouter.get("/moviedata",(req,res)=> {
//     jwt.verify(token, 'shhhhh',(err, decoded)=> {
//         decoded?res.status(200).send("Movie Details"):res.status(400).send({"msg":"Cannot access respected route"})
//     });
//     const {token}=req.query
//     // if(token=="abc@123"){
//     //     res.status(200).send("Movie Details")
//     // } else {
//     //     res.status(400).send({"msg":"Cannot access respected route"})
//     // }
// })

module.exports={
    userRouter
}