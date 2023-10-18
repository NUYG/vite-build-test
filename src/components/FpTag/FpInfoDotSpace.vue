<template>
  <div :class="customTagClass">
    <template v-if="bedroom">
      <span :class="itemClass"> {{ bedroom }}PN<span v-if="hasMoreInfo"> · </span></span>
    </template>
    <template v-if="bathroom">
      <span :class="itemClass">{{ bathroom }}WC<span v-if="hasMoreInfo"> · </span></span>
    </template>
    <template v-if="size">
      <span :class="itemClass">{{ size }}m²<span v-if="hasMoreInfo"> · </span></span>
    </template>
    <template v-if="furText">
      <span :class="itemClass">{{ furText }}<span v-if="hasMoreInfo"> · </span></span>
    </template>
    <template v-if="balcony">
      <span :class="itemClass">{{ balcony }}<span v-if="hasMoreInfo"> · </span></span>
    </template>
    <template v-if="views">
      <span :class="itemClass">{{ views }}</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    bedroom: {
      type: [Number, String],
      default: null,
    },
    bathroom: {
      type: Number,
      default: null,
    },
    size: {
      type: Number,
      default: null,
    },
    floor: {
      type: Number,
      default: null,
    },
    balcony: {
      type: String,
      default: null,
    },
    views: {
      type: String,
      default: null,
    },
    customTagClass: {
      type: String,
    },
    furText: {
      type: String,
    },
    itemClass:{
      type:String
    }
  },
  computed: {
    hasMoreInfo() {
      return (
          this.bedroom !== null ||
          this.bathroom !== null ||
          this.size !== null ||
          this.floor !== null ||
          this.balcony !== null || this.furText !== null
      );
    },
  },
};
</script>

<style>
.property-info {
  display: flex;
  flex-wrap: wrap;
  font-size: 10px;
}
</style>
