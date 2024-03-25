import { connectDB } from "./config/db";
import { config } from "./config/config";
import { checkLiveEventsCron } from "./cronJobs/checkLiveGames";
import { checkDailyEvents } from "./services/getDailyEvents";
import { storeCacheValues } from "./config/cacheValues";
import { checkDailyEventsCron } from "./cronJobs/checkDailyEvents";
import { checkWeeklyEventsCron } from "./cronJobs/checkWeeklyEvents";
import { checkWeeklyEvents } from "./services/getWeeklyEvents";

let db: any;

(async () => {
  db = connectDB().then();
})();


checkDailyEvents();
checkWeeklyEvents();
checkWeeklyEventsCron.start();
checkDailyEventsCron.start();
checkLiveEventsCron.start();

