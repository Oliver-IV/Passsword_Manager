
const accountList = document.getElementById("accountList") ;

const userButtons = document.querySelectorAll(".btnshowu") ;
const passwordButtons = document.querySelectorAll(".btnshowp") ;

for (let i = 0; i < userButtons.length; i++) {
    userButtons[i].onclick = () => {

        if(document.querySelectorAll(".btnshowu")[i].closest(".rounded-lg").querySelector(".userfield").textContent == '*****') {

            let accountName = document.querySelectorAll(".btnshowu")[i].closest(".rounded-lg").querySelector(".accname").textContent ;

            fetch(`/account/user?name=${accountName}`, 
                {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json'
                    }
                }
            ).then(response => {
                if(response.ok) {
                    response.text().then(text => {
                        document.querySelectorAll(".btnshowu")[i].closest(".rounded-lg").querySelector(".userfield").textContent = text ;
                    }) ;
                } else {
                    return response.text().then(errorMessage => {
                        throw new Error(errorMessage) ;
                    });
                }
            }
            ).catch(err => {
                Swal.fire("Error", err.message, "error") ;
            });
        } else {
            document.querySelectorAll(".btnshowu")[i].closest(".rounded-lg").querySelector(".userfield").textContent = "*****" ;
        }
    }

    passwordButtons[i].onclick = () => {

        if(document.querySelectorAll(".btnshowp")[i].closest(".rounded-lg").querySelector(".passwordfield").textContent == '*****') {

            let accountName = document.querySelectorAll(".btnshowp")[i].closest(".rounded-lg").querySelector(".accname").textContent ;

            fetch(`/account/password?password=${accountName}`, 
                {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json'
                    }
                }
            ).then(response => {
                if(response.ok) {
                    response.text().then(text => {
                        document.querySelectorAll(".btnshowp")[i].closest(".rounded-lg").querySelector(".passwordfield").textContent = text ;
                    }) ;
                } else {
                    return response.text().then(errorMessage => {
                        throw new Error(errorMessage) ;
                    });
                }
            }
            ).catch(err => {
                Swal.fire("Error", err.message, "error") ;
            });
        } else {
            document.querySelectorAll(".btnshowp")[i].closest(".rounded-lg").querySelector(".passwordfield").textContent = "*****" ;
        }
    }
    
}