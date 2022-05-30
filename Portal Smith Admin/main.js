import {
    saveReport, 
    getReports, 
    deleteReport, 
    filteredReportsLocation,
    filteredReportsDay,
    filteredReportsTech,
    filteredReportMonth,
    filteredReportZone,
    getReportToEdit,
    getMoreReports,
    updateReport,
    setAsReady,
    uploadFactures
} from "./firebase.js";

let showedData;
let actualMonth;


window.addEventListener("DOMContentLoaded", async()=>{
    console.log("Working");
    const todayDate = new Date;
    let todayDay;
    let todayMonth;
    let todayYear;

    if(todayDate.getDate().toString().length == 1){
        todayDay = "0"+todayDate.getDate().toString();
    }else{
        todayDay = todayDate.getDate().toString();
    }
    if(todayDate.getMonth().toString().length == 1){
        todayMonth = "0"+(todayDate.getMonth()+1).toString();
    }else{
        todayMonth = (todayDate.getMonth()+1).toString();
    }


    switch(todayMonth){
        case "01":
            actualMonth = "enero";
            break;
        case "02":
            actualMonth = "febrero";
            break;
        case "03":
            actualMonth = "marzo";
            break;
        case "04":
            actualMonth = "abril";
            break;
        case "05":
            actualMonth = "mayo";
            break;
        case "06":
            actualMonth = "junio";
            break;
        case "07":
            actualMonth = "julio";
            break;
        case "08":
            actualMonth = "agosto";
            break;
        case "09":
            actualMonth = "septiembre";
            break;
        case "10":
            actualMonth = "octubre";
            break;
        case "11":
            actualMonth = "noviembre";
            break;
        case "12":
            actualMonth = "diciembre";
            break;
    }


    const reportHolder = document.querySelector(".reportsHolder");
    const reportDate = document.getElementById("reportDate").textContent = todayDay+"-"+todayMonth+"-"+todayDate.getFullYear().toString();



    reportHolder.innerHTML = "";
    const querySnapshot = await getReports();
    showedData = querySnapshot;

    querySnapshot.forEach(doc => {
        printAllData(doc);
    });
    await setAllDeleteButtons();
});

//Set the display mode of the edit section
const editFormHolder = document.querySelector(".editFormHolder");
editFormHolder.style.display = "none";
const exitEditButton = document.querySelector(".exitEditButton");

exitEditButton.addEventListener("click", setEditFormDisplay);

function setEditFormDisplay(id){
    editFormHolder.id = id;
    if(editFormHolder.style.display == "none"){
        editFormHolder.style.display = "flex";
    }else{
        editFormHolder.style.display = "none";
    }
}

//Set the listener to al the delete buttons;
function setAllDeleteButtons(){
    const reportHolder = document.querySelector(".reportsHolder");
    const reportDeleteButtons = reportHolder.querySelectorAll(".reportDeleteButton");
    const reportEditButtons = reportHolder.querySelectorAll(".reportEditButton");

    reportDeleteButtons.forEach((e)=>{
        e.addEventListener("click", (event)=>{
            deleteReport(e.id);
            setTimeout(()=>{
                location.reload();
            }, 1000);
        });
    });

    const setAsFactured = document.querySelectorAll(".facturedButton");
    setAsFactured.forEach((e)=>{
        const setAsFacturedFormHolder = document.querySelector(".setAsFacturedFormHolder");
        const exitFacturedButton = document.querySelector(".exitFacturedButton");

        e.addEventListener("click", async(obj)=>{
            setAsFacturedFormHolder.id = e.id;

            if(setAsFacturedFormHolder.className == "setAsFacturedFormHolder notShowed"){
                setAsFacturedFormHolder.className = "setAsFacturedFormHolder showed";
            }

            const reportDateEdit = document.getElementById("reportDateEdit");
            const reportIdEdit = document.getElementById("reportIdEdit");

            const reportData = await getReportToEdit(setAsFacturedFormHolder.id);

            reportDateEdit.textContent = reportData.data().date;
            reportIdEdit.value = reportData.data().id;
        })

        exitFacturedButton.addEventListener("click", ()=>{
            setAsFacturedFormHolder.className = "setAsFacturedFormHolder notShowed";
        });
    });

    const readyButtons = document.querySelectorAll(".readyButton");
    readyButtons.forEach((e)=>{
        const setAsReadyFormHolder = document.querySelector(".setAsReadyFormHolder");
        const closeSetAsForm = document.querySelector(".closeSetAsForm");
        
        e.addEventListener("click", ()=>{
            console.log(e.id);
            const setAsButtonSender = document.querySelector(".setAsButtonSender").id = e.id;
            setAsReadyFormHolder.style.display = "flex";
        })

    })

    reportEditButtons.forEach((e)=>{
        const reportDescription = document.getElementById("reportDescriptionEdit");
        const reportStatus = document.getElementById("reportStatusEdit");
        const reportId = document.getElementById("reportIdEdit");
        const reportEquipment = document.getElementById("reportEquipmentId");
        const reportTechnician = document.getElementById("reportTechnicianEdit");
        const reportLocation = document.getElementById("reportLocationEdit");
        const reportAuth = document.getElementById("reportAuthEdit");
        const reportDateEdit = document.getElementById("reportDateEdit");

        e.addEventListener("click", async(event)=>{
            setEditFormDisplay(e.id);
            const report = await getReportToEdit(e.id);

            reportDateEdit.innerHTML = report.data().date;
            reportDescription.value = report.data().description;
            reportStatus.value = report.data().status;
            reportId.value = report.data().id;
            reportEquipment.value = report.data().equipment;
            reportTechnician.value = report.data().technician;
            reportLocation.value = report.data().location;
            reportAuth.value = report.data().auth;
        });
    });
}

