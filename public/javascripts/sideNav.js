const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const drop1 = document.getElementById("drop1");
const drop2 = document.getElementById("drop2");

drop1.style.display = "none";
drop2.style.display = "none";

btn1.addEventListener("click", ()=>{
    if(drop1.style.display === "none"){
        drop1.style.display = "block";
    }else{
        drop1.style.display = "none";
    }
})

btn2.addEventListener("click", ()=>{
    if(drop2.style.display === "none"){
        drop2.style.display = "block";
    }else{
        drop2.style.display = "none";
    }
})