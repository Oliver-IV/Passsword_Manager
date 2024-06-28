const inputEmail = document.getElementById("email") ;
const inputPassword = document.getElementById("password") ;
const btnLogin = document.getElementById("login") ;

function login() {
    const body = {
        email: inputEmail.value,
        password: inputPassword.value
    }
    fetch("/login",
        {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) 
        }
    ).then(response => {
        if(response.ok) {
            window.location.href = "/menu"
        } else {
            return response.text().then(errorMessage => {
                Swal.fire("Error", errorMessage, "error") ;
            });
        }
    }).catch(err => {
        Swal.fire("Error", "There's an error logging in, try again later...", "error") ;
    });
}

const init = () => {

    btnLogin.onclick = () => {
        login() ;
    }

    document.onkeydown = (event) => {
        if(event.key == 'Enter') {
            login();
        }
    }

} ;

init() ;