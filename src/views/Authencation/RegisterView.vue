<template>
  <div class="row d-flex justify-content-center my-4">
    <img alt="MORE logo" :src='getIconUrl("MORE_horizontal_logo.png")' style="width: 300px">
  </div>
  <div class="d-flex  justify-content-center align-items-center align-content-center text-center ">
    <div class="col-11 col-lg-6 box-shadow p-4 border8 ">
      <span style="font-weight: 600;font-size:24px">Đăng ký</span>
      <FpForm classes="mt-3 custom-placeholder d-flex justify-content-center" title="Bắt đầu kết nối với hệ thống giỏ hàng chất lượng cao" :fields="fields" submit-text="Đăng ký"
              @submitData="formData" btnSubmitContainer="row d-flex justify-content-center" btnSubmitClass="col-7"  btn-status="more-btn" labelCLass="col-lg-7" :customInput="true">
        <template #message>
          <div class="col-lg-10 col-12 p-0 ">
            <p class="mt-3 ps-4 d-flex justify-content-start justify-content-xl-center">
              <input type="checkbox" v-model="confirmInfo"/>&nbsp Tôi xác nhận thông tin trên là đúng &nbsp
<!--              <span style="color: #95A4FC">các điều khoản</span>-->
            </p>
          </div>
          <p v-if="errorMessage" class="text-danger text-center ">{{ errorMessage }}</p>
        </template>

      </FpForm>
      <p class="text-center mt-3">Đã có tài khoản?
        <RouterLink to="/login/" class="text-primary">Đăng nhập</RouterLink>
      </p>
    </div>
  </div>
</template>

<script>

import FpForm from '../../components/FpInput/FpForm.vue'
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import {getIconUrl} from "@/utils/utils";
import {post} from "@/utils/dataQuery";
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
          id: 'username',
          name: 'username',
          type: 'text',
          placeholder: 'Không chứa ký tự đặc biệt hoặc khoảng trắng',
          label:'Tên đăng nhập',
          required: true,
          widthField:scrWdtFrom(scrWdtEnum.LG) ? 60 : 100,
          valueStreaming:true
        },
        {
          id: 'last_name',
          name: 'last_name',
          type: 'text',
          placeholder: 'VD: Thuỳ Minh',
          label:'Họ',
          required: true,
          widthField:scrWdtFrom(scrWdtEnum.LG) ? 60 : 100,
          valueStreaming:true
        },
        {
          id: 'first_name',
          name: 'first_name',
          type: 'text',
          placeholder: 'VD: Trần',
          label:'Tên',
          required: true,
          widthField:scrWdtFrom(scrWdtEnum.LG) ? 60 : 100
        },
        {
          id: 'phone',
          name: 'phone',
          type: 'phone',
          placeholder: 'VD: 0908208568',
          label:'Số điện thoại',
          required: true,
          widthField:scrWdtFrom(scrWdtEnum.LG) ? 60 : 100
        },
        {
          id: 'CID',
          name: 'citizenID',
          type: 'CID',
          placeholder: 'VD: 01234500011234',
          label:'Căn cước công dân',
          required: false,
          widthField:scrWdtFrom(scrWdtEnum.LG) ? 60 : 100
        },
        {
          id: 'email',
          name: 'email',
          type: 'email',
          placeholder: '@gmail.com',
          label:'Email',
          required: true,
          borderWhite:false,
          widthField:scrWdtFrom(scrWdtEnum.LG) ? 57 : 94
        },
        {
          id: 'pw',
          name: 'password',
          type: 'password',
          placeholder: 'Chứa tối thiểu 8 ký tự và có ít nhất một chữ số',
          label:'Mật khẩu',
          required: true,
          widthField:scrWdtFrom(scrWdtEnum.LG) ? 60 : 100,
          textUnderForm: 'Sử dụng nhiều hơn 8 ký tự có ít nhất một chữ và số'
        },
        {
          id: 'pwConfirm',
          name: 'pwConfirm',
          type: 'password',
          placeholder: 'Xác nhận lại mật khẩu của bạn',
          label:'Xác nhận mật khẩu',
          required: true,
          widthField:scrWdtFrom(scrWdtEnum.LG) ? 60 : 100,
        },
        {
          id: 'referral',
          name: 'referral',
          type: 'text',
          placeholder: 'VD: hungmoigioi28',
          label:'Người giới thiệu',
          required: false,
          widthField:scrWdtFrom(scrWdtEnum.LG) ? 60 : 100
        },
      ],
      username: '',
      pw: '',
      succeed: '',
      resText: '',
      confirmInfo:false
    }
  },
  methods: {
    getIconUrl,
     formData(data) {
       if (!data.first_name || !data.pw || !data.phone || !data.email) {
         this.errorMessage = 'Vui lòng điền đầy đủ các trường thông tin!';
         return;
       } else if (data.pw !== data.pwConfirm) {
         this.errorMessage = 'Mật khẩu xác nhận không trùng khớp!';
         return;
       } else if (!this.confirmInfo) {
         this.errorMessage = 'Vui lòng check vào ô xác nhận!';
         return;
       } else if (!(/(?!.*[.\-_]{2,})^[a-zA-Z0-9.\-_]{3,24}$/.test(data.username))) {
         this.errorMessage = 'Tên đăng nhập không được chứa khoảng trắng hoặc kí tự đặc biệt!';
         return;
       }
       this.onSubmitRegister(data)
    },
    async onSubmitRegister(data)
    {
      if(! await this.checkValidUsername(data.username))
      {
          return
      }
      this.errorMessage=''
      const response = await post('/fp_user/register', data)
      if (response.succeed) {
        window.alert('Tạo tài khoản thành công!')
        this.$router.push('/login')
      }
    },
    async checkValidUsername(value)
    {
      if(value)
      {
        const res = await post('/fp_user/username_exist_check',{username:value})
        if(!res.succeed)
        {
          window.alert('Tài khoản đã tồn tại')
        }
        return true
      }
    }

  }
}
</script>

<style >
.box-shadow{
  box-shadow: 0 4px 116px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}
</style>
