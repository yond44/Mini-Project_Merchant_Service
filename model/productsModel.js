import { Sequelize } from "sequelize";
import db from "../config/database.js";


const { DataTypes } = Sequelize;

const products = db.define('products', {
    merchant_id:{
        type: DataTypes.INTEGER,
        references: { model: 'merchant', key: 'id' }
    },
    name:{
        type: DataTypes.STRING
    },
    quantity:{
        type: DataTypes.INTEGER
    },
    price:{
        type: DataTypes.FLOAT
    }
}, {freezeTableName: true, createdAt: false, updatedAt: false});


export default products