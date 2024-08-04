const inputEmail = document.getElementById("email") ;
const inputPassword = document.getElementById("password") ;
const btnLogin = document.getElementById("login") ;

function login() {
    const responseCaptcha = grecaptcha.getResponse() ;

    if(!(responseCaptcha == "" || responseCaptcha == undefined || responseCaptcha == null)) {
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
            if (response.ok) {
                window.location.href = "/menu"
            } else {
                return response.json().then(errorMessage => {
                    throw new Error(errorMessage.error);
                });
            }
        }).catch(err => {
            Swal.fire("Error", err.message, "error");
        });
    } else {
        Swal.fire("Error", 'You must validate Captcha before continuing', "error") ;
    }
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