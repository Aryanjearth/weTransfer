
const bcrypt = require("bcryptjs");
const userModel = require('../models/User')

exports.signup = async (req,res)=> {
    const {username,email,password} = req.body;

    if(!email || !password || !username){
        return res.status(404).send({
            message : "credentials not filled!",
        })
    }
    try{
        const existinguser = await userModel.findOne({email});
        if(existinguser){
            return res.status(409).send({
                message : "email already exist"
            })
        }
    }catch(err){
        return res.status(505).send({
            message : "internal server error",
            error : err
        })
    }

    const data = {
            username : username,
            email : email,
            password : bcrypt.hashSync(password ,8)
        }
    try{
        const created = await userModel.create(data);

        res.status(202).send({
            message : "user created",
            created
        })
    }catch(err){
        return res.send(505).send({
            message : "internal server error",
            error : err
        });
    };

};

exports.signin = async (req,res) => {
        const {email,password} = req.body;

    if(!email || !password){
        return res.status(404).send({
            message : "all fields are required!",
        })
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                message : "user not found"
            });
        }
        const isPasswordCorrect = bcrypt.compareSync(password , user.password);
        if(!isPasswordCorrect){
            return res.status(404).send({
                message : "password is incorrect!"
            });
        }

        res.status(200).send({
            message: "Signin successful",
            
        });


    }catch(err){
        return res.status(505).send({
            message : "internal server error",
            error : err
        });
    }

}