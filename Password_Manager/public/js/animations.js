const name = document.getElementById("account-name") ;
const username = document.getElementById("username") ;
const password = document.getElementById("password") ;
const closeButtonAdd = document.getElementById('closeSlidingElement') ;
const closeButtonEdit = document.getElementById('closeEditForm') ;
var oldNameEdit = "" ;

function showEditAccount(i) {

    let accountName = document.querySelectorAll(".editbtn")[i].closest(".rounded-lg").querySelector(".accname").textContent;

      const container = document.getElementById('editFormContainer');

        if (container.classList.contains('visible') && (inputNameEdit.value == "" || inputUsernameEdit == "" || inputPasswordEdit == "")) {
            container.classList.remove('visible');
            inputNameEdit.value = "" ;
            inputUsernameEdit.value = "" ;
            inputPasswordEdit.value = "" ;
            setTimeout(() => {
                container.classList.add('hidden');
            }, 500); 
        } else {
            container.classList.remove('hidden');
            oldNameEdit = accountName ;
            inputNameEdit.value = accountName ;
            setAccountDetailsInEdit(accountName) ;
            setTimeout(() => {
                container.classList.add('visible');
                container.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 10);
        }

}

document.getElementById('toggleButton').addEventListener('click', function() {
    const element = document.getElementById('slidingElement');

    if (element.classList.contains('visible')) {
        element.classList.remove('visible');
        setTimeout(() => {
            element.classList.add('hidden');
        }, 500); 
    } else {
        element.classList.remove('hidden');
        inputName.value = "" ;
        inputUsername.value = "" ;
        inputPassword.value = "" ;
        setTimeout(() => {
            element.classList.add('visible');
        }, 10); 
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 510); 
    }
});

closeButtonEdit.onclick = () => {
    document.getElementById('editFormContainer').classList.add('hidden');
} ;

closeButtonAdd.onclick = () => {
    document.getElementById('slidingElement').classList.remove('visible');
    document.getElementById('slidingElement').classList.add('hidden');
} ;
