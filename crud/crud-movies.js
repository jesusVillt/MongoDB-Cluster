// OPERACIONES CRUD SOBRE sample_mflix.movies
// docker exec -it mongos mongosh --port 27021
// use sample_mflix
//
// Despues de cada operacion se revisa la distribucion con getShardDistribution()

// Distribucion inicial
db.movies.getShardDistribution();


// CREATE

// insertOne
db.movies.insertOne({
  id_movie: 21350,
  title: "Oppenheimer",
  year: 2023,
  runtime: 180,
  genres: ["Biography", "Drama", "History"],
  directors: ["Christopher Nolan"],
  cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
  plot: "La historia del fisico J. Robert Oppenheimer y su papel en la creacion de la bomba atomica.",
  rated: "R",
  countries: ["USA", "UK"],
  languages: ["English"],
  imdb: { rating: 8.3 },
  type: "movie",
  prueba: true
});

// shard en el que quedo
db.movies.find({ id_movie: 21350 }).explain().queryPlanner.winningPlan.shards[0].shardName;

db.movies.getShardDistribution();

// insertMany
db.movies.insertMany([
  { id_movie: 21351, title: "Barbie", year: 2023, runtime: 114, genres: ["Adventure", "Comedy", "Fantasy"], directors: ["Greta Gerwig"], cast: ["Margot Robbie", "Ryan Gosling"], imdb: { rating: 6.8 }, type: "movie", prueba: true },
  { id_movie: 21352, title: "Dune: Part Two", year: 2024, runtime: 166, genres: ["Action", "Adventure", "Drama"], directors: ["Denis Villeneuve"], cast: ["Timothee Chalamet", "Zendaya", "Rebecca Ferguson"], imdb: { rating: 8.5 }, type: "movie", prueba: true },
  { id_movie: 21353, title: "Top Gun: Maverick", year: 2022, runtime: 130, genres: ["Action", "Drama"], directors: ["Joseph Kosinski"], cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly"], imdb: { rating: 8.2 }, type: "movie", prueba: true },
  { id_movie: 21354, title: "Spider-Man: Across the Spider-Verse", year: 2023, runtime: 140, genres: ["Animation", "Action", "Adventure"], directors: ["Joaquim Dos Santos", "Kemp Powers", "Justin K. Thompson"], cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac"], imdb: { rating: 8.5 }, type: "movie", prueba: true },
  { id_movie: 21355, title: "Killers of the Flower Moon", year: 2023, runtime: 206, genres: ["Crime", "Drama", "History"], directors: ["Martin Scorsese"], cast: ["Leonardo DiCaprio", "Lily Gladstone", "Robert De Niro"], imdb: { rating: 7.6 }, type: "movie", prueba: true },
  { id_movie: 21356, title: "Coco", year: 2017, runtime: 105, genres: ["Animation", "Adventure", "Family"], directors: ["Lee Unkrich", "Adrian Molina"], cast: ["Anthony Gonzalez", "Gael Garcia Bernal", "Benjamin Bratt"], imdb: { rating: 8.4 }, type: "movie", prueba: true }
]);

db.movies.getShardDistribution();
db.movies.countDocuments();


// READ

// con la shard key la consulta va a un solo shard (SINGLE_SHARD)
db.movies.findOne({ id_movie: 21350 }, { _id: 0, id_movie: 1, title: 1, year: 1, directors: 1 });
db.movies.find({ id_movie: 21350 }).explain().queryPlanner.winningPlan.stage;

// sin la shard key la consulta va a los tres shards (SHARD_MERGE)
db.movies.find({ year: 2023 }, { _id: 0, id_movie: 1, title: 1 });
db.movies.find({ year: 2023 }).explain().queryPlanner.winningPlan.stage;

// pelicula que venia en la base original
db.movies.findOne({ title: "Interstellar" }, { _id: 0, id_movie: 1, title: 1, year: 1, directors: 1 });

db.movies.getShardDistribution();


// UPDATE

// updateOne con la shard key en el filtro
db.movies.updateOne(
  { id_movie: 21350 },
  { $set: { awards: { wins: 7, text: "Gano 7 premios Oscar, incluido Mejor Pelicula" } } }
);
db.movies.findOne({ id_movie: 21350 }, { _id: 0, title: 1, awards: 1 });

// updateMany sobre las peliculas agregadas
db.movies.updateMany(
  { prueba: true },
  { $set: { lastupdated: new Date() } }
);
db.movies.find({ prueba: true }, { _id: 0, title: 1, lastupdated: 1 });

db.movies.getShardDistribution();


// DELETE

// deleteOne con la shard key en el filtro
db.movies.find({ id_movie: 21351 }).explain().queryPlanner.winningPlan.shards[0].shardName;
db.movies.deleteOne({ id_movie: 21351 });

db.movies.getShardDistribution();

// deleteMany de las peliculas restantes
db.movies.deleteMany({ prueba: true });

db.movies.getShardDistribution();
db.movies.countDocuments({ prueba: true });
db.movies.countDocuments();


// insert many con 300 peliculas

db.movies.getShardDistribution();

db.movies.insertMany([
  { id_movie: 30001, title: "Get Out", year: 2017, directors: ["Jordan Peele"], type: "movie", prueba: true },
  { id_movie: 30002, title: "Dunkirk", year: 2017, directors: ["Christopher Nolan"], type: "movie", prueba: true },
  { id_movie: 30003, title: "The Shape of Water", year: 2017, directors: ["Guillermo del Toro"], type: "movie", prueba: true },
  { id_movie: 30004, title: "Lady Bird", year: 2017, directors: ["Greta Gerwig"], type: "movie", prueba: true },
  { id_movie: 30005, title: "Three Billboards Outside Ebbing, Missouri", year: 2017, directors: ["Martin McDonagh"], type: "movie", prueba: true },
  { id_movie: 30006, title: "Blade Runner 2049", year: 2017, directors: ["Denis Villeneuve"], type: "movie", prueba: true },
  { id_movie: 30007, title: "Wonder Woman", year: 2017, directors: ["Patty Jenkins"], type: "movie", prueba: true },
  { id_movie: 30008, title: "Logan", year: 2017, directors: ["James Mangold"], type: "movie", prueba: true },
  { id_movie: 30009, title: "Baby Driver", year: 2017, directors: ["Edgar Wright"], type: "movie", prueba: true },
  { id_movie: 30010, title: "It", year: 2017, directors: ["Andy Muschietti"], type: "movie", prueba: true },
  { id_movie: 30011, title: "Call Me by Your Name", year: 2017, directors: ["Luca Guadagnino"], type: "movie", prueba: true },
  { id_movie: 30012, title: "The Post", year: 2017, directors: ["Steven Spielberg"], type: "movie", prueba: true },
  { id_movie: 30013, title: "Darkest Hour", year: 2017, directors: ["Joe Wright"], type: "movie", prueba: true },
  { id_movie: 30014, title: "Star Wars: The Last Jedi", year: 2017, directors: ["Rian Johnson"], type: "movie", prueba: true },
  { id_movie: 30015, title: "Thor: Ragnarok", year: 2017, directors: ["Taika Waititi"], type: "movie", prueba: true },
  { id_movie: 30016, title: "Spider-Man: Homecoming", year: 2017, directors: ["Jon Watts"], type: "movie", prueba: true },
  { id_movie: 30017, title: "The Florida Project", year: 2017, directors: ["Sean Baker"], type: "movie", prueba: true },
  { id_movie: 30018, title: "I, Tonya", year: 2017, directors: ["Craig Gillespie"], type: "movie", prueba: true },
  { id_movie: 30019, title: "Mother!", year: 2017, directors: ["Darren Aronofsky"], type: "movie", prueba: true },
  { id_movie: 30020, title: "The Disaster Artist", year: 2017, directors: ["James Franco"], type: "movie", prueba: true },
  { id_movie: 30021, title: "Wind River", year: 2017, directors: ["Taylor Sheridan"], type: "movie", prueba: true },
  { id_movie: 30022, title: "The Greatest Showman", year: 2017, directors: ["Michael Gracey"], type: "movie", prueba: true },
  { id_movie: 30023, title: "Murder on the Orient Express", year: 2017, directors: ["Kenneth Branagh"], type: "movie", prueba: true },
  { id_movie: 30024, title: "Kong: Skull Island", year: 2017, directors: ["Jordan Vogt-Roberts"], type: "movie", prueba: true },
  { id_movie: 30025, title: "War for the Planet of the Apes", year: 2017, directors: ["Matt Reeves"], type: "movie", prueba: true },
  { id_movie: 30026, title: "Justice League", year: 2017, directors: ["Zack Snyder"], type: "movie", prueba: true },
  { id_movie: 30027, title: "Paddington 2", year: 2017, directors: ["Paul King"], type: "movie", prueba: true },
  { id_movie: 30028, title: "The Big Sick", year: 2017, directors: ["Michael Showalter"], type: "movie", prueba: true },
  { id_movie: 30029, title: "A Ghost Story", year: 2017, directors: ["David Lowery"], type: "movie", prueba: true },
  { id_movie: 30030, title: "Okja", year: 2017, directors: ["Bong Joon Ho"], type: "movie", prueba: true },
  { id_movie: 30031, title: "The Killing of a Sacred Deer", year: 2017, directors: ["Yorgos Lanthimos"], type: "movie", prueba: true },
  { id_movie: 30032, title: "Logan Lucky", year: 2017, directors: ["Steven Soderbergh"], type: "movie", prueba: true },
  { id_movie: 30033, title: "Atomic Blonde", year: 2017, directors: ["David Leitch"], type: "movie", prueba: true },
  { id_movie: 30034, title: "John Wick: Chapter 2", year: 2017, directors: ["Chad Stahelski"], type: "movie", prueba: true },
  { id_movie: 30035, title: "Kingsman: The Golden Circle", year: 2017, directors: ["Matthew Vaughn"], type: "movie", prueba: true },
  { id_movie: 30036, title: "The Lego Batman Movie", year: 2017, directors: ["Chris McKay"], type: "movie", prueba: true },
  { id_movie: 30037, title: "Beauty and the Beast", year: 2017, directors: ["Bill Condon"], type: "movie", prueba: true },
  { id_movie: 30038, title: "Alien: Covenant", year: 2017, directors: ["Ridley Scott"], type: "movie", prueba: true },
  { id_movie: 30039, title: "Ghost in the Shell", year: 2017, directors: ["Rupert Sanders"], type: "movie", prueba: true },
  { id_movie: 30040, title: "Wonder", year: 2017, directors: ["Stephen Chbosky"], type: "movie", prueba: true },
  { id_movie: 30041, title: "Downsizing", year: 2017, directors: ["Alexander Payne"], type: "movie", prueba: true },
  { id_movie: 30042, title: "All the Money in the World", year: 2017, directors: ["Ridley Scott"], type: "movie", prueba: true },
  { id_movie: 30043, title: "The Square", year: 2017, directors: ["Ruben Ostlund"], type: "movie", prueba: true },
  { id_movie: 30044, title: "Loveless", year: 2017, directors: ["Andrey Zvyagintsev"], type: "movie", prueba: true },
  { id_movie: 30045, title: "A Fantastic Woman", year: 2017, directors: ["Sebastian Lelio"], type: "movie", prueba: true },
  { id_movie: 30046, title: "Mudbound", year: 2017, directors: ["Dee Rees"], type: "movie", prueba: true },
  { id_movie: 30047, title: "Black Panther", year: 2018, directors: ["Ryan Coogler"], type: "movie", prueba: true },
  { id_movie: 30048, title: "Avengers: Infinity War", year: 2018, directors: ["Anthony Russo", "Joe Russo"], type: "movie", prueba: true },
  { id_movie: 30049, title: "Roma", year: 2018, directors: ["Alfonso Cuaron"], type: "movie", prueba: true },
  { id_movie: 30050, title: "A Star Is Born", year: 2018, directors: ["Bradley Cooper"], type: "movie", prueba: true },
  { id_movie: 30051, title: "Bohemian Rhapsody", year: 2018, directors: ["Bryan Singer"], type: "movie", prueba: true },
  { id_movie: 30052, title: "The Favourite", year: 2018, directors: ["Yorgos Lanthimos"], type: "movie", prueba: true },
  { id_movie: 30053, title: "BlacKkKlansman", year: 2018, directors: ["Spike Lee"], type: "movie", prueba: true },
  { id_movie: 30054, title: "Vice", year: 2018, directors: ["Adam McKay"], type: "movie", prueba: true },
  { id_movie: 30055, title: "Spider-Man: Into the Spider-Verse", year: 2018, directors: ["Bob Persichetti", "Peter Ramsey", "Rodney Rothman"], type: "movie", prueba: true },
  { id_movie: 30056, title: "Hereditary", year: 2018, directors: ["Ari Aster"], type: "movie", prueba: true },
  { id_movie: 30057, title: "Mission: Impossible - Fallout", year: 2018, directors: ["Christopher McQuarrie"], type: "movie", prueba: true },
  { id_movie: 30058, title: "Incredibles 2", year: 2018, directors: ["Brad Bird"], type: "movie", prueba: true },
  { id_movie: 30059, title: "Annihilation", year: 2018, directors: ["Alex Garland"], type: "movie", prueba: true },
  { id_movie: 30060, title: "First Man", year: 2018, directors: ["Damien Chazelle"], type: "movie", prueba: true },
  { id_movie: 30061, title: "If Beale Street Could Talk", year: 2018, directors: ["Barry Jenkins"], type: "movie", prueba: true },
  { id_movie: 30062, title: "Cold War", year: 2018, directors: ["Pawel Pawlikowski"], type: "movie", prueba: true },
  { id_movie: 30063, title: "Burning", year: 2018, directors: ["Lee Chang-dong"], type: "movie", prueba: true },
  { id_movie: 30064, title: "Eighth Grade", year: 2018, directors: ["Bo Burnham"], type: "movie", prueba: true },
  { id_movie: 30065, title: "Searching", year: 2018, directors: ["Aneesh Chaganty"], type: "movie", prueba: true },
  { id_movie: 30066, title: "Crazy Rich Asians", year: 2018, directors: ["Jon M. Chu"], type: "movie", prueba: true },
  { id_movie: 30067, title: "Aquaman", year: 2018, directors: ["James Wan"], type: "movie", prueba: true },
  { id_movie: 30068, title: "Ready Player One", year: 2018, directors: ["Steven Spielberg"], type: "movie", prueba: true },
  { id_movie: 30069, title: "Isle of Dogs", year: 2018, directors: ["Wes Anderson"], type: "movie", prueba: true },
  { id_movie: 30070, title: "Widows", year: 2018, directors: ["Steve McQueen"], type: "movie", prueba: true },
  { id_movie: 30071, title: "Bird Box", year: 2018, directors: ["Susanne Bier"], type: "movie", prueba: true },
  { id_movie: 30072, title: "Mandy", year: 2018, directors: ["Panos Cosmatos"], type: "movie", prueba: true },
  { id_movie: 30073, title: "Sorry to Bother You", year: 2018, directors: ["Boots Riley"], type: "movie", prueba: true },
  { id_movie: 30074, title: "Can You Ever Forgive Me?", year: 2018, directors: ["Marielle Heller"], type: "movie", prueba: true },
  { id_movie: 30075, title: "Leave No Trace", year: 2018, directors: ["Debra Granik"], type: "movie", prueba: true },
  { id_movie: 30076, title: "The Ballad of Buster Scruggs", year: 2018, directors: ["Joel Coen", "Ethan Coen"], type: "movie", prueba: true },
  { id_movie: 30077, title: "Solo: A Star Wars Story", year: 2018, directors: ["Ron Howard"], type: "movie", prueba: true },
  { id_movie: 30078, title: "Venom", year: 2018, directors: ["Ruben Fleischer"], type: "movie", prueba: true },
  { id_movie: 30079, title: "Bumblebee", year: 2018, directors: ["Travis Knight"], type: "movie", prueba: true },
  { id_movie: 30080, title: "Mary Poppins Returns", year: 2018, directors: ["Rob Marshall"], type: "movie", prueba: true },
  { id_movie: 30081, title: "Ralph Breaks the Internet", year: 2018, directors: ["Rich Moore", "Phil Johnston"], type: "movie", prueba: true },
  { id_movie: 30082, title: "Jurassic World: Fallen Kingdom", year: 2018, directors: ["J.A. Bayona"], type: "movie", prueba: true },
  { id_movie: 30083, title: "Upgrade", year: 2018, directors: ["Leigh Whannell"], type: "movie", prueba: true },
  { id_movie: 30084, title: "Game Night", year: 2018, directors: ["John Francis Daley", "Jonathan Goldstein"], type: "movie", prueba: true },
  { id_movie: 30085, title: "Free Solo", year: 2018, directors: ["Jimmy Chin", "Elizabeth Chai Vasarhelyi"], type: "movie", prueba: true },
  { id_movie: 30086, title: "Won't You Be My Neighbor?", year: 2018, directors: ["Morgan Neville"], type: "movie", prueba: true },
  { id_movie: 30087, title: "The Old Man & the Gun", year: 2018, directors: ["David Lowery"], type: "movie", prueba: true },
  { id_movie: 30088, title: "Overlord", year: 2018, directors: ["Julius Avery"], type: "movie", prueba: true },
  { id_movie: 30089, title: "Creed II", year: 2018, directors: ["Steven Caple Jr."], type: "movie", prueba: true },
  { id_movie: 30090, title: "Mid90s", year: 2018, directors: ["Jonah Hill"], type: "movie", prueba: true },
  { id_movie: 30091, title: "Boy Erased", year: 2018, directors: ["Joel Edgerton"], type: "movie", prueba: true },
  { id_movie: 30092, title: "Suspiria", year: 2018, directors: ["Luca Guadagnino"], type: "movie", prueba: true },
  { id_movie: 30093, title: "Parasite", year: 2019, directors: ["Bong Joon Ho"], type: "movie", prueba: true },
  { id_movie: 30094, title: "Joker", year: 2019, directors: ["Todd Phillips"], type: "movie", prueba: true },
  { id_movie: 30095, title: "1917", year: 2019, directors: ["Sam Mendes"], type: "movie", prueba: true },
  { id_movie: 30096, title: "Once Upon a Time in Hollywood", year: 2019, directors: ["Quentin Tarantino"], type: "movie", prueba: true },
  { id_movie: 30097, title: "Marriage Story", year: 2019, directors: ["Noah Baumbach"], type: "movie", prueba: true },
  { id_movie: 30098, title: "Little Women", year: 2019, directors: ["Greta Gerwig"], type: "movie", prueba: true },
  { id_movie: 30099, title: "Jojo Rabbit", year: 2019, directors: ["Taika Waititi"], type: "movie", prueba: true },
  { id_movie: 30100, title: "Ford v Ferrari", year: 2019, directors: ["James Mangold"], type: "movie", prueba: true },
  { id_movie: 30101, title: "Avengers: Endgame", year: 2019, directors: ["Anthony Russo", "Joe Russo"], type: "movie", prueba: true },
  { id_movie: 30102, title: "Us", year: 2019, directors: ["Jordan Peele"], type: "movie", prueba: true },
  { id_movie: 30103, title: "Uncut Gems", year: 2019, directors: ["Josh Safdie", "Benny Safdie"], type: "movie", prueba: true },
  { id_movie: 30104, title: "The Lighthouse", year: 2019, directors: ["Robert Eggers"], type: "movie", prueba: true },
  { id_movie: 30105, title: "Midsommar", year: 2019, directors: ["Ari Aster"], type: "movie", prueba: true },
  { id_movie: 30106, title: "Portrait of a Lady on Fire", year: 2019, directors: ["Celine Sciamma"], type: "movie", prueba: true },
  { id_movie: 30107, title: "Toy Story 4", year: 2019, directors: ["Josh Cooley"], type: "movie", prueba: true },
  { id_movie: 30108, title: "Frozen II", year: 2019, directors: ["Chris Buck", "Jennifer Lee"], type: "movie", prueba: true },
  { id_movie: 30109, title: "The Lion King", year: 2019, directors: ["Jon Favreau"], type: "movie", prueba: true },
  { id_movie: 30110, title: "Klaus", year: 2019, directors: ["Sergio Pablos"], type: "movie", prueba: true },
  { id_movie: 30111, title: "I Lost My Body", year: 2019, directors: ["Jeremy Clapin"], type: "movie", prueba: true },
  { id_movie: 30112, title: "The Farewell", year: 2019, directors: ["Lulu Wang"], type: "movie", prueba: true },
  { id_movie: 30113, title: "Rocketman", year: 2019, directors: ["Dexter Fletcher"], type: "movie", prueba: true },
  { id_movie: 30114, title: "Judy", year: 2019, directors: ["Rupert Goold"], type: "movie", prueba: true },
  { id_movie: 30115, title: "Bombshell", year: 2019, directors: ["Jay Roach"], type: "movie", prueba: true },
  { id_movie: 30116, title: "The Two Popes", year: 2019, directors: ["Fernando Meirelles"], type: "movie", prueba: true },
  { id_movie: 30117, title: "Ad Astra", year: 2019, directors: ["James Gray"], type: "movie", prueba: true },
  { id_movie: 30118, title: "John Wick: Chapter 3 - Parabellum", year: 2019, directors: ["Chad Stahelski"], type: "movie", prueba: true },
  { id_movie: 30119, title: "Spider-Man: Far from Home", year: 2019, directors: ["Jon Watts"], type: "movie", prueba: true },
  { id_movie: 30120, title: "Captain Marvel", year: 2019, directors: ["Anna Boden", "Ryan Fleck"], type: "movie", prueba: true },
  { id_movie: 30121, title: "Shazam!", year: 2019, directors: ["David F. Sandberg"], type: "movie", prueba: true },
  { id_movie: 30122, title: "It Chapter Two", year: 2019, directors: ["Andy Muschietti"], type: "movie", prueba: true },
  { id_movie: 30123, title: "Ready or Not", year: 2019, directors: ["Matt Bettinelli-Olpin", "Tyler Gillett"], type: "movie", prueba: true },
  { id_movie: 30124, title: "Doctor Sleep", year: 2019, directors: ["Mike Flanagan"], type: "movie", prueba: true },
  { id_movie: 30125, title: "Dolemite Is My Name", year: 2019, directors: ["Craig Brewer"], type: "movie", prueba: true },
  { id_movie: 30126, title: "Honey Boy", year: 2019, directors: ["Alma Har'el"], type: "movie", prueba: true },
  { id_movie: 30127, title: "Les Miserables", year: 2019, directors: ["Ladj Ly"], type: "movie", prueba: true },
  { id_movie: 30128, title: "Hustlers", year: 2019, directors: ["Lorene Scafaria"], type: "movie", prueba: true },
  { id_movie: 30129, title: "Just Mercy", year: 2019, directors: ["Destin Daniel Cretton"], type: "movie", prueba: true },
  { id_movie: 30130, title: "Harriet", year: 2019, directors: ["Kasi Lemmons"], type: "movie", prueba: true },
  { id_movie: 30131, title: "Richard Jewell", year: 2019, directors: ["Clint Eastwood"], type: "movie", prueba: true },
  { id_movie: 30132, title: "A Beautiful Day in the Neighborhood", year: 2019, directors: ["Marielle Heller"], type: "movie", prueba: true },
  { id_movie: 30133, title: "Dark Waters", year: 2019, directors: ["Todd Haynes"], type: "movie", prueba: true },
  { id_movie: 30134, title: "Atlantics", year: 2019, directors: ["Mati Diop"], type: "movie", prueba: true },
  { id_movie: 30135, title: "Honeyland", year: 2019, directors: ["Tamara Kotevska", "Ljubomir Stefanov"], type: "movie", prueba: true },
  { id_movie: 30136, title: "Apollo 11", year: 2019, directors: ["Todd Douglas Miller"], type: "movie", prueba: true },
  { id_movie: 30137, title: "Zombieland: Double Tap", year: 2019, directors: ["Ruben Fleischer"], type: "movie", prueba: true },
  { id_movie: 30138, title: "Aladdin", year: 2019, directors: ["Guy Ritchie"], type: "movie", prueba: true },
  { id_movie: 30139, title: "The Gentlemen", year: 2019, directors: ["Guy Ritchie"], type: "movie", prueba: true },
  { id_movie: 30140, title: "Collective", year: 2019, directors: ["Alexander Nanau"], type: "movie", prueba: true },
  { id_movie: 30141, title: "First Cow", year: 2019, directors: ["Kelly Reichardt"], type: "movie", prueba: true },
  { id_movie: 30142, title: "Sound of Metal", year: 2019, directors: ["Darius Marder"], type: "movie", prueba: true },
  { id_movie: 30143, title: "Nomadland", year: 2020, directors: ["Chloe Zhao"], type: "movie", prueba: true },
  { id_movie: 30144, title: "Tenet", year: 2020, directors: ["Christopher Nolan"], type: "movie", prueba: true },
  { id_movie: 30145, title: "Soul", year: 2020, directors: ["Pete Docter"], type: "movie", prueba: true },
  { id_movie: 30146, title: "Promising Young Woman", year: 2020, directors: ["Emerald Fennell"], type: "movie", prueba: true },
  { id_movie: 30147, title: "Minari", year: 2020, directors: ["Lee Isaac Chung"], type: "movie", prueba: true },
  { id_movie: 30148, title: "The Father", year: 2020, directors: ["Florian Zeller"], type: "movie", prueba: true },
  { id_movie: 30149, title: "Mank", year: 2020, directors: ["David Fincher"], type: "movie", prueba: true },
  { id_movie: 30150, title: "Another Round", year: 2020, directors: ["Thomas Vinterberg"], type: "movie", prueba: true },
  { id_movie: 30151, title: "Ma Rainey's Black Bottom", year: 2020, directors: ["George C. Wolfe"], type: "movie", prueba: true },
  { id_movie: 30152, title: "Palm Springs", year: 2020, directors: ["Max Barbakow"], type: "movie", prueba: true },
  { id_movie: 30153, title: "The Invisible Man", year: 2020, directors: ["Leigh Whannell"], type: "movie", prueba: true },
  { id_movie: 30154, title: "Onward", year: 2020, directors: ["Dan Scanlon"], type: "movie", prueba: true },
  { id_movie: 30155, title: "Wolfwalkers", year: 2020, directors: ["Tomm Moore", "Ross Stewart"], type: "movie", prueba: true },
  { id_movie: 30156, title: "Birds of Prey", year: 2020, directors: ["Cathy Yan"], type: "movie", prueba: true },
  { id_movie: 30157, title: "Never Rarely Sometimes Always", year: 2020, directors: ["Eliza Hittman"], type: "movie", prueba: true },
  { id_movie: 30158, title: "Da 5 Bloods", year: 2020, directors: ["Spike Lee"], type: "movie", prueba: true },
  { id_movie: 30159, title: "The Devil All the Time", year: 2020, directors: ["Antonio Campos"], type: "movie", prueba: true },
  { id_movie: 30160, title: "Enola Holmes", year: 2020, directors: ["Harry Bradbeer"], type: "movie", prueba: true },
  { id_movie: 30161, title: "Bad Boys for Life", year: 2020, directors: ["Adil El Arbi", "Bilall Fallah"], type: "movie", prueba: true },
  { id_movie: 30162, title: "Extraction", year: 2020, directors: ["Sam Hargrave"], type: "movie", prueba: true },
  { id_movie: 30163, title: "The Old Guard", year: 2020, directors: ["Gina Prince-Bythewood"], type: "movie", prueba: true },
  { id_movie: 30164, title: "Borat Subsequent Moviefilm", year: 2020, directors: ["Jason Woliner"], type: "movie", prueba: true },
  { id_movie: 30165, title: "News of the World", year: 2020, directors: ["Paul Greengrass"], type: "movie", prueba: true },
  { id_movie: 30166, title: "Pieces of a Woman", year: 2020, directors: ["Kornel Mundruczo"], type: "movie", prueba: true },
  { id_movie: 30167, title: "Emma.", year: 2020, directors: ["Autumn de Wilde"], type: "movie", prueba: true },
  { id_movie: 30168, title: "Possessor", year: 2020, directors: ["Brandon Cronenberg"], type: "movie", prueba: true },
  { id_movie: 30169, title: "I'm Thinking of Ending Things", year: 2020, directors: ["Charlie Kaufman"], type: "movie", prueba: true },
  { id_movie: 30170, title: "Over the Moon", year: 2020, directors: ["Glen Keane"], type: "movie", prueba: true },
  { id_movie: 30171, title: "The Midnight Sky", year: 2020, directors: ["George Clooney"], type: "movie", prueba: true },
  { id_movie: 30172, title: "The Power of the Dog", year: 2021, directors: ["Jane Campion"], type: "movie", prueba: true },
  { id_movie: 30173, title: "CODA", year: 2021, directors: ["Sian Heder"], type: "movie", prueba: true },
  { id_movie: 30174, title: "Belfast", year: 2021, directors: ["Kenneth Branagh"], type: "movie", prueba: true },
  { id_movie: 30175, title: "West Side Story", year: 2021, directors: ["Steven Spielberg"], type: "movie", prueba: true },
  { id_movie: 30176, title: "Licorice Pizza", year: 2021, directors: ["Paul Thomas Anderson"], type: "movie", prueba: true },
  { id_movie: 30177, title: "The Worst Person in the World", year: 2021, directors: ["Joachim Trier"], type: "movie", prueba: true },
  { id_movie: 30178, title: "Spider-Man: No Way Home", year: 2021, directors: ["Jon Watts"], type: "movie", prueba: true },
  { id_movie: 30179, title: "No Time to Die", year: 2021, directors: ["Cary Joji Fukunaga"], type: "movie", prueba: true },
  { id_movie: 30180, title: "Encanto", year: 2021, directors: ["Jared Bush", "Byron Howard"], type: "movie", prueba: true },
  { id_movie: 30181, title: "The Mitchells vs. the Machines", year: 2021, directors: ["Mike Rianda"], type: "movie", prueba: true },
  { id_movie: 30182, title: "Shang-Chi and the Legend of the Ten Rings", year: 2021, directors: ["Destin Daniel Cretton"], type: "movie", prueba: true },
  { id_movie: 30183, title: "The French Dispatch", year: 2021, directors: ["Wes Anderson"], type: "movie", prueba: true },
  { id_movie: 30184, title: "Nightmare Alley", year: 2021, directors: ["Guillermo del Toro"], type: "movie", prueba: true },
  { id_movie: 30185, title: "Don't Look Up", year: 2021, directors: ["Adam McKay"], type: "movie", prueba: true },
  { id_movie: 30186, title: "King Richard", year: 2021, directors: ["Reinaldo Marcus Green"], type: "movie", prueba: true },
  { id_movie: 30187, title: "The Green Knight", year: 2021, directors: ["David Lowery"], type: "movie", prueba: true },
  { id_movie: 30188, title: "Titane", year: 2021, directors: ["Julia Ducournau"], type: "movie", prueba: true },
  { id_movie: 30189, title: "The Lost Daughter", year: 2021, directors: ["Maggie Gyllenhaal"], type: "movie", prueba: true },
  { id_movie: 30190, title: "The Card Counter", year: 2021, directors: ["Paul Schrader"], type: "movie", prueba: true },
  { id_movie: 30191, title: "The Last Duel", year: 2021, directors: ["Ridley Scott"], type: "movie", prueba: true },
  { id_movie: 30192, title: "Free Guy", year: 2021, directors: ["Shawn Levy"], type: "movie", prueba: true },
  { id_movie: 30193, title: "The Suicide Squad", year: 2021, directors: ["James Gunn"], type: "movie", prueba: true },
  { id_movie: 30194, title: "A Quiet Place Part II", year: 2021, directors: ["John Krasinski"], type: "movie", prueba: true },
  { id_movie: 30195, title: "Raya and the Last Dragon", year: 2021, directors: ["Don Hall", "Carlos Lopez Estrada"], type: "movie", prueba: true },
  { id_movie: 30196, title: "Last Night in Soho", year: 2021, directors: ["Edgar Wright"], type: "movie", prueba: true },
  { id_movie: 30197, title: "Flee", year: 2021, directors: ["Jonas Poher Rasmussen"], type: "movie", prueba: true },
  { id_movie: 30198, title: "Summer of Soul", year: 2021, directors: ["Ahmir Questlove Thompson"], type: "movie", prueba: true },
  { id_movie: 30199, title: "Eternals", year: 2021, directors: ["Chloe Zhao"], type: "movie", prueba: true },
  { id_movie: 30200, title: "Black Widow", year: 2021, directors: ["Cate Shortland"], type: "movie", prueba: true },
  { id_movie: 30201, title: "The Matrix Resurrections", year: 2021, directors: ["Lana Wachowski"], type: "movie", prueba: true },
  { id_movie: 30202, title: "The Tragedy of Macbeth", year: 2021, directors: ["Joel Coen"], type: "movie", prueba: true },
  { id_movie: 30203, title: "Petite Maman", year: 2021, directors: ["Celine Sciamma"], type: "movie", prueba: true },
  { id_movie: 30204, title: "Parallel Mothers", year: 2021, directors: ["Pedro Almodovar"], type: "movie", prueba: true },
  { id_movie: 30205, title: "Judas and the Black Messiah", year: 2021, directors: ["Shaka King"], type: "movie", prueba: true },
  { id_movie: 30206, title: "Marcel the Shell with Shoes On", year: 2021, directors: ["Dean Fleischer Camp"], type: "movie", prueba: true },
  { id_movie: 30207, title: "The Banshees of Inisherin", year: 2022, directors: ["Martin McDonagh"], type: "movie", prueba: true },
  { id_movie: 30208, title: "Tar", year: 2022, directors: ["Todd Field"], type: "movie", prueba: true },
  { id_movie: 30209, title: "The Fabelmans", year: 2022, directors: ["Steven Spielberg"], type: "movie", prueba: true },
  { id_movie: 30210, title: "All Quiet on the Western Front", year: 2022, directors: ["Edward Berger"], type: "movie", prueba: true },
  { id_movie: 30211, title: "Avatar: The Way of Water", year: 2022, directors: ["James Cameron"], type: "movie", prueba: true },
  { id_movie: 30212, title: "Elvis", year: 2022, directors: ["Baz Luhrmann"], type: "movie", prueba: true },
  { id_movie: 30213, title: "Women Talking", year: 2022, directors: ["Sarah Polley"], type: "movie", prueba: true },
  { id_movie: 30214, title: "Triangle of Sadness", year: 2022, directors: ["Ruben Ostlund"], type: "movie", prueba: true },
  { id_movie: 30215, title: "Aftersun", year: 2022, directors: ["Charlotte Wells"], type: "movie", prueba: true },
  { id_movie: 30216, title: "The Whale", year: 2022, directors: ["Darren Aronofsky"], type: "movie", prueba: true },
  { id_movie: 30217, title: "Black Panther: Wakanda Forever", year: 2022, directors: ["Ryan Coogler"], type: "movie", prueba: true },
  { id_movie: 30218, title: "Guillermo del Toro's Pinocchio", year: 2022, directors: ["Guillermo del Toro", "Mark Gustafson"], type: "movie", prueba: true },
  { id_movie: 30219, title: "Puss in Boots: The Last Wish", year: 2022, directors: ["Joel Crawford"], type: "movie", prueba: true },
  { id_movie: 30220, title: "Turning Red", year: 2022, directors: ["Domee Shi"], type: "movie", prueba: true },
  { id_movie: 30221, title: "Nope", year: 2022, directors: ["Jordan Peele"], type: "movie", prueba: true },
  { id_movie: 30222, title: "Decision to Leave", year: 2022, directors: ["Park Chan-wook"], type: "movie", prueba: true },
  { id_movie: 30223, title: "RRR", year: 2022, directors: ["S.S. Rajamouli"], type: "movie", prueba: true },
  { id_movie: 30224, title: "Argentina, 1985", year: 2022, directors: ["Santiago Mitre"], type: "movie", prueba: true },
  { id_movie: 30225, title: "Bardo, False Chronicle of a Handful of Truths", year: 2022, directors: ["Alejandro G. Inarritu"], type: "movie", prueba: true },
  { id_movie: 30226, title: "Prey", year: 2022, directors: ["Dan Trachtenberg"], type: "movie", prueba: true },
  { id_movie: 30227, title: "X", year: 2022, directors: ["Ti West"], type: "movie", prueba: true },
  { id_movie: 30228, title: "Pearl", year: 2022, directors: ["Ti West"], type: "movie", prueba: true },
  { id_movie: 30229, title: "The Menu", year: 2022, directors: ["Mark Mylod"], type: "movie", prueba: true },
  { id_movie: 30230, title: "Doctor Strange in the Multiverse of Madness", year: 2022, directors: ["Sam Raimi"], type: "movie", prueba: true },
  { id_movie: 30231, title: "Thor: Love and Thunder", year: 2022, directors: ["Taika Waititi"], type: "movie", prueba: true },
  { id_movie: 30232, title: "The Northman", year: 2022, directors: ["Robert Eggers"], type: "movie", prueba: true },
  { id_movie: 30233, title: "Close", year: 2022, directors: ["Lukas Dhont"], type: "movie", prueba: true },
  { id_movie: 30234, title: "Living", year: 2022, directors: ["Oliver Hermanus"], type: "movie", prueba: true },
  { id_movie: 30235, title: "Empire of Light", year: 2022, directors: ["Sam Mendes"], type: "movie", prueba: true },
  { id_movie: 30236, title: "Babylon", year: 2022, directors: ["Damien Chazelle"], type: "movie", prueba: true },
  { id_movie: 30237, title: "Smile", year: 2022, directors: ["Parker Finn"], type: "movie", prueba: true },
  { id_movie: 30238, title: "Talk to Me", year: 2022, directors: ["Danny Philippou", "Michael Philippou"], type: "movie", prueba: true },
  { id_movie: 30239, title: "Poor Things", year: 2023, directors: ["Yorgos Lanthimos"], type: "movie", prueba: true },
  { id_movie: 30240, title: "Anatomy of a Fall", year: 2023, directors: ["Justine Triet"], type: "movie", prueba: true },
  { id_movie: 30241, title: "The Zone of Interest", year: 2023, directors: ["Jonathan Glazer"], type: "movie", prueba: true },
  { id_movie: 30242, title: "The Holdovers", year: 2023, directors: ["Alexander Payne"], type: "movie", prueba: true },
  { id_movie: 30243, title: "American Fiction", year: 2023, directors: ["Cord Jefferson"], type: "movie", prueba: true },
  { id_movie: 30244, title: "Maestro", year: 2023, directors: ["Bradley Cooper"], type: "movie", prueba: true },
  { id_movie: 30245, title: "May December", year: 2023, directors: ["Todd Haynes"], type: "movie", prueba: true },
  { id_movie: 30246, title: "The Boy and the Heron", year: 2023, directors: ["Hayao Miyazaki"], type: "movie", prueba: true },
  { id_movie: 30247, title: "John Wick: Chapter 4", year: 2023, directors: ["Chad Stahelski"], type: "movie", prueba: true },
  { id_movie: 30248, title: "Guardians of the Galaxy Vol. 3", year: 2023, directors: ["James Gunn"], type: "movie", prueba: true },
  { id_movie: 30249, title: "The Super Mario Bros. Movie", year: 2023, directors: ["Aaron Horvath", "Michael Jelenic"], type: "movie", prueba: true },
  { id_movie: 30250, title: "Mission: Impossible - Dead Reckoning Part One", year: 2023, directors: ["Christopher McQuarrie"], type: "movie", prueba: true },
  { id_movie: 30251, title: "Napoleon", year: 2023, directors: ["Ridley Scott"], type: "movie", prueba: true },
  { id_movie: 30252, title: "Asteroid City", year: 2023, directors: ["Wes Anderson"], type: "movie", prueba: true },
  { id_movie: 30253, title: "The Killer", year: 2023, directors: ["David Fincher"], type: "movie", prueba: true },
  { id_movie: 30254, title: "Society of the Snow", year: 2023, directors: ["J.A. Bayona"], type: "movie", prueba: true },
  { id_movie: 30255, title: "Perfect Days", year: 2023, directors: ["Wim Wenders"], type: "movie", prueba: true },
  { id_movie: 30256, title: "Elemental", year: 2023, directors: ["Peter Sohn"], type: "movie", prueba: true },
  { id_movie: 30257, title: "Air", year: 2023, directors: ["Ben Affleck"], type: "movie", prueba: true },
  { id_movie: 30258, title: "Creed III", year: 2023, directors: ["Michael B. Jordan"], type: "movie", prueba: true },
  { id_movie: 30259, title: "Indiana Jones and the Dial of Destiny", year: 2023, directors: ["James Mangold"], type: "movie", prueba: true },
  { id_movie: 30260, title: "Fast X", year: 2023, directors: ["Louis Leterrier"], type: "movie", prueba: true },
  { id_movie: 30261, title: "Teenage Mutant Ninja Turtles: Mutant Mayhem", year: 2023, directors: ["Jeff Rowe"], type: "movie", prueba: true },
  { id_movie: 30262, title: "Robot Dreams", year: 2023, directors: ["Pablo Berger"], type: "movie", prueba: true },
  { id_movie: 30263, title: "Fallen Leaves", year: 2023, directors: ["Aki Kaurismaki"], type: "movie", prueba: true },
  { id_movie: 30264, title: "The Iron Claw", year: 2023, directors: ["Sean Durkin"], type: "movie", prueba: true },
  { id_movie: 30265, title: "Priscilla", year: 2023, directors: ["Sofia Coppola"], type: "movie", prueba: true },
  { id_movie: 30266, title: "Rustin", year: 2023, directors: ["George C. Wolfe"], type: "movie", prueba: true },
  { id_movie: 30267, title: "Dream Scenario", year: 2023, directors: ["Kristoffer Borgli"], type: "movie", prueba: true },
  { id_movie: 30268, title: "Sing Sing", year: 2023, directors: ["Greg Kwedar"], type: "movie", prueba: true },
  { id_movie: 30269, title: "Hit Man", year: 2023, directors: ["Richard Linklater"], type: "movie", prueba: true },
  { id_movie: 30270, title: "Inside Out 2", year: 2024, directors: ["Kelsey Mann"], type: "movie", prueba: true },
  { id_movie: 30271, title: "Deadpool & Wolverine", year: 2024, directors: ["Shawn Levy"], type: "movie", prueba: true },
  { id_movie: 30272, title: "Gladiator II", year: 2024, directors: ["Ridley Scott"], type: "movie", prueba: true },
  { id_movie: 30273, title: "Anora", year: 2024, directors: ["Sean Baker"], type: "movie", prueba: true },
  { id_movie: 30274, title: "Conclave", year: 2024, directors: ["Edward Berger"], type: "movie", prueba: true },
  { id_movie: 30275, title: "The Brutalist", year: 2024, directors: ["Brady Corbet"], type: "movie", prueba: true },
  { id_movie: 30276, title: "Emilia Perez", year: 2024, directors: ["Jacques Audiard"], type: "movie", prueba: true },
  { id_movie: 30277, title: "A Complete Unknown", year: 2024, directors: ["James Mangold"], type: "movie", prueba: true },
  { id_movie: 30278, title: "Challengers", year: 2024, directors: ["Luca Guadagnino"], type: "movie", prueba: true },
  { id_movie: 30279, title: "Civil War", year: 2024, directors: ["Alex Garland"], type: "movie", prueba: true },
  { id_movie: 30280, title: "Furiosa: A Mad Max Saga", year: 2024, directors: ["George Miller"], type: "movie", prueba: true },
  { id_movie: 30281, title: "Kingdom of the Planet of the Apes", year: 2024, directors: ["Wes Ball"], type: "movie", prueba: true },
  { id_movie: 30282, title: "Twisters", year: 2024, directors: ["Lee Isaac Chung"], type: "movie", prueba: true },
  { id_movie: 30283, title: "Beetlejuice Beetlejuice", year: 2024, directors: ["Tim Burton"], type: "movie", prueba: true },
  { id_movie: 30284, title: "Moana 2", year: 2024, directors: ["David Derrick Jr.", "Jason Hand", "Dana Ledoux Miller"], type: "movie", prueba: true },
  { id_movie: 30285, title: "The Wild Robot", year: 2024, directors: ["Chris Sanders"], type: "movie", prueba: true },
  { id_movie: 30286, title: "Flow", year: 2024, directors: ["Gints Zilbalodis"], type: "movie", prueba: true },
  { id_movie: 30287, title: "Longlegs", year: 2024, directors: ["Osgood Perkins"], type: "movie", prueba: true },
  { id_movie: 30288, title: "I'm Still Here", year: 2024, directors: ["Walter Salles"], type: "movie", prueba: true },
  { id_movie: 30289, title: "A Real Pain", year: 2024, directors: ["Jesse Eisenberg"], type: "movie", prueba: true },
  { id_movie: 30290, title: "Nickel Boys", year: 2024, directors: ["RaMell Ross"], type: "movie", prueba: true },
  { id_movie: 30291, title: "September 5", year: 2024, directors: ["Tim Fehlbaum"], type: "movie", prueba: true },
  { id_movie: 30292, title: "Godzilla x Kong: The New Empire", year: 2024, directors: ["Adam Wingard"], type: "movie", prueba: true },
  { id_movie: 30293, title: "Kung Fu Panda 4", year: 2024, directors: ["Mike Mitchell"], type: "movie", prueba: true },
  { id_movie: 30294, title: "Despicable Me 4", year: 2024, directors: ["Chris Renaud"], type: "movie", prueba: true },
  { id_movie: 30295, title: "Joker: Folie a Deux", year: 2024, directors: ["Todd Phillips"], type: "movie", prueba: true },
  { id_movie: 30296, title: "Megalopolis", year: 2024, directors: ["Francis Ford Coppola"], type: "movie", prueba: true },
  { id_movie: 30297, title: "Juror #2", year: 2024, directors: ["Clint Eastwood"], type: "movie", prueba: true },
  { id_movie: 30298, title: "Love Lies Bleeding", year: 2024, directors: ["Rose Glass"], type: "movie", prueba: true },
  { id_movie: 30299, title: "Heretic", year: 2024, directors: ["Scott Beck", "Bryan Woods"], type: "movie", prueba: true },
  { id_movie: 30300, title: "Smile 2", year: 2024, directors: ["Parker Finn"], type: "movie", prueba: true }
]);

db.movies.getShardDistribution();
db.movies.countDocuments({ prueba: true });

// borrar las peliculas de prueba
db.movies.deleteMany({ prueba: true });

db.movies.getShardDistribution();
db.movies.countDocuments();