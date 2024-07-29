const inputEmail = document.getElementById("email") ;
const btnSendCode = document.getElementById("sendcode") ;

function sendRecoveryCode() {
    const body = {
        email: inputEmail.value
    }
    fetch(`/forgotten/code`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) 
        }
    ).then(response => {
        if(response.ok) {
            Swal.fire("Code Sent!", "Check your email and enter the code to change your password", "success").then(() => {
                window.location.href = "/forgotten/code" ;
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

    btnSendCode.onclick = () => {

        sendRecoveryCode() ;

    };

} ;

init() ;