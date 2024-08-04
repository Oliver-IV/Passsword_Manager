import CryptoJS from "crypto-js";
import client from "./connection.js";
import dotenv from "dotenv";
import DataError from "./DataError.js";


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
                throw new DataError("There's already a User with this email!");
            } else {
                userDTO.password = encrypytAES(userDTO.password) ;
                await collection.insertOne(userDTO);
                return userDTO;
            }
        } catch (error) {
            if(error instanceof DataError) {
                throw new Error(error.message) ;
            } else {
                throw new Error("There's a problem with the connection...");
            }
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
                const newAccountIndex = userBD.accounts.findIndex(acc => acc.name.toLowerCase() == account.name.toLowerCase()) ;
                if(newAccountIndex == -1) {
                    account.password = encrypytAES(account.password) ;
                await collection.updateOne(
                    { "email": email },
                    { $push: { "accounts": account } }
                );
                    return true;
                } else {
                    throw new DataError("There's already an account with this name...") ;
                }
            } else {
                throw new DataError("There's an error with your data...");
            }
        } catch (error) {
            if(error instanceof DataError) {
                throw new Error(error.message) ;
            } else {
                throw new Error("There's a problem with the connection...") ;
            }
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
                throw new DataError("Your email or password is wrong...") ;
            }
        } catch (error) {
            if(error instanceof DataError) {
                throw new Error(error.message) ;
            } else {
                throw new Error("There's a problem with the connection...") ;
            }
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
                throw new DataError("There's an error with your data...") ;
            }

        } catch (error) {
            if(error instanceof DataError) {
                throw new Error(error.message) ;
            } else {
                throw new Error("There's a problem with the connection...") ;
            }
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
                throw new DataError("There's an error with your data...") ;
            }

        } catch (error) {
            if(error instanceof DataError) {
                throw new Error(error.message) ;
            } else {
                throw new Error("There's a problem with the connection...") ;
            }
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
                throw new DataError("There's an error with your data...") ;
            }

        } catch (error) {
            if(error instanceof DataError) {
                throw new Error(error.message) ;
            } else {
                throw new Error("There's a problem with the connection...") ;
            }
        } finally {
            await client.close() ;
        }
    }

    async getAccountDetails(email, name) {
        try {
            await client.connect();
    
            const collection = client.db("bd_password_manager").collection("users");
    
            const existingUser = await collection.findOne({
                email: email
            });
    
            if (existingUser) {
                let userDetails = null;
                existingUser.accounts.forEach(account => {
                    if (account.name.toLowerCase() === name.toLowerCase()) {
                        userDetails = {
                            user: account.user,
                            password: decryptAES(account.password)
                        };
                    }
                });
    
                if (userDetails) {
                    return userDetails;
                } else {
                    throw new DataError("There's an error with your data...");
                }
            } else {
                throw new DataError("There's an error with your data...");
            }
    
        } catch (error) {
            if (error instanceof DataError) {
                throw new Error(error.message);
            } else {
                throw new Error("There's a problem with the connection...");
            }
        } finally {
            await client.close();
        }
    }
    

    async existUser(email) {
        try {
            await client.connect() ;
            
            const collection = client.db("bd_password_manager").collection("users") ;

            const existingUser = await collection.findOne(
                {
                "email": email
                }
            ) ;

            if(existingUser) {
                return true ;
            } else {
                false ;
            }
        } catch (error) {
            if(error instanceof DataError) {
                throw new Error(error.message) ;
            } else {
                throw new Error("There's a problem with the connection...") ;
            }
        } finally {
            await client.close() ;
        }
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
                        $set : { "password": encrypytAES(password) }
                    }
                ) ;

                return true ;
            } else {
                throw new DataError("There's an error with your data...") ;
            }

        } catch (error) {
            if(error instanceof DataError) {
                throw new Error(error.message) ;
            } else {
                throw new Error("There's a problem with the connection...") ;
            }
        } finally {
            await client.close() ;
        }
    }
    
    async editAccount(email, oldName, newAccount) {
        try {
            await client.connect() ;

            const collection = client.db("bd_password_manager").collection("users") ;

            const existingUser = await collection.findOne(
                {
                "email": email
                }
            ) ;

            if(existingUser) {
                const accountIndex = existingUser.accounts.findIndex(account => account.name.toLowerCase() == oldName.toLowerCase()) ;
                const newAccountIndex = -1 ;

                if(oldName.toLowerCase() != newAccount.name.toLowerCase()) {
                    newAccountIndex = existingUser.accounts.findIndex(account => account.name.toLowerCase() == newAccount.name.toLowerCase()) ;
                }
                

                if(newAccountIndex == -1) {
                    if(accountIndex != -1) {

                        existingUser.accounts[accountIndex] = {
                            "name": newAccount.name,
                            "user": newAccount.user,
                            "password": encrypytAES(newAccount.password)
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
                        throw new DataError("There's a problem editing your account...") ;
                    }
                } else {
                    throw new DataError("There's already an account with this name...") ;
                }
            } else {
                throw new DataError("There's an error with your data...") ;
            }

        } catch (error) {
            if(error instanceof DataError) {
                throw new Error(error.message) ;
            } else {
                throw new Error("There's a problem with the connection...") ;
            }
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
                    throw new DataError("There's a problem editing your account...")
                }
            } else {
                throw new DataError("There's an error with your data...") ;
            }

        } catch (error) {
            if(error instanceof DataError) {
                throw new Error(error.message) ;
            } else {
                throw new Error("There's a problem with the connection...") ;
            }
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