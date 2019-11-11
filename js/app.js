"use strict";

import Creek from "./creek/creek.js";
import Player from "./player.js";
import Resources from "./resources.js";

window.onload = async () => {
  document.body.setAttribute("style", "background: grey");

  const creek = new Creek();
  const player = new Player(20, 20, 32, 32, "red");
  const entities = [
    {
      draw: (context, interpolation) => {
        context.fillStyle = "black";
        context.fillRect(
          0,
          0,
          creek.get("context").get_width(),
          creek.get("context").get_height()
        );
      },
      update: () => {}
    },
    player
  ];

  await creek.get("resources").init(creek, Resources);

  creek.init([player]);
  creek.run();
  creek.get("data").set("player", player);
  creek.get("data").set("entity_list", entities);
};
