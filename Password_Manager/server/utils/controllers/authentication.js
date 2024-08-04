import UsersDAO from "../../persistence/UsersDAO.js";
import UserDTO from "../../dtos/UserDTO.js";
import AccountDTO from "../../dtos/AccountDTO.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { validateUser, validateAccount, validateLogin, validatePassword } from "../../persistence/dataSchemas.js"
import transport from "./mailer.js";
import CryptoJS from "crypto-js";

dotenv.config({ path: "../.env" });

const usersDAO = new UsersDAO();

function login(req, res) {

    try {
        if (validateLogin({ email: req.body.email, password: req.body.password })) {
            usersDAO.getUser(req.body.email, req.body.password).then(results => {

                if (results) {

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
                    );

                    res.status(200).cookie("access_token", token,
                        {
                            httpOnly: true,
                            secure: true,
                            sameSite: "strict",
                            maxAge: 3600000
                        }
                    ).send(user);
                }

            }).catch(err => {
                res.status(401).json({ error: err.message || "Unknown Error" });
            });
        }
    } catch (error) {
        res.status(401).json({ error: error.message || "Unknown Error" })
    }
}

function createUser(req, res) {
    try {
        const b = req.body;

        const user = new UserDTO(b.name, b.last_name_p, b.last_name_m, b.email, b.password, []);
        if (validateUser(user)) {
            if (b.password === b.repeatedPassword) {
                usersDAO.addUser(user).then(results => {

                    if (results) {
                        res.status(200).send("The user has been created succesfully!");
                    }
                }).catch(err => {
                    res.status(400).json({ error: err.message || "Unknown Error" });
                });
            } else {
                res.status(400).json({ error: "The passwords don't match" });
            }
        }
    } catch (error) {
        res.status(400).json({ error: error.message || "Unknown Error" });
    }

}

function getAccountsNames(email) {
    try {
        return usersDAO.getAccountsNames(email);
    } catch (error) {
        res.status(400).json({ error: "Unknown Error" });
    }
}

function getUser(req, res) {
    try {
        const { user } = req.session;
        const name = req.query.name;

        usersDAO.getAccountUser(user.email, name).then(results => {
            res.status(200).send(results);
        }).catch(err => {
            console.log(err);
            res.status(400).json({ error: err.message || "Unknown Error" });
        });
    } catch (error) {
        res.status(400).json({ error: "Unknown Error" });
    }

}

function getPassword(req, res) {
    try {
        const { user } = req.session;
        const password = req.query.password;

        usersDAO.getAccountPassword(user.email, password).then(results => {
            res.status(200).send(results);
        }).catch(err => {
            res.status(400).json({ error: err.message || "Unknown Error" });
        });
    } catch (error) {
        res.status(400).json({ error: "Unknown Error" });
    }

}

const getAccountDetails = async (req, res) => {
    try {
        const { user } = req.session;
        const { name } = req.query;

        usersDAO.getAccountDetails(user.email, name).then(results => {
            res.status(200).json(results);
        }).catch(err => {
            console.error(err);
            res.status(400).json({ error: err.message || "Unknown Error" });
        });
    } catch (error) {
        res.status(400).json({ error: "Unknown Error" });
    }
}


function addAccount(req, res) {

    try {
        const { user } = req.session;

        const account = new AccountDTO(req.body.name, req.body.user, req.body.password);
        if (validateAccount(account)) {
            usersDAO.addAccount(user.email, account).then(results => {
                res.redirect("/menu");
            }).catch(err => {
                res.status(400).json({ error: err.message || "Unknown Error" });
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message || "Unknown Error" });
    }

}

function deleteAccount(req, res) {
    try {
        const { user } = req.session;

        usersDAO.deleteAccount(user.email, req.body.name).then(results => {
            res.status(200).send(results);
        }).catch(err => {
            res.status(400).json({ error: err.message || "Unknown Error" });
        });
    } catch (error) {
        res.status(400).json({ error: "Unknown Error" });
    }
}

function editAccount(req, res) {

    try {
        const { user } = req.session;

        const account = new AccountDTO(req.body.name, req.body.user, req.body.password);
        if (validateAccount(account)) {
            usersDAO.editAccount(user.email, req.body.oldName, account).then(results => {
                res.status(200).send(results);
            }).catch(err => {
                res.status(400).json({ error: err.message || "Unknown Error" });
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message || "Unknown Error" });
    }

}

function existUser(req, res) {
    const email = req.body.email;
    try {
        return usersDAO.existUser(email);
    } catch (error) {
        res.status(400).json({ error: error.message || "Unknown Error" });
    }
}

async function generateCodeForPassword(req, res) {
    const email = req.body.email;

    const recoveryCode = generateRecoveryCode();
    const expirationTime = Date.now() + 3600000;

    const data = {
        recoverycode: recoveryCode,
        codeexpirationtime: expirationTime,
        email: email
    }

    const token = jwt.sign(
        data,
        process.env.CHANGEP_KEY,
        {
            expiresIn: "1h"
        }
    );

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'PASSWORD MANAGER RECOVERY CODE',
        text: `Hi! This is CompaOli from your Password Manager. You've requested a password change and this is your code: ${recoveryCode}
                , it will expire on 1 hour. If it wasn't you, don't worry! Your passwords are still save, just ignore this mail and thanks 
                for trusting us :)`
    }

    const info = await transport.sendMail(mailOptions);

    res.status(200).cookie("changep_token", token,
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 100 * 60 * 60
        }
    ).status(200).json({ message: "Your recovery code has been sent to your email successfully!" });

}

function changePassword(req, res) {
    const userRecoveryCode = req.body.recoverycode;
    const recoveryCode = req.session.dataPassword.recoverycode;
    const expirationTime = req.session.dataPassword.codeexpirationtime;
    const email = req.session.dataPassword.email;

    if (expirationTime > Date.now()) {
        if (userRecoveryCode === recoveryCode) {
            try {
                if (validatePassword(req.body.newPassword)) {
                    usersDAO.changePassword(email, req.body.newPassword).then(results => {
                        res.status(200).send("The password has been changed successfully!");
                    });
                }
            } catch (error) {
                res.status(401).json({ error: error.message || "Unknown Error" });
            }
        } else {
            res.status(401).json({ error: "The code is worng, check it and try again later..." });
        }
    }

}

export { login, createUser, getAccountsNames, getUser, getPassword, addAccount, deleteAccount, editAccount, existUser, changePassword, generateCodeForPassword, getAccountDetails };

function generateRecoveryCode() {
    const length = 6;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    const randomBytes = CryptoJS.lib.WordArray.random(length);

    for (let i = 0; i < randomBytes.sigBytes; i++) {
        const byte = (randomBytes.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        code += charset[byte % charset.length];
    }

    return code;
}