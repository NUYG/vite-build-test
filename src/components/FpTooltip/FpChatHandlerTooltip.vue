<template>
  <div class="tooltip-content justify-content-end" :id="id" :class="isUserName ? 'my-chat-position' : 'friend-chat-position'">
    <FpIcon src-icon="DotsThree.svg" :size="24" class="col-auto h-100 position-relative" @click="handlerChat=!handlerChat"></FpIcon>
    <div class="position-absolute handler-chat-tooltip box-shadow" v-if="handlerChat">
      <p class="mt-2 text-center sidebar-menu_item px-3 py-2 col-auto" @click="removeChat(id)">Thu hồi</p>
    </div>
  </div>
</template>

<script>

import {defineComponent} from "vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";

export default defineComponent({
  components: {FpIcon},
  props:{
    id:Number,
    isUserName:{
      type:Boolean
    },
  },
  data()
  {
    return{
      handlerChat:false
    }
  },
  emits:['openHandlerID','removeChat'],
  methods:{
    removeChat(id)
    {
      this.$emit('removeChat',id)
    }
  }
})
</script>

<style>

.box-shadow{
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.tooltip-content {
  /*display: none;*/
  position: absolute;
  transform: translateY(-50%);
  background-color: #efefef;
  padding: 2px;
  border-radius: 8px;
  z-index: 100;
}

.my-chat-position {
  right: 110%;
  top: 50%;
}

.friend-chat-position {
  left: 110%;
  top: 50%;
}

</style>
