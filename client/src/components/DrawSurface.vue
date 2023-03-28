<template>
  <div class="flex-container">
    <canvas 
      width="800" 
      height="300" 
      id="canvas" 
      @touchstart="beginDrawing" 
      @touchend="stopDrawing" 
      @touchmove="keepDrawing" 
      @mousedown="beginDrawing" 
      @mouseup="stopDrawing" 
      @mousemove="keepDrawing"
    ></canvas>
  </div>
  <div class="flex-container btn-container">
    <button @click="textToSpeech">Audio</button>
    <button @click="fetchNewPhrase">New Phrase</button>
    <button @click="checkAnswer">Check Answer</button>
    <button @click="clearCanvas">Clear</button>
  </div>
  <div v-if="showAnswer" class="flex-container answer-container">
    Correct Answer: {{ phrase.text }}
    Translation: {{ phrase.translation }}
    Your Answer: {{ userAnswer }}
  </div>
</template>

<script>
import { Buffer } from 'buffer';

export default {
  name: 'DrawSurface',
  data() {
    return {
      canvas: null,
      x: 0,
      y: 0,
      isDrawing: false,
      phrase: null,
      showAnswer: false,
      userAnswer: null
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
      this.canvas.clearRect(0,0, 800, 300);
      this.userAnswer = null;
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
        const url = 'api/test';
        const data = new FormData();
        data.append('fileName', 'test');
        data.append('testImage', blob);

        const response = await fetch(url, {
          method: "POST",
          body: data
        });
        const json = await response.json();
        const answer = json.answer;
        this.userAnswer = answer;
        this.showAnswer = true;

        return answer;
      } catch(err) {
        console.log(err);
      }
    },
    async fetchNewPhrase() {
      try {
        const url = 'api/phrase';
        const response = await fetch(url, { method: "GET" });

        const json = await response.json();
        this.clearCanvas();
        this.showAnswer = false;
        return json;
      } catch(err) {
        console.log(err);
      }
    },
    async textToSpeech() {
      const synth = window.speechSynthesis;
      const utterThis = new SpeechSynthesisUtterance(this.phrase.text);
      utterThis.default = true;
      utterThis.lang = "ko-KR";
      utterThis.rate = 0.7;
      synth.speak(utterThis);
    }
  },
  async mounted() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");    
    this.canvas = ctx;

    const response = await this.fetchNewPhrase();
    this.phrase = response.phraseResponse;
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
}

.btn-container {
  padding-top: 40px;
}

.answer-container {
  padding-top: 40px;
  color: white;
}

#canvas {
  background-color: green;
}
</style>