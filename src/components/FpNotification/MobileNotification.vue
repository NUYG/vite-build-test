<template>
  <div>
    <FpDefLayout :bcProps="bcProps">
      <template #comp>
        <div class="p-2">
          <FpNotificationListItem :listItem="notificationData" v-if="!loadingItem"/>
          <div class="row d-flex justify-content-center" v-if="loadingItem">
            <div class="spinner-border text-dark" role="status"></div>
          </div>
        </div>
      </template>
    </FpDefLayout>
  </div>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import FpNotificationListItem from "@/components/FpNotification/FpNotificationListItem.vue";
import {breadcrumpProp} from "@/models/customProp";
import {post} from "@/utils/dataQuery";
export default {
  components:{
    FpDefLayout,
    FpNotificationListItem
  },
  data()
  {
    return{
      bcProps: {
        [breadcrumpProp.title]: 'Thông Báo',
      },
      notificationData:[],
      loadingItem:true
    }
  },
  methods:{
    async getNotificationData()
    {
      const res = await post('/firebase/get_user_notify_msgs',{})
      this.notificationData=res.returnData
      this.loadingItem=false
    }
  },
  mounted() {
    this.getNotificationData()
  }
}
</script>