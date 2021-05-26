import clashApi from "clash-of-clans-api";
import Player from "./mongoose.js";

let clashApiClient = clashApi({
  token: process.env.clashApiToken,
  request: {
    proxy: process.env.ip_address,
  },
});

function byClanTag(tag, callback) {
  clashApiClient
    .clanByTag(tag)
    .then(async (response) => {
      var reply = "";
      for (var member of response.memberList) {
        await Player.findOne({ playerTAG: member.tag }, (err, player) => {
          if (err) {
            callback("Error: ", err);
          }
          if (!player) {
            reply = reply + member.name + " -- " + member.tag + " -- " + "Not linked\n";
          } else {
            if (player.strikeCount === 0) {
              reply = reply + member.name + " -- " + member.tag + " -- No Strikes.\n";
            } else {
              reply = reply + member.name + " -- " + member.tag + " -- " + player.strikeCount + " Strikes.\n";
            }
          }
        });
      }
      callback("```" + response.name + " :   \n\n" + reply + "```");
    })
    .catch(() => callback("Error: Something went wrong while getting data!"));
}

export { byClanTag };
