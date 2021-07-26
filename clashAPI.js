import clashApi from "clash-of-clans-api";
import Player from "./mongoose.js";
import getToken from "./clashAPILogin.js";

const token = await getToken();

let clashApiClient = clashApi({
  token: token,
});

function byClanTag(tag, callback) {
  clashApiClient
    .clanByTag(tag)
    .then(async (response) => {
      var reply = "";
      for (var member of response.memberList) {
        await findPlayer(member)
          .then((response) => {
            reply = reply + response;
          })
          .catch((err) => callback(err));
      }
      callback("```" + response.name + " :   \n\n" + reply + "```");
    })
    .catch((error) => {
      console.log(error);
      callback("Error: Something went wrong while getting data!");
    });
}

async function findPlayer(member) {
  return new Promise((resolve, reject) => {
    Player.findOne({ playerTAG: member.tag }, (err, player) => {
      if (err) {
        reject("Error: ", err);
      }
      if (!player) {
        resolve(member.name + " -- " + member.tag + " -- " + "Not linked.\n");
      } else {
        if (player.strikeCount === 0) {
          resolve(member.name + " -- " + member.tag + " -- No Strikes.\n");
        } else {
          resolve(member.name + " -- " + member.tag + " -- " + player.strikeCount + " Strikes.\n");
        }
      }
    });
  });
}

export { byClanTag };
