<template>
  <div class="hello">
  </div>
</template>

<script>
import { Noise } from 'noisejs'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import Victor from 'victor'
import { Particle } from '@/Particle'

mapboxgl.accessToken = 'pk.eyJ1Ijoiam96ZWYtc3RyYXR1bSIsImEiOiJjamp5MGtpZHExNXg2M3dwYTB2OXJkN2N5In0.P20sd8p6-eKDGJEHJwF8OQ'

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
      scale: 40,
      cols: 0,
      rows: 0,
      field: [],
      numParticles: 1000,
      time: 0,
      map: null
    }
  },
  mounted () {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width = window.innerWidth
    this.height = this.canvas.height = window.innerHeight
    this.setColRows(this.scale, this.width, this.height)
    this.createParticles()
    this.generateField(0)
    this.animate()

    this.map = new mapboxgl.Map({
      container: 'app',
      style: 'mapbox://styles/jozef-stratum/cjjy0upkm4w4a2rqyy2cwkrnz'
      // style: 'mapbox://styles/jozef-stratum/cjjy6fkr67qfr2rmxbcnzhvwv'
    })

    this.map.on('load', () => {
      console.log('Loaded map')
      this.map.setPitch(30);
      this.map.setZoom(4);
      const bounds = this.map.getBounds()
      const nw = bounds.getNorthWest()
      const ne = bounds.getNorthEast()
      const sw = bounds.getSouthWest()
      const se = bounds.getSouthEast()
      

      this.map.addSource('some id', {
        type: 'canvas',
        canvas: this.canvas,
        animate: true,
        coordinates: [
          [nw.lng, nw.lat],
          [ne.lng, nw.lat],
          [ne.lng, sw.lat],
          [nw.lng, sw.lat]
        ]
      })

      this.map.addLayer({
        id: 'canvas',
        source: 'some id',
        type: 'raster',
      })
    })
  },
  methods: {
    setColRows (scale, width, height) {
      this.cols = Math.floor(width / scale)
      this.rows = Math.floor(height / scale)
    },
    generateField (time) {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          const index = (x + y * this.cols)
          const xOffset = Math.floor(x * this.scale)
          const yOffset = Math.floor(y * this.scale)

          const angle = noise.simplex3(x / this.scale, y / this.scale, this.time) * 360
          const speed = Math.abs(noise.simplex3(x / this.scale, y / this.scale, this.time)) * this.scale
          // const angleVector = new Victor(0, speed)
          const angleVector = new Victor(0, speed)
          angleVector.rotateByDeg(angle)

          this.field[index] = angleVector
        }
      }
    },
    draw () {
      // for (let y = 0; y < this.rows; y++) {
      //   for (let x = 0; x < this.cols; x++) {
      //     const index = (x + y * this.cols)
      //     const angleVector = this.field[index]

      //     const xOffset = Math.floor(x * this.scale)
      //     const yOffset = Math.floor(y * this.scale)

      //     const currentPos = new Victor(xOffset, yOffset)
      //     currentPos.add(angleVector)

      //     this.ctx.beginPath()
      //     this.ctx.moveTo(xOffset, yOffset)
      //     this.ctx.lineTo(currentPos.x, currentPos.y)
      //     this.ctx.stroke()
      //     this.ctx.fillRect(currentPos.x, currentPos.y, 3, 3);
      //   }
      // }
      // this.ctx.strokeStyle = "rgba(255, 255, 255, 1)"
      particles.forEach((particle) => {
        particle.follow(this.field)
        particle.update()
        particle.show(this.ctx)
      })
    },
    animate () {
      this.time += 0.001

      // Fade trails
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.95)'
      var prev = this.ctx.globalCompositeOperation;
      this.ctx.globalCompositeOperation = "destination-in";
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.globalCompositeOperation = prev;

      // this.ctx.clearRect(0, 0, this.width, this.height)
      // this.ctx.fillStyle="rgba(0,0,0,0.1)"
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
