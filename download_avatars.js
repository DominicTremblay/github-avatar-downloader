var GITHUB_USER = "DominicTremblay";
var GITHUB_TOKEN = "2c53aa22f54d3b74ece0dfab62afc3952dae46eb";

var request = require('request');
var fs = require('fs');

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var options = {
        url: requestURL,
        headers: {
          'User-Agent': 'request'
        }
      }

  request(options, function(err, response, body){

    if(err) {
      cb(err,null);
    }
    else {
      console.log(response.statusCode);
      cb(null, JSON.parse(body));
    }
  });
}

function downloadImageByURL(url, filePath) {
  request(url)
  .on('error', function(err){
    throw err;
  })
  .on('response', function(response){
    console.log('Downloading image...');
    console.log('HTTP Status', response.statusCode, response.statusMessage);
    console.log('HTTP Content-Type: \'' + response.headers['content-type'] + '\'');
  })
  .pipe(fs.createWriteStream(filePath))
  .on('finish', function(){
    console.log("Download complete");
  });
}

// downloadImageByURL('https://avatars2.githubusercontent.com/u/2741?v=3&s=466', 'avatars/kvirani.jpg');


getRepoContributors("jquery", "jquery", function(err, result) {
  if (err) {
    console.log("Errors:", err);
  }

  else {

    for (contributorKey in result) {
      downloadImageByURL(result[contributorKey].avatar_url, 'avatars/'+result[contributorKey].login+'.jpg');
    }
  }

});

