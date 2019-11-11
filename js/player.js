import Palettes from "./palettes.js";

class Player {
  constructor(x, y, x_size, y_size, color, palette) {
    this.x = x;
    this.y = y;
    this.x_size = x_size;
    this.y_size = y_size;
    this.color = color;
    this.layer = 2;
    this.previous = [];
    this.previous_check = {};
    this.palette = palette;
    this.max_health = 5;
    this.health = this.max_health;
  }

  init(creek) {
    this.creek = creek;
    creek.get("utilities").setup_throttle("player_attack", 300);
    creek.get("utilities").setup_throttle("player_move", 90);
  }

  get_key(x, y) {
    return `${x}-${y}`;
  }

  draw(context, interpolation) {
    let size = null;
    let x = null;
    let y = null;
    let ticks = this.creek.get("time").ticks;
    let prev = null;

    let player = this.creek.get("resources").get_image("player");
    context.fillStyle = "red";
    context.fillRect(
      this.x * this.x_size,
      this.y * this.y_size,
      this.x_size,
      6
    );
    context.fillStyle = "#00ff00";
    context.fillRect(
      this.x * this.x_size,
      this.y * this.y_size,
      this.x_size * (this.health / this.max_health),
      6
    );
    context.drawImage(
      player.img,
      this.x * this.x_size,
      this.y * this.y_size,
      this.x_size,
      this.y_size
    );
  }

  update(creek) {
    const time = creek.get("time");
    const controls = creek.get("controls");
    const utilities = creek.get("utilities");

    let new_x = this.x;
    let new_y = this.y;
    let move_distance = 1;
    let vdir = null;
    let hdir = null;
    let prev_check = null;

    if (this.health < 1) {
      console.log("player lost!");
      creek.get("data").set("game_running", false);
    }

    if (
      controls.check_key("Space") &&
      utilities.use_throttle("player_attack")
    ) {
      creek.get("audio").play("slash");
    }

    if (controls.check_key("ArrowUp")) {
      vdir = "n";
    } else if (controls.check_key("ArrowDown")) {
      vdir = "s";
    }

    if (controls.check_key("ArrowLeft")) {
      hdir = "w";
    } else if (controls.check_key("ArrowRight")) {
      hdir = "e";
    }

    if (navigator.maxTouchPoints !== 0) {
      let mouse = controls.get_mouse();
      let context = creek.get("context");
      let width = context.get_width();
      let height = context.get_height();
      let third_x = width / 3;
      let third_y = height / 3;
      let top_third_x = width - third_x;
      let top_third_y = height - third_y;

      if (!mouse.pressed) {
        return;
      }

      if (mouse.x < third_x) {
        hdir = "w";
      } else if (mouse.x > top_third_x) {
        hdir = "e";
      }

      if (mouse.y < third_y) {
        vdir = "n";
      } else if (mouse.y > top_third_y) {
        vdir = "s";
      }
    }

    if (vdir === null && hdir === null) {
      return;
    }

    if (hdir === "w") {
      new_x = this.x - move_distance;
    } else if (hdir === "e") {
      new_x = this.x + move_distance;
    }

    if (vdir === "n") {
      new_y = this.y - move_distance;
    } else if (vdir === "s") {
      new_y = this.y + move_distance;
    }

    this.last_vdir = vdir;
    this.last_hdir = hdir;
    this.last_x = this.x;
    this.last_y = this.y;
    this.x = new_x;
    this.y = new_y;

    this.moved_at = time.ticks;
  }
}

export default Player;
