<template>
  <div class="row d-flex justify-content-center my-4">
    <img alt="MORE logo" :src='getIconUrl("MORE_horizontal_logo.png")' style="width: 300px;height: auto;">
  </div>
  <div class="d-flex  justify-content-center align-items-center align-content-center text-center ">
    <div class="col-11 col-lg-6 box-shadow p-4 border8 ">
      <span style="font-weight: 600;font-size:24px">Quên mật khẩu</span>
      <FpForm classes="mt-3 text-content d-flex justify-content-center"  :fields="fields"
              submit-text="Xác nhận" btnStatus="more-btn"
              @submitData="onSubmitForm" btnSubmitContainer="row d-flex justify-content-center" btnSubmitClass="col-7">
        <template #message>
<!--          <div class="col-lg-10 col-12 d-flex justify-content-end">-->
<!--            <p class="mt-2 pe-lg-4" style="color: #95A4FC" @click="$router.push('/login')">Quay lại</p>-->
<!--          </div>-->
          <p v-if="errorMessage" class="text-danger text-center ">{{ errorMessage }}</p>
        </template>
      </FpForm>
      <p class="text-center mt-2">
        <RouterLink to="/login" style="color: rgb(149, 164, 252);">Quay lại</RouterLink>
      </p>
    </div>
  </div>
</template>

<script>
import FpForm from '../../components/FpInput/FpForm.vue'
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {post} from "@/utils/dataQuery";
import {getIconUrl, goToURL} from "@/utils/utils";

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
          id: 'usernameEmail',
          name: 'username',
          type: 'text',
          placeholder: 'Tên người dùng',
          required: true,
          widthField: scrWdtFrom(scrWdtEnum.LG) ? 60 : 100
        },
      ],
    }
  },
  methods: {
    getIconUrl,
    async onSubmitForm(data) {
      const res = await post("/fp_user/send_reset_email", {
        usernameEmail: data.usernameEmail,
      })
      this.$router.push('/login');
    },
  }
}
</script>

<style>
.box-shadow {
  box-shadow: 0 4px 116px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}
</style>
