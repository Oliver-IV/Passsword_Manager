
const accountList = document.getElementById("accountList") ;
const userButtons = document.querySelectorAll(".btnshowu") ;
const passwordButtons = document.querySelectorAll(".btnshowp") ;
const inputName = document.getElementById("account-name") ;
const inputUsername = document.getElementById("username") ;
const inputPassword = document.getElementById("password") ;
const addBtn = document.getElementById("addbtn") ;
const editButtons = document.querySelectorAll(".editbtn") ;
const deleteButtons = document.querySelectorAll(".deletebtn") ;
const copyButtonsU = document.querySelectorAll(".copybtnu") ;
const copyButtonsP = document.querySelectorAll(".copybtnp") ;
const clipboardIconsU = document.querySelectorAll(".clipboardIconu") ;
const clipboardIconsP = document.querySelectorAll(".clipboardIconp") ;   
const inputNameEdit = document.getElementById("accnameedit") ;
const inputUsernameEdit = document.getElementById("accusernameedit") ;
const inputPasswordEdit = document.getElementById("accpasswordedit") ;
const saveBtn = document.getElementById("savebtn") ;
const logoutBtn = document.getElementById("logout") ;

function showUser(i) {
    if(document.querySelectorAll(".btnshowu")[i].closest(".rounded-lg").querySelector(".userfield").textContent == '**********') {

        let accountName = document.querySelectorAll(".btnshowu")[i].closest(".rounded-lg").querySelector(".accname").textContent ;

        fetch(`/account/user?name=${accountName}`, 
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            }
        ).then(response => {
            if (response.ok) {
                response.text().then(text => {
                    document.querySelectorAll(".btnshowu")[i].closest(".rounded-lg").querySelector(".userfield").textContent = text;
                });
            } else if (response.status === 401) {
                window.location.href = "/auth/signin";
            } else {
                return response.json().then(errorMessage => {
                    throw new Error(errorMessage.error);
                });
            }
        }
        ).catch(err => {
            Swal.fire("Error", err.message, "error") ;
        });
    } else {
        document.querySelectorAll(".btnshowu")[i].closest(".rounded-lg").querySelector(".userfield").textContent = "**********" ;
    }
}

function showPassword(i) {
    if(document.querySelectorAll(".btnshowp")[i].closest(".rounded-lg").querySelector(".passwordfield").textContent == '**********') {

        let accountName = document.querySelectorAll(".btnshowp")[i].closest(".rounded-lg").querySelector(".accname").textContent ;

        fetch(`/account/password?password=${accountName}`, 
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                }
            }
        ).then(response => {
            if (response.ok) {
                response.text().then(text => {
                    document.querySelectorAll(".btnshowp")[i].closest(".rounded-lg").querySelector(".passwordfield").textContent = text;
                });
            } else if (response.status === 401) {
                window.location.href = "/auth/signin";
            } else {
                return response.json().then(errorMessage => {
                    throw new Error(errorMessage.error);
                });
            }
        }
        ).catch(err => {
            Swal.fire("Error", err.message, "error") ;
        });
    } else {
        document.querySelectorAll(".btnshowp")[i].closest(".rounded-lg").querySelector(".passwordfield").textContent = "**********" ;
    }
}

function addAccount() {

    const body = {
        name: inputName.value,
        user: inputUsername.value,
        password: inputPassword.value
    } ;

    fetch("/addAcc", 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    ).then(response => {
        if(response.ok) {
            Swal.fire("Account Added", "Your account has been added successfully!", "success").then(() => {
                window.location.reload() ;
            }) ;
        } else {
            return response.json().then(errorMessage => {
                throw new Error(errorMessage.error);
            });
        }
    }).catch(err => {
        Swal.fire("Error", err.message, "error") ;
    }) ;

}

function deleteAccount(i) {

    let accountName = document.querySelectorAll(".deletebtn")[i].closest(".rounded-lg").querySelector(".accname").textContent ;

    const body = { name: accountName } ;

    Swal.fire({
        title: 'Do you want to delete this account?',
        text: "This action will delete this account forever",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          
            fetch("/deleteAcc", 
                {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            ).then(response => {
                if(response.ok) {
                    Swal.fire('Deleted!', 'Your account has been deleted', 'success').then(() => {
                        window.location.reload() ;
                      }) ;
                } else {
                    return response.json().then(errorMessage => {
                        throw new Error(errorMessage.error);
                    });
                }
            }).catch(err => {
                Swal.fire("Error", err.message, "error") ;
            }) ;
          
        }
      })
}

