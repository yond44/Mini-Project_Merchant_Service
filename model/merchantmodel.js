import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const merchants = db.define('merchant', {
    username:{
        type: DataTypes.STRING,
    },
    password:{
        type: DataTypes.STRING
    },
    name:{
        type: DataTypes.STRING
    },
    address:{
        type: DataTypes.STRING
    },
    phone_number:{
        type: DataTypes.INTEGER
    },
    join_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    refresh_token:{
        type: DataTypes.TEXT
    }
}, {freezeTableName: true, createdAt: false, updatedAt: false});


export default merchants