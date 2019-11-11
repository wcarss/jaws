"use strict";

import Creek from "./creek/creek.js";
import Player from "./player.js";
import Resources from "./resources.js";
import Maps from "./maps.js";

window.onload = async () => {
  document.body.setAttribute("style", "background: grey");

  const creek = new Creek();
  const player = new Player(20, 20, 32, 32);
  const maps = new Maps(player);

  await creek.get("resources").init(creek, Resources);

  creek.init([player, maps]);
  creek.run();
  //player.y = creek.get("context").get_height() / 2;
  console.log("player.y: ", player.y);
  creek.get("data").set("player", player);
  creek.get("data").set("entity_list", maps.get_entities());
};
