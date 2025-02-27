require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");
// ... lets u use req.body 
const bodyParser = require('body-parser'); 



// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
      console.log("Something went wrong when retrieving an access token", error);
    });



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



// setting the spotify-api goes here:






// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
    
});

app.get('/artists', (req, res, next) => {
    console.log('artist is ',req.query)
    spotifyApi.searchArtists(req.query.artist).then(data => {
        
        console.log("The received data from the API: ", data.body.artists.items);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('artists',  {artists: data.body.artists.items});
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    })
});
  
app.get('/albums/:artistId', (req, res, next) => {
    console.log('artist: ',req.params)
    spotifyApi.getArtistAlbums(req.params.artistId).then(data => {
        console.log("The received data from the API: ", data.body.items);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('albums',  {albums: data.body.items});
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/songs/:albumId', (req, res, next) => {
    console.log('abum: ',req.params)
    spotifyApi.getAlbumTracks(req.params.albumId).then(data => { 
        console.log("The received data from the API: ", data.body.items);
        // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        res.render('songs',  {songs: data.body.items});
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    })
});



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
