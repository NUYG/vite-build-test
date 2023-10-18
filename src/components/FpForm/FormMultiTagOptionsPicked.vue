<template>
    <div class="">
      <div class="py-3 mt-3" :class="formClass" v-for="(item, index) in selectedList" :key="index">
        <div v-if="showPjImg" class="mb-3 col">
          <UnitImg :imgSrc="item.avtData?.imgUrl" :ratio-img="[3,2]"></UnitImg>
          <div class="w-100 d-flex justify-content-between position-absolute project-tag" >
            <span class="col-auto text-white position-absolute" style="top:10px;left:10px">{{item.name}}</span>
            <FpIcon src-icon="times-solid.svg" :size="20" @click="removeItem(item.id)" class="position-absolute white-svg" style="top:10px;right:10px"></FpIcon>
          </div>



        </div>
        <div v-else class="tag col-7">
          <div class="d-flex tag-text justify-content-around">
            <span class="col-auto pjTag" :style="{'background-color': item.projectColor}"></span>
            <span class="small col-auto">{{ item[nameAttr] }}</span>
            <span class="ms-2  col-auto" @click="removeItem(item.id)"><FpIcon alt="deleteIcon" srcIcon="delete-gray.svg"/> </span>
          </div>
        </div>

        <FpBlockPick v-if="item.blkData && item.blkData.length>0" title="Chọn tháp"  titleIcon="pickBuilding.svg" :optionsVal="item.blkData"
                     :borderBox="false" @optVal="blockSelected" :selectedBlock="blockInqSelect" :can-ext-click="true" :set-extend-opt="false"/>
      </div>
    </div>
    <input v-if="sugData && sugData.length>0" type="text" class="form-control border-white bold-input p-2" v-model="findText" :list="'sug-' "
           @input="pickItem">
    <datalist :id="'sug-'">
      <option v-for="(item, index) in sugData" :key="index" :value="item[nameAttr]" :data-id="item.id"></option>
    </datalist>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpBlockPick from "@/components/FpForm/FpBlockPick.vue";
import UnitImg from "@/components/FpUnit/UnitImg.vue";
export default {
  data() {
    return {
      findText: '',
    }
  },
  methods: {
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
        this.$emit('selectedHandler', {sugPick:index})
      }
    },
    removeItem(id)
    {
      this.$emit('selectedHandler', {unpick:id})
    },
    blockSelected(value)
    {
      this.$emit('selectedHandler', {blockPick:value})
    }
  },
  emits: ['selectedHandler'],
  props: {
    title: {
      type: String,
    },
    sugData: {
      type: Array,
      default: () => []
    },
    nameAttr: {
      type: String,
      default: 'name'
    },
    selectedList: {
      type: Array ,
      default: () => []
    },
    blockInqSelect: {
      type: Array,
      default: () => []
    },
    showPjImg:{
      type:Boolean,
      default:false
    },
    formClass:{
      type:String
    }
  },
  mounted() {
  },
  watch: {
  },
  components: {
    UnitImg,
    FpIcon,
    FpBlockPick
  }
}
</script>

<style scoped>
.pjTag {
  height: 8px;
  width: 20px;
  border-radius: 20px;
  margin-right: 3px;
  margin-top: 6px;
}
.project-tag{
  top: 0;
  height: 20%;
  position:absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient( rgba(0, 0, 0, 0.5) , rgba(255, 255, 255, 0))
}

</style>