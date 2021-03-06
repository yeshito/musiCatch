# Project Tasks #

### BACK-END ###
- [x] * Setup database schema
- [X] * Setup user authentication and authorization using express, bcrypt, and Neo4j
- [X] * Once account is created provide instructions for user to export itunes library to xml file and upload the file to their account, parse the xml file for the artist names, and send that from the front-end to the database, associate them with the user and put those artists at the front of the update queue.
- [X] * Write api requests for getting a new artist's id, and creating them in the database
- [X] * Write api request for getting artists releases and parsing it for most recent and putting them into the database.
- [X] * Create worker which checks for new releases from RSS feed and sends updates to my database
- [X] * Create worker which queues up messages to be sent out when new releases match an artist that is liked by a user i the database.
- [X] * Create worker which receives messages, usernames, phone numbers, to compose message and put into queue.
- [X] * Create worker which goes through queue of update text messages, compiles them and sends them off to Twilio to actually send texts and sends confirmation to server to update in db the date and release that a user was sent an update on.



### FRONT-END ###
- [X] * Wireframes
- [X] * Setup basic home page with account creation and login, with dark them
- [X] * Ability to upload xml itunes library file
- [X] Stylish Step by step instructions on how to upload your itunes xml library
- [ ] User dashboard which upon login shows them releases that they were notified about and links to releases.
- [ ] Use React to allow users to manually add artists to their account, send api requests to get artist id, and send all of the newly added artists to the db to build edges.

~ 80 artists in your itunes library

### LAST-MINUTE TASKS ###
- [X] Change twilio account SID, authtoken etc. to live version in .env file

## Technologies ##
  * HTML5
  * CSS3
  * Javascript
  * Node/Express
  * Neo4j
  * Redis
  * Twilio


## Database schema for MusiCatch ##

  #### Schema commands run in Neo4j ####
  CREATE CONSTRAINT ON (u:User) ASSERT u.email is unique
  CREATE CONSTRAINT ON (a:Artist) ASSERT a.artistId is UNIQUE
  CREATE CONSTRAINT ON (r:Release) ASSERT r.trackId is UNIQUE
  CREATE INDEX ON :User(email)
  CREATE INDEX ON :Artist(artistName)

### Nodes ###

  #### User ####
  * id *unique* (assigned by Neo4j)
  * email *unique*
  * password
  * firstName
  * lastName
  * cellNum
  * signupDate

  #### Artist ####
  * id *unique* (assigned by Neo4j)
  * "artistName": "Radiohead",
  * "artistLinkUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
  * "artistId": 657515,
  * "amgArtistId": 41092,
  * "primaryGenreName": "Alternative",
  * "primaryGenreId": 20


  #### Release ####
  "wrapperType": "track",
  "kind": "music-video",
  "trackId": 1154535588,
  "artistName": "Radiohead",
  "artistId": 657515,
  "trackName": "Present Tense: Jonny, Thom & a CR78",
  "trackCensoredName": "Present Tense: Jonny, Thom & a CR78",
  "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
  "trackViewUrl": "https://itunes.apple.com/us/music-video/present-tense-jonny-thom-cr78/id1154535588?uo=4",
  "previewUrl": "http://a1119.phobos.apple.com/us/r1000/128/Video71/v4/34/44/50/34445064-b4a6-285d-caa1-fd76b9a0d1e6/mzvf_5613188103403410015.640x480.h264lc.U.p.m4v",
  "artworkUrl30": "http://is3.mzstatic.com/image/thumb/Video52/v4/06/66/8c/06668cb9-8bc0-52b6-11fd-bf5f570c551d/source/30x30bb.jpg",
  "artworkUrl60": "http://is3.mzstatic.com/image/thumb/Video52/v4/06/66/8c/06668cb9-8bc0-52b6-11fd-bf5f570c551d/source/60x60bb.jpg",
  "artworkUrl100": "http://is3.mzstatic.com/image/thumb/Video52/v4/06/66/8c/06668cb9-8bc0-52b6-11fd-bf5f570c551d/source/100x100bb.jpg",
  "collectionPrice": 1.99,
  "trackPrice": 1.99,
  "releaseDate": "2016-09-17T07:00:00Z",
  "collectionExplicitness": "notExplicit",
  "trackExplicitness": "notExplicit",
  "trackTimeMillis": 325247,
  "country": "USA",
  "currency": "USD",
  "primaryGenreName": "Alternative"

properties with objects inside:
content:Encoded
category
coverArt

### Edges ###
  (Artist)-RELEASED->(Release)
  (User)-[LIKES]->(Artist)
  (User)-[NOTIFIED {date: Null or string, enqueued: boolean }]->(Release)


Html, CSS, React front end with dashboard of collection of recent updates, (api calls for new releases? or on server side.) User login account, bcrypt, etc. Upload xml itunes library file
express-xml-bodyparser

