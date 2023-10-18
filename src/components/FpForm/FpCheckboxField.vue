<template>
  <div class="row">
    <label v-for="(item, index) in items" :key="index" class="col-auto">
      <input
          class="form-check-input"
          type="checkbox"
          :value="item.id"
          :checked="isSelected(item.id)"
          @change="handleSelectionChange"
      />
     <span :class="boxTextClass"> {{ item.content }}</span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default:() => [],
      required: true,
    },
    multiselect: {
      type: Boolean,
      default: false,
    },
    selectedItems: {
      type: Array,
      default: () =>[],
    },
    boxTextClass:{
      type:String,
      default:"px-2"
    }
  },
  data() {
    return {
      selectedItemsValue: this.selectedItems || [],
    };
  },
  computed: {

  },
  mounted() {

  },
  emits:['pickedValue'],
  methods: {
    isSelected(itemId) {
      return this.selectedItems.includes(itemId);
    },
    handleSelectionChange(event) {
      const selectedId = event.target.value;
      const isSelected = this.isSelected(selectedId);

      if (isSelected) {
        const index = this.selectedItems.indexOf(selectedId);
        if (index > -1) {
          this.selectedItems.splice(index, 1);
        }
      } else {
        this.selectedItems.push(selectedId);
      }
      this.$emit('pickedValue', this.selectedItems);
    },
  },
};
</script>
