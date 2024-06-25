import UsersDAO from "../../persistence/UsersDAO.js";
import UserDTO from "../../dtos/UserDTO.js";
import jwt from "jsonwebtoken" ;
import dotenv from "dotenv" ;
import cookieParser from "cookie-parser";

dotenv.config({path: "../.env"}) ;

const usersDAO = new UsersDAO() ;

function login(req, res) {

    usersDAO.getUser(req.body.email, req.body.password).then(results => {

        if(results) {

            const user = {
                email: results.email,
                name: results.name,
                accounts: results.accounts
            }
            const token = jwt.sign(
                user,
                process.env.SECRET_KEY,
                {
                    expiresIn: "1h"
                }
            ) ;

            res.status(200).cookie("access_token", token, 
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 100 * 60 * 60
                }
            ).send(user) ;
        }

    }).catch(err => {
        res.status(401).send(err.message) ;
    }) ;

}

function createUser(req, res) {
    const b = req.body ;
    const user = new UserDTO(b.name, b.last_name_p, b.last_name_m, b.email, b.password, []) ;

    usersDAO.addUser(user).then(results => {
        
        if(results) {
            res.status(200).send("The user has ben creates succesfully!") ;
        }
    }).catch(err => {
        res.status(400).send(err.message) ;
    }) ;
} 

function getAccountsNames(email) {
    return usersDAO.getAccountsNames(email) ;
}

function getUser(req, res) {
    const { user } = req.session ;
    const name = req.query.name ;
    
    usersDAO.getAccountUser(user.email, name).then(results => {
        res.status(200).send(results) ;
    }).catch(err => {
        res.status(400).send(err) ;
    }) ;
}

function getPassword(req, res) {
    const { user } = req.session ;
    const password = req.query.password ;
    
    usersDAO.getAccountPassword(user.email, password).then(results => {
        res.status(200).send(results) ;
    }).catch(err => {
        res.status(400).send(err) ;
    }) ;
}
export { login, createUser, getAccountsNames, getUser, getPassword } ;