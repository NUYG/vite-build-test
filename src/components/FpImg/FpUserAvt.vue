<template>
  <div>
    <label :for='idFormInput' :class="{'d-flex justify-content-center position-relative':upload}"
           style="border-radius: 100%">
      <img :src='avtData' alt='' class="rounded-circle-with-border" :class="classes" :style="imgStyle"
           style="border-radius: 100%">
      <span v-if="upload" class='user-img-text'>Thay đổi</span>
      <!--      <FpDot :dotSize="dotSize" classStyle="position-absolute dot-position" :dotColor="dotColor"></FpDot>-->
    </label>
    <input v-if="upload" id='file-input' type='file' ref="fileInput" accept='image/*' style='display:none'
           @change='readFile'>
  </div>
</template>

<script>
import {post} from "@/utils/dataQuery";
import {getImgUrlFromExtData} from "@/utils/avataFunction";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      extData: false,
    }
  },
  props: {
    classes: {
      type: String,
      default: ''
    },
    upload: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number
    },
    anotherUser: {
      type: Boolean,
      default: false
    },
    anotherAvt: {
      type: Object,
      default: () => {
      },
    },
    freeSrcAvt: {
      type: String,
    },
    dotSize: {
      type: Number,
      default: 8
    },
    dotColor: {
      type: String,
    },
    avtOutline: {
      type: String,
    },
    isGuest:{
      type:Boolean,
      default:false
    }
  },
  computed: {
    ...mapGetters(['getAllStore']),
    avtData() {
      if (this.freeSrcAvt) {
        return this.extData = this.freeSrcAvt
      }
      return getImgUrlFromExtData(this.extData)
    },
    imgStyle() {
      const outLine = this.avtOutline ? `border-radius: 50%;background-color: white;box-shadow: 0 0 0 3px ${this.avtOutline} ` : ''
      const size = this.size ? `;width:${this.size}px;height:${this.size}px; ` : ''
      return outLine + size
    },
    idFormInput() {
      return this.upload ? 'file-input' : ''
    },
    avtCurrentUser()
    {
        return this.getAllStore?.currentUserData?.extData[0]
    }
  },
  methods: {
    // check has avt props => render ; else render avt default user
    async getAvtUser() {
      if (this.anotherUser) {
        this.extData = this.anotherAvt
      } else {
        this.extData = this.avtCurrentUser
      }
    },
    readFile(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      // const image = new Image();
      reader.onload = () => {
        const selectedFile = {
          dataUrl: reader.result,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };
        this.$emit('avtChanged', selectedFile)
        this.$refs.fileInput.value = null;
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    },
  },
  emits: ['avtChanged'],
  mounted() {
   !this.isGuest ? this.getAvtUser() : '';
  },
  components: {},
  watch:
    {
      anotherAvt() {
        this.getAvtUser();
      },
    },
}
</script>

<style scoped>
.round-border {
  border-radius: 100% !important;
}

</style>
