const name = document.getElementById("name")
const email = document.getElementById("email")
const pass = document.getElementById("Passwords")  
const form = document.getElementById("form")
const message = document.getElementById("message")  
form.addEventListener("submit", e => {
    e.preventDefault()
    let warnings = ""
    let login = false
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
    message.innerHTML = ""

    if (name.value.length < 6) {
        warnings += `The name is not valid <br>`
        login = true
    }
    if (!regexEmail.test(email.value)) {
        warnings += `The email is not valid <br>`
        login = true
    }
    if (pass.value.length < 8) {
        warnings += `The password is not valid <br>`
        login = true
    }

    if (login) {
        message.innerHTML = warnings
    } else {
        message.innerHTML = `Submitted`
    }
})
