<template>
    <div v-if="listItem.length">
      <div v-for="(item,index) in listItem" :key="index">
        <div class="notification-item p-2" @click="goToNotification(item.data.url,item.id)">
          <FpNotificationItem :notificationTime="getTime(item.init_time)" :title="item" :seen="item.seen"/>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-title mt-5 text-center text-center font-weight-600 " style="font-size: 20px;color: #D9D9D9">Chưa có thông báo</p>
      <div class="row d-flex justify-content-center">
        <FpIcon src-icon="blanknotification.png" :size="200" class="col-auto p-0"></FpIcon>
      </div>
    </div>
</template>

<script>
import FpNotificationItem from "@/components/FpNotification/FpNotificationItem.vue";
import {getTime} from "@/utils/dateTimeUtils";
import {post} from "@/utils/dataQuery";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
export default {
  components: {
    FpIcon,
    FpNotificationItem
  },
  props: {
    listItem: {
      type: Array,
      default: () => []
    },
    loadingDone:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    getTime,
    async goToNotification(url,id)
    {
        const res = await post('/firebase/user_notify_seen',{
          id: id
        })
        window.location.href=url
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.notification-item:hover {
  background-color: #f2f2f2;
  border-radius: 10px;
  cursor: pointer;
}
</style>
