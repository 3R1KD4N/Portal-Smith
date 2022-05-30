import {
    saveReport, 
    getReports, 
    deleteReport, 
    filteredReportsLocation,
    filteredReportsDay,
    filteredReportsTech,
    getReportToEdit
} from "./firebase.js";

//Set as form -------------
const setAsReadyFormHolder = document.querySelector(".setAsReadyFormHolder");
const closeSetAsForm = document.querySelector(".closeSetAsForm");

closeSetAsForm.addEventListener("click", ()=>{
    setAsReadyFormHolder.style.display = "none";
});
