import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-analytics.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    where, 
    query, 
    limit,
    orderBy,
    getDoc,
    startAfter,
    updateDoc
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";
import {
    ref,
    getStorage,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js"


// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyDapJZJjW7Rch8vBHbDGFdUf5jZM5I9eok",
    authDomain: "portalsmith-5c190.firebaseapp.com",
    databaseURL: "https://portalsmith-5c190-default-rtdb.firebaseio.com",
    projectId: "portalsmith-5c190",
    storageBucket: "portalsmith-5c190.appspot.com",
    messagingSenderId: "237567229959",
    appId: "1:237567229959:web:28827324ff4f4bf5e6aaa2",
    measurementId: "G-G066GBTCWE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const storage = getStorage();

//Save reports function --------------------------
export const saveReport = (date, id, location, equipment, description, status, technician, auth, month, isFactured, zone) => {
    addDoc(collection(db, "reports"), {date: date, id: id, location: location, equipment: equipment, description: description, status: status, technician: technician, auth: auth, month: month, isFactured: isFactured, zone: zone});
}

//Get reports function --------------------------
export const getReports = ()=> getDocs(query(collection(db, "reports"), limit(30), orderBy("status", "asc")));

//Delete reports function -----------------------
export const deleteReport = (id)=>{
    deleteDoc(doc(db, "reports", id));
}

//Get paginate reports
export const getMoreReports = async(lastSnapshot)=>{
    const nextSnap = await getDocs(query(collection(db, "reports"), limit(30), orderBy("status", "asc"), startAfter(lastSnapshot)));
    return nextSnap;
}


//FILTER SECTION ---------------------------------------------
//Get filtered data by location
export const filteredReportsLocation = async (filterLocation)=>{
    const collectionData = collection(db, "reports");
    const filteredRequest = query(collectionData, where("location", "==", filterLocation), orderBy("status", "asc"), limit(100));
    
    const filteredData = await getDocs(filteredRequest);
    return(filteredData);
}
//Get filtered data by date
export const filteredReportsDay = async (filterDay)=>{
    const collectionData = collection(db, "reports");
    const filteredRequest = query(collectionData, where("date", "==", filterDay), orderBy("status", "asc"), limit(100));

    const filteredData = await getDocs(filteredRequest);
    return(filteredData);
}
//Get filtered data by technician
export const filteredReportsTech = async (filterTech)=>{
    const collectionData = collection(db, "reports");
    const filteredRequest = query(collectionData, where("technician", "==", filterTech), orderBy("date", "asc"), limit(100));

    const filteredData = await getDocs(filteredRequest);
    return(filteredData);
}
//Get filtered report by month
export const filteredReportMonth = async (filterMonth)=>{
    const collectionData = collection(db, "reports");
    const filteredRequest = query(collectionData, where("month", "==", filterMonth), orderBy("status", "asc"), limit(100));

    const filteredData = await getDocs(filteredRequest);
    return filteredData;
}
//Get filtered by zone
export const filteredReportZone = async(filterZone)=>{
    const collectionData = collection(db, "reports");
    const filteredRequest = query(collectionData, where("zone", "==", filterZone), orderBy("status", "asc"), limit(100));

    const filteredData = await getDocs(filteredRequest);
    return filteredData;
}
//Get filtered report by ID report
export const filteredReportId = async(idReport)=>{
    const collectionData = collection(db, "reports");
    const filteredRequest = query(collectionData, where("id", "==", idReport), orderBy("status", "asc"));

    const filteredData = await getDocs(filteredRequest);
    return filteredData;
}
//Get report to edit
export const getReportToEdit = async (id)=> getDoc(doc (db, "reports", id));


//Update a edited report
export const updateReport = async(reportId, data)=>{
    const newFields = {
        "description": data.description,
        "status": data.status,
        "id": data.id,
        "equipment": data.equipment,
        "technician": data.technician,
        "location": data.location,
        "auth": data.auth
    }
    await updateDoc(doc(db, "reports", reportId), newFields);
}

//Set as ready
export const setAsReady = async(reportId, data)=>{
    const newFields = {
        "status": data.status,
        "technician": data.technician, 
        "comentary": data.comentary,
        "auth": data.auth
    }

    await updateDoc(doc(db, "reports", reportId), newFields);
}


/*-----------------------------------------------------------------------------------------------------------------------
---------------------------------------------- UPLOAD DATA SECTION ------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------*/

//uploadFactures({ file: factura.xml });
export const uploadFactures = async(pdf, xml)=>{
    const reportReferencePDF = ref(storage, "factures/"+pdf.name);
    const reportReferenceXML = ref(storage, "factures/"+xml.name);
    const setAsFacturedFormHolder = document.querySelector(".setAsFacturedFormHolder");

    await uploadBytes(reportReferencePDF, pdf);
    await uploadBytes(reportReferenceXML, xml);

    const downloadPDF = await getDownloadURL(reportReferencePDF);
    const downloadXML = await getDownloadURL(reportReferenceXML);
    const reportId = setAsFacturedFormHolder.id;

    await updateDoc(doc(db, "reports", reportId), {"status": "3 Facturado", "XML": downloadXML, "PDF": downloadPDF});
}