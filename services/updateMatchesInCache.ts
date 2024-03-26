import { RedisClient } from "../config/db";
import { Event } from "../models/Event";

export const updateMatchesInCache = async () => {
    try {
        const dateToday = new Date()

        let month = dateToday.getUTCMonth() + 1;
        let year = dateToday.getFullYear();
        
        const date_string = `${year}-${month < 10 ? "0" + month : month}-${dateToday.getDate()<10? "0"+dateToday.getDate(): dateToday.getDate()}`
        let modified_matches = await Event.find({ date: date_string, prediction_changed: true })

        let unmodified_matches = await Event.find({
            date: date_string,
            prediction_changed: false
        })
        
        await RedisClient.set("modified_matches", JSON.stringify(modified_matches))
        await RedisClient.set("unmodified_matches", JSON.stringify(unmodified_matches))

        return console.log("successfully updated daily matches in cache")
    }catch(err){console.log("could not update modified matches in cache due to error: ", err)}
}