var request = require('request');
var fs = require('fs');
require('dotenv').config();

var GITHUB_USER = "DominicTremblay";




function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + process.env.GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
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
    console.log('Downloading', filePath);
    console.log('HTTP Status', response.statusCode, response.statusMessage);
    console.log('HTTP Content-Type: \'' + response.headers['content-type'] + '\'');
  })
  .pipe(fs.createWriteStream(filePath))
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
