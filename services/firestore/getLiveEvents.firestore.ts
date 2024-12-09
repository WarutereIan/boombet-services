import axios from "axios";
import { config } from "../../config/config";
import { firestoreDb } from "../../config/firestore";
import { sleep } from "../../utils/sleepFunction";
import { replaceImgUrl } from "../../utils/replaceImgUrl";

const options = {
  method: "GET",
  url: "https://sportscore1.p.rapidapi.com/sports/1/events/live",
  headers: {
    "X-RapidAPI-Key": config.RAPID_API_KEY,
    "X-RapidAPI-Host": "sportscore1.p.rapidapi.com",
  },
};

export const checkLiveEvents = async () => {
  try {
    console.log("axios request -checkLiveEvents");
    let response = await axios(options);

    let events: any[] = response.data.data;

    let number_of_matches = 0;
    let invalidatedCount = 0;

    let liveList: any[] = [];

    const EventsRef = firestoreDb.collection("Events");

    for (const event of events) {
      //the event's doc name will be the event id as provided by softswiss

      let eventRef = EventsRef.doc(`${event.id}`);

      let start_at: any = event.start_at;

      let date = start_at.slice(0, 10);

      event.date = date;

      //check if doc exists, only then update it in db
      const doc = await eventRef.get();

      if (doc.exists) {
        let res = await eventRef.update({
          status: event.status,
          status_more: event.status_more,
          winner_code: event.winner_code,
          cards_code: event.cards_code,
          event_data_change: event.event_data_change,
          lasted_period: event.lasted_period,
          main_odds: event.main_odds,
          live: true,
          home_score: event.home_score,
          away_score: event.away_score,
          time_details: event.time_details,
        });

        console.log("updated live match", doc.id);
        
      } else {
        //else create it in db
        await eventRef.set({
          ...event,
          live: false,
          prediction_changed: false,
          admin_prediction: null,
          ai_prediction: null,
          expires_at: getDocTTL()
        });

        console.log("created new live event in db", eventRef.id);
      }

      //update the necessary stats in live match

      liveList.push(eventRef.id);
    }

    //get livematches in db
    const liveEventsRef = await EventsRef.where("live", "==", true).get();

    if (liveEventsRef.empty) {
      console.log("No live events");
      return;
    }
    //if not empty
    liveEventsRef.forEach(async (liveEventRef) => {
      if (!liveList.includes(liveEventRef.id)) {
        //update match status to false in db
        let eventRef = EventsRef.doc(`${liveEventRef.id}`);

        await eventRef.update({ live: false });

        console.log(
          `Match id ${liveEventRef.id} finished and live status updated to False
          `
        );
        invalidatedCount++;
      } else {
        for (let i = 0; i < 2; i++) {
          await sleep(i * 200);
        }
        let eventRef = EventsRef.doc(
          `${liveEventRef.id.replace("Events/", "")}`
        );

        /* let incidents = await getEventIncidents(
          liveEventRef.id.replace("Events/", "")
        );
        let stats = await getEventStats(liveEventRef.id.replace("Events/", "")); */

        //replaceImgUrl(liveEventRef.data())
        //await eventRef.update({ incidents, stats });
      }

      console.log("invalidated matches", invalidatedCount);

      console.log("live matches", liveList.length);
    });
  } catch (error) {
    console.log(error);
  }
};

async function getEventIncidents(eventId: string) {
  try {
    console.log("axios request - getEventIncidents");

    const options = {
      method: "GET",
      url: `https://sportscore1.p.rapidapi.com/events/${eventId}/incidents`,
      headers: {
        "X-RapidAPI-Key": config.RAPID_API_KEY,

        "X-RapidAPI-Host": "sportscore1.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);

    const incidents = response.data.data;

    return incidents;
  } catch (error) {
    console.error(error);
  }
}

async function getEventStats(eventId: string) {
  try {
    console.log("axios request -getEventStats");

    const options = {
      method: "GET",
      url: `https://sportscore1.p.rapidapi.com/events/${eventId}/statistics`,
      headers: {
        "X-RapidAPI-Key": config.RAPID_API_KEY,

        "X-RapidAPI-Host": "sportscore1.p.rapidapi.com",
      },
    };

    let response = await axios.request(options);

    let stats = response.data.data;

    return stats;
  } catch (error) {
    console.error(error);
  }
}

const getDocTTL = () => {
  const today = new Date();
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
return oneWeekFromNow
}


checkLiveEvents().then();
