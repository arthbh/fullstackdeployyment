const express=require("express");
const { NoteModel } = require("../model/note.model");
const noteRouter=express.Router()
const jwt=require("jsonwebtoken")

noteRouter.get("/",async(req,res)=> {
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"masai")
    try {
        if(decoded){
            const notes = await NoteModel.find({"userID":decoded.userID})
            res.status(200).send(notes)
        }else {
            res.status(400).send({"msg":error.message})
        }   
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

noteRouter.post("/add", async(req,res)=> {

    try {
        const note=new NoteModel(req.body)
        await note.save()
        res.status(200).send({"msg":"A new Note has been added"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }

})

noteRouter.patch("/update/:noteID",async(req,res)=> {
    const {noteID}=req.params;
    // console.log(id);
    const payload=req.body;
    try {
        await NoteModel.findByIdAndUpdate({_id:noteID},payload)
        res.status(200).send({"msg":"New user has been updated"})
        
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})
// while updating logic will same
noteRouter.delete("/delete/:noteID",async(req,res)=> {
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"masai");
    const req_id=decoded.userID //The process who is making the delete req
    const note=NoteModel.findOne({_id:noteID})
    const userID_in_note=note.userID
    const {noteID} = req.params;
    try {
        if(req_id==userID_in_note){
            await NoteModel.findByIdAndDelete({_id:noteID})
            res.status(200).send({"msg":"Not AUthorised"})

        }else {
            res.status(400).send({"msg":error.message})

        }
        
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

module.exports={noteRouter};