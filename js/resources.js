"use strict";

class CreekImage {
  constructor(
    id,
    width,
    height,
    url,
    source_x,
    source_y,
    source_width,
    source_height
  ) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.url = url || `resources/images/${id}.png`;
    this.source_x = source_x || 0;
    this.source_y = source_y || 0;
    this.source_width = source_width || width;
    this.source_height = source_height || height;
  }

  get() {
    return {
      type: "image",
      url: this.url,
      id: this.id,
      source_x: this.source_x,
      source_y: this.source_y,
      source_width: this.source_width,
      source_height: this.source_height,
      width: this.width,
      height: this.height
    };
  }
}

class CreekSound {
  constructor(id, url, muted, volume, looping) {
    url = url || `resources/sounds/${id}.wav`;
    muted = muted || false;
    volume = volume || 0.6;
    looping = looping || false;

    this.id = id;
    this.url = url;
    this.muted = muted;
    this.volume = volume;
    this.looping = looping;
  }

  get() {
    return {
      type: "sound",
      url: this.url,
      id: this.id,
      muted: this.muted,
      volume: this.volume,
      looping: this.looping
    };
  }
}

const Resources = [
  new CreekSound("pickup").get(),
  new CreekSound("pickup_c").get(),
  new CreekSound("pickup_c_sharp").get(),
  new CreekSound("pickup_d").get(),
  new CreekSound("pickup_e_flat").get(),
  new CreekSound("pickup_e").get(),
  new CreekSound("pickup_f").get(),
  new CreekSound("pickup_f_sharp").get(),
  new CreekSound("pickup_g").get(),
  new CreekSound("pickup_g_sharp").get(),
  new CreekSound("pickup_a").get(),
  new CreekSound("pickup_b_flat").get(),
  new CreekSound("pickup_b").get(),
  new CreekSound("pickup_c_2").get(),
  new CreekSound("pickup_c_sharp_2").get(),
  new CreekSound("pickup_d_2").get(),
  new CreekSound("pickup_e_flat_2").get(),
  new CreekSound("pickup_e_2").get(),
  new CreekSound("pickup_f_2").get(),
  new CreekSound("pickup_success_c_2").get(),
  new CreekSound("pickup_success_f_2").get(),
  new CreekSound("level").get(),
  new CreekSound("bwuh").get(),
  new CreekSound("bwuh_2").get(),
  new CreekSound("bwuh_low").get(),
  new CreekSound("slash").get(),
  new CreekSound(
    "cave_hopping",
    "resources/sounds/cave_hopping_longer.mp3",
    false,
    0.6,
    false
  ).get(),
  new CreekImage(
    "player",
    32,
    32,
    "resources/images/16_16_ship_collection.png",
    379,
    203,
    14,
    14
  ).get(),
  new CreekImage("reticle_black", 32, 32).get(),
  new CreekImage("reticle_red", 32, 32).get(),
  new CreekImage("reticle_green", 32, 32).get()
];

export default Resources;
