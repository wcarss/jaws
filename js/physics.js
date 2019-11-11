class Physics {
  constructor() {}

  init(creek) {
    this.creek = creek;
    console.log("PhysicsManager init.");
  }

  to_rect(entity) {
    return {
      left: entity.x,
      width: entity.x_size,
      right: entity.x + entity.x_size,
      top: entity.y,
      bottom: entity.y + entity.y_size,
      height: entity.y_size,
      mid_x: entity.x + entity.x_size / 2,
      mid_y: entity.y + entity.y_size / 2,
      collide_distance: Math.max(entity.x_size / 2, entity.y_size / 2)
    };
  }

  distance(rect_one, rect_two, debug) {
    let x_distance = Math.abs(rect_one.mid_x - rect_two.mid_x),
      y_distance = Math.abs(rect_one.mid_y - rect_two.mid_y),
      hypotenuse = Math.sqrt(x_distance * x_distance + y_distance * y_distance);

    return hypotenuse;
  }

  aabb_collide(entity_one, entity_two, debug) {
    let a = this.to_rect(entity_one);
    let b = this.to_rect(entity_two);
    let d1x = a.left - b.right;
    let d1y = a.top - b.bottom;
    let d2x = b.left - a.right;
    let d2y = b.top - a.bottom;
    let ret = null;

    if (debug) {
      console.log("entity one, a: " + JSON.stringify(a));
      console.log("entity two, b: " + JSON.stringify(b));
      console.log(
        "d1x, d2x, d1y, d2y: " + d1x + ", " + d2x + ", " + d1y + ", " + d2y
      );
    }

    if (d1x > 0 || d1y > 0 || d2x > 0 || d2y > 0) {
      ret = false;
    } else {
      ret = true;
    }

    if (debug) {
      console.log("aabb_collide returningLKJLJLKJ " + ret);
    }

    return ret;
  }

  collide(entity_one, entity_two, debug) {
    let rect_one = this.to_rect(entity_one),
      rect_two = this.to_rect(entity_two),
      rect_distance = this.distance(rect_one, rect_two, debug),
      collision = null;

    if (debug) {
      console.log(
        "distance to collide: " +
          rect_one.collide_distance +
          rect_two.collide_distance
      );
      console.log("distance is " + rect_distance);
    }

    return (
      rect_distance <= rect_one.collide_distance + rect_two.collide_distance
    );
  }

  parallel_line_intersect(one_low, one_high, two_low, two_high) {
    /* I'm really reinventing the wheel here!
     *
     * For the purpose of these diagrams, lower absolute value
     * (not magnitude) is on the left, higher is on the right.
     *
     * e.g.:
     *
     *   low --------- high
     *
     * Return codes are as follows:
     *
     * "below": one does not intersect two, and is below it
     *
     *   |--one--|  |--two--|
     *
     * "above": one does not intersect two, and is above it
     *
     *   |--two--|  |--one--|
     *
     * "low": one intersects only the lower bound of two
     *
     *   |--one--|
     *       |--two--|
     *
     *   or
     *
     *   |--one--|
     *           |--two--|
     *
     *   or
     *
     *   |--one--|
     *   |---two---|
     *
     * "middle": one intersects two, but not either bound of two,
     *           one is "contained within" two
     *
     *    |--one--|
     *   |---two---|
     *
     *   or
     *
     * "equal": one and two are equivalent
     *
     *   |--one--|
     *   |--two--|
     *
     * "high": one intersects only the higher bound of two
     *
     *       |--one--|
     *   |--two--|
     *
     *   or
     *
     *   |--two--|
     *           |--one--|
     *
     *   or
     *
     *     |--one--|
     *   |---two---|
     *
     * "whole": one intersects both bounds of two,
     *          one "contains" two
     *
     *   |---one---|
     *    |--two--|
     *
     *   or
     *
     *   |---one---|
     *   |--two--|
     *
     *   or
     *
     *   |---one---|
     *     |--two--|
     *
     * error: NaN or undefined values, and/or
     *        low > high for one and/or
     *        low > high for two
     *
     */

    if (one_high < two_low) {
      return "below";
    }

    if (one_low > two_high) {
      return "above";
    }

    if (one_low === two_low && one_high === two_high) {
      return "equal";
    }

    if (one_low <= two_low && one_high < two_high && one_high > two_low) {
      // not assuming one_high >= two_low in case conditions order is shuffled
      return "low";
    }

    if (one_low > two_low && one_high < two_high) {
      return "middle";
    }

    if (one_low > two_low && one_high >= two_high && one_low < two_high) {
      // not assuming one_low <= two_high in case conditions order is shuffled
      return "high";
    }

    if (
      one_low <= two_low &&
      one_high >= two_high &&
      !(one_low === two_low && one_high === two_high)
    ) {
      // not assuming one_low !(one_low === two_low && one_high === two_high)
      // in case conditions order is shuffled
      return "whole";
    }

    return "error";
  }

  directional_collide(one, two, options) {
    options = options || {};

    let x_intersect = this.parallel_line_intersect(
        one.x,
        one.x + one.x_size,
        two.x,
        two.x + two.x_size
      ),
      y_intersect = this.parallel_line_intersect(
        one.y,
        one.y + one.y_size,
        two.y,
        two.y + two.y_size
      ),
      _top = y_intersect === "low",
      bottom = y_intersect === "high",
      left = x_intersect === "low",
      right = x_intersect === "high",
      x_center =
        x_intersect === "middle" ||
        x_intersect === "whole" ||
        x_intersect === "equal",
      y_center =
        y_intersect === "middle" ||
        y_intersect === "whole" ||
        y_intersect === "equal",
      x_collision = left || right || x_center,
      y_collision = _top || bottom || y_center,
      happening = x_collision && y_collision;

    // by default, this returns null if no actual collision
    if (!(happening || options.return_non_collisions)) {
      return null;
    }

    return {
      top: _top,
      bottom: bottom,
      left: left,
      right: right,
      x_center: x_center,
      y_center: y_center,
      center: x_center || y_center,
      x_collision: x_collision,
      y_collision: y_collision,
      happening: x_collision && y_collision
    };
  }
}

export default Physics;
