
import {Cron} from "croner"
import { checkWeeklyEvents } from "../services/firestore/getWeeklyEvents.firestore";

export const checkWeeklyEventsCron = new Cron(`0 0/15 1/5 * *`, async () => {
  console.log("checkWeeklyEventsCron running");
  await checkWeeklyEvents();
});

//export const checkWeeklyEventsCron = () => {
//cron.schedule("0 0 */3 * *", async () => {
//try {
//await checkWeeklyEvents();
//} catch (err) {
//console.error(err);
//}
//});
//};
