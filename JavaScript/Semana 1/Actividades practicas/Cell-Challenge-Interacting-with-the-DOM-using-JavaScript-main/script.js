const name = document.getElementById ("name")
const email = document.getElementById ("email")
const password = document.getElementById("password")
const form = document.getElementById("form")
const warnings = document.getElementById("warnings")

form.addEventListener("Submit", e=>{
    e.preventDefault()
    if(nombre.value.length <6) {
        alert("Nombre muy corto")
    }
})




//https://www.youtube.com/watch?v=36S19D6kZkc