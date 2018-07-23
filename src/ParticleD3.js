import Victor from 'victor'

export class Particle {
  constructor (width, height, scale, rows, cols) {
    this.startingPos = new Victor(this.randomBetween(-180, 180), this.randomBetween(-90, 90))
    this.pos = this.startingPos.clone()
    this.vel = new Victor(0, 0)
    this.acc = new Victor(0, 0)
    this.maxspeed = 1
    this.maxLife = 80
    this.life = Math.floor(Math.random() * this.maxLife)
    this.prevPos = [{ x: this.pos.x, y: this.pos.y }]
    this.scl = scale
    this.cols = cols
    this.rows = rows
    this.height = height
    this.width = width
    this.forceIndex = 0
  }

  update () {
    this.vel.multiply(new Victor(0.5, 0.5))
    this.vel.add(this.acc)
    this.limit(this.vel, this.maxspeed)
    // // console.log(this.acc);
    this.pos.add(this.vel)
    this.acc.multiply(new Victor(0, 0))

    this.life++

    if (this.life > this.maxLife) {
      this.life = 0
      this.prevPos = []
      this.pos = this.startingPos.clone()
      this.updatePrev()
    }
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
    const halfLife = this.maxLife / 2
    const alpha = 1 - Math.abs(this.life - halfLife) / halfLife
    ctx.strokeStyle = `rgba(0,0,0, ${alpha})`
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(this.prevPos[0].x, this.prevPos[0].y)
    ctx.lineTo(this.pos.x, this.pos.y)
    ctx.stroke()

    // ctx.beginPath()
    // ctx.arc(this.pos.x, this.pos.y, 2, 0, 2 * Math.PI)
    // // ctx.fill()
    // ctx.stroke()
    this.updatePrev()
    this.edges()
  }

  updatePrev () {
    // this.prevPos.x = this.pos.x
    // this.prevPos.y = this.pos.y
    this.prevPos.unshift({ x: this.pos.x, y: this.pos.y })
    if (this.prevPos.length > 10) this.prevPos.length = 10
  }

  edges () {
    if (this.pos.x > 180) {
      this.pos.x = -180
      this.prevPos = []
      this.updatePrev()
    }
    if (this.pos.x < -180) {
      this.pos.x = 180
      this.prevPos = []
      this.updatePrev()
    }
    if (this.pos.y > 90) {
      this.pos.y = -90
      this.prevPos = []
      this.updatePrev()
    }
    if (this.pos.y < -90) {
      this.pos.y = 90
      this.prevPos = []
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

  randomBetween (min, max) {
    return Math.random() * (max - min) + min
  }
}
