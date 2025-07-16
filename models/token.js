const mongoose = require('mongoose');

const tokenSchema  = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },

        token:{
            type:String,
            required:true,
        },

        createdAt:{
            type:Date,
            required:true,
        },

        expiresAt:{
            type:Date,
            required:true,
        }
    }
)



module.exports =mongoose.model("Token", tokenSchema);