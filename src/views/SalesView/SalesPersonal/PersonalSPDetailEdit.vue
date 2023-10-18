<template>
  <div class="container-fluid">
      <span class="font-weight-600 text-content">Thông tin giao dịch </span>
    <div>
      <div v-for="(field, index) in formDataWithModifiedLabels" :key="index">
        <FpFormExt
            :id="field.id"
            group-class="mt-3"
            :status="field.status"
            :can-ext="field.canExt"
            :label-content="field.labelContent"
            :defaultVal="outputData[field.id]"
            @formFieldData="onDataChange"
            :rent="renting"
        ></FpFormExt>
      </div>
    </div>
      <div class="row mt-5 d-flex justify-content-center">
            <ButtonView class="col-auto" status="gray-btn" content="Hủy" @click="resetForm"/>
            <ButtonView class="col-auto ms-5" status="gray-btn" content="Lưu thay đổi" @click="handleComplete"/>
      </div>
  </div>

</template>

<script>
import FilterLayout from "@/components/FpFilter/SalesFilter/FilterLayout.vue";
import FpFormExt from "@/components/FpForm/FpFormExt.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {uPricePfxExt} from "@/utils/unit";
export default {
  components:{
    FpFormExt,
    FilterLayout,
    ButtonView
  },
  data()
  {
    return {
      outputData:'',
      formData: [
        {
          id:'name',
          status: 'text',
          canExt: false,
          labelContent: 'Tiêu đề',
        },
        {
          id:'pjName',
          status: 'text',
          labelContent: 'Dự án',
        },
        {
          id:'price',
          status: 'number',
          labelContent: `Giá giao dịch ${this.uPricePxf}`,
        },
        {
          id:'fee',
          status: 'number',
          labelContent: 'Hoa hồng ( Triệu )',
        },
        {
          id:'bedroom',
          status: 'bedroom',
          labelContent: 'Phòng ngủ',
        },
        {
          id:'bathroom',
          status: 'bathroom',
          labelContent: 'Số nhà vệ sinh',
        },
        {
          id:'balcony',
          status: 'balcony',
          labelContent: 'Hướng',
        },
        {
          id:'size',
          status: 'size',
          labelContent: 'Diện tích',
        },

      ],
    }
  },
  methods:{
    onDataChange(field, newVal) {
      this.outputData[field] = newVal;
    },
    handleComplete() {
      this.$emit('completeEditData',this.outputData)
    },
    resetForm()
    {
      this.outputData = { ...this.editData }
      this.$emit('cancelEdit')
    }
  },
  computed:{
    uPricePxf()
    {
      return uPricePfxExt(this.renting)
    },
    formDataWithModifiedLabels() {
      return this.formData.map(field => {
        if (field.id === 'price') {
          return {
            ...field,
            labelContent: `Giá giao dịch ( ${this.uPricePxf} )`
          };
        }
        return field;
      });
    }
  },
  props:{
    editData:{
      type:Object,
      default:() => {}
    },
    renting:{
      type:Boolean,
      default:true
    }
  },
  emits:['completeEditData','cancelEdit'],
  mounted() {
    this.outputData = { ...this.editData }
    this.formData.forEach(field => {
      if (typeof field.default !== 'undefined') {
        this.outputData[field.id] = field.default;
      }
    });
  },

}
</script>