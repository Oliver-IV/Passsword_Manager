class UserDTO {

    constructor(names, last_name_p, last_name_m, email, password, accounts) {
        this.names = names;
        this.last_name_p = last_name_p;
        this.last_name_m = last_name_m;
        this.email = email;
        this.password = password;
        this.accounts = accounts;
    }

    // toJSON() {
    //     return {
    //         names: this.names,
    //         last_name_p: this.last_name_p,
    //         last_name_m: this.last_name_m,
    //         email: this.email,
    //         password: this.password,
    //         accounts: this.accounts
    //     } ;
    // }
}

export default UserDTO ;