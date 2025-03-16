export interface MovieWatchedEvent {
    name: 'meadow_api/movie.watched';
    data: {
      movie_title: string;
      recipient_email: string;
    };
  }