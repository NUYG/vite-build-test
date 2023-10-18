<template>
  <div style="height: 45vh">
    <div class="d-flex flex-wrap mt-2">
      <template v-for="(pj,index) in pjSelectedList" :key="index">
        <div class="col-auto border border8 p-1 px-2 mt-2 me-1 ms-1"
             :class="{'button-blue-teal':checkPjPicked(pj.id)}" @click="unPicked(pj.id)">
          <span>{{ pj.name }}</span>
        </div>
      </template>
      <div class="new-sales-step-6 col-auto border border8 p-1 px-2 mt-2 me-1 ms-1 button-blue-teal" v-if="pspPick">
        <span>Khác</span>
      </div>

    </div>
    <div class="row px-2" v-if="pspPick && pspProject">
      <div class="col-auto border border8 p-1 px-2 mt-2 me-1 ms-1 button-blue-teal">
        <span>{{ pspProject }}</span>
      </div>
    </div>
    <div class="new-sales-step-5 d-flex flex-wrap mt-4">
      <template v-for="(pj,index) in pjBlockRepo" :key="index">
        <div class="col-auto border border8 p-1 px-2 mt-2 me-1 ms-1"
             :class="{'button-blue-teal':checkPjPicked(pj.id)}" @click="sugPicked(pj.id)">
          <span>{{ pj.name }}</span>
        </div>
      </template>
      <div class="new-sales-step-6 col-auto border border8 p-1 px-2 mt-2 me-1 ms-1" @click="onPspPick" v-if="!pspPick">
        <span>Khác</span>
      </div>
    </div>
  </div>

  <FpLabelFormTemplate v-if="!extendEditUnit" class="mt-2" label="Tìm dự án" labelClass="text-gray"
                       :style="{'margin-top': !pjSelectedList.length ? '45px' : ''}">
    <template #comp>
      <input type="text" class="form-control border-white bold-input p-1"
             v-model="findText" :list="'sug'"
             @input="pickItem" @keyup.enter="onFindPj">
      <datalist :id="'sug'">
        <option v-for="(item, index) in pjBlockRepo" :key="index" :value="item['name']" :data-id="item.id"></option>
      </datalist>
    </template>
  </FpLabelFormTemplate>

  <TextNotification
    v-if='toastMsg'
    :message='msg'
    @close='toastMsg=false'
    :closeNotiTime="1800"
    toast-class="col-10 border border-success"
  />
</template>

<script>
import ButtonView from "@/components/FpButton/ButtonView.vue";
import FpLabelFormTemplate from "@/components/FpLayout/FpLabelFormTemplate.vue";
import ProjectSelected from "@/components/FpFilter/AgentFilter/LayoutResidence/ProjectSelected.vue";
import ButtonNextPrevCreatedCus from "@/views/SalesView/SalesCusCreatedInMobile/ButtonNextPrevCreatedCus.vue";
import FormMultiTagOptionsPicked from "@/components/FpForm/FormMultiTagOptionsPicked.vue";
import FormPick from "@/components/FpForm/FormPick.vue";
import PickBedroomWUnitType from "@/components/FpForm/PickBedroomWUnitType.vue";
import FpFurniturePick from "@/components/FpForm/FpFurniturePick.vue";
import FpRangeSelect from "@/components/FpRange/FpRangeSelect.vue";
import FormPickBalcony from "@/components/FpForm/FormPickBalcony.vue";
import FpFloorSelected from "@/components/FpForm/FpFloorSelected.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import ViewUnitFilter from "@/components/FpFilter/AgentFilter/LayoutResearch/ViewUnitFilter.vue";
import TextNotification from "@/components/Misc/TextNotification.vue";
import {getItemFromLocalStorage, removeLocalItem, setLocalStorageItem} from "@/utils/utils";
import {pageTour} from "@/views/Guidance/pageTour";
import TourHost from "@/views/Guidance/TourHost.vue";

