var GITHUB_USER = "DominicTremblay";
var GITHUB_TOKEN = "2c53aa22f54d3b74ece0dfab62afc3952dae46eb";

var request = require('request');

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


getRepoContributors("jquery", "jquery", function(err, result) {
  if (err) {
    console.log("Errors:", err);
  }

  else {

    for (contributorKey in result) {
      console.log(result[contributorKey].avatar_url);
    }
  }

});

