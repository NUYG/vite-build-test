<template>
  <div class="row d-flex justify-content-center my-4">
    <img alt="MORE logo" :src='getIconUrl("MORE_horizontal_logo.png")' style="width: 300px;height: auto;">
  </div>
  <div class="d-flex  justify-content-center align-items-center align-content-center text-center ">
    <div class="col-11 col-lg-6 box-shadow p-4 border8 ">
      <span style="font-weight: 600;font-size:24px">Thay đổi mật khẩu</span>
      <FpForm classes="mt-3 text-content d-flex justify-content-center" title="Thay đổi mật khẩu" :fields="fields"
              submit-text="Cập nhật"
              @submitData="formData" btnSubmitContainer="row d-flex justify-content-center" btnSubmitClass="col-7">
        <template #message>
          <p v-if="errorMessage" class="text-danger text-center ">{{ errorMessage }}</p>
        </template>
      </FpForm>
    </div>
  </div>
</template>

<script>
import FpForm from '../../components/FpInput/FpForm.vue'
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {post} from "@/utils/dataQuery";
import {getIconUrl} from "@/utils/utils";
import {homeURL} from "@/router/URLs";

export default {
  components: {
    FpIcon,
    FpForm
  },
  data() {
    return {
      errorMessage: false,
      fields: [
        {
          id: 'oldPw',
          name: 'oldPw',
          type: 'password',
          placeholder: 'Mật khẩu cũ',
          required: true,
          widthField: scrWdtFrom(scrWdtEnum.LG) ? 60 : 100
        },
        {
          id: 'pw',
          name: 'password',
          type: 'password',
          placeholder: 'Mật khẩu',
          required: true,
          widthField: scrWdtFrom(scrWdtEnum.LG) ? 60 : 100,
        },
        {
          id: 'pwConfirm',
          name: 'ConfirmPassword',
          type: 'password',
          placeholder: 'Lặp lại mật khẩu',
          required: true,
          widthField: scrWdtFrom(scrWdtEnum.LG) ? 60 : 100
        }
      ],
      oldPw: '',
      pw: '',
      pwConfirm: '',
      succeed: '',
      resText: ''
    }
  },
  methods: {
    getIconUrl,
    async formData(data) {
      try {
        if (!data.oldPw || !data.pw || !data.pwConfirm) {
          this.errorMessage = 'vui lòng điền đầy đủ các trường thông tin!'
          return
        }

        if (data.pw !== data.pwConfirm) {
          this.errorMessage = 'Mật khẩu xác nhận không trùng khớp!'
          return
        }

        const res = await post('/fp_user/user_change_pw', data);
        if (res.succeed) {
          this.$router.push(homeURL)
        } else {
          this.errorMessage = res.resText
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
.box-shadow {
  box-shadow: 0 4px 116px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}
</style>
