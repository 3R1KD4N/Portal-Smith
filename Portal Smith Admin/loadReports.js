import {saveReport, getReports, deleteReport, filterReports} from "./firebase.js";
const locations = ["Tim Hortons VPH", "Tim Hortons Huinala", "Tim Hortons D.V"];
const statusList = ["0 Pendiente", "1 Revisado", "2 Listo"];

let numberOfReports = 50;
while(numberOfReports >= 0){
    numberOfReports--;


    /*export const saveReport = (date, id, location, equipment, description, status) => {
        addDoc(collection(db, "reports"), {date: date, id: id, location: location, equipment: equipment, description: description, status: status});
    }*/
    const id = parseInt(Math.random(0, 1)*100000);
    const date = parseInt(Math.random(0, 0.3)*10)+"-"+parseInt(Math.random(0, 0.3)*10)+"-"+parseInt(Math.random(0, 0.3)*10);
    const location = locations[Math.floor(Math.random() * 3)];
    const equipment = ("Equipment "+numberOfReports).toString();
    const description = ("Descripcion "+numberOfReports).toString();
    const status = statusList[Math.floor(Math.random() * 3)];


    saveReport(date, id, location, equipment, description, status);
}