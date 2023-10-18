<template>
  <div class="position-relative h-100">
    <div style="height: 70vh" class="overflow-scroll row">
      <div class="col-10">
        <p><span class="text-title font-600">{{ headerContent[step].title }}</span></p>
        <span v-if="headerContent[step]?.description">{{ headerContent[step]?.description }}</span>
      </div>
      <div>
        <CreateCusRentStatus :rentProps="inqData.rent" @cusRent="onCusRentingChange" v-if="step===1"/>
        <MobileInqProjectPick :inqData="inqData" @unitInq="unitInq" v-if="step===2" :projects='projects'
                              :pjBlockRepo="unitPjBlockRepo" :pjSelectedDefault="pjSelectedList"
                              :extendUnit="extendUnit" />
        <CreatePjBlock :inqData="inqData" :pjSelectedDefault="pjSelectedList" v-if="step===3"
                       :pjBlockRepo="unitPjBlockRepo" @pj-block-picked="unitInq"></CreatePjBlock>
        <CreateFurUnitType :inqData="inqData" v-if="step===4"></CreateFurUnitType>
        <CreateInqUnit v-if="step===5" :inq-data="inqData"></CreateInqUnit>
        <CreateCusFinance :pricing="inqData.ceilingPrice" :renting="inqData.rent"
                          @inqPrice="onInqPriceChange" v-if="step===6"/>
        <CreateCusInforView :cusData="cusData" @createCusData="onCusDataChange" v-if="!cusLocked&& step===7"
                            @avt-clicked="onEditAvt"/>
        <UploadAvt v-if="step===8 && !cusLocked" :currentAvt="getUrlTypeAvtOfCusData(cusData)" :sizeAvt="120"
                   @updateAvt="onAvtPick" :isCreateInqPage="true"></UploadAvt>
      </div>
    </div>


    <div>
      <ButtonNextPrevCreatedCus :nextContent="buttonVal[step][1]" :prev-content="prevContent"
                                @stepClick="onStepClick"/>
    </div>

  </div>


  <TextNotification
      v-if='warningToast'
      :message='warningMsg'
      @close='removeToast'
      :closeNotiTime="1500"
  />
</template>

<script>
import CreateCusInforView from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusInforView.vue";
import CreateCusRentStatus from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusRentStatus.vue";
import CreateCusFinance from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusFinance.vue";
import FindPjForCus from "@/views/SalesView/SalesCusCreatedInMobile/MobileInqProjectPick.vue";
import MobileInqProjectPick from "@/views/SalesView/SalesCusCreatedInMobile/MobileInqProjectPick.vue";
import ButtonNextPrevCreatedCus from "@/views/SalesView/SalesCusCreatedInMobile/ButtonNextPrevCreatedCus.vue";
import PickBedroomWUnitType from "@/components/FpForm/PickBedroomWUnitType.vue";
import TextNotification from "@/components/Misc/TextNotification.vue";
import CreateCusAvt from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusAvt.vue";
import UploadAvt from "@/components/FpImg/UploadAvt.vue";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import CreatePjBlock from "@/views/SalesView/SalesCusCreatedInMobile/CreatePjBlock.vue";
import CreateFurUnitType from "@/views/SalesView/SalesCusCreatedInMobile/CreateFurUnitType.vue";
import CreateInqUnit from "@/views/SalesView/SalesCusCreatedInMobile/CreateInqUnit.vue";
import {getItemFromLocalStorage} from "@/utils/utils";

