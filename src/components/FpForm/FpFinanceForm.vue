<template>
  <div v-if="isVnCurrency">
    <div>
      <label v-if="label">{{ label }}</label>
      <input
          class="form-control border border-white"
          type="text"
          v-model="textValue"
          @input="handleInput"
          @keydown="handleKeyDown"
          inputmode="numeric"
      />
    </div>
    <span class="row text-content text-center">{{priceText}}</span>
    <div class="row" v-if="isEdited && textValue !== 0 && textValue !== ''">
      <div
          class="col-auto p-2 tag m-2"
          v-for="option in options"
          :key="option"
          @click="priceSugPick(suggestCurrency(textValue, Math.pow(10, option)), option)"
          v-if="!selectedOptions.includes(option)">
        {{suggestCurrency(textValue, Math.pow(10, option))}}
      </div>
    </div>
  </div>
  <div v-else>
    <FpNewCurrencyInput :def-val="price" @emit-price="onSubmitPrice" :renting="rent"></FpNewCurrencyInput>
  </div>


</template>

<script>
import FpNewCurrencyInput from "@/components/FpForm/FpNewCurrencyInput.vue";
import {
  convertCurrencyToVnd,
  Currency,
  getCurrentCurrencyName,
} from "@/models/currency";
import {uPriceFullPfx} from "@/utils/unit";

export default {
  components: { FpNewCurrencyInput},
  data() {
    return {
      textValue: 0,
      options: [5, 6, 7],
      selectedOptions: [],
      isEdited: false,
      MILLION: 1000000,
      BILLION: 1000000000,
      isVnCurrency: true
    };
  },
  props: {
    rent: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
    },
    label: {
      type: String,
    },
  },
  mounted() {
    this.setFormatPropsToTextVal(this.price)
    this.isVnCurrency = getCurrentCurrencyName() === Currency.VND
  },
  computed:{
    priceText()
    {
      if(this.textValue !== 0 && this.textValue !== '')
      {
        const price  = convertCurrencyToVnd(this.removeNonNumeric(this.textValue))
        if(parseInt(price) >= 1 && parseInt(price) < 1000)
        {
          return `${convertCurrencyToVnd(this.removeNonNumeric(this.textValue))} ${uPriceFullPfx(true)}`
        }
        else if(parseInt(price)>1000) {
          return `${convertCurrencyToVnd(this.removeNonNumeric(this.textValue)/1000)} ${uPriceFullPfx(false)}`
        }
      }
      return ''
    }
  },
  watch: {
    textValue(newVal) {
      this.formatInputValue(newVal)
      this.emitsPrice(newVal)
    },
    price(newVal) {
      this.setFormatPropsToTextVal(newVal)
    },
  },
  emits: ['price'],
  methods: {
    uPriceFullPfx,
    onSubmitPrice(newPrice) {
      this.$emit('price', convertCurrencyToVnd(newPrice, this.rent))
    },
    setFormatPropsToTextVal(propsValue) {
      this.textValue = this.rent ? this.formatCurrency(propsValue * this.MILLION) : this.formatCurrency(propsValue * this.BILLION)
    },
    clearOptions() {
      this.options = [5, 6, 7]
    },
    priceSugPick(value, option) {
      this.textValue = value;
      this.selectedOptions.push(option);
      // Add additional suggestions based on the selected value
      const selectedValue = this.parseCurrency(value);
      if (selectedValue) {
        const numDigits = selectedValue.toString().length;
        const additionalOptions = Array.from({ length: 3 }, (_, index) => index + 1);
        this.options = [...additionalOptions];
      }
    },
    suggestCurrency(value, numb) {
      let cleanedValue = this.removeNonNumeric(value);
      if (cleanedValue !== '') {
        const numericValue = cleanedValue.replace(',', '');
        return this.formatCurrency(numericValue * numb);
      }
    },
    emitsPrice(value) {
      const numericValue = this.rent ? this.parseCurrency(value) / this.MILLION : this.parseCurrency(value) / this.BILLION;
      if (!isNaN(numericValue) && numericValue.toFixed(2) > 0.5 && numericValue) {
        this.$emit('price', numericValue);
      }
    },
    handleInput() {
      this.isEdited = true;
      this.clearOptions()
    },
    formatInputValue(value, deleted) {
      if (value) {
        let cleanedValue = this.removeNonNumeric(value);
        if (cleanedValue !== '') {
          cleanedValue = deleted ? cleanedValue.slice(0, -1) : cleanedValue
          this.textValue = this.formatCurrency(cleanedValue);
        }
      }
    },
    handleKeyDown(event) {
      if (event.keyCode === 8) {
        this.formatInputValue(this.textValue, true)
      }
    },
    formatCurrency(value) {
      if (!value || value === 0) {
        return 0;
      }
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    },
    parseCurrency(value) {
      if (value) {
        return value.replace(/[^\d,]/g, '').replace(',', '');
      }
    },
    removeNonNumeric(value) {
      return value?.replace(/[^\d,]/g, '');
    },
  },
};
</script>
