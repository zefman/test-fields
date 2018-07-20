<template>
  <div id="app">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { Noise } from 'noisejs';
import Victor from 'victor';
import { Particle } from './Particle';

const noise = new Noise(Math.random());

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      width: 0,
      height: 0,
      scale: 20,
      cols: 0,
      rows: 0,
      field: [],
      particles: [],
      time: 0,
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.setColRows(this.scale, this.width, this.height);
    this.createParticles();
    this.animate();
  },
  methods: {
    setColRows(scale, width, height) {
      this.cols = Math.floor(width / scale);
      this.rows = Math.floor(height / scale);
    },
    generateField(time) {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          const index = (x + y * this.width);
          const xOffset = Math.floor( x * this.scale );
          const yOffset =Math.floor( y * this.scale );

          const angle = Math.abs( noise.simplex3(x / this.scale, y / this.scale, this.time) ) * 360;
          const speed = Math.abs( noise.simplex3(x / this.scale, y / this.scale, this.time) ) * this.scale;
          const angleVector = new Victor(0, speed);
          angleVector.rotateByDeg(angle);
          
          this.field[index] = angleVector;
        }
      }
    },
    draw() {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          const index = (x + y * this.width);
          const angleVector = this.field[index];

          const xOffset = Math.floor( x * this.scale );
          const yOffset = Math.floor( y * this.scale );
         
          const currentPos = new Victor(xOffset, yOffset);
          currentPos.add(angleVector);

          this.ctx.beginPath();
          this.ctx.moveTo(xOffset, yOffset);
          this.ctx.lineTo(currentPos.x, currentPos.y);
          this.ctx.stroke();
        }
      }

      this.particles.forEach((particle) => {
        particle.follow(this.field);
        particle.update();
        this.ctx.fillRect(particle.pos.x, particle.pos.y,5,5);
      });
    },
    animate() {
      this.time += 0.01;
      this.ctx.clearRect(0,0,this.width,this.height);
      this.generateField(this.time);
      this.draw();
      requestAnimationFrame(this.animate.bind(this));
    },
    createParticles() {
      for (let i = 0; i < 2; i++) {
        this.particles.push(new Particle(this.width, this.height, this.scale, this.cols, this.rows))
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

canvas {
  height: 100%;
  width: 100%;
}
</style>
