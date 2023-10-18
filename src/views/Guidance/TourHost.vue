<template>
  <slot name="content">

  </slot>
</template>

<script lang="js">


import {completePageTour, pageTourDone, userTourDisabled} from "@/views/Guidance/utils";
import {mapGetters} from "vuex";

export default {
  components: {},
  data() {
    return {
      tour: null,
    };
  },
  props: {
    // TourOptions obj
    tourOptions: {
      type: Object,
      default: {},
    },
    pageName: {
      type: String,
      required: true,
    },
    startDelay: {
      type: Number,
      default: 600,
    },
  },
  computed: {
    ...mapGetters(['getAllStore']),
      username()
      {
        return this.getAllStore?.currentUserData?.username
      }
  },
  methods: {
    onTourCancel() {
    },
    onTourCompleted(){
      completePageTour(this.username, this.pageName);
    },
    createTour() {
      this.tour = this.$shepherd(this.tourOptions);
    },
    async playTour() {

      setTimeout(() => {
        console.log(this.username, ' asdkjaskjdlakjsd')
        if (userTourDisabled(this.username, this.pageName)){
          return;
        }

        if (pageTourDone(this.username, this.pageName)){
          return;
        }

        this.createTour();
        this.tour.start();

        this.tour.on('cancel', this.onTourCancel);
        this.tour.on('complete', this.onTourCompleted)
      }, this.startDelay);
    }
  },
  watch: {

  },
  emits: [],
  async mounted() {
    await this.getAllStore;
    await this.playTour();
  },
  created() {

  },
  unmounted() {
    if (this.tour){
      this.tour.cancel();
    }
  }
}
</script>

<style scoped>
</style>
