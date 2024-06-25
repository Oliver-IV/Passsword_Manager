const inputEmail = document.getElementById("email") ;
const inputPassword = document.getElementById("password") ;
const inputName = document.getElementById("name") ;
const inputLastName = document.getElementById("lastName") ;
const inputMotherLastName = document.getElementById("motherLastName") ;
const inputconfirmPassword = document.getElementById("confirmPassword") ;
const btnCreateAcc = document.getElementById("createAcc") ;

function createAccount() {
    const body = {
        name: inputName.value,
        last_name_p: inputLastName.value,
        last_name_m: inputMotherLastName.value,
        email: inputEmail.value,
        password: inputPassword.value
    }

    fetch("/createAcc",
        {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) 
        }
    ).then(response => {
        if(response.ok) {
            if (response.ok) {
                Swal.fire("Cuenta creada", "Se ha creado la cuenta!", "success").then(() => {
                    window.location.href = '/';
                }) ;
            }
        } else {
            return response.text().then(errorMessage => {
                Swal.fire("Error", errorMessage, "error") ;
            });
        }
    }).catch(err => {
        Swal.fire("Error", 'Se produjo un error al iniciar sesión. Por favor, inténtalo de nuevo.', "error") ;
    });

}

const init = () => {
    btnCreateAcc.onclick = () => {
        createAccount() ;
    };
} ;

init() ;