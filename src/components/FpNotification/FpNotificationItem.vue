<template>
   <div class="d-flex justify-content-between">
      <div class="col-10">
         <b class=" text-content">{{ title.noti_title }}</b>
         <br>
         <span class=" text-content">{{ title.noti_body }}</span>
         <p class="text-small">{{ notificationTime }}</p>
      </div>
      <div class="col-2 d-flex justify-content-center align-items-center ">
         <FpDot :dotSize="8" :dotColor="seenColor"/>
      </div>
   </div>
</template>

<script>
import FpDot from "@/views/AgentView/NewAgent/AgentCart/UnitCard/UnitCardItem/FpDot.vue";
import {roleNotification} from "@/utils/contentNotification";

export default {
   data() {
      return {}
   },
   components: {
      FpDot
   },
   props: {
      title: {
         type: Object,
         default: () => ({
            noti_title: '',
            noti_body: '',
         })
      },
      notificationTime: {
         type: String,
         default: ''
      },
      seen: {
         type: Boolean,
         default: false,
      }
   },
   computed: {
      seenColor() {
         return this.seen ? '#D9D9D9' : 'black'
      }
   },
   methods: {
      getNotification(data) {
         return roleNotification[data.role][data.clf](data)
      },
   },
   mounted() {

   }
}
</script>