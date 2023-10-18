<template>
  <div>
    <router-view></router-view>
    <router-view name="subView"></router-view>
  </div>
</template>

<script>
export default {
  name: 'SDashBoardController',
};
</script>
