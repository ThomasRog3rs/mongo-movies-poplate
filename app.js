const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const mongo_uri = "mongodb://localhost:27017/moviesdb";

mongoose.connect(mongo_uri)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log("MongoDB not Connected: " + err));

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    director: { type: String, required: true },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5, 
    },
    review: { type: String, required: false },
});

movieSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Movie = mongoose.model('Movie', movieSchema);

const movieNames = [
  "The Shawshank Redemption",
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
  "Star Wars: Episode IV - A New Hope",
  "Star Wars: Episode V - The Empire Strikes Back",
  "Star Wars: Episode VI - Return of the Jedi",
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

const newTestMovie = new Movie({
    title: "TEST MOVIE",
    releaseYear: 1999,
    director: "John Doe",
    stars: 3,
    review: "lorem ipsum"
});

newTestMovie.save();

console.log("Saving...")
console.log(newTestMovie);