
import { checkLiveEvents } from "../services/firestore/getLiveEvents.firestore";
import {Cron} from "croner"

export const checkLiveEventsCron = new Cron("0/1 * * * *", async () => {
  try {
    await checkLiveEvents();
  } catch (err) {
    console.error(err);
  }
});


