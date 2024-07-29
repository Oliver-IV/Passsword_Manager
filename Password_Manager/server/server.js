import express from "express" ;
import bodyParser from "body-parser";
import path, { delimiter } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { PORT } from "./utils/config.js"
import jwt from "jsonwebtoken" ;
import dotenv from "dotenv" ;
import { login, createUser, getAccountsNames, getPassword, getUser, addAccount, deleteAccount, editAccount, existUser, changePassword, generateCodeForPassword } from "./utils/controllers/authentication.js"
import { addAbortSignal } from "stream";

dotenv.config() ;
const __dirName = path.dirname(fileURLToPath(import.meta.url)) ;
const publicPath = path.join(__dirName, "../public") ;
const app = express() ;

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true})) ;
app.use(express.static(publicPath)) ;
app.use(express.json()) ;
app.use(cookieParser()) ;
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    const token = req.cookies.access_token ;
    req.session = {user: null} ;
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY) ;
        data.accounts = "" ;
        req.session.user = data ;
    } catch (error) {

    }
    next() ;
}) ;

app.get("/", (req, res) => {
    const { user } = req.session ;
    resetSession() ;

    if(!user) {
        res.sendFile(publicPath + "/pages/login.html") ;
    } else {
        res.redirect("/auth/logout") ;
    }
}) ;

app.get("/createAcc", (req, res) => {
    const { user } = req.session ;

    if(!user) {
        res.sendFile(publicPath + "/pages/createAcc.html") ;
    } else {
        res.redirect("/auth/logout") ;
    }
}) ;

app.get("/forgotten", (req, res) => {
    const { user } = req.session ;

    if(!user) {
        res.sendFile(publicPath + "/pages/forgotten.html") ;
    } else {
        res.redirect("/auth/logout") ;
    }
}) ;

app.get("/forgotten/code", (req, res) => {
    const { user } = req.session ;
    const { email } = req.session ;

    if(!user) {
        if(email) {
            res.sendFile(publicPath + "/pages/forgottencode.html") ;
        } else {
            res.redirect("/") ;
        }
    } else {
        res.redirect("/auth/logout") ;
    }
}) ;

app.get("/menu", (req, res) => {
    const { user } = req.session ;

    if(user) {
        getAccountsNames(user.email).then(results => {
            if(user) {
                res.render(publicPath + "/pages/menu", {accounts: results}) ;
            } else {
                res.redirect("/auth/signin") ;
            }
        }).catch(err => {
    
        }) ;
    } else {
        res.redirect("/auth/signin") ;
    }
    
}) ;

app.get("/auth/signin", (req, res) => {
    res.status(401).sendFile(publicPath + "/pages/signin.html") ;
}) ;

app.get("/auth/logout", (req, res) => {
    res.status(401).sendFile(publicPath + "/pages/logout.html") ;
}) ;

app.get("/account/user", (req, res) => {
    const { user } = req.session ;

    if (user) {
        getUser(req, res) ;
    } else {
        res.redirect("/auth/signin") ;
    }
}) ;

app.get("/account/password", (req, res) => {
    const { user } = req.session ;

    if (user) {
        getPassword(req, res) ;
    } else {
        res.redirect("/auth/signin") ;
    }
}) ;

app.post("/login", (req, res) => {
    const { user } = req.session ;
    
    if(!user) {
        login(req, res) ;
    } else {
        res.status(401).redirect("/menu") ;
    }
    
}) ;

app.post("/createAcc", (req, res) => {
    const { user } = req.session ;

    if(!user) {
        createUser(req, res) ;
    } else {
        res.status(401).redirect("/menu") ;
    }
}) ;

app.post("/addAcc", (req, res) => {
    const { user } = req.session ;

    if(user) {
        addAccount(req, res) ;
    } else {
        res.redirect("/auth/signin") ;
    }
}) ;

app.post("/logout", (req, res) => {
    res.clearCookie("access_token") ;
    res.redirect("/") ;
}) ;

app.post("/forgotten/code", (req, res) => {
    const { user } = req.session ;

    if(!user) {
        if(existUser(req, res)){
            generateCodeForPassword(req, res) ;
        } else {
            res.redirect("/") ;
        }
    } else {
        res.redirect("/auth/logout") ;
    }
}) ;

app.delete("/deleteAcc", (req, res) => {
    const { user } = req.session ;

    if(user) {
        deleteAccount(req, res) ;
    } else {
        res.redirect("/auth/signin") ;
    }
})

app.patch("/editAcc", (req, res) => {
    const { user } = req.session ;

    if(user) {
        editAccount(req, res) ;
    } else {
        res.redirect("/auth/signin") ;
    }
}) ;

app.patch("/forgotten/changepassword", (req, res) => {
    const { user } = req.session ;
    const { email } = req.session ;

    if(!user) {
        if(email) {
            changePassword(req, res) ;
        } else {
            res.redirect("/") ;
        }
    } else {
        res.redirect("/auth/logout") ;
    }
}) ;

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`) ;
}) ;

function resetSession(req, res) {
    try {
        req.session.email = null ;
        req.session.recoverycode = null ;
        req.session.codeexpirationtime = null ;
    } catch (error) {
        
    }
}