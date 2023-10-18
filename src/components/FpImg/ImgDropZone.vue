<template>
   <label for="file-input" class="drop-area text-center py-4" :class="{ dragging: dragging }"
          @dragover.prevent="dragOverHandler"
          @dragenter.prevent="dragEnterHandler"
          @dragleave.prevent="dragLeaveHandler"
          @drop.prevent="dropHandler"
          @dragstart="dragStartHandler"
   >
      <span  :class="contentClass">{{textContent}}</span>
      <br>
      <span  :class="ruleTextClass">
         Tối thiểu 300x300px, tối đa 5Mb
         (JPEG, JPG, PNG, GIF, BMP, WEBP)
      </span>
   </label>
   <input @dragstart="dragStartHandler" id="file-input" type="file" accept="image/*" multiple @change="onFileSelected"
          @click="resetFileInput"/>
</template>

<script>

export default {
   components: {},
   data() {
      return {
         selectedFiles: [],
         images: [],
         visible: true,
         loadedImages: [],
         dragging: false,
      }
   },
   props: {
     textContent:{
       type:String,
       default:'Kéo & thả ảnh hoặc nhấn vào vùng này để tải ảnh lên.'
     },
     ruleTextClass:{
       type:String,
       default:'text-small text-gray text-wrap mt-2'
     },
     contentClass:{
       type:String,
       default:'text-content mt-2'
     }
   },
   computed: {},
   methods: {
      resetFileInput(event) {
         if (this.previousFile && this.previousFile === event.target.files[0]) {
            event.target.value = null;
         }
      },
      dragStartHandler(event) {
         event.preventDefault();
      },
      dragOverHandler(event) {
         event.preventDefault();
         this.dragging = true;
      },
      dragEnterHandler(event) {
         event.preventDefault();
      },
      dragLeaveHandler(event) {
         event.preventDefault();
         this.dragging = false;
      },
      dropHandler(event) {
         event.preventDefault();
         const files = event.dataTransfer.files;
         this.readFileUpload(files);
      },
      onFileSelected(event) {
         const files = event.target.files;
         this.readFileUpload(files);
         this.previousFile = files[0];
      },
      readFileUpload(files) {
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
                     width: image.width,
                     height: image.height,
                  };
                  if (selectedFile.width > 300 && selectedFile.height > 300) {
                     this.$emit("file-uploaded", selectedFile);
                  } else {
                     window.alert(`file ${selectedFile.name} không đạt tiêu chuẩn`);
                  }
                 if(i === files.length - 1)
                 {
                   this.$emit("finishUpload");
                 }
               };
            };
            reader.readAsDataURL(file);
         }
      },
   },
   watch: {},
   emits: ["file-uploaded","finishUpload"],
   mounted() {
   },
}
</script>
