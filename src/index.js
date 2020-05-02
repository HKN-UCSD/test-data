import admin from 'firebase-admin';
import Config from '../config.js';
import faker from 'faker';

const EVENTS_COUNT = 50;
const NAMES_COUNT = 8
const TAGS_CHOICES = 3

const generateNames = () =>
{
  let numIters = Math.floor(Math.random() * NAMES_COUNT) + 1;
  let i = 0;
  let names = [];

  while (i < numIters) {
    names.push(faker.name.findName());
    i++;
  }

  return names;
}

const generateTags = () =>
{
  let tags = [];

  let randChoice = Math.floor(Math.random() * TAGS_CHOICES);
  switch (randChoice) {
    case 0:
      tags.push('Professional');
      break;
    case 1:
      tags.push('Technical');
      break;
    case 2:
      tags.push('Social');
      break;
  }

  return tags;
}

const generateEvents = () =>
{
  let events = [];

  for (let i = 0; i < EVENTS_COUNT; i++) {
    let eventObj = {
      startDate: faker.date.recent(),
      endDate: faker.date.future(),
      hosts: generateNames(),
      location: faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.country(),
      name: faker.random.words(),
      tags: generateTags(),
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
}

const main = () =>
{
  admin.initializeApp({
    credential: admin.credential.cert(Config.FirebaseConfig),
    databaseURL: Config.FirebaseURL,
  });

  let db = admin.firestore()
  const eventsTestData = generateEvents();

  for (let i = 0; i < eventsTestData.length; i++) {
    db.collection('events').add(eventsTestData[i])
  }

  console.log('Test data seeded.' + '\n');
}

main();
