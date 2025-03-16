// src/index.ts
import { Inngest, EventSchemas } from "inngest";

const inngest = new Inngest({ 
        id: "My App"});


async function sendTestEvent() {
  await inngest.send({
    name: "test/event",
    data: {
      message: "Hello from Inngest!",
    },
  });

  console.log("Event sent!");
}

sendTestEvent().catch(console.error);