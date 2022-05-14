import merchants from "../model/merchantmodel.js";
import products from "../model/productsmodel.js";


export const productsList = async (req, res) => {
    try {
        const product = await products.findAll({
            attribute: ['name', 'quantity', 'price']
        });

        res.json(product)
    } catch (error) {
        res.sendStatus(400);
        
    };
};
 



export const inputProduct = async (req,res) => {
    const merchant= await merchants.findOne({
        where: {
            username: req.header.username
        }
    });
    try  {
        await  products.create({
                merchant_id : merchant.id,
                name: req.body.name,
                quantity: req.body.quantity,
                price: req.body.price
            });
          
        res.send("Input success");
    }catch (error) {
        res.sendStatus(400);
    };
};




export const getProducts = async (req,res) => {

    try  {
        const merchant = await merchants.findOne({
            where: {
                username: req.header.username
            }
        });
        const product = await products.findAll({
            where: {
                merchant_id : merchant.id
            }
        });
        res.send(product);
    }catch(error) {
        res.sendStatus (400)
    };
};









export const updateProduct = async (req,res) => {
    const merchant = await merchants.findOne({
       where: {
           username: req.header.username
       }
   });
   
   const validation = await products.findOne({
       where: {
           id: req.body.id
       }
   });
   const params = req.params.username;
   if (params !== merchant.username) return res.sendStatus(401) ;

   try {
    
        if (validation.merchant_id !== merchant.id) return res.status(404).send("Product not found");
        await products.update({  
                name: req.body.name,
                quantity: req.body.quantity,
                price: req.body.price
        },{
             where: {
                 id: req.body.id
             }
            });
    
        res.send("Product updated");
        
   } catch (error) {
    return res.status(404).send("Product not found")
   };
  
}
;

export const deleteProduct = async (req,res) =>{
    const merchant = await merchants.findOne({
        where: {
            username: req.header.username
        }
    });
       const validation = await products.findOne({
       where: {
           id: req.body.id
       }
   });
   const params = req.params.username;
   if (params !== merchant.username) return res.send(404) ;
   try {
       
            if (validation.merchant_id !== merchant.id) return res.status(404).send("Product not found");
            await validation.destroy();
    
            res.send("Product deleted");
        
   } catch (error) {
    return res.status(404).send("Product not found");
   };
  
};


export const deleteAllProducts = async(req, res) => {
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
    

    try {
        if (validation.merchant_id !== merchant.id) return res.status(404).send("Product not found");
        await products.destroy({
            where: {
                merchant_id : merchant.id
            }
        });
        
        res.send("deleted")
    } catch (error) {
        res.sendStatus(400)
        
    };
};

