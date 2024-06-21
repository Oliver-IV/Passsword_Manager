import express from "express" ;
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { PORT } from "./utils/config.js"
import jwt from "jsonwebtoken" ;
import dotenv from "dotenv" ;
import login from "./utils/controllers/authentication.js"
import createUser from "./utils/controllers/authentication.js"

dotenv.config() ;
const __dirName = path.dirname(fileURLToPath(import.meta.url)) ;
const publicPath = path.join(__dirName, "../public") ;
const app = express() ;

app.use(bodyParser.urlencoded({extended: true})) ;
app.use(express.static(publicPath)) ;
app.use(express.json()) ;
app.use(cookieParser()) ;
app.use((req, res, next) => {
    const token = req.cookies.access_token ;
    req.session = {user: null} ;
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY) ;
        req.session.user = data ;
    } catch (error) {

    }
    next() ;
}) ;

console.log(publicPath) ;

app.get("/", (req, res) => {
    const { user } = req.session ;

    if(!user) {
        res.sendFile(publicPath + "/pages/login.html") ;
    } else {
        res.redirect("/auth/logout") ;
    }
}) ;

app.get("/createAcc", (req, res) => {
    res.sendFile(publicPath + "/pages/createAcc.html") ;
}) ;

app.get("/forgotten", (req, res) => {
    res.sendFile(publicPath + "/pages/forgotten.html") ;
}) ;

app.get("/forgotten/code", (req, res) => {
    res.sendFile(publicPath + "/pages/forgottencode.html") ;
}) ;

app.get("/menu", (req, res) => {
    const { user } = req.session ;

    if(user) {
        res.sendFile(publicPath + "/pages/menu.html") ;
    } else {
        res.redirect("/auth/signin") ;
    }
    
}) ;

app.get("/auth/signin", (req, res) => {
    res.sendFile(publicPath + "/pages/signin.html")
}) ;

app.get("/auth/logout", (req, res) => {
    res.sendFile(publicPath + "/pages/logout.html") ;
}) ;

app.post("/login", (req, res) => {
    login(req, res) ;
}) ;

app.post("/createAcc", (req, res) => {
    createUser(req, res) ;
}) ;

app.post("/logout", (req, res) => {
    res.clearCookie("access_token") ;
    res.redirect("/") ;
}) ;

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`) ;
}) ;











// app.get("/signup", authorization.validarSesionUsuarioNoLoggeado, (req, res) => {
//     res.sendFile(dirName + "/public/pages/register.html") ;
//     console.log("Registrar Mandado") ;
// }) ;

// app.post("/signup", (req, res) => {
//     if(req.body.nombre != '' || req.body.apellidop != '' || req.body.apellidom != '' || req.body.correo != '' || req.body.password != '') {
//         autenticacion.registrar(req, res) ; 
//     } else {
//         res.status(400).send("Llena los campos vacios") ;
//     }
// }) ;

// app.get("/forgotten", (req, res) => {
//     res.sendFile(dirName + "/public/pages/changepassword.html") ;
//     console.log("Olvidar Contrasenia mandado") ;
// })

// app.post("/forgotten", (req, res) => {
//     console.log(req.body) ;

//     autenticacion.cambiarContrasenia(req, res) ;

// }) ;



// console.log(dirName) ;