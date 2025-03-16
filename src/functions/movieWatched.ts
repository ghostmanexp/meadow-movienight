import { Inngest, RetryAfterError } from "inngest";
import axios from "axios";
import { Resend } from "resend";
import { MovieWatchedEvent } from "../types/events";
import { OmdbMovieResponse } from "../types/omdb";
import 'dotenv/config';

const inngest = new Inngest({ id: "Meadow Movie Handler" });
const resend = new Resend(process.env.RESEND_API_KEY);

export default inngest.createFunction(
  {
    id: "Handle Movie Watched Event",
    retries: 5,
  },
  { event: "meadow_api/movie.watched" },
  async ({ event, step }: { event: MovieWatchedEvent, step: any }) => {
    const { movie_title, recipient_email } = event.data;

    const omdbApiKey = await step.run("validades-omdb-api-key", () => {
      const key = process.env.OMDB_API_KEY;
      if (!key) {
        throw new Error("OMDB_API_KEY environment variable is not set");
      }
      return key;
    })

    const fromEmail = await step.run("validate-from-email", () => {
      const email = process.env.FROM_EMAIL;
      if (!email) {
        throw new Error("FROM_EMAIL environment variable is not set");
      }
      return email;
    });

    const movieData = await step.run("fetch-movie-data", async () => {
      try {
        console.log(`🔍 Fetching movie data for "${movie_title}" from OMDb API`);
        const movieResponse = await axios.get(`https://www.omdbapi.com/`, {
          params: {
            apikey: omdbApiKey,
            t: movie_title,
            plot: "full",
          },
        });

        const movieData = movieResponse.data as OmdbMovieResponse;

        if (movieData.Response === "False") {
          console.error(`❌ Movie "${movie_title}" not found: ${movieData.Error}`);
          throw new Error(`Movie "${movie_title}" not found.`);
        }
        console.log(`✅ Movie data retrieved successfully for "${movieData.Title}"`);
        return movieData;
      } catch (error) {
        console.error('Error fetching movie data:', error);
        throw error;
      }
    });

    const emailResult = await step.run("send-email", async () => {
      try {
        console.log(`📧 Sending email to ${recipient_email}`);
        const emailResponse = await resend.emails.send({
          from: `Movie Info <${fromEmail}>`,
          to: recipient_email,
          subject: `Movie Summary: ${movieData.Title}`,
          html: `<h2>${movieData.Title}</h2><p>${movieData.Plot}</p>`,
        });

        console.log("✅ Email Response from Resend:", emailResponse);
        return { success: true, emailId: emailResponse.data?.id };
      } catch (error) {
        // For email sending errors, we want to retry with increasing backoff
        console.error('Error sending email:', error);
        throw new RetryAfterError('Failed to send email, will retry', 60);
      }
    });

    return emailResult;
  }
);