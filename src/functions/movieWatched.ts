import { Inngest } from "inngest";
import axios from "axios";
import { Resend } from "resend";
import { MovieWatchedEvent } from "../types/events";
import { OmdbMovieResponse } from "../types/omdb";
import 'dotenv/config';

const inngest = new Inngest({ id: "Meadow Movie Handler" });
const resend = new Resend(process.env.RESEND_API_KEY); 

export default inngest.createFunction(
  { id: "Handle Movie Watched Event" },
  { event: "meadow_api/movie.watched" },
  async ({ event }: { event: MovieWatchedEvent }) => {
    const { movie_title, recipient_email } = event.data;

    try {
      // Fetch movie details from OMDb
      const omdbApiKey = process.env.OMDB_API_KEY; // Ensure to set API key
      const movieResponse = await axios.get(`https://www.omdbapi.com/`, {
        params: {
          apikey: omdbApiKey,
          t: movie_title,
        },
      });

      const movieData = movieResponse.data as OmdbMovieResponse;

      if (movieData.Response === "False") {
        console.error(`❌ Movie "${movie_title}" not found: ${movieData.Error}`);
        throw new Error(`Movie "${movie_title}" not found.`);
      }

      // Send email using Resend
      const emailResponse = await resend.emails.send({
        from: `Movie Info <${process.env.FROM_EMAIL}>`,
        to: recipient_email,
        subject: `Movie Summary: ${movieData.Title}`,
        html: `<h2>${movieData.Title}</h2><p>${movieData.Plot}</p>`,
      });

      console.log("✅ Email Response from Resend:", emailResponse);

      return { success: true, emailId: emailResponse.data?.id };
    } catch (error) {
      console.error('Error processing movie watched event:', error);
      throw error; // Inngest will handle retries automatically
    }
  }
);