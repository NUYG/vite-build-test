<template>
  <div class="container-fluid ">
    <div class="row d-flex justify-content-center my-4">
      <img alt="MORE logo" :src='getIconUrl("MORE_horizontal_logo.png")' style="width: 300px;height: auto">
    </div>
    <div class="d-flex  justify-content-center align-items-center align-content-center text-center ">
      <div class="col-11 col-lg-6 box-shadow p-4 py-3 border8 ">
        <span style="font-weight: 600;font-size:24px">Chào mừng</span>
        <FpForm classes="mt-3 text-content d-flex justify-content-center" title="Vui lòng đăng nhập để bắt đầu"
                :fields="fields" submit-text="Đăng nhập" btn-status="more-btn"
                @submitData="submitForm" btnSubmitContainer="row d-flex justify-content-center" btnSubmitClass="col-7">
          <template #message>
                      <div class="col-lg-10 col-12 d-flex justify-content-end">
                        <p class="mt-2 pe-4" style="color: #95A4FC" @click="$router.push('/resetPw')">Quên mật khẩu ?</p>
                      </div>
            <p v-if="errorText" class="text-danger text-center ">{{ errorText }}</p>
          </template>

        </FpForm>
        <p class="text-center mt-3">Chưa có tài khoản?
          <RouterLink to="/register" class="text-primary">Đăng ký</RouterLink>
        </p>
      </div>
    </div>
  </div>
  <div class="row position-fixed " style="right: 10%;bottom: 10%">
    <div class="p-3 btn-go-cart" @click="$router.push(FpGuestCart)">
      <FpIcon src-icon="Storefront.svg" :size="32" class="p-0"></FpIcon>
    </div>
  </div>

</template>

<script>
import FpForm from '../../components/FpInput/FpForm.vue'
import {post} from "@/utils/dataQuery";
import {getIconUrl, goToURL} from "@/utils/utils";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import ButtonView from "@/components/FpButton/ButtonView.vue";
import {scrWdtEnum, scrWdtFrom, scrWdtTo} from "@/utils/windowWidth";
import {FpGuestCart, homeURL} from "@/router/URLs";
import {mapActions} from "vuex";
export default {
  components: {
    FpIcon,
    FpForm,
    ButtonView,
    FpGuestCart
  },
  data() {
    return {
      fields: [
        {
          id: 'username',
          name: 'username',
          type: 'username',
          label: '',
          placeholder: 'Tên đăng nhập',
          widthField: scrWdtFrom(scrWdtEnum.LG) ? 60 : 80,
        },
        {
          id: 'pw',
          name: 'password',
          type: 'password',
          label: '',
          placeholder: 'Mật khẩu',
          widthField: scrWdtFrom(scrWdtEnum.LG) ? 60 : 80,
        }
      ],
      errorText: '',
      userRoles: '',
      FpGuestCart
    }
  },

  methods: {
    getIconUrl,
    async submitForm(data) {
      const res = await post('/fp_user/login_api', data)
      if (res) {
        // localStorage.setItem('token', res.token)
        goToURL(homeURL)
      } else {
        this.errorText = 'Thông tin đăng nhập chưa chính xác !'
      }
    },
  },
  mounted() {
  },
}
</script>


<style>
.box-shadow {
  box-shadow: 0 4px 116px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}
.btn-go-cart{
  box-shadow: 0 4px 116px rgba(0, 0, 0, 0.4);
  border-radius: 16px;
}
.btn-go-cart:hover{
  border:1px solid #D9D9D9;
}
</style>
