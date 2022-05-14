import  Express  from "express";
import { register, login, update, delAccount, changePassword, logout, getMerchant, getMerchantsList} from "../services/merchantService.js";
import { authToken } from "../authMiddleware.js/auth.js";
import { refreshToken } from "../services/refreshToken.js";

const merchantRouter = Express.Router();

merchantRouter.get('/merchantList', getMerchantsList)
merchantRouter.get('/merchant', authToken, getMerchant)
merchantRouter.post ('/registration', register);
merchantRouter.post ('/login', login);
merchantRouter.delete('/logout', logout)
merchantRouter.put ('/merchant/password', authToken, changePassword)
merchantRouter.put('/merchant/:username',authToken, update)
merchantRouter.delete('/merchant/:username',authToken, delAccount);

merchantRouter.get('/token', refreshToken)




export default merchantRouter