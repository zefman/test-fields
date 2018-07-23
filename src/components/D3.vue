<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import * as d3 from 'd3'
import * as  topojson from 'topojson'
import axios from 'axios'
import { Noise } from 'noisejs'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import Victor from 'victor'
import { Particle } from '@/Particle'

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
      numParticles: 600,
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
    console.log(d3);
    const projection = d3.geoOrthographic()
      .scale(this.height / 2.1)
      .translate([this.width / 2, this.height / 2])
      .clipAngle(90)
      .precision(.5);

    const graticule = d3.geoGraticule();

    const path = d3.geoPath()
      .projection(projection)
      .context(this.ctx);

    var speed = 1e-2,
    start = Date.now();

    var sphere = {type: "Sphere"};

    axios.get('/world-110m.json')
      .then(res => {
        console.log(res)
        const topo = res.data

        var land = topojson.feature(topo, topo.objects.land),
          borders = topojson.mesh(topo, topo.objects.countries, function(a, b) { return a !== b; }),
          grid = graticule();

        d3.timer(() => {
          projection.rotate([speed * (Date.now() - start), -15]);

          this.ctx.clearRect(0, 0, this.width, this.height);

          this.ctx.beginPath();
          path(sphere);
          this.ctx.lineWidth = 3;
          this.ctx.strokeStyle = "#000";
          this.ctx.stroke();

          this.ctx.beginPath();
          path(sphere);
          this.ctx.fillStyle = "#fff";
          this.ctx.fill();

          this.ctx.beginPath();
          path(land);
          this.ctx.fillStyle = "#222";
          this.ctx.fill();

          this.ctx.beginPath();
          path(borders);
          this.ctx.lineWidth = .5;
          this.ctx.strokeStyle = "#fff";
          this.ctx.stroke();

          this.ctx.beginPath();
          path(grid);
          this.ctx.lineWidth = .5;
          this.ctx.strokeStyle = "rgba(119,119,119,.5)";
          this.ctx.stroke();
        });
      })

    // this.animate()
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
      particles.forEach((particle) => {
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
