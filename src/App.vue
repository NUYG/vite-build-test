<script setup >

import InstallApp from "@/components/features/InstallApp.vue"
import MainView from "@/views/MainView.vue";

</script>

<template>
<div class="container-fluid pe-0">
  <MainView/>
  <InstallApp v-if="false"></InstallApp>
</div>
</template>



