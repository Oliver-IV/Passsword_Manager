const inputEmail = document.getElementById("email") ;
const inputPassword = document.getElementById("password") ;
const inputName = document.getElementById("name") ;
const inputLastName = document.getElementById("lastName") ;
const inputMotherLastName = document.getElementById("motherLastName") ;
const inputconfirmPassword = document.getElementById("confirmPassword") ;
const btnCreateAcc = document.getElementById("createAcc") ;

function createAccount() {
    const responseCaptcha = grecaptcha.getResponse() ;

    if(!(responseCaptcha == "" || responseCaptcha == undefined || responseCaptcha == null)) {
        const body = {
            name: inputName.value,
            last_name_p: inputLastName.value,
            last_name_m: inputMotherLastName.value,
            email: inputEmail.value,
            password: inputPassword.value,
            repeatedPassword: inputconfirmPassword.value
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
            if (response.ok) {
                if (response.ok) {
                    Swal.fire("Account Created", "Your account has been created successfully!", "success").then(() => {
                        window.location.href = '/';
                    });
                }
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
    btnCreateAcc.onclick = () => {
        createAccount() ;
    };
} ;

init() ;