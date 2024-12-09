
import {Cron} from "croner"

import { checkDailyEvents } from "../services/firestore/getDailyEvents.firestore";

export const checkDailyEventsCron = new Cron("1 0/3 * * *", async () => {
  console.log("checkDailyEventsCron running");
  
  await checkDailyEvents();
})

/* export const checkDailyEventsCron = () =>
  cron.schedule("1 0/3 * * *", async () => {
    try {
      await checkDailyEvents();
    } catch (err) {
      console.error(err);
    }
  }); */
