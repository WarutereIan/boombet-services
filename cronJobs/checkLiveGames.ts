import { CronJob } from "cron";
import { checkLiveEvents } from "../services/firestore/getLiveEvents.firestore";

export const checkLiveEventsCron = new CronJob("0/1 * * * *", async () => {
  try {
    await checkLiveEvents();
  } catch (err) {
    console.error(err);
  }
});
