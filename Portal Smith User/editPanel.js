import {
    uploadEvidences, uploadEvidencesPhotos
} from "./firebase.js";

//Set as form -------------
const setAsReadyFormHolder = document.querySelector(".setAsReadyFormHolder");
const closeSetAsForm = document.querySelector(".closeSetAsForm");

closeSetAsForm.addEventListener("click", ()=>{
    setAsReadyFormHolder.style.display = "none";
    const evidencesInput = document.getElementById("evidencesInput");
    evidencesInput.value = null
});

const evidencesInput = document.getElementById("evidencesInput");
const setAsButtonSender = document.querySelector(".setAsButtonSender");

evidencesInput.addEventListener("input", async()=>{
    uploadEvidencesPhotos(evidencesInput.files, setAsButtonSender.id);
})