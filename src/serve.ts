// src/serve.ts
import express from 'express';
import { serve } from 'inngest/express';
import { Inngest } from 'inngest';
import movieWatchedFunction from './functions/movieWatched';
import 'dotenv/config';

const inngest = new Inngest({ id: 'Meadow Movie Handler' });

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(serve({ client: inngest, functions: [movieWatchedFunction] }));

app.listen(3000, () => {
  console.log('🚀 Inngest functions are running at: http://localhost:3000');
});