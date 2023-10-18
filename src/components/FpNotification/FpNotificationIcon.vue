<template>
  <div class="">
    <ButtonBadge :badge-numb="newNotification ? notificationNotSeen : 0">
        <template #objectBadged>
            <FpIcon src-icon="Bell.svg" :size="size" @click="onNotificationClick"></FpIcon>
        </template>
    </ButtonBadge>
    <FpNotificationTooltip :widthSize="300" :heightSize="500" position="bottom" :top="25" :left="-140"
                           v-if="showNotification" text="Thông báo">
    </FpNotificationTooltip>
  </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
import FpNotificationTooltip from "@/components/FpTooltip/FpNotificationTooltip.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import ButtonBadge from "@/components/FpButton/ButtonBadge.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";

export default {
  data() {
    return {
      showNotification: false,
      newNotification: false,
    }
  },
  components: {
    FpIcon,
    ButtonBadge,
    FpNotificationTooltip
  },
  methods: {
    getIconUrl,
    onNotificationClick() {
      if (scrWdtFrom(scrWdtEnum.LG)) {
        this.checkNewNotification()
        this.showNotification = !this.showNotification
      }
      else {
        this.checkNewNotification()
        this.$router.push('/notification')
      }
      window.localStorage.removeItem('newNotificationTime')
    },
    checkNewNotification() {
      this.newNotification = window.localStorage.getItem('newNotificationTime');
    }
  },
  mounted() {
    this.checkNewNotification()
  },
  props: {
    size: {
      type: Number,
    },
    notificationTime: {
      type: String,
    },
    notificationNotSeen:{
      type:Number,
      default:0
    }
  },
  watch: {
    notificationTime() {
      this.checkNewNotification()
    }
  },
  computed: {
    sizeImg() {
      return `width:${this.size}px;height:${this.size}px`
    },
    iconNotification() {
      return this.newNotification ? 'Bell-dot.svg' : 'Bell.svg'
    }
  }
}
</script>

<style scoped>
.bell-active {
  background-color: #EAECEE;
  border-radius: 8px;
}
</style>
