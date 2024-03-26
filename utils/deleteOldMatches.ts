import { Event } from "../models/Event";

export const deleteOldMatches = async () => {
    try {
        //delete all documents older than a month
        //so, get current data, go back in time
        //create new Date object from current data format: yyyy/mm/dd

        for (let i = 10; i < 30; i++) {

            const dateToday = new Date()
            const date = dateToday.setDate(dateToday.getDate() - i)
            const adjusted_date = new Date(date)
            
            let month = adjusted_date.getUTCMonth() + 1;
            let year = adjusted_date.getFullYear();
        
        const date_string = `${year}-${month < 10 ? "0" + month : month}-${adjusted_date.getDate()<10? "0"+adjusted_date.getDate(): adjusted_date.getDate()}`
            
            console.log(date_string);
            
            const deleted_matches =await Event.deleteMany({ date: date_string })
            
           console.log(deleted_matches);
           
        }


    }catch(err){console.error(err)}
}




