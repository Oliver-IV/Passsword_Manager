import express from "express" ;
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { PORT } from "./utils/config.js"


const __dirName = path.dirname(fileURLToPath(import.meta.url)) ;
const publicPath = path.join(__dirName, "../public") ;
const app = express() ;

app.use(bodyParser.urlencoded({extended: true})) ;
app.use(express.static(publicPath)) ;
app.use(express.json()) ;
app.use(cookieParser()) ;

console.log(publicPath) ;

app.get("/", (req, res) => {
    res.sendFile(publicPath + "/pages/login.html") ;
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
    res.sendFile(publicPath + "/pages/menu.html") ;
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