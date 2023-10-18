<template>
   <img @click='downloadImages' :src="getIconUrl('download.svg')" class='p-0 icon-hover' style='width:20px' alt=''>
</template>

<script>
import {getIconUrl} from "@/utils/utils";
import {IMG_URL} from "@/utils/constants";
export default {
  data() {
    return {
    }
  },
  props: {
     imageUrls: {
        type: Array,
        default: () => ([]),
     },
  },
  computed: {
  },
  methods: {
     getIconUrl,
     downloadImages() {
        this.imageUrls.forEach((url) => {
           const link = document.createElement("a");
           link.href = IMG_URL + url;
           link.download = url;
           link.click();
        });
     },
  },
}
</script>

<style scoped>

</style>