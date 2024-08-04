const inputEmail = document.getElementById("email") ;
const btnSendCode = document.getElementById("sendcode") ;

function sendRecoveryCode() {
    const responseCaptcha = grecaptcha.getResponse() ;

    if(!(responseCaptcha == "" || responseCaptcha == undefined || responseCaptcha == null)) {
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
            if (response.ok) {
                Swal.fire("Code Sent!", "Check your email and enter the code to change your password", "success").then(() => {
                    window.location.href = "/forgotten/code";
                });
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

    btnSendCode.onclick = () => {

        sendRecoveryCode() ;

    };

} ;

init() ;