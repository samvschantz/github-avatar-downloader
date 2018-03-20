var owner = process.argv[2]
var repo = process.argv[3]

var request = require('request');
var secret = require('./secrets');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secret.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var parsedJSON = JSON.parse(body)
    cb(err, parsedJSON);
    parsedJSON.forEach(function(element){
      var filePath = element['login']
      var url = element['avatar_url']
      var position = parsedJSON.indexOf(element) + 1
      downloadImageByURL(url, filePath, position)
    })
  });
}

function downloadImageByURL(url, filePath, position) {
  request.get(url + filePath)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log('Downloading image #' + position);
    })
    .pipe(fs.createWriteStream('githubAvatars/' + filePath))
}

getRepoContributors(owner, repo, function(err, result) {
  if (!owner){
    throw new Error('ERROR: Please enter an owner and a repo in the format: node download_avatars.js <owner> <repo>')
  } else if (!repo){
    throw new Error('ERROR: Please enter an owner and a repo in the format: node download_avatars.js <owner> <repo>')
  } else if (owner, repo){
  console.log("Errors:", err);
  console.log("Result:", result);
  }
});


