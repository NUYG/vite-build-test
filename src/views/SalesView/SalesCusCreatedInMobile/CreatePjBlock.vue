<template>
    <div v-if="pjSelectedList.length" >
      <div class="overflow-scroll mb-2 " style="height: 52vh;">
        <FormMultiTagOptionsPicked :showPjImg="true" :selectedList="pjSelectedList"  form-class="border rounded p-3"
                                   :blockInqSelect="blockSelectedList" @selectedHandler="pickedHandler"/>
      </div>
    </div>
    <FpLabelFormTemplate  class="mt-3" label="Tìm dự án" labelClass="text-gray">
      <template #comp>
        <input type="text" class="form-control border-white bold-input p-2"
               v-model="findText" :list="'sug'"
               @input="pickItem">
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
import PickBedroomWUnitType from "@/components/FpForm/PickBedroomWUnitType.vue";
import FormMultiTagOptionsPicked from "@/components/FpForm/FormMultiTagOptionsPicked.vue";
import FpLabelFormTemplate from "@/components/FpLayout/FpLabelFormTemplate.vue";
import TextNotification from "@/components/Misc/TextNotification.vue";

export default {
  components:{
    TextNotification,
    FpLabelFormTemplate,
    PickBedroomWUnitType,
    FormMultiTagOptionsPicked
  },
  data()
  {
    return{
      blockSelectedList:[],
      findText:'',
      pjSelectedList: [],
      toastMsg:false,
      msg:'',
    }
  },
  props:{
    pjSelectedDefault:{
      type: Array,
      default: () => []
    },
    pjBlockRepo: {
      type: Array,
      default: () => []
    },
    inqData: {
      type: Object,
      default: () => {}
    },
  },
  methods:{
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
    sugPicked(id) {
      const index = this.pjSelectedList.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        this.pjSelectedList.splice(index, 1);
      } else {
        const selected = this.pjBlockRepo.filter(item => item.id === parseInt(id));
        this.msg=`Đã chọn ${selected[0]?.name}. `
        this.toastMsg=true
        this.pjSelectedList.push(...selected);
      }
    },
    sugUnpick(id) {
      const index = this.pjSelectedList.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        const unpickBlockId = this.pjSelectedList[index].blkData
        if (unpickBlockId.length > 0) {
          unpickBlockId.map(blk => {
            if (this.blockSelectedList.includes(blk.id)) {
              this.blockSelectedList.splice(this.blockSelectedList.indexOf(blk.id), 1);
            }
          })
        }
        this.pjSelectedList.splice(index, 1);
        this.findText='a'
        this.findText=''
      }
    },
    pickedHandler(options) {
      if (options.sugPick) {
        this.sugPicked(options.sugPick)
      } else if (options.unpick) {
        this.sugUnpick(options.unpick)
      } else if (options.blockPick) {
        this.onBlockPick(options.blockPick)
      }
    },
    onBlockPick(blockId) {
      if (this.blockSelectedList.includes(blockId)) {
        this.blockSelectedList.splice(this.blockSelectedList.indexOf(blockId), 1);
      } else {
        this.blockSelectedList.push(blockId);
      }
    },
    setPropsToState() {
      this.pjSelectedDefault?.map(pj => {
        this.pjSelectedList.push(pj)
      })
      this.blockSelectedList = this.inqData.blocks
      this.extendEditUnit=this.extendUnit
    }
  },
  async mounted() {
    await this.setPropsToState()
  },
  emits:['pjBlockPicked'],
  watch: {
    pjSelectedDefault(newVal)
    {
      this.pjSelectedList=newVal
    },
    pjSelectedList:{
      handler(newVal){
        {
          this.inqData.project=[]
          newVal.map(pjList => {
            this.inqData.project.push(pjList.id)
          })
          this.$emit('pjBlockPicked',{pjSelectedList:newVal})
        }
      },
      deep: true
    },
    blockSelectedList: {
      handler(newVal) {
        {
          this.$emit('pjBlockPicked', {blockSelected: Object.values(newVal)})
        }
      },
      deep: true
    },
  }

}
</script>