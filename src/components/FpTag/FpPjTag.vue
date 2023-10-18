<template>
    <div class="p-2">
      <div class="d-flex flex-wrap">
        <span class="col d-flex flex-wrap"><b>{{pjStatusCode}}</b></span>
      </div>
      <div class="col d-flex flex-wrap mt-2">
        <FpInfoDotSpace v-bind="pjInformation" custom-tag-class="text-sm-12 text-gray" item-class="col-auto"></FpInfoDotSpace>
      </div>
    </div>
</template>

<script>
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import FpPjInformationTag from "@/components/FpTag/FpPjInformationTag.vue";
import FpInfoDotSpace from "@/components/FpTag/FpInfoDotSpace.vue";
export default {
  components:{
    FpInfoDotSpace,
    FpIcon,
    FpPjInformationTag
  },
  props:{
    fav:{
      type:Boolean,
      default:false
    },
    pjStatusCode:{
      type:String,
      default: ''
    },
    pjInformation:{
      type:Object,
      default:() => {}
    }
  },
  methods:{
    onFavClick() {
      if (this.pjInformation) {
        const updatedPjInformation = { ...this.pjInformation, fav: !this.fav };
        this.$emit('favClick', updatedPjInformation.id, updatedPjInformation.fav);
      }
    }
  },
  computed:{
    favIcon()
    {
      return this.fav ? 'star-solid.svg' : 'star.svg';
    }
  },
  emits:['favClick']
}
</script>