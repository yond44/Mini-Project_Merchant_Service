import merchants from "../model/merchantmodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import products from "../model/productsmodel.js";


export const getMerchantsList = async (req, res) => {
    try {
        const merchant = await merchants.findAll({

            attributes : ['name','address','phone_number','join_at']
        })
            res.json(merchant)
    } catch (error) {
        res.sendStatus(400)
    }
}



export const getMerchant = async (req, res) => {
    try {
        const merchant = await merchants.findOne({ 
            where: {
                username: req.header.username
            },
            
            attributes : ['id','username','name','address','phone_number','join_at']
        });
        res.json(merchant);
    } catch (error) {
        res.sendStatus(404)
    };
};




export const register = async(req, res) => {
    const { username, name, password, address, phone_number } = req.body
    if (password === "") return res.status(400).json({error: "Password can't be empty"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const duplicate = await merchants.findAll({
        where: {
            username: req.body.username
        }
    });
    if (duplicate.length !== 0) return res.status(400).json({error: "Username already used"});
    try {
        
        await merchants.create({
            username: username,
            password: hashPassword,
            name: name,
            address: address,
            phone_number: phone_number
        })
        res.json({msg: "Register successs"});
    } catch (error) {
        res.sendStatus(400);
    };

};




export const login = async (req, res) => {
    try {
        const merchant = await merchants.findAll({
            where: {
                username : req.body.username
            }
        });
        
        const match = await bcrypt.compare(req.body.password, merchant[0].password);
        if (!match) return res.status(400).json({error: "Wrong Password"});
        const userId = merchant[0].id;
        const username = merchant[0].username;
        const password = merchant[0].password;
       
      
        const accessToken = jwt.sign({userId,username,password}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '5m'
        });
        const refreshToken = jwt.sign({userId,username,password}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await merchants.update({refresh_token : refreshToken}, {
            where:{
            id : userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({error: "Username doesn't exist"});
    };
};




export const update = async (req,res) => {
    const merchant = await merchants.findOne({ 
        where: {
            username: req.header.username
        }
    });
    const params = req.params.username;
    if (params !== merchant.username) return res.sendStatus(404) 
    try  {
        await merchant.update({
          
           name: req.body.name,
           address: req.body.address,
           phone_number: req.body.phone_number
       },{
        where: {
            username: req.header.username
        }
       });
        res.send("Updated")
    }catch(error) {
        res.sendStatus(400)
    };
};




export const changePassword = async (req,res) => {
    const merchant = await merchants.findOne({ 
        where: {
            username: req.header.username
        }
    });

    const validation = await merchants.findAll({
        where: {
            username: req.header.username
        }
    })
    
    const password = req.body.newPassword
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    if (password === "") return res.status(400).json({error: "Password can't be empty"});
    
    const match = await bcrypt.compare(req.body.oldPassword, validation[0].password);
    if (!match) return res.status(400).json({error: "Wrong old password"});
    try  {
        await merchant.update({
           password: hashPassword
       },{
        where: {
            username: req.header.username
        }
       });
        res.send("Your password has been changed")
    }catch(error) {
        res.sendStatus(400)
    };
};







export const delAccount = async(req, res) => {
    const merchant = await merchants.findOne({
        where:{
            username: req.header.username
        }
    });
    
    const validation = await products.findOne({
        where : {
            merchant_id: merchant.id
        }
    });
    const params = req.params.username;
    if (params !== merchant.username) return res.sendStatus(404) 
    try {
        if (validation.merchant_id !== merchant.id) return res.sendStatus(400);
        await products.destroy({
            where: {
                merchant_id : merchant.id
            }
        });
        await merchant.destroy()
        
        res.send("account deleted")

// this "catch" is a function to delete an account if the merchant which never input products into database or don't have products in database at all.
// without this, an account that never input products can't be deleted, and I still can't find a better solution for this.
    } catch (success) {
        await merchant.destroy()
        res.send("account deleted")
        
    };
};

export const logout = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204)
        const merchant = await merchants.findAll({
            where:{
                refresh_token : refreshToken
            }
        });
        if(!merchant[0]) return res.sendStatus(204);
        const userId = merchant[0].id;
        await merchants.update({refresh_token: null},{
            where: {
                id : userId
            }
        });
        res.clearCookie('refreshToken');
        return res.send("Logged out")
    } catch (error) {
        res.sendStatus(400)
        
    }
}