/*
Here we are prepared to receive a POST message from the client,
and acknowledge that, with a very limited response back to the client
*/

/*
Use browser to view pages at http://localhost:3000/canvasWithTimer.html

When the blue cube is moved with the arrow keys, a POST message will be
sent to the server when the arrow key is released. The POST message will
contain a data string which is the location of the blue cube when the
arrow key was released. The server sends back a JSON string which the client should use
to put down a "waypoint" for where the arrow key was released

Also if the client types in the app text field and presses the "Submit Request" button
a JSON object containing the text field text will be send to this
server in a POST message.

Notice in this code we attach an event listener to the request object
to receive data that might come in in chunks. When the request end event
is posted we look and see if it is a POST message and if so extract the
data and process it.


*/

//Cntl+C to stop server (in Windows CMD console)

//DATA to be used in a future tutorial exercise.
/*Exercise: if the user types the title of a song that the server has,
the server should send a JSON object back to the client to replace
the words array in the client app.
*/

//hard coded songs to serve client
//var canvas = document.getElementById('html/canvas1');
var array;
var lyrics = [];
var chords = [];
var xMargin = 30;
var yMargin = 30;
var yGap =    40;


var xPos, yPos;
var fs = require('fs'); //need to read static files

var peacefulEasyFeeling = [];
fs.readFile('songs/' + 'Peaceful Easy Feeling' + '.txt', function(err, data) {
  if(err) throw err;
  array = data.toString().split("\n");
  chords = new Array(array.length);
  for(i=0;i<array.length;i++){
    yPos = yGap*i;
    xPos = xMargin;
    lyrics[i] = array[i];
    lyrics[i] = lyrics[i].split(" ");
    chords[i] = new Array(lyrics[i].length);              // set size of chords array
    for(j=0; j<lyrics[i].length;j++) {
      if (chords[i][j] == undefined) chords[i][j] = '';                                                  // fill undefined with blank value
      if (lyrics[i][j].includes(']')) {                                                                  // Check if lyric has chords in it
        chords[i][j] = lyrics[i][j].substring(lyrics[i][j].indexOf('['), lyrics[i][j].indexOf(']') + 1); // find the chords in the word
        lyrics[i][j] = lyrics[i][j].replace(chords[i][j],'');                                            // remove chords from lyric
        chords[i][j] = chords[i][j].replace('[','');
        chords[i][j] = chords[i][j].replace(']','');                                                     // remove square brackets from chord
      }
      peacefulEasyFeeling.push({word: lyrics[i][j], x:xPos, y:yPos+yMargin, chord: chords[i][j], chordX:xPos, chordY:yPos+yMargin-15});
      xPos += getStringWidth(lyrics[i][j])*8 + 20;
    }
  }
});

var sisterGoldenHair = [];
fs.readFile('songs/' + 'Sister Golden Hair' + '.txt', function(err, data) {
  if(err) throw err;
  array = data.toString().split("\n");
  chords = new Array(array.length);
  for(i=0;i<array.length;i++){
    yPos = yGap*i;
    xPos =xMargin;
    lyrics[i] = array[i];
    lyrics[i] = lyrics[i].split(" ");
    chords[i] = new Array(lyrics[i].length);
    for(j=0; j<lyrics[i].length;j++) {
      if (chords[i][j] == undefined) chords[i][j] = '';                                                  // fill undefined with blank value
      if (lyrics[i][j].includes(']')) {                                                                  // Check if lyric has chords in it
        chords[i][j] = lyrics[i][j].substring(lyrics[i][j].indexOf('['), lyrics[i][j].indexOf(']') + 1);     // find the chords in the word
        lyrics[i][j] = lyrics[i][j].replace(chords[i][j],'');                                            // remove chords from lyric
        chords[i][j] = chords[i][j].replace('[','');
        chords[i][j] = chords[i][j].replace(']','');                                                     // remove square brackets from chord
      }
      sisterGoldenHair.push({word: lyrics[i][j], x:xPos, y:yPos+yMargin, chord: chords[i][j], chordX:xPos, chordY:yPos+yMargin-15});
      xPos += getStringWidth(lyrics[i][j])*8 + 20;
    }
  }
});