//Print all the data
function printAllData(doc){
    const reportHolder = document.querySelector(".reportsHolder");

    if(doc.data().status.toString().slice(2) == "Pendiente"){
        reportHolder.innerHTML = reportHolder.innerHTML + 
        `
            <div class="report">
                <div class="reportMainData">
                    <h4>`+doc.data().location+`</h4>
                    <h4>`+doc.data().equipment+`</h4>
                    <h4>`+doc.data().id+`</h4>
                    <h4>`+doc.data().date+`</h4>
                </div>
            <div class="divisionBar"></div>
            <div class="reportDescription">
                <p>`+doc.data().description+`</p>
                <br>
                <p>Tecnico: `+doc.data().technician+`</p>
                <p>Firmado por: `+doc.data().auth+`</p>
            </div>
            <div class="reportsButtons">
                <h4 class="reportTextStatus Pendiente">Estado: `+doc.data().status.toString().slice(2)+`</h4>
                <div class="technicianData">
                    <button class="BlueButtons reportEditButton" id="`+doc.id+`">Editar</button>
                    <button class="RedButtons reportDeleteButton" id="`+doc.id+`">Eliminar</button>
                    <button class="readyButton Listo" id="`+doc.id+`">Marcar como listo</button>
                </div>
            </div>
        </div>
        `;
    }
    else if(doc.data().status.toString().slice(2) == "Revisado"){
        reportHolder.innerHTML = reportHolder.innerHTML + 
        `
            <div class="report">
                <div class="reportMainData">
                    <h4>`+doc.data().location+`</h4>
                    <h4>`+doc.data().equipment+`</h4>
                    <h4>`+doc.data().id+`</h4>
                    <h4>`+doc.data().date+`</h4>
                </div>
            <div class="divisionBar"></div>
            <div class="reportDescription">
                <p>`+doc.data().description+`</p>
                <br>
                <p>Tecnico: `+doc.data().technician+`</p>
                <p>Firmado por: `+doc.data().auth+`</p>
            </div>
            <div class="reportsButtons">
                <h4 class="reportTextStatus Revisado">Estado: `+doc.data().status.toString().slice(2)+`</h4>
                <div class="technicianData">
                    <button class="BlueButtons reportEditButton" id="`+doc.id+`">Editar</button>
                    <button class="RedButtons reportDeleteButton" id="`+doc.id+`">Eliminar</button>
                    <button class="readyButton Listo" id="`+doc.id+`">Marcar como listo</button>
                </div>
            </div>
        </div>
        `;
    }
    else if(doc.data().status.toString().slice(2) == "Listo"){
        reportHolder.innerHTML = reportHolder.innerHTML + 
        `
            <div class="report">
                <div class="reportMainData">
                    <h4>`+doc.data().location+`</h4>
                    <h4>`+doc.data().equipment+`</h4>
                    <h4>`+doc.data().id+`</h4>
                    <h4>`+doc.data().date+`</h4>
                </div>
            <div class="divisionBar"></div>
            <div class="reportDescription">
                <p>`+doc.data().description+`</p>
                <br>
                <p>Tecnico: `+doc.data().technician+`</p>
                <p>Firmado por: `+doc.data().auth+`</p>
            </div>
            <br>
            <div class="reportsButtons">
                <h4 class="reportTextStatus Listo">Estado: `+doc.data().status.toString().slice(2)+`</h4>
                <div class="technicianData">
                    <button class="BlueButtons reportEditButton" id="`+doc.id+`">Editar</button>
                    <button class="RedButtons reportDeleteButton" id="`+doc.id+`">Eliminar</button>
                    <button class="facturedButton" id="`+doc.id+`">Marcar como facturado</button>
                </div>
            </div>
        </div>
        `;
    }
    else if(doc.data().status.toString().slice(2) == "Facturado"){
        reportHolder.innerHTML = reportHolder.innerHTML + 
        `
            <div class="report">
                <div class="reportMainData">
                    <h4>`+doc.data().location+`</h4>
                    <h4>`+doc.data().equipment+`</h4>
                    <h4>`+doc.data().id+`</h4>
                    <h4>`+doc.data().date+`</h4>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                </div>
            <div class="divisionBar"></div>
            <div class="reportDescription">
                <p>`+doc.data().description+`</p>
                <br>
                <p>Tecnico: `+doc.data().technician+`</p>
                <p>Firmado por: `+doc.data().auth+`</p>
                <p>Facturas: <a class="downloadLink" href="`+doc.data().XML+`" download="xd">XML</a> o <a class="downloadLink" href="`+doc.data().PDF+`" download="xd">PDF</a></p>
            </div>
            <br>
            <div class="reportsButtons">
                <h4 class="reportTextStatus Listo">Estado: `+doc.data().status.toString().slice(2)+`</h4>
                <div class="technicianData">
                    <button class="BlueButtons reportEditButton" id="`+doc.id+`">Editar</button>
                    <button class="RedButtons reportDeleteButton" id="`+doc.id+`">Eliminar</button>
                </div>
            </div>
        </div>
        `;
    }
}

