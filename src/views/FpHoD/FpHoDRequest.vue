<template>
  <FpDefLayout :bc-props="pgMeta">
    <template #comp>
      <h4 class="text-center">Yêu cầu</h4>
      <div class="row d-flex justify-content-center">
        <div class="col-lg-6 col-10 mt-2">
          <TextField placeholder="Tên yêu cầu" @field-val="onNameReqChange"></TextField>
        </div>
      </div>
      <div class="d-flex row justify-content-center">
        <div class="mt-2 col-lg-6 col-10">
          <textarea class="form-control" rows="3" placeholder="Vấn đề gặp phải" v-model="content"></textarea>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <ButtonView content="Gửi yêu cầu" class="col-lg-6 col-10" status="more-btn" @click="submitReq"></ButtonView>
      </div>
    </template>
  </FpDefLayout>
</template>
<script>

import {defineComponent} from "vue";
import FpDefLayout from "@/views/FpDefLayout.vue";
import {breadcrumpProp} from "@/models/customProp";
import TextField from "@/components/FpInput/FpFields/TextField.vue";
import NoteField from "@/components/FpInput/FpFields/noteField.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {post} from "@/utils/dataQuery";

export default defineComponent({
  components: {NoteField, FpDefLayout, TextField,ButtonView},
  data() {
    return {
      pgMeta: {
        [breadcrumpProp.title]: 'Yêu cầu'
      },
      name:'',
      content:''
    }
  },
  methods:{
    onNameReqChange(val)
    {
      this.name = val
    },
    async submitReq()
    {
      const res = await post('/hod/create_hod_request',{
        name:this.name,
        content:this.content
      })
    },
    // async testApi()
    // {
    //   const res = await post('/hod/get_hod_requests_mgmt',{
    //     id:1,
    //   })
    //   console.log(res,'res')
    // }
  },
  mounted() {
  }
})
</script>
