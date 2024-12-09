import axios from "axios";
import { config } from "../../config/config";
import { firestoreDb } from "../../config/firestore";
import { sleep } from "../../utils/sleepFunction";

const date = new Date();

let day: any = date.getDate();

if (day / 10 < 1) {
  day = `0${day}`;
}
let month = date.getUTCMonth() + 1;
let year = date.getFullYear();

//day format with which to query api for events

let dateToday = `${year}-${month < 10 ? "0" + month : month}-${day}`;

export const checkDailyEvents = async () => {
  const options = {
    method: "GET",
    url: `https://sportscore1.p.rapidapi.com/sports/1/events/date/${dateToday}`,
    headers: {
      "X-RapidAPI-Key": config.RAPID_API_KEY,
      "X-RapidAPI-Host": "sportscore1.p.rapidapi.com",
    },
  };

  try {
    console.log("axios request -checkDailyEvents-", dateToday);
    let res: any = await axios(options);

    let events: any = res.data.data;

    const EventsRef = firestoreDb.collection("Events");

    for (const event of events) {
      for (let i = 0; i < 5; i++) {
        await sleep(i * 1000);
      }

      let eventRef = EventsRef.doc(`${event.id}`);

      console.log(eventRef.path);

      let start_at: any = event.start_at;

      let date = start_at.slice(0, 10);

      event.date = date;

      //will first need to check if event exists, if not create.

      //check if event exists
      const doc = await eventRef.get();

      if (doc.exists) {
        console.log("doc exists", doc.id);
        continue;
      }

      if (event.sport_id == 1) {
        //get event lineups

        getEventLineups(event.id).then((lineups) => {
          getEventmarkets(event.id).then(async (markets) => {
            //create doc
            await eventRef.set({
              ...event,
              markets: markets,
              lineups: lineups,
              live: false,
              prediction_changed: false,
              admin_prediction: null,
              ai_prediction: null,
              expires_at: getDocTTL()
            });
          });
        });

        console.log("created event", eventRef.id);
      }
    }
    console.log(`created events for ${dateToday} in db`);
  } catch (error) {
    console.log(error);
  }
};

const getEventmarkets = async (eventId: string) => {
  try {
    console.log("axios request - getEventMarkets");
    const options = {
      method: "GET",
      url: `https://sportscore1.p.rapidapi.com/events/${eventId}/markets`,
      headers: {
        "X-RapidAPI-Key": config.RAPID_API_KEY,

        "X-RapidAPI-Host": "sportscore1.p.rapidapi.com",
      },
    };

    await sleep(500);

    const response = await axios.request(options);

    const markets = response.data.data;

    return markets;
  } catch (error) {
    console.error(error);
  }
};

const getEventLineups = async (eventId: string) => {
  try {
    console.log("axios request -getEventLineups");
    const options = {
      method: "GET",
      url: `https://sportscore1.p.rapidapi.com/events/${eventId}/lineups`,
      headers: {
        "X-RapidAPI-Key": config.RAPID_API_KEY,

        "X-RapidAPI-Host": "sportscore1.p.rapidapi.com",
      },
    };

    await sleep(500);

    const response = await axios.request(options);

    const lineups = response.data.data;

    return lineups;
  } catch (error) {
    console.error(error);
  }
};

const getDocTTL = () => {
  const today = new Date();
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
return oneWeekFromNow
}

