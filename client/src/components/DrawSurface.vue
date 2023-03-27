<template>
  <div class="draw-surface-container">
    <div>Draw Inside the green box</div>
    <canvas width="300" height="300" id="canvas" @mousedown="beginDrawing" @mouseup="stopDrawing" @mousemove="keepDrawing"></canvas>
    <button @click="checkAnswer">Check Answer</button>
    <button @click="clearCanvas">Clear</button>
  </div>
</template>

<script>
import { Buffer } from 'buffer';

export default {
  name: 'DrawSurface',
  data() {
    return {
      worker: null,
      canvas: null,
      x: 0,
      y: 0,
      isDrawing: false,
      client: null
    }
  },
  methods: {
    drawLine(x1, y1, x2, y2) {
      let ctx = this.canvas;
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    },
    beginDrawing(e) {
      this.x = e.offsetX;
      this.y = e.offsetY;
      this.isDrawing = true;
    },
    stopDrawing(e) {
      if(this.isDrawing === true) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = 0;
        this.y = 0;
        this.isDrawing = false;
      }
    },
    keepDrawing(e) {
      if(this.isDrawing === true) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = e.offsetX;
        this.y = e.offsetY;
      }
    },
    draw(e) {
      this.canvas.beginPath();
      this.canvas.lineWidth = 5;
      this.canvas.lineCap = 'round';
      this.canvas.strokeStyle = '#c0392b';
      this.canvas.moveTo(this.pos.x, this.pos.y); // from
      this.setPosition(e);
      this.canvas.lineTo(this.pos.x, this.pos.y); // to
      this.canvas.stroke(); 
    },
    clearCanvas() {
      this.canvas.clearRect(0,0, 300, 300);
    },
    dataURItoBlob(dataURI) {
      const data = dataURI.split(',')[1]; 
      const byteString = Buffer.from(data, "base64");

      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      const blob = new Blob([byteString], { type: mimeString  });
      return blob;
    },
    async checkAnswer() {
      const canvas = document.getElementById("canvas");
      const dataURL = canvas.toDataURL();
      const blob = this.dataURItoBlob(dataURL);

      try {
        const url = 'http://localhost:8000/api/test';
        const data = new FormData();
        data.append('fileName', 'test');
        data.append('testImage', blob);

        const response = await fetch(url, {
          method: "POST",
          body: data
        });

        return response.json();
      } catch(err) {
        console.log(err);
      }
    }
  },
  async mounted() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");    
    this.canvas = ctx;
  }
}
</script>

<style scoped>
.draw-surface-container {
  width: 400px;
  height: 400px;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
}

#canvas {
  background-color: green;
  height: 300px;
  width: 300px;
  margin-left: 50px;
  margin-top: 50px;
}
</style>