var brownEyedGirl = [];
fs.readFile('songs/' + 'Brown Eyed Girl' + '.txt', function(err, data) {
  if(err) throw err;
  array = data.toString().split("\n");
  chords = new Array(array.length);
  for(i=0;i<array.length;i++){
    yPos = yGap*i;
    xPos = xMargin;
    lyrics[i] = array[i];
    lyrics[i] = lyrics[i].split(" ");
    chords[i] = new Array(lyrics[i].length);
    for(j=0; j<lyrics[i].length;j++) {
      if (chords[i][j] == undefined) chords[i][j] = '';                                                  // fill undefined with blank value
      if (lyrics[i][j].includes("]")) {                                                                  // Check if lyric has chords in it
        chords[i][j] = lyrics[i][j].substring(lyrics[i][j].indexOf('['), lyrics[i][j].indexOf(']') + 1); // find the chords in the word
        lyrics[i][j] = lyrics[i][j].replace(chords[i][j],'');                                            // remove chords from lyric
        chords[i][j] = chords[i][j].replace('[','');
        chords[i][j] = chords[i][j].replace(']','');                                                     // remove square brackets from chord
        chords[i][j].x = xPos;
        chords[i][j].y = yPos+yMargin - 15;
      }
      brownEyedGirl.push({word: lyrics[i][j], x:xPos, y:yPos+yMargin, chord: chords[i][j], chordX:xPos, chordY:yPos+yMargin-15});
      xPos += getStringWidth(lyrics[i][j])*10 + 20;
    }
  }
});


var songs = {"Peaceful Easy Feeling" : peacefulEasyFeeling,
"Sister Golden Hair" : sisterGoldenHair,
"Brown Eyed Girl" : brownEyedGirl
};

// function getTextWidth(text){
//   var context = canvas.getContext('2d');
//   context.font = fontSize.toString() + 'pt ' + font;
//   return context.measureText(text).width;
// }

//Server Code
var http = require('http'); //need to http
var url = require('url');  //to parse url strings

var counter = 1000; //to count invocations of function(req,res)


var ROOT_DIR = 'html'; //dir to serve static files from

var MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'text/javascript', //should really be application/javascript
  'json': 'application/json',
  'png': 'image/png',
  'txt': 'text/plain'
};

var get_mime = function(filename) {
  var ext, type;
  for (ext in MIME_TYPES) {
    type = MIME_TYPES[ext];
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return type;
    }
  }
  return MIME_TYPES['txt'];
};

var getStringWidth = function(stringname) {
  return stringname.length;
}

http.createServer(function (request,response){
  var urlObj = url.parse(request.url, true, false);
  console.log('\n============================');
  console.log("PATHNAME: " + urlObj.pathname);
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
  console.log("METHOD: " + request.method);

  var receivedData = '';

  //attached event handlers to collect the message data
  request.on('data', function(chunk) {
    receivedData += chunk;
  });

  //event handler for the end of the message
  request.on('end', function(){
    console.log('received data: ', receivedData);
    console.log('type: ', typeof receivedData);

    //if it is a POST request then echo back the data.
    if(request.method == "POST"){
      var dataObj = JSON.parse(receivedData);
      console.log('received data object: ', dataObj);
      console.log('type: ', typeof dataObj);
      //Here we can decide how to process the data object and what
      //object to send back to client.
      //FOR NOW EITHER JUST PASS BACK AN OBJECT
      //WITH "text" PROPERTY
      if(typeof dataObj == 'number'){
        console.log("this should be a number: " + dataObj);
      }
      if (typeof dataObj == 'object') canvas = dataObj;
      //TO DO: return the words array that the client requested
      //if it exists

      console.log("USER REQUEST: " + dataObj.text );
      var returnObj = {};
      for(text in songs){
        if(dataObj.text == text){
          returnObj.text = ' FOUND ';
          // var fs = require('fs');
          // fs.readFile('songs/' + text + '.txt', function(err, data) {
          //   if(err) throw err;
          //   var array = data.toString().split("\n");
          //   for(i in array){console.log(array[i]);}
          // });
          returnObj.wordArray = songs[text];
          break;
        }else {
          returnObj.text = 'NOT FOUND ';
        }
      }

      if(dataObj.updateF){
       fs.writeFile('songs/test.txt', dataObj.updateF, function(err){
         if(err){
           return console.log(err);
         }
       });
     }
      //object to return to client
      response.writeHead(200, {'Content-Type': MIME_TYPES["text"]});  //does not work with application/json MIME
      response.end(JSON.stringify(returnObj)); //send just the JSON object
    }
  });

  if(request.method == "GET"){
    //handle GET requests as static file requests
    var filePath = ROOT_DIR + urlObj.pathname;
    if(urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';

    fs.readFile(filePath, function(err,data){
      if(err){
        //report error to console
        console.log('ERROR: ' + JSON.stringify(err));
        //respond with not found 404 to client
        response.writeHead(404);
        response.end(JSON.stringify(err));
        return;
      }
      response.writeHead(200, {'Content-Type': get_mime(filePath)});
      response.end(data);
    });
  }


}).listen(3000);

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');
