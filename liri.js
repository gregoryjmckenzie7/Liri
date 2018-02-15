require("dotenv").config();

var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
let input = " ";

for (var i = 3; i < process.argv.length; i++){
	input = input + "" + process.argv[i];
};

function getTweets(){
	client.get("statuses/user_timeline", "@makejckenzie", function (error, tweets, response) {
		if(!error) {
			console.log("These are your tweets: \n");
			for (var x=0; x <= 19; x++){
				var theTweets = tweets[x];
				console.log(theTweets.text);
				console.log(theTweets.created_at);
				console.log("___________________________\n");
			};
		}
	});
};

function getSpotify(){
	spotify.search({ type: "track", query: input, limit: 3}, function (error, data){
		if(error) {
			return console.log("Error occurred:" + error);
		}
		var song = (data.tracks.items[0]);
		var artists = song.artists;
		if (artists){
			artists.forEach(function (response){
				console.log("Artist: " + response.name);
			});
		};
		console.log("Track Name: " + song.name);
		console.log("Preview Link: " + song.external_urls.spotify);
		console.log("Album: " + song.album.name);
		console.log("______________________________\n");
	});
};
function getMovie() {
	request("https://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function (error, response, body){
		if (!error && response.statusCode === 200) {
			var movie = JSON.parse(body);
			console.log("Movie Information: \n");
			console.log("Title: " + (movie.Title));
			console.log("Year: " + (movie.Year));
			console.log("IMDB Rating: " + (movie.imdbRating + "/10"));
			if (movie.Ratings[1]){
				console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
			}
			else {
				console.log("Rotten Tomatoes Rating: No Rotten Tomatoes Rating Available");
			}
			console.log("Country: " + (movie.Country));
			console.log("Language(s)" + (movie.Language));
			console.log("Plot: " + (movie.Plot));
			console.log("Actors: " + (movie.Actors));
			console.log("______________________________\n")
		};
	});
};

function readCommand() {

	fs.readFile("random.txt", "utf8", function (error, data){
		if (error) {
			return console.log(error);
		}
		var dataArr = data.split(",");
		command = dataArr[0];
		input = dataArr[1];
		run();
	});
};

function run(){
	switch (command){
		case "my-tweets":
		getTweets();
		break;
		case "spotify-this-song":
		getSpotify();
		break;
		case "movie-this":
		getMovie();
		break;
		case "do-what-it-says":
		readCommand();
		break;
	}
}

run();

