let numContainer = document.getElementById("num");
let value = 0;
let btnsuma = document.querySelector(".suma");
let btnresta = document.querySelector(".resta");
let btnreset = document.querySelector(".reset");



btnsuma.addEventListener("click", () => {value++;numContainer.textContent = value;});
btnresta.addEventListener("click", () => {value--;numContainer.textContent = value});
btnreset.addEventListener("click", () => {value=0;numContainer.textContent = value});


//seccion 2 clima