const inputCode = document.getElementById("code") ;
const btnChangePassword = document.getElementById("resetpassword") ;
const inputPassword = document.getElementById("password") ;

function changePassword() {
    const body = {
        recoverycode: inputEmail.value,
        newPassword: inputPassword.value
    }
    fetch("/forgotten/changepassword", 
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) 
        }
    ).then(response => {
        if(response.ok) {
            Swal.fire("Password Changed!", "Your password has been changed successfully!", "success").then(() => {
                window.location.href = "/" ;
            }) ;
        }else {
            return response.json().then(errorMessage => {
                throw new Error(errorMessage.error);
            });
        }
    }).catch(err => {
        Swal.fire("Error", err.message, "error") ;
    });
}

const init = () => {

    btnChangePassword.onclick = () => {

        changePassword() ;

    } ;

} ;

init() ;