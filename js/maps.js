import Palettes from "./palettes.js";

class Star {
  constructor(creek, x, y) {
    this.creek = creek;
    this.type = "star";
    this.x = x;
    this.y = y;
    let size = 4 - Math.random() * 4;
    this.x_size = size;
    this.y_size = size;
    this.x += this.x_size;
    this.x_speed = 5 - Math.random() * 5;
    this.y_speed = 0;
    if (Math.random() > 0.6) {
      this.y_speed = Math.random() - 1;
    }
    this.color = "white";
    //this.color = `rgb(${this.color_val},${this.color_val},${this.color_val})`;
  }

  draw(context, interpolation) {
    if (this.gone) return;
    //let img = this.creek.get("resources").get_image("enemy");
    context.fillStyle = this.color;
    //context.fillRect(this.x, this.y, this.x_size, this.y_size);
    context.beginPath();
    context.arc(this.x, this.y, this.x_size / 2, 0, 360);
    context.fill();
    // context.drawImage(
    //   player.img,
    //   this.x * this.x_size,
    //   this.y * this.y_size,
    //   this.x_size,
    //   this.y_size
    // );
  }

  update(creek) {
    if (this.gone) return;
    this.x -= this.x_speed;
    this.y += this.y_speed;
    if (this.x < -(this.x_size + 10)) {
      this.gone = true;
    }
    if (this.y > this.creek.get("context").get_height() + this.y_size + 10) {
      this.gone = true;
    }
    if (this.y < -(this.y_size + 10)) {
      this.gone = true;
    }
  }
}

class Enemy {
  constructor(creek, x, y) {
    this.creek = creek;
    this.type = "asteroid";
    this.x = x;
    this.y = y;
    let size = 128 - Math.random() * 48;
    if (Math.random() > 0.98) {
      size = 768;
    }
    this.x_size = size;
    this.y_size = size;
    this.x += this.x_size;
    this.x_speed = 25 - Math.random() * 15;
    this.y_speed = 0;
    if (Math.random() > 0.4) {
      this.y_speed = Math.random() * 12 - 6;
    }
    this.color_val = Math.random() * 255;
    this.color = `rgb(${this.color_val},${this.color_val},${this.color_val})`;
  }

  draw(context, interpolation) {
    if (this.gone) return;
    //let img = this.creek.get("resources").get_image("enemy");
    context.fillStyle = this.color;
    //context.fillRect(this.x, this.y, this.x_size, this.y_size);
    context.beginPath();
    context.arc(this.x, this.y, this.x_size / 2, 0, 360);
    context.fill();
    // context.drawImage(
    //   player.img,
    //   this.x * this.x_size,
    //   this.y * this.y_size,
    //   this.x_size,
    //   this.y_size
    // );
  }

  update(creek) {
    if (this.gone) return;
    this.x -= this.x_speed;
    this.y += this.y_speed;
    if (this.creek.get("physics").collide(this, this.creek.get("player"))) {
      this.creek.get("player").health -= 1;
      this.gone = true;
      this.creek.get("audio").play("slash");
    }
    if (this.x < -(this.x_size + 10)) {
      this.gone = true;
    }
    if (this.y > this.creek.get("context").get_height() + this.y_size + 10) {
      this.gone = true;
    }
    if (this.y < -(this.y_size + 10)) {
      this.gone = true;
    }
  }
}

class Maps {
  constructor(player) {
    this.player = player;
    this.entities = [];
    this.max_star_count = 200;
    this.max_asteroid_count = 20;
  }

  init(creek) {
    this.creek = creek;
    this.max_x = this.creek.get("context").get_width();
    this.max_y = this.creek.get("context").get_height();
    const background = {
      draw: (context, interpolation) => {
        context.fillStyle = "black";
        context.fillRect(
          0,
          0,
          this.creek.get("context").get_width(),
          this.creek.get("context").get_height()
        );
      },
      update: () => {}
    };
    this.entities = [background, new Enemy(this.creek, this.max_x, 300)];
    for (let i = 0; i < this.max_star_count; i++) {
      this.entities.push(
        new Star(
          this.creek,
          this.creek.get("utilities").random_int(this.max_x + 10),
          this.creek.get("utilities").random_int(this.max_y + 10)
        )
      );
    }
    setInterval(this.update, 500);
  }

  update = () => {
    this.entities = this.entities.filter(entity => !entity.gone);
    let asteroid_count = 0;
    let star_count = 0;
    for (const entity of this.entities) {
      if (entity.type === "star") {
        star_count += 1;
      } else {
        asteroid_count += 1;
      }
    }
    if (asteroid_count < this.max_asteroid_count) {
      this.entities.push(
        new Enemy(
          this.creek,
          this.max_x + 10,
          this.creek.get("utilities").random_int(this.max_y + 10)
        )
      );
    }
    if (star_count < this.max_star_count) {
      this.entities.push(
        new Star(
          this.creek,
          this.max_x + 10,
          this.creek.get("utilities").random_int(this.max_y + 10)
        )
      );
      this.entities.push(
        new Star(
          this.creek,
          this.max_x + 10,
          this.creek.get("utilities").random_int(this.max_y + 10)
        )
      );
      this.entities.push(
        new Star(
          this.creek,
          this.max_x + 10,
          this.creek.get("utilities").random_int(this.max_y + 10)
        )
      );
    }
    //console.log(`pushed entities (${this.entities.length}): `, this.entities);
    this.creek.get("data").set("entity_list", this.get_entities());
  };

  get_key(x, y) {
    return `${x}-${y}`;
  }

  get_entities() {
    return [...this.entities, this.player];
  }
}

export default Maps;
