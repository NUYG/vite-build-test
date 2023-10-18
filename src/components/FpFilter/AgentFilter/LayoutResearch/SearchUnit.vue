<template>
    <TextField placeholder="Tìm" @fieldVal="onSearchValue"/>
</template>


<script>
import TextField from "@/components/FpInput/FpFields/TextField.vue";
export default {
    methods:{
      onSearchValue(data)
      {
        this.$emit('searchVal',{['searchVal']:data})
      }
    },
    components:{
      TextField
    },
   emits:['searchVal']
}
</script>