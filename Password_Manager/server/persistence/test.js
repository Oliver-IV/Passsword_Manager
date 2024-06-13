import UserDTO from "../dtos/UserDTO.js";
import UsersDAO from "./UsersDAO.js";
import client from "./connection.js"
import AccountDTO from "../dtos/AccountDTO.js"

const usersDAO = new UsersDAO() ; 

// usersDAO.addUser(new UserDTO("Secro", "Valencia", "Gutierrez", "elsecro@gmail.com", "elsecro777", []))
// .then((result) => {
//     console.log(result) ;
// })
// .catch(err => {
//     console.log(err) ; 
// });

//   usersDAO.addAccount("companacho@gmail.com", new AccountDTO("Prime Video", "companacho@gmail.com", "diossiexiste"))
//   .then((result) => {
//       console.log(result) ;
//   })
//   .catch(err => {
//       console.log(err) ; 
//   });

// usersDAO.getUser("companacho@gmail.com", "companacho777").then((results) => {
//     console.log(results) ;
// }).catch(err => {
//     console.log(err) ;
// }) ; ;

//  usersDAO.getAccountsNames("companacho@gmail.com").then((results) => {
//      console.log(results) ;
//  }).catch(err => {
//      console.log(err) ;
//  }) ;

//  usersDAO.getAccountUser("companacho@gmail.com", "Netflix").then((results) => {
//     console.log(results) ;
//  }).catch(err => {
//     console.log(err) ;
//  }) ;

//  usersDAO.getAccountPassword("companacho@gmail.com", "prime video").then((results) => {
//     console.log(results) ;
//  }).catch(err => {
//     console.log(err) ;
//  }) ;

// usersDAO.changePassword("companacho@gmail.com", "elnacho666").then((result) => {
//     console.log(result) ;
// }).catch(err => {
//     console.log(err) ;
// }) ;

// usersDAO.editAccount("companacho@gmail.com", new AccountDTO("Netflix", "companacho@gmail.com", "vivacristorey")).then(result => {
//     console.log(result) ;
// }).catch(err => {
//     console.log(err) ;
// }) ;

usersDAO.deleteAccount("companacho@gmail.com", "Netflix").then(result => {
    console.log(result) ;
}).catch(err => {
    console.log(err) ;
}) ;