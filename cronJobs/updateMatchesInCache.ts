import { CronJob } from "cron";
import { updateMatchesInCache } from "../services/updateMatchesInCache";

export const updateMatchesInCacheCron = new CronJob("0/1 * * * *", async () => {

    try {
        console.log("updateModifiedMatchesInCache Cron running");
  await updateMatchesInCache()
    } catch (error) {
        console.error(error)
    }
  
});