Neo4j
Does not create duplicate relationships
back end with node express server, spotify oauth, get email and/or telephone number to text updates. Ideally anytime a user’s liked artist releases something (or once  a week depending on how frequently I can check the new releases).

Redis worker to queue up notification requests to Twilio. Have a worker that is constantly checking for new releases for artists in the database and adds it to the database if it finds one, and sets up the twilio message notification send.

Twilio to send text notifications of new releases with image of release or musicvideo

node/express-handles data that comes back from front end api requests and puts into database. Parse out artist duplicates from

connect server to neo4j
Module: apoc Installation


$ npm install apoc


Spotify and itunes?

itunes:

has search and lookup api requests

search: search by artist name, (xml has release date, artist name and persistent ID but not artist ID)
filter for most recent artist releases,

Oauth spotify, get all artists from Your music make api call for each artist, get list of albums and make api calls for each album to get release date.

Spotify already has updates on new releases for artists that are followed, the API query setup is going to be more requests per finding new releases than itunes.




## Step by step API calls needed for getting an artist's (Radiohead) newest releases from the itunes search API

* API call 1 (get Artist) appleID
    https://itunes.apple.com/search?term=radiohead&media=music&entity=musicArtist

results:
    ```
    {
  "resultCount": 2,
  "results": [
    {
      "wrapperType": "artist",
      "artistType": "Artist",
      "artistName": "Radiohead",
      "artistLinkUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "artistId": 657515,
      "amgArtistId": 41092,
      "primaryGenreName": "Alternative",
      "primaryGenreId": 20
    },
    {
      "wrapperType": "artist",
      "artistType": "Artist",
      "artistName": "My Head Radio",
      "artistLinkUrl": "https://itunes.apple.com/us/artist/my-head-radio/id260616576?uo=4",
      "artistId": 260616576,
      "primaryGenreName": "Electronic",
      "primaryGenreId": 7
    }
  ]
}
    ```
if results grab results[0],  
add artist node with all properties to db, create appropriate relationships

