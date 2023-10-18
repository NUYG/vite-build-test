<template>
   <div :class="alertOn ? 'alert-input' : ''" class="p-3 border border-gray rounded border8">
      <div class="text-gray">{{ title }}</div>
      <div class="row">

         <div v-for="(item, index) in selectedItems" :key="index" class="col-auto">
            <div class="tag d-flex justify-content-between">
               <div class='d-flex tag-text align-items-center'>
                  <span v-show="item[colorAttr]" :style="{'background-color': item[colorAttr]}"
                        style="height: 8px; width: 20px; border-radius: 20px; margin-right: 3px;margin-top: 6px"></span>
                  <span class="small">
                  {{ item[nameAttr] }}
            </span>
                  <span @click="unselItem(index)" class='ms-2 '>
                     <img alt="" :src="getIconUrl('delete-gray.svg')"/>
                  </span>
               </div>
            </div>
         </div>

      </div>
      <input type="text" class="form-control border-white bold-input p-2" v-model="findText" :list="'sug-' + fieldId"
             @input="pickItem">
      <datalist :id="'sug-' + fieldId">
         <option v-for="(item, index) in sugData" :key="index" :value="item[nameAttr]+' '" :data-id="index"></option>
      </datalist>
   </div>
</template>

<script>
import {post} from "@/utils/dataQuery";
import {getIconUrl} from "@/utils/utils";

export default {
   data() {
      return {
         findText: '',
         sugData: () => ([]),
      }
   },
   props: {
      selectedItems: {
         type: Array,
         default: () => ([]),
      },
      fieldId: {
         type: String,
         default: 'mult-tag'
      },
      alertOn: {
         type: Boolean,
         default: false,
      },
      title: {
         type: String,
         default: 'Chưa ghi tiêu đề kìa',
      },
      colorAttr: {
         type: String,
         default: 'color',
      },
      nameAttr: {
         type: String,
         default: 'name',
      },
      sugDataEP: {
         type: String,
         default: '',
      },
      extFilter: {
         type: Object,
         default: () => ({}),
      }
   },
   computed: {
      selItemsID() {
         return this.selectedItems.map((item) => item.id);
      },
   },
   methods: {
      getIconUrl,
      unselItem(index) {
         this.$emit("item-removed", index);
      },
      pickItem(event) {
         const selectedOption = event.target.list.querySelector(
            `option[value="${this.findText}"]`
         );
         if (!selectedOption) {
            return;
         }
         const index = selectedOption.getAttribute("data-id");
         if (index) {
            this.addItem(index);
         }
      },
      addItem(index) {
         this.findText = '';
         this.$emit("item-picked", this.sugData[index]);
      },
      // APIs
      async getSugData() {
         const res = await post(this.sugDataEP, {
            ...this.extFilter,
            exIds: this.selItemsID,
         })
         if (res.succeed) {
            this.sugData = res.returnData;
         }
      },
   },
   emits: ['item-picked', 'item-removed'],
   watch: {
      selectedItems: {
         handler() {
            this.getSugData();
         },
         deep: true,
      },
   },
   mounted() {
      this.getSugData();
   }
}
</script>
