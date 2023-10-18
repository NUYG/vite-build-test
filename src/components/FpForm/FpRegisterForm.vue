<template>
  <FpDynamicForm :schema="formSchema" />
</template>
<script>
import FpDynamicForm from '@/components/FpForm/FpDynamicForm.vue';
import * as Yup from 'yup';
export default {
  components: {
    FpDynamicForm,
  },
  data: () => {
    const formSchema = {
      fields: [
        {
          placeholder:'Tên đăng nhập',
          name: 'username',
          as: 'input',
          rules: Yup.string().required(),
        },
        {
          placeholder:'Họ',
          name: 'first_name',
          as: 'input',
          rules: Yup.string().required(),
        },
        {
          placeholder:'Tên',
          name: 'last_name',
          as: 'input',
          rules: Yup.string().required(),
        },
        {
          placeholder:'Số điện thoại',
          name: 'phone',
          as: 'input',
          rules: Yup.string().required(),
        },
        {
          placeholder:'Căn cước công dân',
          name: 'citizenID',
          as: 'input',
          rules: Yup.string().required(),
        },
        {
          placeholder:'Email',
          name: 'email',
          as: 'input',
          rules: Yup.string().email().required(),
        },
        {
          placeholder:'Mật khẩu',
          name: 'password',
          as: 'input',
          type: 'password',
          rules: Yup.string().min(6).required(),
        },
      ],
    };
    return {
      formSchema,
    };
  },
};
</script>