import axios from "axios";
[];
import { response } from "express";
import { config } from "../../config/config";
import { sleep } from "../../utils/sleepFunction";
import { firestoreDb } from "../../config/firestore";

const date = new Date();

let day = date.getDate();

/* if (day / 10 < 1) {
  day = `0${day}`;
} */
let month = date.getUTCMonth() + 1;
let year = date.getFullYear();

//day format with which to query api for events

export const checkWeeklyEvents = async () => {
  if (Number(day) >= 31) day = 1;
  if (month >= 12 && day == 1) {
    month = 1;
    year += 1;
  }

  for (let i = 0; i < 28; i++) {
    let dateToday = `${year}-${month < 10 ? "0" + month : month}-${
      Number(day) + i
    }`;

    if ((Number(day) + i) / 10 < 1)
      dateToday = `${year}-${month < 10 ? "0" + month : month}-0${
        Number(day) + i
      }`;

    console.log("axios request -checkWeeklyEvents, current date: ", dateToday);
    const options = {
      method: "GET",
      url: `https://sportscore1.p.rapidapi.com/sports/1/events/date/${dateToday}`,
      headers: {
        "X-RapidAPI-Key": config.RAPID_API_KEY,

        "X-RapidAPI-Host": "sportscore1.p.rapidapi.com",
      },
    };

    try {
      let res: any = await axios(options);

      let events: any = res.data.data;

      const EventsRef = firestoreDb.collection("Events");

      for (const event of events) {
        for (let i = 0; i < 2; i++) {
          await sleep(i * 1000);
        }

        let eventRef = EventsRef.doc(`${event.id}`);

        const doc = await eventRef.get();

        if (doc.exists) {
          console.log("doc exists");
          continue;
        }

        let start_at: any = event.start_at;

        let date = start_at.slice(0, 10);

        event.date = date;

        if (event.sport_id == 1) {
          getEventLineups(event.id).then((lineups) => {
            getEventmarkets(event.id).then(async (markets) => {
              //create doc
              await eventRef.set({
                ...event,
                markets: markets == undefined || !markets ? null : markets,
                lineups: lineups == undefined || !lineups ? null : lineups,
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
    } catch (err: any) {
      console.error(err);
    }
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

    if (!markets || markets == undefined) {
      return null;
    }

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

    if (!lineups || lineups == undefined) {
      return null;
    }
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

checkWeeklyEvents().then();
