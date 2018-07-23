import Victor from 'victor'

export class Particle {
  constructor (width, height, scale, rows, cols) {
    this.pos = new Victor(Math.random() * width, Math.random() * height)
    this.vel = new Victor(0, 0)
    this.acc = new Victor(0, 0)
    this.maxspeed = 2
    this.h = 0
    this.prevPos = new Victor(0, 0).copy(this.pos)
    this.scl = scale
    this.cols = cols
    this.rows = rows
    this.height = height
    this.width = width
    this.forceIndex = 0
  }

  update () {
    this.vel.add(this.acc)
    this.limit(this.vel, this.maxspeed)
    // // console.log(this.acc);
    this.pos.add(this.vel)
    this.acc.multiply(new Victor(0, 0))
  }

  follow (vectors) {
    const x = Math.floor(this.pos.x / this.scl)
    const y = Math.floor(this.pos.y / this.scl)
    const index = x + y * this.cols
    const force = vectors[index]
    // window.forceIndex = index
    // console.log(force.angleDeg())
    if (force) {
      this.applyForce(force)
    }
  }

  applyForce (force) {
    this.acc.add(force)
    // this.vel = force.clone().normalize()
  }

  show (ctx) {
    // stroke(this.h, 255, 255, 25);
    // this.h = this.h + 1;
    // if (this.h > 255) {
    //   this.h = 0;
    // }
    // strokeWeight(1);
    // line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    // const currentPos = new Victor(0, 0)
    // currentPos.add(angleVector)

    // this.ctx.beginPath()
    // this.ctx.moveTo(xOffset, yOffset)
    // this.ctx.lineTo(currentPos.x, currentPos.y)
    // this.ctx.stroke()
    // this.ctx.fillRect(currentPos.x, currentPos.y, 3, 3);

    // ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(this.pos.x, this.pos.y, 0.5, 0.5)
    this.updatePrev()
    this.edges()
  }

  updatePrev () {
    this.prevPos.x = this.pos.x
    this.prevPos.y = this.pos.y
  }

  edges () {
    if (this.pos.x > this.width) {
      this.pos.x = 0
      this.updatePrev()
    }
    if (this.pos.x < 0) {
      this.pos.x = this.width
      this.updatePrev()
    }
    if (this.pos.y > this.height) {
      this.pos.y = 0
      this.updatePrev()
    }
    if (this.pos.y < 0) {
      this.pos.y = this.height
      this.updatePrev()
    }
  }

  limit (vector, max) {
    const maxVector = new Victor(max, max)
    if (vector.lengthSq() > maxVector.lengthSq()) {
      vector
        .normalize()
        .multiply(maxVector)
    }
  }
}
