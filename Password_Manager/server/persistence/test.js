import UserDTO from "../dtos/UserDTO.js";
import UsersDAO from "./usersDAO.js";
import client from "./connection.js"

const usersDAO = new UsersDAO() ; 

usersDAO.addUser(new UserDTO("Ignacio", "Valencia", "Auditore", "companacho@gmail.com", "companacho777", []))
.then((result) => {
    console.log(result) ;
})
.catch(err => {
    console.log(err) ; 
});
