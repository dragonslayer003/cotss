function strikeCalc(strike) {
  var strikes = "",
    strikeCount = 0;

  switch (strike) {
    case "1":
      strikes = "Left the clan without approval.\n";
      strikeCount = 0.5;
      break;

    case "2":
      strikes = "Failed to respond to leadership.\n";
      strikeCount = 0.5;
      break;

    case "3":
      strikes = "Attacked wrong base in war.\n";
      strikeCount = 0.5;
      break;

    case "4":
      strikes = "Missed a war Attack without reason.\n";
      strikeCount = 1;
      break;

    case "5":
      strikes = "Missed attack in CWL without reason.\n";
      strikeCount = 1;
      break;

    case "6":
      strikes = "Failed to meet Clan Games points.\n";
      strikeCount = 1;
      break;

    case "7":
      strikes = "Opting in for war while hero(s) down.\n";
      strikeCount = 1;
      break;

    case "8":
      strikes = "Did not follow the war plan.\n";
      strikeCount = 1;
      break;

    case "9":
      strikes = "Did not use either of the attacks in the war.\n";
      strikeCount = 2;
      break;

    case "10":
      strikes = "Changed the war plan made by war general.\n";
      strikeCount = 3;
      break;

    case "11":
      strikes = "Toxic towards other players.\n";
      strikeCount = 4;
      break;

    case "12":
      strikes = "Camping accounts and/or going AFK.\n";
      strikeCount = 4;
      break;

    case "13":
      strikes = "Failed to swap War Base when advised by Leadership of FWA.\n";
      strikeCount = 1;
      break;

    case "14":
      strikes = "Failed to attack your FWA Mirror without properly alerting Leadership.\n";
      strikeCount = 1;
      break;

    default:
      strikes = "";
      strikeCount = 0;
      break;
  }

  return { strikes, strikeCount };
}

export default strikeCalc;
