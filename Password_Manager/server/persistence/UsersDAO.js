import CryptoJS from "crypto-js";
import client from "./connection.js";
import dotenv from "dotenv";


class UsersDAO {
    
    constructor() {
        dotenv.config({path: "../.env"}) ;

    }

    addUser(userDTO) {
        return new Promise((resolve, reject) => {
            try {
                client.connect() ;
                const collection = client.db("bd_password_manager").collection("users") ;
                 
                collection.insertOne(userDTO) ;

                resolve(userDTO) ;
            } catch (err) {
                reject(new Error("There's a problem with the connection...")) ;
            } 
        }) ;
    }

    addAccount(email, account) {
        return new Promise((resolve, reject) => {
            try {
                client.connect() ;
                const collection = client.db("bd_password_manager").collection("users") ;
                 
                collection

                resolve(userDTO) ;
            } catch (err) {
                reject(new Error("There's a problem with the connection...")) ;
            } finally {
                client.close() ;
            }
        }) ;
    }

    getUser() {

    }

    getAccountUser() {

    }

    getAccountPassword() {
        
    }

    existUser() {

    }

    changePassword() {

    }

    editAccount() {

    }

    deleteAccount() {

    }

}

function encrypytAES(password) {
    const key = process.env.AES_KEY ;
    const encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();
    return encryptedPassword;
}


function decryptAES(encryptedPassword) {
    const key = process.env.AES_KEY ;
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedPassword, key);
    const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
}

export default UsersDAO ;