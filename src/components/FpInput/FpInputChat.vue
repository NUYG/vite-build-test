<template>
  <div class="d-flex mt-2 p-2 form-chat justify-content-between row">
    <input type="text" v-model="inputData.textVal" :disabled="disableInput"
           class=" border-0 input-chat text-dark form-control rounded text-wrap d-block col"
           @keyup.enter="handleSubmit" placeholder="Nhắn tin" @click="$emit('inputChatClick')"
           @blur="$emit('inputChatBlur')"/>
    <div class="d-flex justify-content-end col-auto">
      <label :for="`file-input`+id" @mousedown="triggerFileInput">
        <ButtonView :btn-icon="getIconUrl('ImageSquare.svg')" :icon-size="28" status="no-bg-btn"></ButtonView>
      </label>
      <input :id="`file-input`+id" type="file" accept="image/*" style="display: none" @change="onFileSelected"  multiple :disabled="disableInput">
      <ButtonView status="no-bg-btn" :btnIcon="getIconUrl('sendMessage.svg')" @click="handleSubmit" :iconSize="28"/>
    </div>
  </div>
</template>

<script>
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {getIconUrl} from "@/utils/utils";
import {post} from "@/utils/dataQuery";

export default {
  components: {ButtonView},
  props: {
    disableInput:Boolean,
    id:Number,
    previewData:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      inputData: {
        textVal: '',
        imgData: '',
      },
      imgUploadList: []
    }
  },
  emits: ['inputChatSubmit', 'inputChatClick', 'inputChatBlur','chatImgContent'],
  computed:{
    formatImgList()
    {
      if(this.imgUploadList.length > 0)
      {
        const formatData = []
        this.imgUploadList.map(img => {
          formatData.push({imgName:img?.name,imgData:img.dataUrl})
        })
        console.log('thông tin cập nhật lại')
        return formatData
      }
    }
  },
  methods: {
    getIconUrl,
    triggerFileInput() {
      const fileInput = document.getElementById(`file-input`+this.id);
      if (fileInput) {
        fileInput.click();
      }
    },
    onFileSelected(event) {
      const files = event.target.files;
      this.readFileUpload(files);
      this.previousFile = files[0];
    },
    async readFileUpload(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          window.alert(`${file.name} không phải là tệp ảnh.`);
          continue;
        }
        const reader = new FileReader();
        const image = new Image();
        reader.onload = () => {
          image.src = reader.result;
          image.onload = () => {
            const selectedFile = {
              dataUrl: reader.result,
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
            };
            if(selectedFile)
            {
              this.imgUploadList.push(selectedFile)
            }
            if (i === files.length - 1 ) {
                this.handleSubmit()
            }
          };
        };
         await  reader.readAsDataURL(file);
      }
    },
    async handleSubmit() {
      if (this.imgUploadList.length > 0){
        await this.uploadChatImg();
      }
      else {
        await this.$emit('inputChatSubmit', this.inputData.textVal)
      }
      this.inputData.textVal = ''
      this.inputData.imgData = ''
    },
    async uploadChatImg() {
      const response = await post("/mlib/img/create_chat_imgs", {
        imgList: this.formatImgList
      });
      console.log('gửi rồi')
      if (response?.succeed && response.returnData) {
        this.$emit('chatImgContent', response.returnData)
        this.imgUploadList = []
      }
    },
  },
  watch:{
    previewData: {
      handler(newVal) {
        {
          this.imgUploadList = newVal
        }
      },
      deep: true
    },
  }
}
</script>

<style scoped>
.form-chat {
  border-radius: 16px;
  background-color: #F7F7F7;
}

.input-chat {
  background-color: #F7F7F7 !important;
  width: 80% !important;
}

.input-chat:focus {
  outline: none;
  box-shadow: none;
}

</style>
