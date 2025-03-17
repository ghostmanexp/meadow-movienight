
# Meadow Movie Night

A service that sends movie information emails when a movie is watched. This application uses Inngest for event processing, OMDb API for movie data, and Resend for email delivery.

## Features

- Trigger events when movies are watched
- Fetch detailed movie information from OMDb API
- Send formatted emails with movie details to recipients
- Robust error handling and retry mechanisms

## Prerequisites

- Node.js (22 or later)
- npm or yarn
- OMDb API key (get one at [omdbapi.com](https://www.omdbapi.com/apikey.aspx))
- Resend API key (sign up at [resend.com](https://resend.com))

## Setup

1. Clone the repository:

```bash
git clone https://github.com/ghostmanexp/meadow-movienight.git
cd meadow-movienight
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory with the following variables:

OMDB_API_KEY=your_omdb_api_key
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=your_sender_email@example.com
PORT=3000

## Running the Application

1. Start the Inngest function server:

```bash
npm run dev
 ```

This will start the server at http://localhost:3000 .

2. Start the Inngest CLI:

```bash
npx ts-node src/serve.ts
```

3. Trigger a movie watched event:

```bash
npx ts-node src/sendMovieWatchedEvent.ts
 ```

This will send a test event for "The Matrix" to the email specified in the script.

## Customizing
To change the movie or recipient email for the test trigger, edit the src/sendMovieWatchedEvent.ts file:

```typescript
const event: MovieWatchedEvent = {
  name: "meadow_api/movie.watched",
  data: {
    movie_title: "Your Movie Title",
    recipient_email: "recipient@example.com",
  },
};
 ```