export default {
  components: {
    CreateInqUnit,
    CreateFurUnitType,
    CreatePjBlock,
    CreateCusAvt,
    MobileInqProjectPick,
    PickBedroomWUnitType,
    ButtonNextPrevCreatedCus,
    FindPjForCus,
    CreateCusFinance,
    CreateCusRentStatus,
    CreateCusInforView,
    TextNotification,
    UploadAvt
  },
  props: {
    cusLocked: {
      type: Boolean,
    },
    projects: {
      type: Array,
      default: () => []
    },
    pjBlockRepo: {
      type: Array,
      default: () => []
    },
    stepProps: {
      type: Number
    }
  },
  data() {
    return {
      headerContent: {
        1: {title: 'Dễ dàng tìm & thuê nhà chỉ với vài thao tác'},
        2: {title: 'Tìm dự án phù hợp với khách hàng của bạn'},
        3: {title: ''},
        4: {
          title: 'Chọn loại phòng & loại nội thất căn hộ',
        },
        5: {
          title: 'Thông tin khác',
        },
        6: {
          title: 'Thêm mức tài chính mà bạn mong muốn',
        },
        7: {
          title: 'Thêm tên khách hàng để chúng tôi nhớ thay cho bạn',
          description: 'Bảo mật thông tin khách hàng là một trong những ưu tiên hàng đầu của chúng tôi'
        },
        8: {
          title: '[Tên khách hàng] cần một ảnh đại diện',
          description: 'Chọn ảnh đại diện khách hàng giúp bạn dễ dàng ghi nhớ khách hàng hơn.'
        }
      },
      buttonVal: {
        1: ['', 'Bắt đầu'],
        2: ['', 'Tiếp theo'],
        3: ['', 'Chọn loại căn'],
        4: ['Thông tin khác', 'Hoàn thành'],
        5: ['Chọn dự án', 'Hoàn thành'],
        6: ['', 'Hoàn thành'],
        7: ['', 'Bắt đầu tư vấn'],
        8: ['', 'Hoàn thành'],
      },
      optionsVal: [[1, 1], [2, 2], [3, 3], [4, 4], [5, '*']],
      step: 1,
      cusData: {
        id: -1,
        name: '',
        fb: '',
        email: '',
        phone: '',
        preset_avt: 'maleAvatar.png',
      },
      inqData: {
        ceilingPrice: 0,
        rent: true,
        blocks: [],
        bedroom: '',
        project: [],
        moveInDay: null,
        size: 0,
        balcony: '',
        unitType: 'ap',
        heights: [],
        furniture: ''
      },
      pjSelectedList: [],
      extendUnit: false,
      warningToast: false,
      warningMsg: ''
    }
  },
  computed: {
    unitPjBlockRepo() {
      return this.projects?.map(obj1 => {
        return this.pjBlockRepo.find(obj2 => obj2.id === obj1.id);
      })
    },
    prevContent() {
      return this.buttonVal[this.step][0] || ''
    },
    isPspPj()
    {
      // return getItemFromLocalStorage('pspPj')
      return !this.pjSelectedList.length
    }
  },
  methods: {
    getUrlTypeAvtOfCusData,
    setToastStatus(content) {
      this.warningToast = true
      this.warningMsg = content
    },
    removeToast() {
      this.warningToast = false
    },
    onCusDataChange(cusData) {
      this.cusData = cusData
    },
    checkCanNextStep() {
      if (this.step === 7 && this.cusData.name === '') {
        this.setToastStatus('Vui lòng điền tên khách hàng !')
        return false
      }
      // if (this.step === 2 && !this.inqData.project.length) {
      //   this.setToastStatus('Vui lòng chọn dự án!')
      //   return false
      // }
      return true
    },

    // xin lỗi những ai maintain component này rất nhiều :)))

    onStepClick(step) {
      if (step === 'next' && this.checkCanNextStep()) {

        if(this.step === 2 && this.isPspPj)
        {
          if(this.inqData.rent)
          {
            this.buttonVal['4'] = this.cusLocked ? ['Thông tin khác','Tạo giao dịch cá nhân'] : ['Thông tin khác','Hoàn thành']
          }
          else {
            this.buttonVal['4'] =  ['', 'Thêm tài chính'];
          }
          return this.emitStep(4)
        }
        else if (this.step === 3 &&!this.inqData.rent ) {
          this.buttonVal['4'] = ['', 'Thêm tài chính'] ;
          this.emitStep(4);
        }
        else if(this.step===3 && this.cusLocked )
        {
          this.buttonVal['4'] = this.isPspPj ? ['Thông tin khác', 'Tạo giao dịch cá nhân'] :  ['Thông tin khác', 'Bắt đầu tư vấn'];
          this.emitStep(4);
        }
        else if (
            ( this.isPspPj &&
            (this.step === 4 || this.step === 5) && this.inqData.rent ) && !this.cusLocked
             ||( this.isPspPj &&
             (this.step === 6 || this.step === 5) && !this.inqData.rent ) && !this.cusLocked

        ) {
               this.buttonVal['7']= ['','Tạo giao dịch cá nhân']
               this.emitStep(7)
        }
        else if (this.cusLocked && this.inqData.rent && this.step === 4) {
          return this.$emit('cusCreated', {cusData: this.cusData, inqData: this.inqData});
        } else if (this.step === 5 && !this.inqData.rent && this.cusLocked ) {
          this.buttonVal['6'] = this.isPspPj ? ['Thông tin khác', 'Tạo giao dịch ngoài'] :  ['Thông tin khác', 'Bắt đầu tư vấn']
          return this.emitStep(6)
        } else if (this.step === 5 && this.inqData.rent && this.cusLocked) {
          return this.emitStep(4)
        } else if ((this.step === 4 && this.inqData.rent) || this.step === 5) {
          this.buttonVal['7']= ['','Bắt đầu tư vấn']
          this.emitStep(7);
        } else if (this.step === 4 && !this.inqData.rent) {
          this.buttonVal['6'] = this.cusLocked ? (this.isPspPj ?  ['Thông tin khác', 'Tạo giao dịch ngoài']  :  ['Thông tin khác', 'Bắt đầu tư vấn'])
              :  ['Thông tin khác', 'Hoàn thành'];
          this.emitStep(6);
        } else if (this.step === 6 && !this.inqData.rent && !this.cusLocked) {
          this.buttonVal['7']= ['','Bắt đầu tư vấn']
          this.emitStep(7);
        } else if (this.step === 7 || (this.step === 6 && this.cusLocked)) {
          this.headerContent['8'].title = `${this.cusData.name} cần một ảnh đại diện`;
          return this.$emit('cusCreated', {cusData: this.cusData, inqData: this.inqData});
        } else if (this.step === 8) {
          this.emitStep(7);
        } else {
          this.emitStep(this.step + 1);
        }
      }

      if (step === 'prev') {
        if(this.step === 4 && this.isPspPj )
        {
          this.buttonVal['7']= ['','Tạo giao dịch cá nhân']
          this.emitStep(7)
        }
         if (this.step === 4) {
          this.emitStep(this.step + 1);
        } else if (this.step === 5) {
          this.emitStep(2);
        } else if (this.step === 7 && this.inqData.rent) {
          this.emitStep(5);
        } else {
          this.emitStep(this.step - 1);
        }
      }


    },
    emitStep(step) {
      this.$emit('nextStep', step)
    },
    onEditAvt() {
      this.emitStep(8)
    },
    onCusRentingChange(renting) {
      this.inqData.rent = renting
      this.$emit('rentingPick', this.inqData.rent)
    },
    onInqPriceChange(price) {
      this.inqData.ceilingPrice = price
    },
    unitInq(value) {
      if (value.pjSelectedList) {
        this.pjSelectedList = value.pjSelectedList
      } else if (value.blockSelected) {
        this.inqData.blocks = value.blockSelected
      } else if (value.extendEditUnit) {
        this.extendUnit = value.extendEditUnit
      }
    },
    onAvtPick(val) {
      if (val.dataUrl) {
        this.$emit('dataUrl', val)
      } else {
        this.cusData.preset_avt = val
      }
    },
    changeBtnContent()
    {
      if(this.cusLocked)
      {
        this.buttonVal['4'] = ['Thông tin khác', 'Bắt đầu tư vấn']
        this.buttonVal['6'] = ['Thông tin khác', 'Bắt đầu tư vấn']
      }
    }
  },
  emits: ['cusCreated', 'dataUrl', 'nextStep', 'rentingPick'],
  async mounted() {
    this.step = this.stepProps > 0 ? this.stepProps : 1
    await this.changeBtnContent()
  },
  watch: {
    stepProps(newVal) {
      newVal > 0 ? this.step = newVal : this.step = 1
    },
    cusLocked()
    {
      this.changeBtnContent()
    }
  }
}
</script>

<style scoped>
.font-600 {
  font-weight: 600;
}
</style>