* API call 2 (get artist releases):
  https://itunes.apple.com/lookup?id=657515&media=music&entity=album,musicVideo&sort=recent&limit=200

  results:
  ```
  {
  "resultCount": 35,
  "results": [
    {
      "wrapperType": "artist",
      "artistType": "Artist",
      "artistName": "Radiohead",
      "artistLinkUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "artistId": 657515,
      "amgArtistId": 41092,
      "primaryGenreName": "Alternative",
      "primaryGenreId": 20
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1143391524,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Com Lag: 2+2=5 - EP",
      "collectionCensoredName": "Com Lag: 2+2=5 - EP",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/com-lag-2+2-5-ep/id1143391524?uo=4",
      "artworkUrl60": "http://is4.mzstatic.com/image/thumb/Music22/v4/f6/11/0b/f6110b45-d786-716a-a816-1e425d7a3d95/source/60x60bb.jpg",
      "artworkUrl100": "http://is4.mzstatic.com/image/thumb/Music22/v4/f6/11/0b/f6110b45-d786-716a-a816-1e425d7a3d95/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 10,
      "copyright": "℗ 2004 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2004-03-24T08:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1117241935,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Just - Single",
      "collectionCensoredName": "Just - Single",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/just-single/id1117241935?uo=4",
      "artworkUrl60": "http://is1.mzstatic.com/image/thumb/Music30/v4/ac/38/54/ac3854ee-70b3-500c-09c1-107b9db120c0/source/60x60bb.jpg",
      "artworkUrl100": "http://is1.mzstatic.com/image/thumb/Music30/v4/ac/38/54/ac3854ee-70b3-500c-09c1-107b9db120c0/source/100x100bb.jpg",
      "collectionPrice": 3.87,
      "collectionExplicitness": "notExplicit",
      "trackCount": 3,
      "copyright": "℗ 1995 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "1995-08-07T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1114686637,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "The Daily Mail / Staircase - Single",
      "collectionCensoredName": "The Daily Mail / Staircase - Single",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/daily-mail-staircase-single/id1114686637?uo=4",
      "artworkUrl60": "http://is5.mzstatic.com/image/thumb/Music20/v4/d9/c3/7e/d9c37ed7-b200-1fe1-4a3b-994b4ea90c6d/source/60x60bb.jpg",
      "artworkUrl100": "http://is5.mzstatic.com/image/thumb/Music20/v4/d9/c3/7e/d9c37ed7-b200-1fe1-4a3b-994b4ea90c6d/source/100x100bb.jpg",
      "collectionPrice": 2.58,
      "collectionExplicitness": "notExplicit",
      "trackCount": 2,
      "copyright": "℗ 2011 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2011-12-19T08:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1113546075,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Spectre - Single",
      "collectionCensoredName": "Spectre - Single",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/spectre-single/id1113546075?uo=4",
      "artworkUrl60": "http://is1.mzstatic.com/image/thumb/Music60/v4/44/2a/0d/442a0dee-f203-c30a-9094-50770f214cf6/source/60x60bb.jpg",
      "artworkUrl100": "http://is1.mzstatic.com/image/thumb/Music60/v4/44/2a/0d/442a0dee-f203-c30a-9094-50770f214cf6/source/100x100bb.jpg",
      "collectionPrice": 1.29,
      "collectionExplicitness": "notExplicit",
      "trackCount": 1,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-05-16T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112943810,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Anyone Can Play Guitar - Single",
      "collectionCensoredName": "Anyone Can Play Guitar - Single",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/anyone-can-play-guitar-single/id1112943810?uo=4",
      "artworkUrl60": "http://is1.mzstatic.com/image/thumb/Music18/v4/20/b0/c6/20b0c6bf-267a-4ce6-f2ae-0693583dcd8a/source/60x60bb.jpg",
      "artworkUrl100": "http://is1.mzstatic.com/image/thumb/Music18/v4/20/b0/c6/20b0c6bf-267a-4ce6-f2ae-0693583dcd8a/source/100x100bb.jpg",
      "collectionPrice": 3.87,
      "collectionExplicitness": "notExplicit",
      "trackCount": 3,
      "copyright": "℗ 1993 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "1993-01-25T08:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112425223,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Street Spirit (Fade Out) - EP",
      "collectionCensoredName": "Street Spirit (Fade Out) - EP",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/street-spirit-fade-out-ep/id1112425223?uo=4",
      "artworkUrl60": "http://is5.mzstatic.com/image/thumb/Music20/v4/e1/8a/56/e18a56a7-a096-3a74-ecbb-899561165386/source/60x60bb.jpg",
      "artworkUrl100": "http://is5.mzstatic.com/image/thumb/Music20/v4/e1/8a/56/e18a56a7-a096-3a74-ecbb-899561165386/source/100x100bb.jpg",
      "collectionPrice": 6.45,
      "collectionExplicitness": "explicit",
      "contentAdvisoryRating": "Explicit",
      "trackCount": 5,
      "copyright": "℗ 1996 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "1996-01-22T08:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112419253,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Knives Out - EP",
      "collectionCensoredName": "Knives Out - EP",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/knives-out-ep/id1112419253?uo=4",
      "artworkUrl60": "http://is5.mzstatic.com/image/thumb/Music20/v4/84/2d/ad/842dada2-6fc5-b04c-322b-8b5ffe2493c6/source/60x60bb.jpg",
      "artworkUrl100": "http://is5.mzstatic.com/image/thumb/Music20/v4/84/2d/ad/842dada2-6fc5-b04c-322b-8b5ffe2493c6/source/100x100bb.jpg",
      "collectionPrice": 6.45,
      "collectionExplicitness": "notExplicit",
      "trackCount": 5,
      "copyright": "℗ 2001 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2001-08-06T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112414716,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Karma Police - EP",
      "collectionCensoredName": "Karma Police - EP",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/karma-police-ep/id1112414716?uo=4",
      "artworkUrl60": "http://is5.mzstatic.com/image/thumb/Music20/v4/34/1a/9f/341a9fa7-6631-a844-48f6-1bcfb3eba19d/source/60x60bb.jpg",
      "artworkUrl100": "http://is5.mzstatic.com/image/thumb/Music20/v4/34/1a/9f/341a9fa7-6631-a844-48f6-1bcfb3eba19d/source/100x100bb.jpg",
      "collectionPrice": 6.45,
      "collectionExplicitness": "notExplicit",
      "trackCount": 5,
      "copyright": "℗ 1997 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "1997-08-25T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112408551,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "High & Dry / Planet Telex - EP",
      "collectionCensoredName": "High & Dry / Planet Telex - EP",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/high-dry-planet-telex-ep/id1112408551?uo=4",
      "artworkUrl60": "http://is2.mzstatic.com/image/thumb/Music20/v4/3e/2e/aa/3e2eaaa4-d170-944f-d073-eb5a08aa09d2/source/60x60bb.jpg",
      "artworkUrl100": "http://is2.mzstatic.com/image/thumb/Music20/v4/3e/2e/aa/3e2eaaa4-d170-944f-d073-eb5a08aa09d2/source/100x100bb.jpg",
      "collectionPrice": 7.74,
      "collectionExplicitness": "notExplicit",
      "trackCount": 6,
      "copyright": "℗ 1995 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "1995-02-27T08:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112408383,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Creep - EP",
      "collectionCensoredName": "Creep - EP",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/creep-ep/id1112408383?uo=4",
      "artworkUrl60": "http://is4.mzstatic.com/image/thumb/Music18/v4/a1/1f/a8/a11fa8ac-f724-b58d-0a4b-a36d9826e74a/source/60x60bb.jpg",
      "artworkUrl100": "http://is4.mzstatic.com/image/thumb/Music18/v4/a1/1f/a8/a11fa8ac-f724-b58d-0a4b-a36d9826e74a/source/100x100bb.jpg",
      "collectionPrice": 6.45,
      "collectionExplicitness": "explicit",
      "contentAdvisoryRating": "Explicit",
      "trackCount": 5,
      "copyright": "℗ 1992 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "1992-09-21T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112408006,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "My Iron Lung",
      "collectionCensoredName": "My Iron Lung",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/my-iron-lung/id1112408006?uo=4",
      "artworkUrl60": "http://is3.mzstatic.com/image/thumb/Music20/v4/d7/59/67/d7596770-4f68-b49a-25ab-4a53e65259de/source/60x60bb.jpg",
      "artworkUrl100": "http://is3.mzstatic.com/image/thumb/Music20/v4/d7/59/67/d7596770-4f68-b49a-25ab-4a53e65259de/source/100x100bb.jpg",
      "collectionPrice": 9.03,
      "collectionExplicitness": "notExplicit",
      "trackCount": 7,
      "copyright": "℗ 1994 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "1994-09-26T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112407871,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Paranoid Android - EP",
      "collectionCensoredName": "Paranoid Android - EP",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/paranoid-android-ep/id1112407871?uo=4",
      "artworkUrl60": "http://is5.mzstatic.com/image/thumb/Music30/v4/93/44/0b/93440bad-78f5-55ea-d09c-5a0ecae17bcb/source/60x60bb.jpg",
      "artworkUrl100": "http://is5.mzstatic.com/image/thumb/Music30/v4/93/44/0b/93440bad-78f5-55ea-d09c-5a0ecae17bcb/source/100x100bb.jpg",
      "collectionPrice": 7.74,
      "collectionExplicitness": "notExplicit",
      "trackCount": 6,
      "copyright": "℗ 1997 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "1997-05-26T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112407306,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "No Surprises - Single",
      "collectionCensoredName": "No Surprises - Single",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/no-surprises-single/id1112407306?uo=4",
      "artworkUrl60": "http://is4.mzstatic.com/image/thumb/Music18/v4/fc/eb/7d/fceb7dfd-bb02-3a46-a11d-5ff179227842/source/60x60bb.jpg",
      "artworkUrl100": "http://is4.mzstatic.com/image/thumb/Music18/v4/fc/eb/7d/fceb7dfd-bb02-3a46-a11d-5ff179227842/source/100x100bb.jpg",
      "collectionPrice": 3.87,
      "collectionExplicitness": "notExplicit",
      "trackCount": 3,
      "copyright": "℗ 1998 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "1998-01-12T08:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112407235,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Fake Plastic Trees - Single",
      "collectionCensoredName": "Fake Plastic Trees - Single",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/fake-plastic-trees-single/id1112407235?uo=4",
      "artworkUrl60": "http://is5.mzstatic.com/image/thumb/Music20/v4/d5/32/22/d53222ec-cdfa-0570-2690-39fb7f28952b/source/60x60bb.jpg",
      "artworkUrl100": "http://is5.mzstatic.com/image/thumb/Music20/v4/d5/32/22/d53222ec-cdfa-0570-2690-39fb7f28952b/source/100x100bb.jpg",
      "collectionPrice": 3.87,
      "collectionExplicitness": "notExplicit",
      "trackCount": 3,
      "copyright": "℗ 1995 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "1995-05-15T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1112405045,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Pyramid Song - EP",
      "collectionCensoredName": "Pyramid Song - EP",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/pyramid-song-ep/id1112405045?uo=4",
      "artworkUrl60": "http://is2.mzstatic.com/image/thumb/Music60/v4/77/af/84/77af8490-1d16-88a2-2804-de0222b03f37/source/60x60bb.jpg",
      "artworkUrl100": "http://is2.mzstatic.com/image/thumb/Music60/v4/77/af/84/77af8490-1d16-88a2-2804-de0222b03f37/source/100x100bb.jpg",
      "collectionPrice": 6.45,
      "collectionExplicitness": "notExplicit",
      "trackCount": 5,
      "copyright": "℗ 2001 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2001-05-21T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1111577743,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "A Moon Shaped Pool",
      "collectionCensoredName": "A Moon Shaped Pool",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/a-moon-shaped-pool/id1111577743?uo=4",
      "artworkUrl60": "http://is2.mzstatic.com/image/thumb/Music18/v4/34/03/34/34033451-12e2-2d0b-c100-11a390922a01/source/60x60bb.jpg",
      "artworkUrl100": "http://is2.mzstatic.com/image/thumb/Music18/v4/34/03/34/34033451-12e2-2d0b-c100-11a390922a01/source/100x100bb.jpg",
      "collectionPrice": 10.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 11,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-05-10T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1111495817,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Daydreaming - Single",
      "collectionCensoredName": "Daydreaming - Single",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/daydreaming-single/id1111495817?uo=4",
      "artworkUrl60": "http://is5.mzstatic.com/image/thumb/Music20/v4/1d/f1/30/1df13064-32d6-6c88-988e-64188fb4b662/source/60x60bb.jpg",
      "artworkUrl100": "http://is5.mzstatic.com/image/thumb/Music20/v4/1d/f1/30/1df13064-32d6-6c88-988e-64188fb4b662/source/100x100bb.jpg",
      "collectionPrice": 1.29,
      "collectionExplicitness": "notExplicit",
      "trackCount": 1,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-05-07T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1110448315,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Burn the Witch - Single",
      "collectionCensoredName": "Burn the Witch - Single",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/burn-the-witch-single/id1110448315?uo=4",
      "artworkUrl60": "http://is4.mzstatic.com/image/thumb/Music18/v4/b0/4a/74/b04a7409-6f9e-f72b-a963-28b210f76e09/source/60x60bb.jpg",
      "artworkUrl100": "http://is4.mzstatic.com/image/thumb/Music18/v4/b0/4a/74/b04a7409-6f9e-f72b-a963-28b210f76e09/source/100x100bb.jpg",
      "collectionPrice": 1.29,
      "collectionExplicitness": "notExplicit",
      "trackCount": 1,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-05-03T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1109714965,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "The King of Limbs",
      "collectionCensoredName": "The King of Limbs",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/the-king-of-limbs/id1109714965?uo=4",
      "artworkUrl60": "http://is5.mzstatic.com/image/thumb/Music20/v4/7d/c6/60/7dc660b2-9fc6-6824-bcd7-c10c6207a98b/source/60x60bb.jpg",
      "artworkUrl100": "http://is5.mzstatic.com/image/thumb/Music20/v4/7d/c6/60/7dc660b2-9fc6-6824-bcd7-c10c6207a98b/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 8,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-05-04T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1109714933,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "In Rainbows",
      "collectionCensoredName": "In Rainbows",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/in-rainbows/id1109714933?uo=4",
      "artworkUrl60": "http://is4.mzstatic.com/image/thumb/Music20/v4/03/e5/09/03e509b5-fd59-1d69-5bb9-50190e10e250/source/60x60bb.jpg",
      "artworkUrl100": "http://is4.mzstatic.com/image/thumb/Music20/v4/03/e5/09/03e509b5-fd59-1d69-5bb9-50190e10e250/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 10,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-05-06T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1109714866,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Tkol Rmx 1234567",
      "collectionCensoredName": "Tkol Rmx 1234567",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/tkol-rmx-1234567/id1109714866?uo=4",
      "artworkUrl60": "http://is2.mzstatic.com/image/thumb/Music18/v4/be/cd/78/becd78ed-424f-b62d-1909-3c63e6e50b4e/source/60x60bb.jpg",
      "artworkUrl100": "http://is2.mzstatic.com/image/thumb/Music18/v4/be/cd/78/becd78ed-424f-b62d-1909-3c63e6e50b4e/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 19,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-05-04T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1097873905,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "I Might Be Wrong (Live)",
      "collectionCensoredName": "I Might Be Wrong (Live)",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/i-might-be-wrong-live/id1097873905?uo=4",
      "artworkUrl60": "http://is3.mzstatic.com/image/thumb/Music69/v4/be/e0/83/bee08381-30f6-39ff-e298-5cef6c9894fb/source/60x60bb.jpg",
      "artworkUrl100": "http://is3.mzstatic.com/image/thumb/Music69/v4/be/e0/83/bee08381-30f6-39ff-e298-5cef6c9894fb/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 8,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-04-01T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1097864180,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Amnesiac",
      "collectionCensoredName": "Amnesiac",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/amnesiac/id1097864180?uo=4",
      "artworkUrl60": "http://is5.mzstatic.com/image/thumb/Music49/v4/d3/73/a2/d373a2af-0175-3dfc-f4da-3ba55521ad50/source/60x60bb.jpg",
      "artworkUrl100": "http://is5.mzstatic.com/image/thumb/Music49/v4/d3/73/a2/d373a2af-0175-3dfc-f4da-3ba55521ad50/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 11,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-04-01T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1097863576,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Hail to the Thief",
      "collectionCensoredName": "Hail to the Thief",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/hail-to-the-thief/id1097863576?uo=4",
      "artworkUrl60": "http://is1.mzstatic.com/image/thumb/Music49/v4/dc/63/17/dc6317be-a241-82a1-4391-1058d9990dd4/source/60x60bb.jpg",
      "artworkUrl100": "http://is1.mzstatic.com/image/thumb/Music49/v4/dc/63/17/dc6317be-a241-82a1-4391-1058d9990dd4/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 14,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-04-01T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1097862870,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Kid A",
      "collectionCensoredName": "Kid A",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/kid-a/id1097862870?uo=4",
      "artworkUrl60": "http://is3.mzstatic.com/image/thumb/Music69/v4/cb/b4/83/cbb48306-e44c-d5ea-eaf6-aef3e320e176/source/60x60bb.jpg",
      "artworkUrl100": "http://is3.mzstatic.com/image/thumb/Music69/v4/cb/b4/83/cbb48306-e44c-d5ea-eaf6-aef3e320e176/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 11,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-04-01T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1097862703,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "The Bends",
      "collectionCensoredName": "The Bends",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/the-bends/id1097862703?uo=4",
      "artworkUrl60": "http://is5.mzstatic.com/image/thumb/Music49/v4/be/5d/0e/be5d0e68-c3eb-6aa7-739e-aa6ced08edc1/source/60x60bb.jpg",
      "artworkUrl100": "http://is5.mzstatic.com/image/thumb/Music49/v4/be/5d/0e/be5d0e68-c3eb-6aa7-739e-aa6ced08edc1/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 12,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-04-01T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1097862062,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "Pablo Honey",
      "collectionCensoredName": "Pablo Honey",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/pablo-honey/id1097862062?uo=4",
      "artworkUrl60": "http://is2.mzstatic.com/image/thumb/Music69/v4/32/44/08/324408b9-c9ad-e8c1-17ec-132b15dada48/source/60x60bb.jpg",
      "artworkUrl100": "http://is2.mzstatic.com/image/thumb/Music69/v4/32/44/08/324408b9-c9ad-e8c1-17ec-132b15dada48/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "explicit",
      "contentAdvisoryRating": "Explicit",
      "trackCount": 12,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-04-01T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "collection",
      "collectionType": "Album",
      "artistId": 657515,
      "collectionId": 1097861387,
      "amgArtistId": 41092,
      "artistName": "Radiohead",
      "collectionName": "OK Computer",
      "collectionCensoredName": "OK Computer",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/us/album/ok-computer/id1097861387?uo=4",
      "artworkUrl60": "http://is4.mzstatic.com/image/thumb/Music69/v4/4e/b8/ba/4eb8ba96-6ee2-8a60-f012-a7a61a4fe097/source/60x60bb.jpg",
      "artworkUrl100": "http://is4.mzstatic.com/image/thumb/Music69/v4/4e/b8/ba/4eb8ba96-6ee2-8a60-f012-a7a61a4fe097/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "collectionExplicitness": "notExplicit",
      "trackCount": 12,
      "copyright": "℗ 2016 XL Recordings",
      "country": "USA",
      "currency": "USD",
      "releaseDate": "2016-04-01T07:00:00Z",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "track",
      "kind": "music-video",
      "artistId": 657515,
      "trackId": 1154535588,
      "artistName": "Radiohead",
      "trackName": "Present Tense: Jonny, Thom & a CR78",
      "trackCensoredName": "Present Tense: Jonny, Thom & a CR78",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "trackViewUrl": "https://itunes.apple.com/us/music-video/present-tense-jonny-thom-cr78/id1154535588?uo=4",
      "previewUrl": "http://a1119.phobos.apple.com/us/r1000/128/Video71/v4/34/44/50/34445064-b4a6-285d-caa1-fd76b9a0d1e6/mzvf_5613188103403410015.640x480.h264lc.U.p.m4v",
      "artworkUrl30": "http://is3.mzstatic.com/image/thumb/Video52/v4/06/66/8c/06668cb9-8bc0-52b6-11fd-bf5f570c551d/source/30x30bb.jpg",
      "artworkUrl60": "http://is3.mzstatic.com/image/thumb/Video52/v4/06/66/8c/06668cb9-8bc0-52b6-11fd-bf5f570c551d/source/60x60bb.jpg",
      "artworkUrl100": "http://is3.mzstatic.com/image/thumb/Video52/v4/06/66/8c/06668cb9-8bc0-52b6-11fd-bf5f570c551d/source/100x100bb.jpg",
      "collectionPrice": 1.99,
      "trackPrice": 1.99,
      "releaseDate": "2016-09-17T07:00:00Z",
      "collectionExplicitness": "notExplicit",
      "trackExplicitness": "notExplicit",
      "trackTimeMillis": 325247,
      "country": "USA",
      "currency": "USD",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "track",
      "kind": "music-video",
      "artistId": 657515,
      "trackId": 1111945190,
      "artistName": "Radiohead",
      "trackName": "Daydreaming",
      "trackCensoredName": "Daydreaming",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "trackViewUrl": "https://itunes.apple.com/us/music-video/daydreaming/id1111945190?uo=4",
      "previewUrl": "http://a466.phobos.apple.com/us/r1000/150/Video30/v4/13/ac/87/13ac8767-c7c5-41b5-bb6f-ed1aae597e70/mzvf_5531763037463038169.640x472.h264lc.U.p.m4v",
      "artworkUrl30": "http://is1.mzstatic.com/image/thumb/Video50/v4/68/a7/2f/68a72f01-969a-9c62-73e2-b68e6c15009a/source/30x30bb.jpg",
      "artworkUrl60": "http://is1.mzstatic.com/image/thumb/Video50/v4/68/a7/2f/68a72f01-969a-9c62-73e2-b68e6c15009a/source/60x60bb.jpg",
      "artworkUrl100": "http://is1.mzstatic.com/image/thumb/Video50/v4/68/a7/2f/68a72f01-969a-9c62-73e2-b68e6c15009a/source/100x100bb.jpg",
      "collectionPrice": 1.99,
      "trackPrice": 1.99,
      "releaseDate": "2016-05-07T07:00:00Z",
      "collectionExplicitness": "notExplicit",
      "trackExplicitness": "notExplicit",
      "trackTimeMillis": 386003,
      "country": "USA",
      "currency": "USD",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "track",
      "kind": "music-video",
      "artistId": 657515,
      "trackId": 1111944159,
      "artistName": "Radiohead",
      "trackName": "Burn the Witch",
      "trackCensoredName": "Burn the Witch",
      "artistViewUrl": "https://itunes.apple.com/us/artist/radiohead/id657515?uo=4",
      "trackViewUrl": "https://itunes.apple.com/us/music-video/burn-the-witch/id1111944159?uo=4",
      "previewUrl": "http://a1717.phobos.apple.com/us/r1000/127/Video30/v4/0f/4f/0f/0f4f0f25-35f8-2475-a75b-3624525cc436/mzvf_6861437096633098527.640x480.h264lc.U.p.m4v",
      "artworkUrl30": "http://is4.mzstatic.com/image/thumb/Video62/v4/fe/81/76/fe8176fe-a474-3683-92ac-d9f0a0763371/source/30x30bb.jpg",
      "artworkUrl60": "http://is4.mzstatic.com/image/thumb/Video62/v4/fe/81/76/fe8176fe-a474-3683-92ac-d9f0a0763371/source/60x60bb.jpg",
      "artworkUrl100": "http://is4.mzstatic.com/image/thumb/Video62/v4/fe/81/76/fe8176fe-a474-3683-92ac-d9f0a0763371/source/100x100bb.jpg",
      "collectionPrice": 1.99,
      "trackPrice": 1.99,
      "releaseDate": "2016-05-04T07:00:00Z",
      "collectionExplicitness": "notExplicit",
      "trackExplicitness": "notExplicit",
      "trackTimeMillis": 239337,
      "country": "USA",
      "currency": "USD",
      "primaryGenreName": "Alternative"
    },
    {
      "wrapperType": "track",
      "kind": "feature-movie",
      "trackId": 1033001742,
      "artistName": "Jon Shenk",
      "trackName": "The Island President",
      "trackCensoredName": "The Island President",
      "trackViewUrl": "https://itunes.apple.com/us/movie/the-island-president/id1033001742?uo=4",
      "previewUrl": "http://a1004.phobos.apple.com/us/r30/Video7/v4/4b/dd/31/4bdd3154-5742-ab5a-c02d-0023b9c5e12f/mzvf_4797077210192572161.640x476.h264lc.D2.p.m4v",
      "artworkUrl30": "http://is4.mzstatic.com/image/thumb/Video3/v4/cc/c6/00/ccc60090-0a9b-451c-8603-af9c4393fbf9/source/30x30bb.jpg",
      "artworkUrl60": "http://is4.mzstatic.com/image/thumb/Video3/v4/cc/c6/00/ccc60090-0a9b-451c-8603-af9c4393fbf9/source/60x60bb.jpg",
      "artworkUrl100": "http://is4.mzstatic.com/image/thumb/Video3/v4/cc/c6/00/ccc60090-0a9b-451c-8603-af9c4393fbf9/source/100x100bb.jpg",
      "collectionPrice": 6.99,
      "trackPrice": 6.99,
      "trackRentalPrice": 0.99,
      "collectionHdPrice": 7.99,
      "trackHdPrice": 7.99,
      "trackHdRentalPrice": 0.99,
      "releaseDate": "2012-03-28T07:00:00Z",
      "collectionExplicitness": "notExplicit",
      "trackExplicitness": "notExplicit",
      "trackTimeMillis": 6068068,
      "country": "USA",
      "currency": "USD",
      "primaryGenreName": "Independent",
      "contentAdvisoryRating": "PG",
      "shortDescription": "The Island President tells the story of President Mohamed Nasheed of the Maldives, a man confronting",
      "longDescription": "The Island President tells the story of President Mohamed Nasheed of the Maldives, a man confronting a problem greater than any other world leader has ever faced - the literal survival of his country and everyone in it. Nasheed brought democracy to the Maldives after thirty years of despotic rule but he is now faced with an even greater challenge: as one of the most low-lying countries in the world, a rise of three feet in sea level would submerge the 1200 islands of the Maldives and make them uninhabitable. A classic David and Goliath tale, The Island President captures Nasheed's battle to stop and reverse global warming, culminating in his trip to the Copenhagen Climate Sumitt in 2009 where the film provides a rare and unprecedented glimpse at Nasheed's electrifying and passionate behind the scenes exchanges with the heads of state attending this top-level global assembly. A film about one man's mission to save his nation and perhaps the planet, The Island President is a riveting, uplifting story that is impossible to take your eye off of."
    },
    {
      "wrapperType": "track",
      "kind": "feature-movie",
      "trackId": 924601562,
      "artistName": "Stephen Kijak",
      "trackName": "Scott Walker: 30 Century Man",
      "trackCensoredName": "Scott Walker: 30 Century Man",
      "trackViewUrl": "https://itunes.apple.com/us/movie/scott-walker-30-century-man/id924601562?uo=4",
      "previewUrl": "http://a1050.phobos.apple.com/us/r30/Video1/v4/41/67/62/416762a1-0d91-6397-446d-99fe7e8212a7/mzvf_7115424198891708250.640x472.h264lc.D2.p.m4v",
      "artworkUrl30": "http://is2.mzstatic.com/image/thumb/Video3/v4/28/01/b2/2801b239-9bb6-678a-e8b5-2190034e2419/source/30x30bb.jpg",
      "artworkUrl60": "http://is2.mzstatic.com/image/thumb/Video3/v4/28/01/b2/2801b239-9bb6-678a-e8b5-2190034e2419/source/60x60bb.jpg",
      "artworkUrl100": "http://is2.mzstatic.com/image/thumb/Video3/v4/28/01/b2/2801b239-9bb6-678a-e8b5-2190034e2419/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "trackPrice": 9.99,
      "trackRentalPrice": 3.99,
      "releaseDate": "2009-02-27T08:00:00Z",
      "collectionExplicitness": "notExplicit",
      "trackExplicitness": "notExplicit",
      "trackTimeMillis": 5757791,
      "country": "USA",
      "currency": "USD",
      "primaryGenreName": "Documentary",
      "contentAdvisoryRating": "NR",
      "shortDescription": "SCOTT WALKER: 30 CENTURY MAN is a rare glimpse into the creative world of the most enigmatic figure",
      "longDescription": "SCOTT WALKER: 30 CENTURY MAN is a rare glimpse into the creative world of the most enigmatic figure in rock history, tracing the undeniable impact he has had on popular music through casual interviews with some of his biggest, highest profile fans."
    },
    {
      "wrapperType": "track",
      "kind": "feature-movie",
      "artistId": 85932,
      "trackId": 891899363,
      "artistName": "Bryan Adams",
      "trackName": "¡Released! Highlights of the Human Rights Concerts",
      "trackCensoredName": "¡Released! Highlights of the Human Rights Concerts",
      "artistViewUrl": "https://itunes.apple.com/us/artist/bryan-adams/id85932?uo=4",
      "trackViewUrl": "https://itunes.apple.com/us/movie/released!-highlights-human/id891899363?uo=4",
      "previewUrl": "http://a638.phobos.apple.com/us/r1000/053/Video6/v4/e9/a4/fe/e9a4fe10-8915-6783-b8bc-7c0a26c8457a/mzvf_4889625506710231081.640x464.h264lc.D2.p.m4v",
      "artworkUrl30": "http://is3.mzstatic.com/image/thumb/Video1/v4/63/63/86/636386dd-6f92-d365-a18d-f60165f3caff/source/30x30bb.jpg",
      "artworkUrl60": "http://is3.mzstatic.com/image/thumb/Video1/v4/63/63/86/636386dd-6f92-d365-a18d-f60165f3caff/source/60x60bb.jpg",
      "artworkUrl100": "http://is3.mzstatic.com/image/thumb/Video1/v4/63/63/86/636386dd-6f92-d365-a18d-f60165f3caff/source/100x100bb.jpg",
      "collectionPrice": 9.99,
      "trackPrice": 9.99,
      "trackRentalPrice": 3.99,
      "releaseDate": "2014-07-08T07:00:00Z",
      "collectionExplicitness": "notExplicit",
      "trackExplicitness": "notExplicit",
      "trackTimeMillis": 9431198,
      "country": "USA",
      "currency": "USD",
      "primaryGenreName": "Concert Films",
      "contentAdvisoryRating": "NR",
      "shortDescription": "The Human Rights Concerts is the collective name informally used to describe the series of 28 rock",
      "longDescription": "The Human Rights Concerts is the collective name informally used to describe the series of 28 rock concerts presented worldwide 1986-1998 to raise funds for – and awareness of - the Nobel Peace Prize-winning human rights organization Amnesty International."
    }
  ]
}
  ```
'collection name' has - EP or - single at the end of it to denote release type
'collection Type' always seems to be Album. 'trackCount' of 1 can give away that its a single. 'kind' is 'music-video' when it is a music-video. Need to filter out 'collectionType': 'feature-movie'

'release dates' look like they correspond to the itunes release date and not the actual album release date. First index is artist entity itself. filter array to keep last 15 releases?

build all edges with users who like this artist