/*Querys para la seleccion del Form que envia un reporte*/
const reportDate = document.getElementById("reportDate");
const reportId = document.getElementById("reportId");
const reportEquipment = document.getElementById("reportEquipment");
const reportLocation = document.getElementById("reportLocation");
const reportStatus = document.getElementById("reportStatus");
const reportDescription = document.getElementById("reportDescription");
const reportTechnician = document.getElementById("reportTechnician");
const reportAuth = document.getElementById("reportAuth");

const reportSender = document.getElementById("reportSender");
const isFacture = document.getElementById("isFacture");

/*Publicacion de Reporte* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//Structure = date, id, location, equipment, description, status
const reportForm = document.getElementById("reportForm");
reportSender.addEventListener("click", async(e)=>{
    e.preventDefault();
    console.clear();
    if(reportEquipment.value != "" && reportDescription.value != "" && reportId.value != ""){
        let locationZone;

        switch(reportLocation.value){
            case "TH: VPH":
                locationZone = "Zone Zero"
                break;
            case "TH: Forum Leones":
                locationZone = "Zone Zero"
                break;
            case "TH: San Jerónimo":
                locationZone = "Zone Zero"
                break;
            case "TH: UDEM CCU":
                locationZone = "Zone Zero"
                break;


            case "TH: Office Park":
                locationZone = "Zone Altea"
                break;
            case "TH: Altea Huinalá":
                locationZone = "Zone Altea"
                break;
            case "TH: Altea Miguel Alemán":
                locationZone = "Zone Altea"
                break;
            case "TH: TH: La Fe":
                locationZone = "Zone Altea"
                break;
            case "TH: Mol Concordia":
                locationZone = "Zone Altea"
                break;


            case "TH: Altea Misiones":
                locationZone = "Zone Minus";
                break;
            case "TH: Altea Pletórico":
                locationZone = "Zone Minus";
                break;
            case "TH: Garza Sada":
                locationZone = "Zone Minus";
                break;
            case "TH: Micropolis":
                locationZone = "Zone Minus";
                break;
            case "TH: Tec Biblioteca":
                locationZone = "Zone Minus";
                break;

            
            case "TH: Paseo Villalta":
                locationZone = "Zone V"
                break;
            case "TH: Distrito V":
                locationZone = "Zone V"
                break;
            case "TH: Parque Centro":
                locationZone = "Zone V"
                break;
            case "TH: Carranza":
                locationZone = "Zone V"
                break;

            
            case "TH: Central de Autobuses":
                locationZone = "Zone II";
                break;
            case "TH: Colón Metro":
                locationZone = "Zone II";
                break;


            case "TH: Av. México":
                locationZone = "Zone Magna";
                break;
            case "TH: Miguel de la Madrid":
                locationZone = "Zone Magna";
                break;
            case "TH: Constitución":
                locationZone = "Zone Magna";
                break;
            case "TH: Pablo Livas":
                locationZone = "Zone Magna";
                break;
            case "TH: Arcadia Guadalupe":
                locationZone = "Zone Magna";
                break;
            case "TH: Ayutla":
                locationZone = "Zone Magna";
                break;
            case "TH: Chapultepec":
                locationZone = "Zone Magna";
                break;


            case "TH: Arboledas":
                locationZone = "Zone Lower";
                break;
            case "TH: Magma":
                locationZone = "Zone Lower";
                break;
            case "TH: Fashion Drive":
                locationZone = "Zone Lower";
                break;
            case "TH: Calzada del Valle":
                locationZone = "Zone Lower";
                break;
            case "TH: Ricardo Margain":
                locationZone = "Zone Lower";
                break;


            case "TH: Nogalar":
                locationZone = "Zone Origi";
                break;
            case "TH: Las Puentes":
                locationZone = "Zone Origi";
                break;
            case "TH: Nuevo Anáhuac":
                locationZone = "Zone Origi";
                break;
            case "TH: Animol":
                locationZone = "Zone Origi";
                break;
            case "TH: Sultanes":
                locationZone = "Zone Origi";
                break;
        }

        saveReport(reportDate.textContent, reportId.value, reportLocation.value, reportEquipment.value, reportDescription.value, reportStatus.value, reportTechnician.value, reportAuth.value, actualMonth, isFacture.value, locationZone);

        reportEquipment.value = "";
        reportDescription.value = "";
        reportId.value = "";
        reportAuth.value = "";
        isFacture.value = "off";
        
        setTimeout( async(e)=>{
            const reportHolder = document.querySelector(".reportsHolder");
            reportHolder.innerHTML = "";
            const querySnapshot = await getReports();
            querySnapshot.forEach(doc => {
                printAllData(doc);
            });
            await setAllDeleteButtons();
        }, 1000);
    }
});


const setFiltersButton = document.querySelector(".setFiltersButton");
setFiltersButton.addEventListener("click", requestFilter);

/*Filter function ------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------*/

