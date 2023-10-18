<template>
  <div class="row" :style='contentBoxHeight'>
<!--    <FpIcon srcIcon="customerIdentified.svg" class="row"/>-->
    <div class="row d-flex justify-content-center mt-3">
      <div class="col-auto cursor-pointer new-sales-step-10" @click='onAvtPicked'>
        <FpIcon :size="120"  :src-icon="cusData.preset_avt" style="border-radius: 50%" ></FpIcon>
      </div>
      <p class="fst-italic text-center mt-2 text-content text-color-black">Chọn ảnh đại diện</p>
      <div class="d-flex justify-content-center">
        <div class="form-check me-4">
          <input @click="setGender('male')" class="form-check-input" type="checkbox"
                 :checked="cusData.gender==='male'">
          <label class="form-check-label"> Anh </label>
        </div>
        <div class="form-check ms-4">
          <input @click="setGender('female')" class="form-check-input" type="checkbox"
                 :checked="cusData.gender==='female'">
          <label class="form-check-label"> Chị </label>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-8 pe-0">
        <div class="p-3 border border-gray rounded new-sales-step-8">
          <div class="text-gray text-content fst-italic">Tên khách hàng</div>
          <input v-model="cusData.name" type="text" class="form-control border-white "
                 placeholder="Nhập tên khách hàng"/>
        </div>

      </div>
      <div class="col-4 pe-0 new-sales-step-9">
        <div class="row">
          <div class="col-5 mt-1" v-for="(value,key,index) in iconData" :key="index">
            <FpIcon  :style="removeOpacityPickedIcon(key)" :srcIcon="value.icon" @click="openInputField(key,value.label)"/>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="p-3 border border-gray rounded mt-4" v-if="currentInputField.value">
        <EmailField labelClass="fst-italic text-gray" v-if="currentInputField.value==='email'" :defValue="cusData.email" inputClass="p-3 " :borderNone="true" placeholder="Nhập email khách hàng" :required="true"
                    @fieldVal="onEmailChange" />
        <Fbfield  labelClass="fst-italic text-gray" v-if="currentInputField.value==='fb'" :defValue="cusData.fb" inputClass="p-3 " :borderNone="true" placeholder="Nhập facebook khách hàng" :required="true"
                 @fieldVal="onFbChange"/>
        <FpVnesePhoneField   labelClass="fst-italic text-gray" v-if="currentInputField.value==='phone'" :defValue="cusData.phone" inputClass="p-3 " :borderNone="true" :required="true"
                           @fieldVal="onPhoneNumberChange" placeholder="Nhập số điện thoại khách hàng"/>
         <label class="fst-italic text-gray w-100" v-if="currentInputField.value==='cusSrc'"> Nguồn khách hàng
           <FormCusSrcPick @srcCusPick="onSrcCusPick"/>
         </label>
      </div>
    </div>

  </div>

</template>


<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpLabelFormTemplate from "@/components/FpLayout/FpLabelFormTemplate.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import EmailField from "@/components/FpInput/FpFields/EmailField.vue";
import Fbfield from "@/components/FpInput/FpFields/Fbfield.vue";
import ButtonNextPrevCreatedCus from "@/views/SalesView/SalesCusCreatedInMobile/ButtonNextPrevCreatedCus.vue";
import FpVnesePhoneField from "@/components/FpForm/FpVnesePhoneField.vue";
import {debounce} from "lodash/function";
import {grayToOpacity} from "@/utils/utils";
import FormCusSrcPick from "@/components/FpForm/FormCusSrcPick.vue";
import FpUserImg from "@/components/FpImg/FpUserImg.vue";

export default {
  components: {
    FpLabelFormTemplate,
    FpIcon,
    ButtonView,
    Fbfield,
    EmailField,
    ButtonNextPrevCreatedCus,
    FpVnesePhoneField,
    FormCusSrcPick,
    FpUserImg
  },
  data()
  {
    return {
      iconData:{
        email:{icon:'email.svg'},
        fb:{icon:'facebook-logo.svg'},
        phone:{icon:'phone.svg'},
        cusSrc:{icon:'DotsSix.svg'}
      },
      currentInputField:{
        value:'',
        label:''
      },
      gender:''
    }
  },
  computed:{
    contentBoxHeight()
    {
      return this.currentInputField.value ? 'height:20vh' : ``
    }
  },
  props:{
    cusData:{
      type:Object,
      default:() => {}
    }
  },
  methods:{
    setGender(gender) {
      this.gender=gender
      this.cusData.gender = gender
    },
    removeOpacityPickedIcon(pickedIcon)
    {
      return pickedIcon===this.currentInputField.value ?`opacity:1` : `opacity:${grayToOpacity(5)}`
    },
    openInputField(item)
    {
      this.currentInputField.value=item;
    },
    onEmailChange(val)
    {
      this.cusData.email=val.email
    },
    onPhoneNumberChange(val)
    {
      this.cusData.phone=val.phoneNumber
    },
    onFbChange(val)
    {
      this.cusData.fb=val.facebook
    },
    onSrcCusPick(val)
    {
      this.cusData.source=val
    },
    onAvtPicked()
    {
      this.$emit('avtClicked')
    },
    emitData :debounce(function() {
      this.$emit('createCusData',this.cusData)
   }, 500),
  },
  watch: {
    cusData:{
      handler() {
        this.emitData()
      },
      deep: true,
    },
  },
  emits:['createCusData','avtClicked']
}
</script>

<style>

</style>