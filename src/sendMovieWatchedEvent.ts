import { Inngest } from "inngest";
import { MovieWatchedEvent } from "./types/events";

const inngest = new Inngest({ id: "Meadow Movie Handler", eventKey: "local" });

const event: MovieWatchedEvent = {
  name: "meadow_api/movie.watched",
  data: {
    movie_title: "The Matrix",
    recipient_email: "clem@test.com",
  },
};

async function trigger() {  
  await inngest.send(event);
  console.log('Movie watched event triggered.');
}

trigger().catch(console.error);