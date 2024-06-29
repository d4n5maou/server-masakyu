const { where, Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {User} = require("../models");
const authController = {};
const secret_key = process.env.SECRET_KEY;


authController.register = async(req,res) => {
    const saltRounds = 10;
    try {
        const data = req.body
        console.log("req body:", data);
        // validasi jika data kosong
        if(!data.email || !data.username || !data.password){
            return res.status(400).json({
                
                message: "Field harus diisi!"
            });
        }
        // validasi jika username/email sudah ada
        const existingUser = await User.findOne({
            where:{
                [Op.or]:[
                    {username:data.username},
                    {email:data.email}
                ]
            }
        });
        if(existingUser){
            if(existingUser.username === data.username){
                return  res.status(409).json({message:'Username sudah digunakan'});
            }else if(existingUser.email === data.email){
                return res.status(409).json({message:'Email sudah digunakan'});
            }
        }

        //hashpw
        const hashedPassword = await hashPassword(data.password, saltRounds);
        console.log(hashedPassword);
        const createUser = await User.create({
            username:data.username,
            email:data.email,
            password:hashedPassword
        });
        
        return res.status(201).json({
            message:'Register'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Terjadi kesalahan saat membuat user',
            error: error.message // Anda bisa mengirimkan pesan error yang lebih spesifik jika diperlukan
        });
    }
}

authController.login = async(req,res) => {
    try {
        const data = req.body;
        if(!data.email || !data.password){
            return res.status(400).json({
                message: "Field harus diisi!"
            });
        }

        const findUser = await User.findOne({
            where:{email:data.email}
        });
        console.log(findUser.id);

        //buat custom payload jwt
        const payload =  {
            id:findUser.id,
            username:findUser.username,
            email:findUser.email
        }
        console.log("User found:", findUser);
        if(findUser){
            //compare password
            const isPassword = await comparePassword(data.password,findUser.password);
            if(isPassword){
                console.log("login success");
                //cetak token
                const token = jwt.sign(payload,secret_key, { 
                    expiresIn: '1h' 
                });
                console.log("Generated token:", token);
                return res.status(200).json({
                    message:'Berhasil masuk',
                    token,
                    data:findUser
                });
            }else{
                console.log("login failed");
                return res.status(401).json({message:'Password salah'});
            }
        }else if(!findUser){
            return res.status(404).json({message:'Email tidak ditemukan'})
        }
    } catch (error) {
        console.error("error:",error);
        return res.status(500).json({
            
            message: "Terjadi kesalahan pada server.",
        });
    }
}

authController.tokenValidation = async(req,res)=>{
    try {
        const {token} = req.query;

        const decode = await jwt.verify(token, secret_key);
        return res.status(200).json({
            valid:true
        });
    } catch (error) {
        console.error("error:",error);
        //jika token kedaluarsa
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({
                message:"Token telah kedaluarsa"
            });
        }

        return res.status(500).json({
            message: "Terjadi kesalahan pada server.",
        });
    }
}

authController.logout = async(req,res)=>{
    try {
        let blacklistToken = [];
        const token = req.header('Authorization').replace('Bearer ', '');

        await blacklistToken.push(token);

        return res.status(200).json({
            message:"Berhasil logout"
        })
    } catch (error) {
        console.error("Error: ",error);
    }
}

const hashPassword = async (pw,saltRounds) => {
    try {
        const hashResult = await bcrypt.hash(pw,saltRounds);
        return hashResult;
    } catch (error) {
        console.error("Error:",error);
    }
}

const comparePassword = async (pw, hashedPw) => {
    try {
        const result = await bcrypt.compare(pw,hashedPw);
        return result;
    } catch (error) {
        console.error("Error: ",error);
    }
}

module.exports = authController;