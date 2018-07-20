import Victor from 'victor'

export class Particle {
  constructor (width, height, scale, rows, cols) {
    this.pos = new Victor(Math.random() * width, Math.random() * height)
    this.vel = new Victor(0, 0)
    this.acc = new Victor(0, 0)
    console.log(this.acc)
    this.maxspeed = 4
    this.h = 0
    this.prevPos = new Victor(0, 0).copy(this.pos)
    this.scl = scale
    this.cols = cols
    this.rows = rows
  }

  update () {
    this.vel.add(this.acc)
    this.vel.limit(this.maxspeed)
    // // console.log(this.acc);
    this.pos.add(this.vel)
    this.acc.multiply(new Victor(0, 0))
  }

  follow (vectors) {
    var x = Math.floor(this.pos.x / this.scl)
    var y = Math.floor(this.pos.y / this.scl)
    var index = x + y * this.cols
    var force = vectors[index]
    console.log(index)
    if (force) {
      this.applyForce(force)
    }
  }

  applyForce (force) {
    this.acc.add(force)
  }

//   this.show = function() {
//     stroke(this.h, 255, 255, 25);
//     this.h = this.h + 1;
//     if (this.h > 255) {
//       this.h = 0;
//     }
//     strokeWeight(1);
//     line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
//     this.updatePrev();
//   }

  // updatePrev() {
  //     this.prevPos.x = this.pos.x;
  //     this.prevPos.y = this.pos.y;
  // }

  // edges() {
  //     if (this.pos.x > width) {
  //     this.pos.x = 0;
  //     this.updatePrev();
  //     }
  //     if (this.pos.x < 0) {
  //     this.pos.x = width;
  //     this.updatePrev();
  //     }
  //     if (this.pos.y > height) {
  //     this.pos.y = 0;
  //     this.updatePrev();
  //     }
  //     if (this.pos.y < 0) {
  //     this.pos.y = height;
  //     this.updatePrev();
  //     }

  // }
}
