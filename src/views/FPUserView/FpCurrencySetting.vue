<template>
  <div class="col-lg-6 col-12 px-2">
    <div class="row d-flex justify-content-between">
      <span class="font-weight-600 col-auto">Tiền tệ</span>
      <div class="col-4 d-flex justify-content-end">
        <select v-model="currency" class="form-control-plaintext border border-1">
          <option v-for="(cur, index) in CurrencyData" :key="index" :value="cur">{{ cur }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { CurrencyData, getCurrentCurrencyName, getSeverCurrencyRate, getCurrentCurrencyUnit } from "@/models/currency";
import { setLocalStorageItem } from "@/utils/utils";

export default {
  data() {
    return {
      CurrencyData,
      currency: getCurrentCurrencyName() || 'VND',
    };
  },
  watch: {
    currency(newVal) {
      setLocalStorageItem("currency", newVal);
      getSeverCurrencyRate(getCurrentCurrencyName());
    },
  },
  computed: {
    currencyUnit() {
      return getCurrentCurrencyUnit();
    },
  },
};
</script>
