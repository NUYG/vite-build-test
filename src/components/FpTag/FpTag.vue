<template>
  <div :style="tagStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blue: ['#59A8D4', '#E2F5FF'],
      green: ['#4AA785', '#DEF8EE'],
      purple: ['#8A8CD9', '#EDEDFF'],
      default:['black','white']
    };
  },
  props: {
    tagColor: {
      type:String,
      default:'default'
    },
    extClass: String,
    borderRadius: Number,
    borderColor: String,
    borderStyle: String,
    borderWidth:String
  },
  computed: {
    tagStyle() {
      const colors = this[this.tagColor] || this.default;
      return {
        color: colors[0],
        backgroundColor: colors[1],
        borderRadius: this.borderRadius + 'px',
        borderColor: this.borderColor,
        borderStyle: this.borderStyle,
        borderWidth: this.borderWidth
      };
    }
  }
};
</script>
