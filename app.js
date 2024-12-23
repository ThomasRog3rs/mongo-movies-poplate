const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const mongo_uri = "mongodb://localhost:27017/moviesdb";

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    releaseYear: { type: Number, required: true },
    rated: { type: String, required: false },
    actors: { type: String, requred: true },
    plot: {type: String, requred: false},
    director: { type: String, required: true },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5, 
    },
    posterUrl: { type: String, required: false },
});

movieSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Movie = mongoose.model('Movie', movieSchema);

const movieNames = [
  "The Shawshank Redemption",
  "Star Wars: Episode IV - A New Hope",
  "Star Wars: Episode V - The Empire Strikes Back",
  "Star Wars: Episode VI - Return of the Jedi",
  "The Godfather",
  "Pulp Fiction",
  "The Dark Knight",
  "Fight Club",
  "Inception",
  "Goodfellas",
  "The Matrix",
  "Forrest Gump",
  "The Silence of the Lambs",
  "Saving Private Ryan",
  "Jurassic Park",
  "Titanic",
  "The Lion King",
  "Back to the Future",
  "Die Hard",
  "Raiders of the Lost Ark",
  "The Terminator",
  "Alien",
  "Jaws",
  "Schindler's List",
  "The Lord of the Rings: The Fellowship of the Ring",
  "The Lord of the Rings: The Two Towers",
  "The Lord of the Rings: The Return of the King",
  "The Green Mile",
  "Gladiator",
  "The Departed",
  "The Usual Suspects",
  "Interstellar",
  "The Sixth Sense",
  "Se7en",
  "The Prestige",
  "Avatar",
  "Memento",
  "The Avengers",
  "Iron Man",
  "Black Panther",
  "The Social Network",
  "No Country for Old Men",
  "The Wolf of Wall Street",
  "Inglourious Basterds",
  "Django Unchained",
  "The Big Lebowski",
  "Good Will Hunting",
  "A Beautiful Mind",
  "The Pianist",
  "Braveheart"
];

const getMovieDetails = async (movieNames) => {
    await mongoose.connect(mongo_uri)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log("MongoDB not Connected: " + err));

    console.log("Adding Movies...");
    movieNames.forEach(async (movieName) => {
        console.log(`Adding ${movieName}`);

        try {
            const searchResponse = await fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=c57fa46a`);

            if (!searchResponse.ok) {
                console.warn(`Response not ok!`)
                return;
            }

            const movieSearch = await searchResponse.json();
            if (movieSearch.Response !== "True") {
                console.warn(`Failed Response from server (${movieName}): ` + movieSearch.Error);
                return;
            }

            const foundMovie = movieSearch?.Search[0];

            if (foundMovie === null) {
                console.warn(`Could not find ${movieName} (null)`);
                return;
            }
            
            const movieResponse = await fetch(`https://www.omdbapi.com/?i=${foundMovie.imdbID}&apikey=c57fa46a`);
            const movieData = await movieResponse.json();

            const searchMovie = await Movie.findOne({
                title: { $regex: movieData.Title }
            });

            if (searchMovie !== null) {
                console.warn(`Database already has that movie: ${movieData.Title}`);
                return;
            }

            const scaledDownRaiting = Math.round(Number(movieData.imdbRating) / 2);
            
            const newMovie = new Movie({
                title: movieData.Title,
                releaseYear: movieData.Year,
                rated: movieData.Rated,
                actors: movieData.Actors,
                plot: movieData.Plot,
                director: movieData.Director,
                stars: scaledDownRaiting,
                posterUrl: movieData.Poster
            });

            await newMovie.save();

            console.log(`Movie '${movieName}' added`);
            return;
        } catch (err) {
            console.warn("Something went wrong adding movie: ", movieName);
            console.error(err);
            return;
        }

    });
}

getMovieDetails(movieNames);
// console.log(movieNames.length)