export default {
  components: {
    TextNotification,
    FpIcon,
    FormPickBalcony,
    FpRangeSelect,
    ButtonNextPrevCreatedCus,
    ProjectSelected,
    FpLabelFormTemplate,
    ButtonView,
    FormMultiTagOptionsPicked,
    FormPick,
    PickBedroomWUnitType,
    FpFurniturePick,
    FpFloorSelected,
    ViewUnitFilter,
    TourHost
  },
  data() {
    return {
      pjSelectedList: [],
      blockSelectedList: [],
      optionsVal: [[1, 1], [2, 2], [3, 3], [4, 4], [5, '*']],
      extendEditUnit: this.extendUnit,
      findText: '',
      toastMsg: false,
      msg: '',
      pspProject: '',
      pspPick: false,
      pageTour
    }
  },
  methods: {
    onPspPick() {
      this.pspPick = true
      this.pjBlockRepo.push(...this.pjSelectedList)
      this.pjSelectedList = []
    },
    onFindPj() {
      if (!this.pspPick) {
        this.onPspPick()
      }
      this.pspProject = this.findText
      this.toastMsg = true
      this.msg = `Đã chọn dự án ${this.findText}`
      setLocalStorageItem('pspPj', this.pspProject)
      this.findText = ''
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
        this.findText = '';
        this.sugPicked(index)
      }
    },
    unPicked(id) {
      const index = this.pjSelectedList.findIndex(item => item.id === parseInt(id))
      if (index !== -1) {
        this.pjBlockRepo.push(this.pjSelectedList.splice(index, 1)[0])
      }

    },
    sugPicked(id) {
      this.pspPick = false
      this.pspProject = ''
      setLocalStorageItem('pspPj', '')
      const repoIndex = this.pjBlockRepo.findIndex(item => item.id === parseInt(id))
      if (repoIndex !== -1) {
        this.pjSelectedList.push(this.pjBlockRepo.splice(repoIndex, 1)[0])
        this.msg = `Đã chọn ${this.pjSelectedList[this.pjSelectedList.length - 1]?.name}. `
        this.toastMsg = true
      }

    },
    setPropsToState() {
      this.pjSelectedDefault?.map(pj => {
        this.pjSelectedList.push(pj)
      })
      this.blockSelectedList = this.inqData.blocks
      this.extendEditUnit = this.extendUnit
    },
    checkPjPicked(id) {
      return this.pjSelectedList.some(obj => obj.id === id)
    }
  },
  props: {
    pjBlockRepo: {
      type: Array,
      default: () => []
    },
    inqData: {
      type: Object,
      default: () => {
      }
    },
    pjSelectedDefault: {
      type: Array,
      default: () => []
    },
    extendUnit: {
      type: Boolean,
    },
  },
  computed: {
    unitPjBlockRepo() {
      return this.projects.map(obj1 => {
        return this.pjBlockRepo.find(obj2 => obj2.id === obj1.id);
      })
    },
  },
  async mounted() {
    await this.setPropsToState()
    if (getItemFromLocalStorage('pspPj')) {
      this.pspProject = getItemFromLocalStorage('pspPj')
      this.pspPick = true
    }
  },
  emits: ['unitInq'],
  watch: {
    pjSelectedList: {
      handler(newVal) {
        {
          this.inqData.project = []
          newVal.map(pjList => {
            this.inqData.project.push(pjList.id)
          })
          this.$emit('unitInq', {pjSelectedList: newVal})
        }
      },
      deep: true
    },
    blockSelectedList: {
      handler(newVal) {
        {
          this.$emit('unitInq', {blockSelected: Object.values(newVal)})
        }
      },
      deep: true
    },
    extendEditUnit() {
      this.$emit('unitInq', {extendEditUnit: this.extendEditUnit})
    },
    extendUnit(newVal) {
      this.extendEditUnit = newVal
    }

  }
}
</script>
