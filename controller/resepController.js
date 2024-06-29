const { where,Op } = require("sequelize");
const {Resep,User} = require("../models")
const resepController={};

resepController.createResep = async(req,res)=>{
    try {
        const {nama_resep,porsi,waktu_masak,bahan,langkah} = req.body;
        const id_user = req.userId;
        console.log(req.body);
        console.log(id_user);
        //validasi
        if(!nama_resep||!porsi||!waktu_masak||!bahan||!langkah){
            return res.status(400).json({
                message:"Field harus diisi"
            });
        }

        const resep = await Resep.create({
            id_user,nama_resep,porsi,waktu_masak,bahan,langkah
        });
        return res.status(201).json({
            message:"Resep berhasil dibuat"
        });
    } catch (error) {
        console.error("Error: ",error);
        return res.status(500).json({
            message:"Internal server"
        })
    }
}

resepController.getAllResep = async (req, res) => {
    try {
        const resep = await Resep.findAll({
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: User, // Model yang ingin disertakan
                    attributes: ['id', 'username', 'email'] // Atribut dari model User yang ingin disertakan
                }
            ]
        });

        if (resep.length === 0) {
            return res.status(404).json({
                message: "Belum ada yang menulis resep..",
            });
        }

        return res.status(200).json({
            data: resep,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Terjadi kesalahan dalam mengambil resep.",
            error: error.message // Mengirim pesan kesalahan dari Sequelize
        });
    }
};

resepController.getResepByUserId = async(req,res)=>{
    try {
        const {id_user} = req.params;
        const myResep = await Resep.findAll({
            where:{
                id_user
            }
        });
        console.log(myResep);
        if(myResep.length === 0){
            return res.status(404).json({
                message:"Kamu belum membuat resep"
            });
        }
        return res.status(200).json({
            data:myResep
        });
    } catch (error) {
        console.error("Error: ",error);
        return res.status(500).json({
            message:error
        });
    }
}
resepController.getResepById = async(req,res)=>{
    try {
        const {id} = req.params;
        const getResep = await Resep.findOne({
            where:{
                id
            }
        });
        console.log(getResep);
        return res.status(200).json({
            nama_resep:getResep.nama_resep,
            porsi:getResep.porsi,
            waktu_masak:getResep.waktu_masak,
            bahan:getResep.bahan,
            langkah:getResep.langkah
        })
    } catch (error) {
        console.error("Error:,",error);
        return res.status(500).json({
            message:"Terjadi kesalahan pada server"
        });
    }
}

resepController.updateResep = async(req,res)=>{
    try {
        const {nama_resep,porsi,waktu_masak,bahan,langkah} = req.body;
        const {id,uid} = req.params;
        // temukan resep
        const getResepById = await Resep.findOne({
            where: {
                [Op.and]: [
                    { id: id },
                    { id_user: uid }
                ]
            }
        });
        console.log(getResepById !== null);
        if(getResepById === null){
            return res.status(404).json({
                message: "Tidak ditemukan"
            });
        }

        //validasi
        if(!nama_resep||!porsi||!waktu_masak||!bahan||!langkah){
            return res.status(400).json({
                message:"Field harus diisi"
            });
        }

        const resepUpdate = await Resep.update({
            nama_resep,porsi,waktu_masak,bahan,langkah
        },{
            where: {
                [Op.and]: [
                    { id: id },
                    { id_user: uid }
                ]
            }
        });
        return res.status(201).json({
            message: "Berhasil mengubah resep",
          });
        
    } catch (error) {
        console.error("Error: ",error);
        return res.status(500).json({
            message:error
        });
    }
}

resepController.deleteResepById = async(req,res)=>{
    try {
        const {id,uid} = req.params;
        const deleteBydIdAndUid = await Resep.destroy({
            where: {
                [Op.and]: [
                    { id: id },
                    { id_user: uid }
                ]
            }
        });
        if(deleteBydIdAndUid === 0){
            return res.status(404).json({
                message:"Tidak ditemukan"
            });
        }
        return res.status(200).json({
            message: "Berhasil dihapus"
        });
    } catch (error) {
        console.error("Error: ",error);
        return res.status(500).json({
            message:error
        });
    }
}

resepController.cariResep = async(req,res)=>{
    try {
        const {q} = req.query;
        if(q === ""){
            return res.status(400).json({
                message:"Field pencarian kosong"
            });
        }
        const resepByQuery = await Resep.findAll({
            where:{
                nama_resep:{[Op.like]:`%${q}%`}
            },
            include: [
                {
                    model: User, // Model yang ingin disertakan
                    attributes: ['id', 'username', 'email'] // Atribut dari model User yang ingin disertakan
                }
            ]
        });

        return res.status(200).json({
            message:"Pencarian sukses",
            data:resepByQuery
        });
    } catch (error) {
        console.error("Error: ",error);
        return res.status(500).json({
            message:"Terjadi kesalahan pada server"
        })
    }
}

module.exports = {resepController}