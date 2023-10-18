<template>
  <div>
    <div class="border8 box-shadow p-2" :style="tooltipStyle">
      <div class="w-100 border-bottom d-flex text-center mt-2">
        <h6><b>{{ text }}</b></h6>
      </div>
      <div class="mt-3">
        <FpNotificationListItem :listItem="notificationData" :loading-done="loadingDone"/>
      </div>
    </div>
  </div>
</template>

<script>
import FpNotificationListItem from "@/components/FpNotification/FpNotificationListItem.vue";
import {post} from "@/utils/dataQuery";
export default {
  data()
  {
    return{
      notificationData:[],
      loadingDone:false
    }
  },
  components:{
    FpNotificationListItem
  },
  computed: {
    wStyle() {
      return this.widthSize ? `${this.widthSize}px` : `100%`
    },
    hStyle() {
      return this.heightSize ? `${this.heightSize}px` : `100%`
    },
    tooltipStyle() {
      const style = {
        position: "absolute",
        padding: "5px",
        backgroundColor: "white",
        width: this.wStyle,
        height: this.hStyle,
        zIndex: 999,
        overflow: 'auto'
      };
      if (typeof this.top === 'number') {
        style.top = `${this.top}px`;
      }
      if (typeof this.left === 'number') {
        style.left = `${this.left}px`;
      }
      switch (this.position) {
        case "top":
          style.transform = `translate(-50%, -100%)`;
          break;
        case "bottom":
          style.transform = `translate(-50%, 0)`;
          break;
        case "left":
          style.transform = `translate(-100%, -50%)`;
          break;
        case "right":
          style.transform = `translate(0, -50%)`;
          break;
      }
      return {
        ...style,
        ...this.customStyle,
      };
    },
  },
  props: {
    top: {
      type: Number,
      default: null,
    },
    left: {
      type: Number,
      default: null,
    },
    text: {
      type: String,
      required: true,
    },
    widthSize: {
      type: [Number, String],
      default: ''
    },
    heightSize: {
      type: [Number, String],
      default: ''
    },
    customStyle: {
      type: Object,
      default: () => ({}),
    },
    position: {
      type:String
    }
  },
  methods:{
    async getNotificationData()
    {
      const res = await post('/firebase/get_user_notify_msgs',{})
      this.notificationData=res.returnData
      this.loadingDone=true
    }
  },
  mounted() {
    this.getNotificationData()
  }
};
</script>

<style scoped>
.box-shadow
{
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
