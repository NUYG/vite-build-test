<template>
  <div class="position-relative">
    <slot name="objectBadged" >
    </slot>
    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill " :class="badgeNumbClass" v-if="badgeNumb>0">
         {{badgeNumb}}
    </span>
  </div>
</template>

<script>
  export default {
    props:{
      badgeNumb:{
        type:Number,
        default:0
      },
      badgeNumbClass:{
        type:String,
        default: 'more-bg'
      }
    }
  }
</script>
