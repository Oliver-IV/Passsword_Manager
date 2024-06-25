import CryptoJS from "crypto-js";
import client from "./connection.js";
import dotenv from "dotenv";
import { connect } from "http2";


class UsersDAO {
    
    constructor() {
        dotenv.config({path: "../.env"}) ;

    }

    async addUser(userDTO) {
        try {
            await client.connect();
            
            const collection = client.db("bd_password_manager").collection("users");
    
            const existingUser = await collection.findOne({ "email": userDTO.email });
    
            if (existingUser) {
                throw new Error("There's already a User with this email!");
            } else {
                userDTO.password = encrypytAES(userDTO.password) ;
                await collection.insertOne(userDTO);
                return userDTO;
            }
        } catch (error) {
            throw new Error("There's a problem with the connection...");
        } finally {
            await client.close() ;
        }
    }

    async addAccount(email, account) {
        try {
            await client.connect() ;

            const collection = client.db("bd_password_manager").collection("users");

            const userBD = await collection.findOne({ "email": email });

            if (userBD) {
                account.password = encrypytAES(account.password) ;
                await collection.updateOne(
                    { "email": email },
                    { $push: { "accounts": account } }
                );
                return true;
            } else {
                return new Error("There's an error with your data...");
            }
        } catch (error) {
            throw new Error("There's a problem with the connection...") ;
        } finally {
            await client.close() ;
        }
    }

    async getUser(email, password) {
        try {
            await client.connect() ;
            
            const collection = client.db("bd_password_manager").collection("users") ;

            const existingUser = await collection.findOne(
                {
                "email": email
                }
            ) ;

            if(existingUser && decryptAES(existingUser.password) == password) {
                return existingUser ;
            } else {
                throw new Error("Your email or password is wrong...") ;
            }

        } catch (error) {
            throw new Error("There's a problem with the connection...") ;
        } finally {
            await client.close() ;
        }
    }

    async getAccountsNames(email) {
        try {
            await client.connect() ;

            const collection = client.db("bd_password_manager").collection("users") ;

            const existingUser = await collection.findOne(
                {
                "email": email
                }
            ) ;

            if(existingUser) {
                const names = [] ;

                existingUser.accounts.forEach(account => {
                    names.push(account.name) ;
                });

                return names ;
            } else {
                throw new Error("There's an error with your data...") ;
            }

        } catch (error) {
            throw new Error("There's a problem with the connection...") ;
        } finally {
            await client.close() ;
        }
    }

    async getAccountUser(email, name) {
        try {
            await client.connect() ;

            const collection = client.db("bd_password_manager").collection("users") ;

            const existingUser = await collection.findOne(
                {
                "email": email
                }
            ) ;

            if(existingUser) {
                let user = "" ;
                existingUser.accounts.forEach(account => {
                    if(account.name.toLowerCase() == name.toLowerCase()) {
                        user = account.user ;
                    }
                });
                return user ;
            } else {
                throw new Error("There's an error with your data...") ;
            }

        } catch (error) {
            throw new Error("There's a problem with the connection...") ;
        } finally {
            await client.close() ;
        }
    }

    async getAccountPassword(email, name) {
        try {
            await client.connect() ;

            const collection = client.db("bd_password_manager").collection("users") ;

            const existingUser = await collection.findOne(
                {
                "email": email
                }
            ) ;

            if(existingUser) {
                let password = "" ;
                existingUser.accounts.forEach(account => {
                    if(account.name.toLowerCase() == name.toLowerCase()) {
                        password = account.password ;
                    }
                });
                return decryptAES(password) ;
            } else {
                throw new Error("There's an error with your data...") ;
            }

        } catch (error) {
            throw new Error("There's a problem with the connection...") ;
        } finally {
            await client.close() ;
        }
    }

    existUser() {

    }

    async changePassword(email, password) {
        try {
            await client.connect() ;

            const collection = client.db("bd_password_manager").collection("users") ;

            const existingUser = await collection.findOne(
                {
                "email": email
                }
            ) ;

            if(existingUser) {
                
                await collection.updateOne(
                    {
                        "email": email
                    }, 
                    {
                        $set : { "password": password }
                    }
                ) ;

                return true ;
            } else {
                throw new Error("There's an error with your data...") ;
            }

        } catch (error) {
            throw new Error("There's a problem with the connection...") ;
        } finally {
            await client.close() ;
        }
    }
    
    async editAccount(email, newAccount) {
        try {
            await client.connect() ;

            const collection = client.db("bd_password_manager").collection("users") ;

            const existingUser = await collection.findOne(
                {
                "email": email
                }
            ) ;

            if(existingUser) {
                
                const accountIndex = existingUser.accounts.findIndex(account => account.name.toLowerCase() == newAccount.name.toLowerCase()) ;

                if(accountIndex != -1) {

                    existingUser.accounts[accountIndex] = {
                        "name": newAccount.name,
                        "user": newAccount.user,
                        "password": newAccount.password
                    }

                    await collection.updateOne(
                        {
                            "email": email
                        },
                        {
                            $set: {"accounts": existingUser.accounts}
                        }
                    ) ;
                    
                    return true ;
                } else {
                    throw new Error("There's a problem editing your account...")
                }
            } else {
                throw new Error("There's an error with your data...") ;
            }

        } catch (error) {
            throw new Error("There's a problem with the connection...") ;
        } finally {
            await client.close() ;
        }
    }

    async deleteAccount(email, name) {
        try {
            await client.connect() ;

            const collection = client.db("bd_password_manager").collection("users") ;

            const existingUser = await collection.findOne(
                {
                "email": email
                }
            ) ;

            if(existingUser) {
                
                const accountIndex = existingUser.accounts.findIndex(account => account.name.toLowerCase() == name.toLowerCase()) ;

                if(accountIndex != -1) {

                    await collection.updateOne(
                        { "email": email },
                        { $pull: { accounts: { name: name } } }
                    );
                    
                    return true ;
                } else {
                    throw new Error("There's a problem editing your account...")
                }
            } else {
                throw new Error("There's an error with your data...") ;
            }

        } catch (error) {
            console.log(error) ;
            throw new Error("There's a problem with the connection...") ;
        } finally {
            await client.close() ;
        }
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