import admin from "firebase-admin";
import Config from "../config.js";
import faker from "faker";
import moment from "moment";

const EVENTS_COUNT = 50;
const NAMES_COUNT = 4;
const TAGS_CHOICES = 3;
const HOUR_INCR_MAX = 3;
const DAY_INCR_MAX = 16;
const MONTH_INCR_MAX = 4;

const generateNames = () => {
  let numIters = Math.floor(Math.random() * NAMES_COUNT) + 1;
  let i = 0;
  let names = [];

  while (i < numIters) {
    names.push(faker.name.findName());
    i++;
  }

  return names;
};

const generateTags = () => {
  let tags = [];

  let randChoice = Math.floor(Math.random() * TAGS_CHOICES);
  switch (randChoice) {
    case 0:
      tags.push("Professional");
      break;
    case 1:
      tags.push("Technical");
      break;
    default:
      tags.push("Social");
      break;
  }

  return tags;
};

const generateEvents = () => {
  let events = [];

  for (let i = 0; i < EVENTS_COUNT; i++) {

    /* 
     * startDate and endDate of events have randomized offset from the most recent time
     * this script is run, with the offset for Month being from 0 to 3, Date being from 0 - 15.
     * Both startDate and endDate should either be on the same day and month, or be 1 day 
     * apart from each other. 
     * 
     * Furthermore, the hour offset between startDate and endDate is also randomized, with 
     * the offset being between 1 and 3. 
     */
    let dateIncr = Math.floor(Math.random() * DAY_INCR_MAX);
    let monthIncr = Math.floor(Math.random() * MONTH_INCR_MAX);
    let startDate = moment(faker.date.recent());
    let startDateMoment = moment(startDate);
    startDate = startDateMoment.month(startDateMoment.month() + monthIncr).date(startDateMoment.date() + dateIncr);

    let hourIncr = Math.floor(Math.random() * HOUR_INCR_MAX) + 1;
    let endDate = moment(startDate).hour(moment(startDate).hour() + hourIncr);

    let eventObj = {
      startDate: startDate,
      endDate: endDate,
      hosts: generateNames(),
      location:
        faker.address.streetAddress() +
        ", " +
        faker.address.city() +
        ", " +
        faker.address.country(),
      name: faker.random.words(),
      tags: generateTags(),
      description: faker.lorem.paragraph(),
      urls: {
        rsvp: faker.internet.url(),
        signin: faker.internet.url(),
        canva: faker.internet.url(),
        fb: faker.internet.url(),
      },
    };

    events.push(eventObj);
  }

  return events;
};

const main = () => {
  admin.initializeApp({
    credential: admin.credential.cert(Config.FirebaseConfig),
    databaseURL: Config.FirebaseURL,
  });

  let db = admin.firestore();
  const eventsTestData = generateEvents();

  for (let i = 0; i < eventsTestData.length; i++) {
    db.collection("events").add(eventsTestData[i]);
  }

  console.log("Test data seeded." + "\n");
};

main();