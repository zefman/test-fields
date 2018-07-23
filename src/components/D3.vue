<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import * as d3 from 'd3'
import * as topojson from 'topojson'
import axios from 'axios'
import { Noise } from 'noisejs'
import Victor from 'victor'
import { Particle } from '@/ParticleD3'

const noise = new Noise(Math.random())
const particles = []

export default {
  name: 'MapBox',
  data () {
    return {
      canvas: null,
      ctx: null,
      width: 0,
      height: 0,
      scale: 3,
      cols: 0,
      rows: 0,
      field: [],
      numParticles: 100,
      time: 0,
      map: null
    }
  },
  mounted () {
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width = window.innerWidth
    this.height = this.canvas.height = window.innerHeight
    this.setColRows(this.scale, this.width, this.height)
    this.createParticles()
    this.generateField(0)
    console.log(d3)
    const projection = d3.geoOrthographic()
    // const projection = d3.geoMercator()
      .scale(this.height / 2.1)
      .translate([this.width / 2, this.height / 2])
      .clipAngle(90)
      .precision(0.5)

    const graticule = d3.geoGraticule()

    const path = d3.geoPath()
      .projection(projection)
      .pointRadius(function (d) { return 1 })
      .context(this.ctx)

    const speed = 1e-2
    const start = Date.now()

    const sphere = {type: 'Sphere'}

    axios.get('/world-110m.json')
      .then(res => {
        console.log(res)
        const topo = res.data

        const land = topojson.feature(topo, topo.objects.land)
        const borders = topojson.mesh(topo, topo.objects.countries, function (a, b) { return a !== b })
        const grid = graticule()

        d3.timer(() => {
          this.draw()
          projection.rotate([speed * (Date.now() - start), -15])

          this.ctx.clearRect(0, 0, this.width, this.height)

          this.ctx.beginPath()
          path(sphere)
          this.ctx.lineWidth = 3
          this.ctx.strokeStyle = '#000'
          this.ctx.stroke()

          this.ctx.beginPath()
          path(sphere)
          this.ctx.fillStyle = '#fff'
          this.ctx.fill()

          this.ctx.beginPath()
          path(land)
          this.ctx.fillStyle = '#222'
          this.ctx.fill()

          this.ctx.beginPath()
          path(borders)
          this.ctx.lineWidth = 0.5
          this.ctx.strokeStyle = '#fff'
          this.ctx.stroke()

          this.ctx.beginPath()
          path(grid)
          this.ctx.lineWidth = 0.5
          this.ctx.strokeStyle = 'rgba(119,119,119,.5)'
          this.ctx.stroke()

          // particles.forEach((particle) => {
          //   // const [x, y] = projection([particle.pos.x, particle.pos.y])
          //   this.ctx.beginPath()
          //   path({
          //     type: 'Point',
          //     coordinates: [
          //       particle.pos.x,
          //       particle.pos.y
          //     ]
          //   })
          //   // this.ctx.arc(x, y, 2, 0, 2 * Math.PI)
          //   this.ctx.fill()
          // })

          this.field.forEach((field, index) => {
            const end = new Victor(field.pos.x, field.pos.y).add(field.angleVector)
            this.ctx.beginPath()
            path({
              type: 'LineString',
              coordinates: [
                [field.pos.x, field.pos.y],
                [end.x, end.y]
              ]
            })
            this.ctx.stroke()
          })
        })
      })

    // this.animate()
  },
  methods: {
    setColRows (scale, width, height) {
      this.cols = Math.floor(360 / scale)
      this.rows = Math.floor(180 / scale)
    },
    generateField (time) {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          const index = (x + y * this.cols)
          const xOffset = -180 + Math.floor(x * this.scale)
          const yOffset = -90 + Math.floor(y * this.scale)
          const pos = new Victor(xOffset, yOffset)

          const angle = noise.simplex3(x / this.scale, y / this.scale, this.time) * 360
          // const speed = Math.abs(noise.simplex3(x / this.scale, y / this.scale, this.time)) * this.scale
          // const angleVector = new Victor(speed, speed)
          const angleVector = new Victor(this.scale, this.scale)
          angleVector.rotateByDeg(angle)

          this.field[index] = {
            pos,
            angleVector
          }
        }
      }
    },
    draw () {
      particles.forEach((particle) => {
        particle.follow(this.field)
        particle.update()
        // particle.show(this.ctx)
      })
    },
    animate () {
      this.time += 0.001
      this.ctx.clearRect(0, 0, this.width, this.height)
      // this.ctx.fillRect(0, 0, this.width, this.height)
      // this.generateField(this.time)
      this.draw()
      requestAnimationFrame(this.animate.bind(this))
    },
    createParticles () {
      for (let i = 0; i < this.numParticles; i++) {
        particles.push(new Particle(this.width, this.height, this.scale, this.rows, this.cols))
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
