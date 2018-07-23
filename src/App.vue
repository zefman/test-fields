<template>
  <div id="app">
    <!-- <canvas class="wind-layer" ref="canvas"></canvas> -->
  </div>
</template>

<script>
import { Noise } from 'noisejs'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import Victor from 'victor'
import { Particle } from './Particle'

mapboxgl.accessToken = 'pk.eyJ1Ijoiam96ZWYtc3RyYXR1bSIsImEiOiJjamp5MGtpZHExNXg2M3dwYTB2OXJkN2N5In0.P20sd8p6-eKDGJEHJwF8OQ';

const noise = new Noise(Math.random())

export default {
  name: 'app',
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
      numParticles: 600,
      particles: [],
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
      style: 'mapbox://styles/jozef-stratum/cjjy0upkm4w4a2rqyy2cwkrnz',
    });

    this.map.on('load', () => {
      console.log('Loaded map')
      const bounds = this.map.getBounds();
      const nw = bounds.getNorthWest();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const se = bounds.getSouthEast();

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
      });

      this.map.addLayer({
        id: 'canvas',
        source: 'some id',
        type: 'raster',
      })
    });
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
          // const speed = Math.abs(noise.simplex3(x / this.scale, y / this.scale, this.time)) * this.scale
          // const angleVector = new Victor(0, speed)
          const angleVector = new Victor(0, this.scale)
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
      // this.ctx.fillStyle = "rgba(255, 255, 255, 1)"
      this.particles.forEach((particle) => {
        particle.follow(this.field)
        particle.update()
        particle.show(this.ctx)
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
        this.particles.push(new Particle(this.width, this.height, this.scale, this.rows, this.cols))
      }
    }
  }
}
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
}

#app {
  min-height: 100%;
}

.wind-layer {
  height: 100%;
  width: 100%;
  display: none;
  background: transparent;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  /* z-index: 100; */
  pointer-events: none;
}
</style>
