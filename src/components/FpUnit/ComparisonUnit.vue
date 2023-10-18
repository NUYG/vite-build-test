<template>
  <table class="table">
    <tr>
      <td class="col-3"></td>
      <td v-for="(unit,index) in remainingUnits" :key="index" class="col-auto">
        <div class="row d-flex justify-content-start mx-5">
          <FpIcon srcIcon="CheckCircle.svg" :size="24" class="p-0" @click="removeUnit(unit)"></FpIcon>
        </div>
        <UnitImg style="width: 150px" :img-src="unit?.imgs.length ? unit?.imgs[0].wm_url : ''"
                 :ratio-img="[3,2]" style-img="object-fit:cover" :bottomTag="false" :showFurText="false" :unit-tag="getImgUnitTag(unit)"/>
      </td>
    </tr>
    <tr class="border-bottom">
      <td class="py-2 col-3">Giá</td>
      <template v-for="(unit, index) in remainingUnits" :key="index">
        <td class="col">
          <span :class="{'font-weight-600': unit === minPriceUnit}" >
            {{ priceList(unit) }}
          </span>
        </td>
      </template>
    </tr>
    <tr class="border-bottom">
      <td class="py-2 col-3">Phòng ngủ</td>
      <template v-for="(unit, index) in remainingUnits" :key="index">
        <td>
          <span :class="{'font-weight-600':unit===maxBedroomUnit}">
              <FpIcon src-icon="bed.svg" :size='24' class="p-0"></FpIcon>
              {{ unit.bedroom }}
          </span>
        </td>
      </template>
    </tr>
    <tr class="border-bottom">
      <td class="py-2 col-3">Diện tích </td>
      <template v-for="(unit, index) in remainingUnits" :key="index">
        <td>
          <span :class="{'font-weight-600': unit === maxSizeUnit}">{{ unit.size }}m² </span>
        </td>
      </template>
    </tr>
    <tr class="border-bottom">
      <td class="py-2 col-3">Nội thất</td>
      <template v-for="(unit, index) in remainingUnits" :key="index">
        <td>
          <span :class="{'font-weight-600': unit.furniture === 'fully'}">{{ transFurniture(unit?.furniture) }}</span>
        </td>
      </template>
    </tr>
    <tr class="border-bottom">
      <td class="py-2 col-3">View</td>
      <template v-for="(unit, index) in remainingUnits" :key="index">
        <td>
          <span v-if="unit.view">{{ translate(this.VIEW, unit.view) }}</span>
          <span v-if="unit.view2">{{ translate(this.VIEW, unit.view2) }}</span>
        </td>
      </template>
    </tr>
    <tr class="border-bottom">
      <td class="py-2 col-3">Nhà trống</td>
      <template v-for="(unit, index) in remainingUnits" :key="index">
        <td>
          <span v-if="freeScoutUnitList(unit, renting)?.color === 'green'">
            <FpIcon src-icon="CheckDone.svg" :size="24"></FpIcon>
          </span>
          <span v-if="freeScoutUnitList(unit, renting)?.color === 'purple'">
            {{ freeScoutUnitList(unit, renting)?.content?.slice(-5) }}
          </span>
        </td>
      </template>
    </tr>
    <tr class="border-bottom">
      <td class="py-2 col-3">Xác minh</td>
      <template v-for="(unit, index) in remainingUnits" :key="index">
        <td>
          <span v-if="freshUnit(unit) > 0">
            <span :class="{'font-weight-600': freshUnit(unit) === 2}">{{ checkUnitFresh(unit, renting, unit?.lcr) }} lớp</span>
          </span>
        </td>
      </template>
    </tr>
    <tr class="border-bottom">
      <td class="py-2 col-3">Dự án</td>
      <template v-for="(unit, index) in remainingUnits" :key="index">
        <td><span>{{ unit?.pjData?.name }}</span></td>
      </template>
    </tr>
  </table>
</template>

<script>
import UnitImg from "@/components/FpUnit/UnitImg.vue";
import {checkUnitFresh, getImgUnitTag, getStatusOfUnit, transFurniture, unitPrice} from "@/utils/unit";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import { translate } from "@/utils/utils";
import { VIEW } from "@/utils/TransContent";
import { convertVndToUserCurrency, UnitCurrency } from "@/models/currency";

export default {
  components: { FpIcon, UnitImg },
  props: {
    unitComparisonList: {
      type: Array,
      default: () => []
    },
    renting: {
      type: Boolean,
      default: true
    },
  },
  computed: {
    remainingUnits() {
      return this.unitComparisonList;
    },
    minPriceUnit() {
      if (this.remainingUnits.length === 0) {
        return null;
      }
      return this.remainingUnits.reduce((minUnit, currentUnit) => {
        const comparePrice = this.renting ? 'rentingPrice' : 'sellingPrice'
        return parseInt(currentUnit[comparePrice]) < parseInt(minUnit[comparePrice]) ? currentUnit : minUnit;
      });
    },
    maxSizeUnit() {
      if (this.remainingUnits.length === 0) {
        return null;
      }
      return this.remainingUnits.reduce((maxUnit, currentUnit) => {
        return currentUnit.size > maxUnit.size ? currentUnit : maxUnit;
      });
    },
    maxBedroomUnit() {
      if (this.remainingUnits.length === 0) {
        return null;
      }
      return this.remainingUnits.reduce((maxUnit, currentUnit) => {
        return currentUnit.bedroom > maxUnit.bedroom ? currentUnit : maxUnit;
      });
    }
  },
  data() {
    return {
      VIEW
    }
  },
  emits:['closeCompare'],
  methods: {
    transFurniture,
    checkUnitFresh,
    translate,
    getImgUnitTag(unit) {
      return getImgUnitTag({
        unit_type: unit.unit_type,
        renting: this.renting,
        furniture: unit.furniture === 'fully'
      })
    },
    removeUnit(unit) {
      this.unitComparisonList.splice(this.unitComparisonList.indexOf(unit), 1);
      if(!this.unitComparisonList.length)
      {
        this.$emit('closeCompare')
      }
    },
    freeScoutUnitList(unit, renting) {
      if (getStatusOfUnit(unit, renting)) {
        return getStatusOfUnit(unit, renting)[0];
      }
    },
    freshUnit(unit) {
      return checkUnitFresh(unit, this.renting, unit?.lcr);
    },
    priceList(unit) {
      return convertVndToUserCurrency(unitPrice(this.renting, unit), this.renting, UnitCurrency.extend);
    }
  },
  mounted() {},
  watch: {}
}
</script>