async function requestFilter(){
    const reportHolder = document.querySelector(".reportsHolder");
    reportHolder.innerHTML = "";

    if(filterSelection.value == "day"){
        const filterDateInput = document.getElementById("filterDateInput");
        const dateValue = filterDateInput.value.split("-").reverse().join("-");

        const filteredRequest = await filteredReportsDay(dateValue);
        filteredRequest.forEach(doc => {
            printAllData(doc);
        });
        await setAllDeleteButtons();
    }
    if(filterSelection.value == "location"){
        const filterLocationInput = document.getElementById("locationFilter");

        const filteredRequest = await filteredReportsLocation(filterLocationInput.value);
        filteredRequest.forEach(doc => {
            printAllData(doc)
        });
        await setAllDeleteButtons();
    }
    if(filterSelection.value == "month"){
        const monthSelector = document.getElementById("monthSelector");

        const filteredRequest = await filteredReportMonth(monthSelector.value);
        filteredRequest.forEach(doc =>{
            printAllData(doc);
        })
        await setAllDeleteButtons();
    }
    if(filterSelection.value == "zone"){
        const filterZoneSelector = document.getElementById("filterZoneSelector");

        const filteredRequest = await filteredReportZone(filterZoneSelector.value);
        filteredRequest.forEach(doc => {
            printAllData(doc);
        });
        await setAllDeleteButtons();
    }
}

