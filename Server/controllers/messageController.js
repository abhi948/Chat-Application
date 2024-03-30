// const User = require('../model/userModel');
// const bcrypt = require('bcrypt');

const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const {from, to, message} = req.body;
        const data = await messageModel.create({
            message:{text:message},
            users:[from,to],
            sender:from,
        });
        if(data){
            return res.json({msg:"Message Added Successfully"});            
        }else{
            return res.json({msg: "Failed to add message to the db"});
        }
    } catch (error) {
        next(error);
    }
};

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const {from,to} = req.body;
        const message =await messageModel.find({
            users:{
                $all : [from,to],
            },
        }).sort({ updatedAt:1});
        const projectMessage = message.map((msg)=>{
            return{
                fromSelf : msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        res.json(projectMessage);

    } catch (error) {
        next(error);
    }
};