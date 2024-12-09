import { firestoreDb } from "../config/firestore";

export const sub = (id: string) => {
const doc = firestoreDb.collection("Events").doc(id)
    doc.onSnapshot(snapshot => {
        console.log("received doc snapshot: ", snapshot.data());
        
    }, err => {
        console.log("Error:" , err);
        
    })
}



sub("2492498")