//Delete filters function
const deleteFilterButton = document.querySelector(".deleteFilterButton");
deleteFilterButton.addEventListener("click", async (e)=>{
    const reportHolder = document.querySelector(".reportsHolder");
    reportHolder.innerHTML = "";
    const querySnapshot = await getReports();
    querySnapshot.forEach(doc => {
        printAllData(doc);
    });
    await setAllDeleteButtons(); 
});


//Filter DOM function
const filterContainer = document.querySelector(".filterContainer");
const filterSelection = document.getElementById("filterSelection");

filterSelection.addEventListener("change", (e)=>{
    if(filterSelection.value == "day"){
        filterContainer.innerHTML = 
        `
            <label for="filterDate">Fecha</label>
            <input id="filterDateInput" type="date">
        `;


    }
    if(filterSelection.value == "location"){
        filterContainer.innerHTML = 
        `
        <label for="locationFilter">Locacion</label>
            <select name="reportLocation" id="locationFilter">
                <option value="TH: Fashion Drive">TH: Fashion Drive</option>
                <option value="TH: Arboledas">TH: Arboledas</option>
                <option value="TH: UDEM CCU">TH: UDEM CCU</option>
                <option value="TH: La Fe">TH: La Fe</option>
                <option value="TH: Magma">TH: Magma</option>
                <option value="TH: Office Park">TH: Office Park</option>
                <option value="TH: Av. México">TH: Av. México</option>
                <option value="TH: Altea Misiones">TH: Altea Misiones</option>
                <option value="TH: Las Puentes">TH: Las Puentes</option>
                <option value="TH: Micropolis">TH: Micropolis</option>
                <option value="TH: Parque Centro">TH: Parque Centro</option>
                <option value="TH: Altea Miguel Alemán">TH: Altea Miguel Alemán</option>
                <option value="TH: Altea Huinalá">TH: Altea Huinalá</option>
                <option value="TH: Distrito V">TH: Distrito V</option>
                <option value="TH: Altea Pletórico">TH: Altea Pletórico</option>
                <option value="TH: Mol Concordia">TH: Mol Concordia</option>
                <option value="TH: Chapultepec">TH: Chapultepec</option>
                <option value="TH: Arcadia Guadalupe">TH: Arcadia Guadalupe</option>
                <option value="TH: Garza Sada">TH: Garza Sada</option>
                <option value="TH: Nuevo Anáhuac">TH: Nuevo Anáhuac</option>
                <option value="TH: Colón Metro">TH: Colón Metro</option>
                <option value="TH: VPH">TH: VPH</option>
                <option value="TH: Tec Biblioteca">TH: Tec Biblioteca</option>
                <option value="TH: San Jerónimo">TH: San Jerónimo</option>
                <option value="TH: Nuevo Sur">TH: Nuevo Sur</option>
                <option value="TH: Top Obispado">TH: Top Obispado</option>
                <option value="TH: Punto Poniente">TH: Punto Poniente</option>
                <option value="TH: Carranza">TH: Carranza</option>
                <option value="TH: Constitución">TH: Constitución</option>
                <option value="TH: Miguel de la Madrid">TH: Miguel de la Madrid</option>
                <option value="TH: Ayutla">TH: Ayutla</option>
                <option value="TH: Venustiano Sur">TH: Venustiano Sur</option>
                <option value="TH: Nogalar">TH: Nogalar</option>
                <option value="TH: Paseo Villalta">TH: Paseo Villalta</option>
                <option value="TH: Pablo Livas">TH: Pablo Livas</option>
                <option value="TH: Ricardo Margain">TH: Ricardo Margain</option>
                <option value="TH: Central de Autobuses">TH: Central de Autobuses</option>
                <option value="TH: Calzada del Valle">TH: Calzada del Valle</option>
                <option value="TH: Forum Leones">TH: Forum Leones</option>
                <option value="TH: Sultanes">TH: Sultanes</option>
                <option value="TH: Animol">TH: Animol</option>
            </select>
        `;
    }
    if(filterSelection.value == "zone"){
        filterContainer.innerHTML = 
        `
        <label for="filterZoneSelect">Fecha</label>
            <select name="filterZoneSelect" id="filterZoneSelector">
                <option value="Zone Zero">Zone Zero</option>
                <option value="Zone Altea">Zone Altea</option>
                <option value="Zone Minus">Zone Minus</option>
                <option value="Zone V">Zone V</option>
                <option value="Zone II">Zone II</option>
                <option value="Zone Magna">Zone Magna</option>
                <option value="Zone Lower">Zone Lower</option>
                <option value="Zone Origi">Zone Origi</option>
            </select>
        `;
    }
    if(filterSelection.value == "month"){
        filterContainer.innerHTML = `
            <label for="monthSelector">Mes: </label>
            <select name="monthSelector" id="monthSelector">
                <option value="enero">Enero</option>
                <option value="febrero">Febrero</option>
                <option value="marzo">Marzo</option>
                <option value="abril">Abril</option>
                <option value="mayo">Mayo</option>
                <option value="junio">Junio</option>
                <option value="julio">Julio</option>
                <option value="agosto">Agosto</option>
                <option value="septiembre">Septiembre</option>
                <option value="octubre">Octubre</option>
                <option value="noviembre">Noviembre</option>
                <option value="diciembre">Diciembre</option>
            </select>
        `;
    }
});