function copyUser(i) {
    let accountName = document.querySelectorAll(".copybtnu")[i].closest(".rounded-lg").querySelector(".accname").textContent;
  
    fetch(`/account/user?name=${accountName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        response.text().then(text => {
          navigator.clipboard.writeText(text).then(() => {
            const clipboardIcon = document.querySelectorAll(".copybtnu")[i].querySelector("svg");
            const originalClass = clipboardIcon.getAttribute("class");
            const originalDataId = clipboardIcon.getAttribute("data-id");
  
            clipboardIcon.setAttribute("class", "h-4 w-4 check-icon");
            clipboardIcon.removeAttribute("data-id");
            clipboardIcon.innerHTML = `
              <polyline points="20 6 9 17 4 12"></polyline>
            `;
  
            setTimeout(() => {
              clipboardIcon.setAttribute("class", originalClass);
              clipboardIcon.setAttribute("data-id", originalDataId);
              clipboardIcon.innerHTML = `
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              `;
            }, 1000);
          }).catch(function (error) {
            Swal.fire("Error", "There was an error copying your user...", "error");
          });
        });
        } else if (response.status === 401) {
            window.location.href = "/auth/signin";
        } else {
            return response.json().then(errorMessage => {
                throw new Error(errorMessage.error);
            });
        }
    }).catch(err => {
      Swal.fire("Error", err.message, "error");
    });
  }

function copyPassword(i) {
    let accountName = document.querySelectorAll(".copybtnp")[i].closest(".rounded-lg").querySelector(".accname").textContent;

    fetch(`/account/password?password=${accountName}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                response.text().then(text => {
                    navigator.clipboard.writeText(text).then(() => {
                        const clipboardIcon = document.querySelectorAll(".copybtnp")[i].querySelector("svg");
                        const originalClass = clipboardIcon.getAttribute("class");
                        const originalDataId = clipboardIcon.getAttribute("data-id");

                        clipboardIcon.setAttribute("class", "h-4 w-4 check-icon");
                        clipboardIcon.removeAttribute("data-id");
                        clipboardIcon.innerHTML = `
                  <polyline points="20 6 9 17 4 12"></polyline>
                `;

                        setTimeout(() => {
                            clipboardIcon.setAttribute("class", originalClass);
                            clipboardIcon.setAttribute("data-id", originalDataId);
                            clipboardIcon.innerHTML = `
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  `;
                        }, 1000);
                    }).catch(function (error) {
                        Swal.fire("Error", "There was an error copying your password...", "error");
                    });
                });
            } else if (response.status === 401) {
                window.location.href = "/auth/signin";
            } else {
                return response.json().then(errorMessage => {
                    throw new Error(errorMessage.error);
                });
            }
        }).catch(err => {
            Swal.fire("Error", err.message, "error");
        });
    
}

function setAccountDetailsInEdit(accountName) {
    fetch(`/account/edit?name=${accountName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json().then(data => {
                inputUsernameEdit.value = data.user;
                inputPasswordEdit.value = data.password;
            });
        } else if (response.status === 401) {
            window.location.href = "/auth/signin";
        } else {
            return response.json().then(errorMessage => {
                throw new Error(errorMessage.error);
            });
        }
    }).catch(err => {
        Swal.fire("Error", err.message, "error");
    });
}


function editAccount() {

    const body = {
        oldName: oldNameEdit,
        name: inputNameEdit.value,
        user: inputUsernameEdit.value,
        password: inputPasswordEdit.value
    } ;

    fetch("/editAcc", 
        {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    ).then(response => {
        if(response.ok) {
            Swal.fire("Account Edited", "Your account has been edited successfully!", "success").then(() => {
                window.location.reload() ;
            }) ;
        } else {
            return response.json().then(errorMessage => {
                throw new Error(errorMessage.error);
            });
        }
    }).catch(err => {
        Swal.fire("Error", err.message, "error") ;
    }) ;

}

function logout() {
    Swal.fire({
        title: 'Logout',
        text: "Do you want to logout?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if(result.isConfirmed) {
            fetch("/logout", 
                {
                    method: "POST"
                }
            ).then(response => {
                window.location.href = "/" ;
            }) ;
        }
      }) ;
}

const init = () => {

    for (let i = 0; i < userButtons.length; i++) {
        userButtons[i].onclick = () => {
    
            showUser(i) ;
    
        } ;
    
        passwordButtons[i].onclick = () => {
    
            showPassword(i) ;
            
        } ;
    
        editButtons[i].onclick = () => {
            
            showEditAccount(i) ;
    
        } ;
    
        deleteButtons[i].onclick = () => {
    
            deleteAccount(i) ;
    
        } ;
    
        copyButtonsU[i].onclick = () => {
    
            copyUser(i) ;
    
        }
    
        copyButtonsP[i].onclick = () => {
    
            copyPassword(i) ;
    
        }
        
    }
    
    addBtn.onclick = () => {
    
        addAccount() ;
    
    }
    
    saveBtn.onclick = () => {
    
        editAccount() ;
    
    }

    logoutBtn.onclick = () => {
        
        logout() ;

    } ;

}

init() ;