import  jwt  from "jsonwebtoken";
import merchants from "../model/merchantmodel.js";



export const authToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus("401");
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if(err) return res.sendStatus("403");
        req.header = await merchants.findOne({
            where : {
                username: decoded.username
            }
        });
    if (req.cookies.refreshToken == null) return res.sendStatus("401")
        next();
    });
    
};
