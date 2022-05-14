import  Express  from "express";
import { authToken } from "../authMiddleware.js/auth.js";
import { inputProduct,  getProducts, updateProduct, deleteProduct , productsList} from "../services/productService.js";


const productRouter = Express.Router();
productRouter.get('/productsList', productsList)
productRouter.post('/myProducts', authToken, inputProduct);
productRouter.get('/myProducts',authToken, getProducts)
productRouter.put('/myProducts/:username', authToken, updateProduct);
productRouter.delete('/myProducts/:username', authToken, deleteProduct);



export default productRouter