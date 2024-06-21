import UsersDAO from "../../persistence/UsersDAO";
import UserDTO from "../../dtos/UserDTO";
import jwt from "jsonwebtoken" ;
import dotenv from "dotenv" ;
import cookieParser from "cookie-parser";

dotenv.config() ;

function validateCookieNoSession(req, res, next) {
    const token = req.cookies.access_token ;

    if(token) {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY) ;
            //MANEJAR LA RESPUESTA PARA QUE ME ENVIE A LA PAGINA DESEADA
            req.session.user = data ;

        } catch (error) {
            res.status(401).send("Access not authorized") ;
        }
        next() ;
    } else {
        res.status(401).send("Access not authorized") ;
    }
}

function validateCookieWithSession(req, res, next) {
    const token = req.cookies.access_token ;

    if(token) {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY) ;
            res.redirect("/menu") ;
        } catch (error) {
            res.status(400).send("ERROR") ;
        }
        next() ;
    } else {
        res.status(401).send("You must sign out...") ;
    }
}
