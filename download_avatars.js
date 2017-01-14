var request = require('request');
var fs = require('fs');
require('dotenv').config();

var GITHUB_USER = "DominicTremblay";

function checkValidURL(url) {

  if (!GITHUB_USER)
    throw new Error("No github user provided");

  if(!process.env.GITHUB_TOKEN)
    throw new Error("No access token provided");

}


function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + process.env.GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  checkValidURL(requestURL);

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
      if (response.statusCode === 200) {
        cb(null, JSON.parse(body));
      }
      else
        console.log("cannot access the ressource with the specified URL.")
    }
  });
}

function downloadImageByURL(url, filePath) {
  request(url)
  .on('error', function(err){
    throw err;
  })
  .on('response', function(response){
    console.log('Downloading', filePath);
    console.log('HTTP Status', response.statusCode, response.statusMessage);
    console.log('HTTP Content-Type: \'' + response.headers['content-type'] + '\'');
  })
  .pipe(fs.createWriteStream(filePath))
  .on('error', function (err){
    console.log(err);
  })
  .on('finish', function(){
    console.log("Download of ", filePath, 'complete');
  });
}

function getAvatarURLS() {

  var args = process.argv.slice(2);
  if(args.length < 2) {
    console.log('Please provide a repo owner and repo as arguments from the command line');
  }
  else {
    getRepoContributors(args[0], args[1], function(err, result) {
  if (err) {
    console.log("Errors:", err);
  }

  else {

    for (contributorKey in result) {
      downloadImageByURL(result[contributorKey].avatar_url, 'avatars/'+result[contributorKey].login+'.jpg');
    }
  }

});
  }
}

getAvatarURLS();
