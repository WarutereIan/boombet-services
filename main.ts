import { connectDB } from "./config/db";
import { config } from "./config/config";
import { checkLiveEventsCron, } from "./cronJobs/checkLiveGames";
import { checkDailyEvents } from "./services/getDailyEvents";
import { storeCacheValues } from "./config/cacheValues";
import { checkDailyEventsCron } from "./cronJobs/checkDailyEvents";
import { checkWeeklyEventsCron } from "./cronJobs/checkWeeklyEvents";
import { checkWeeklyEvents } from "./services/getWeeklyEvents";
import { deleteOldMatches } from "./utils/deleteOldMatches";

import { updateMatchesInCacheCron } from "./cronJobs/updateMatchesInCache";
import { sub } from "./utils/subToMatch";


let db: any;

(async () => {
  db = connectDB().then();
})();

/* 
checkDailyEvents();
checkWeeklyEvents(); */
checkWeeklyEventsCron
checkDailyEventsCron
checkLiveEventsCron
//updateMatchesInCacheCron.start()

deleteOldMatches().then() 
