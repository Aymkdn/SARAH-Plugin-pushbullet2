exports.init = function(SARAH){
  console.log("[pushbullet2] Plugin loaded.");
  SARAH.listen('pushbullet2', function(data) {
    var config = SARAH.ConfigManager.getConfig();
    config = config.modules.pushbullet2;
    var debug = false;
    if (debug) console.log("[pushbullet2] config = ",config);
    
    if (config.access_token.slice(0,4) === "Find") {
      console.log("[pushbullet2] ERROR: you must configure the plugin!");
    } else {
      if (!data) data = {"title":"Title", "body": "Body"};
      if (!data.title) data.title = "Title";
      if (!data.content) data.content = "Body";
      if (!data.body) {
        data.body = data.content;
        delete data.content;
      }
      if (!data.device_iden) {
        if (config.device_iden) data.device_iden = config.device_iden;
      }
      if (!data.type) data.type = "note";

      if (debug) console.log("[pushbullet2] data = ",data);
      
      // perform the request
      var request = require('request');
      var options = {
        method: 'POST',
        url: 'https://api.pushbullet.com/v2/pushes',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': 'Bearer '+config.access_token
        },
        json: true,
        body: JSON.stringify(data)
      };
      if (debug) console.log("[pushbullet2] options = ",options);
      console.log("[pushbullet2] Sending notification...");
      request(options, function (err, response, json){
        if (err || response.statusCode != 200) {
          console.log("[pushbullet2] ERROR: "+err);
          SARAH.speak("L'action a échoué");
          return;
        } else {
          console.log("[pushbullet2] Notification sent!");
        }
      });
    }
  });
};

exports.action = function(data, callback, config, SARAH) {
  data.body = data.content;
  SARAH.trigger('pushbullet2', data);
  callback({});
};