const showMoreData = document.getElementById("dataHolder");

const showMoreButton = document.querySelector(".showMoreButton");
showMoreButton.addEventListener("click", async()=>{
    if(showedData.docs[showedData.docs.length-1]){
        let lastSnap = showedData.docs[showedData.docs.length-1];
        showedData = await getMoreReports(lastSnap);

        showedData.docs.forEach((doc)=>{
            console.log(doc.id);
            printAllData(doc);
        });
    }
    setAllDeleteButtons();
});

const reportSenderEdit = document.getElementById("reportSenderEdit");
reportSenderEdit.addEventListener("click", async(e)=>{
    const reportDescription = document.getElementById("reportDescriptionEdit");
    const reportStatus = document.getElementById("reportStatusEdit");
    const reportId = document.getElementById("reportIdEdit");
    const reportEquipment = document.getElementById("reportEquipmentId");
    const reportTechnician = document.getElementById("reportTechnicianEdit");
    const reportLocation = document.getElementById("reportLocationEdit");
    const reportAuth = document.getElementById("reportAuthEdit");
    const reportDateEdit = document.getElementById("reportDateEdit");
    
    const data = {
        "description": reportDescription.value,
        "status": reportStatus.value,
        "id": reportId.value,
        "equipment": reportEquipment.value,
        "technician": reportTechnician.value,
        "location": reportLocation.value,
        "auth": reportAuth.value
    }

    updateReport(editFormHolder.id, data);
    setTimeout(async () => {
        location.reload();
        await setAllDeleteButtons();
    }, 500);
});

const setAsButtonSender = document.querySelector(".setAsButtonSender");
setAsButtonSender.addEventListener("click", (e)=>{
    const setAsSelect = document.getElementById("setAsSelect");
    const setAsBy = document.getElementById("setAsBy");
    const setAsComentary = document.getElementById("setAsComentary");
    const singedBy = document.getElementById("singedBy");

    const newFields = {
        "status": setAsSelect.value,
        "technician": setAsBy.value, 
        "comentary": setAsComentary.value,
        "auth": singedBy.value
    }

    setAsReady(setAsButtonSender.id, newFields);
    setTimeout(() => {
        location.reload();
    }, 1500);
});



/*File upload section*/
const setAsFactureSender = document.querySelector(".setAsFactureSender");

setAsFactureSender.addEventListener("click", async(e)=>{
    const uploadFacturePDF = document.getElementById("uploadFacturePDF");
    const uploadFactureXML = document.getElementById("uploadFactureXML");

    const xml = uploadFactureXML.files[0];
    const pdf = uploadFacturePDF.files[0];

    if(uploadFacturePDF.files[0].name != "" && uploadFactureXML.files[0].name != ""){
        await uploadFactures(pdf, xml);
        await location.reload();
    }
});

