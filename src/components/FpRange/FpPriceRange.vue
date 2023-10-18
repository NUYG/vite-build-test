<template>
  <div id="app">
    <div class='range-slider'>
      <input type="range" min="0" :max="sliderMax" step="1" v-model="sliderMin">
      <input type="number" min="0" max="180" step="1" v-model="sliderMin">
      <input type="range" :min="sliderMin" max="180" step="1" v-model="sliderMax" :class="{ 'slider-max': sliderMax <= sliderMin }">
      <input type="number" min="0" max="180" step="1" v-model="sliderMax">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      minAngle: 10,
      maxAngle: 30,
      sliderMin: 10,
      sliderMax: 30
    };
  },
  watch: {
    sliderMin(newVal) {
      if (newVal > this.sliderMax) {
        this.sliderMin = this.sliderMax;
      }
      this.minAngle = newVal;
    },
    sliderMax(newVal) {
      if (newVal < this.sliderMin) {
        this.sliderMax = this.sliderMin;
      }
      this.maxAngle = newVal;
    }
  }
};
</script>



<style scoped>
.range-slider {
  width: 300px;
  margin: auto;
  text-align: center;
  position: relative;
  height: 6em;
}

.range-slider input[type=range] {
  position: absolute;
  left: 0;
  bottom: 0;
}

input[type=number] {
  border: 1px solid #ddd;
  text-align: center;
  font-size: 1.6em;
  -moz-appearance: textfield;
}

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type=number]:invalid,
input[type=number]:out-of-range {
  border: 2px solid #ff6347;
}

input[type=range] {
  -webkit-appearance: none;
  width: 100%;
}

input[type=range]:focus {
  outline: none;
}

input[type=range]:focus::-webkit-slider-runnable-track {
  background: #2497e3;
}

input[type=range]:focus::-ms-fill-lower {
  background: #2497e3;
}

input[type=range]:focus::-ms-fill-upper {
  background: #2497e3;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  background: #2497e3;
  border-radius: 1px;
  box-shadow: none;
  border: 0;
}

input[type=range]::-webkit-slider-thumb {
  z-index: 2;
  position: relative;
  box-shadow: 0 0 0 #000;
  border: 1px solid #2497e3;
  height: 18px;
  width: 18px;
  border-radius: 25px;
  background: #a1d0ff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7px;
}
input[type=range]::-webkit-slider-thumb {
  pointer-events: none;
}

input[type=range].slider-max::-webkit-slider-thumb {
  pointer-events: auto;
}
</style>
