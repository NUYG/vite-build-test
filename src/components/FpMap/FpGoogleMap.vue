<template>
  <div :class="iframeContainer" :style="`width:100%; height:100%`" v-if="location" class="iframe-rwd">
    <iframe  width="100%" height="100%"
            :src="`https://maps.google.com/maps?width=100%25&amp;height=100%&amp;hl=en&amp;q=Google,${location}&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed`">
    </iframe>
  </div>

</template>

<script>
export default {
  props:{
    location:{
      type:String,
    },
    iframeContainer:{
      type:String
    },
  },
}
</script>

<style scoped>
.iframe-rwd  {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}
.iframe-rwd iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
