<template>
    <div class="d-flex flex-wrap justify-content-between">
      <div style="width: 80%" class="friend-chat border8 p-2"
           :class="{'user-chat order-2':isUserName}">
        <img :src="mes?.extData?.dataUrl" alt="img msg" class="w-100"/>
      </div>
      <div class="col d-flex align-items-center "
           :class="{'order-1 justify-content-end':isUserName}">
      </div>
    </div>
</template>

<script>
export default {
  props:{
    isUserName:Boolean,
  }
}
</script>
