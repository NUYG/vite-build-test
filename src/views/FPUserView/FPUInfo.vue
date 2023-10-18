<template>
  <FpDefLayout
      :bc-props="state.pgMeta"
  >
    <template #comp>
      <div class="container-fluid">
        <div class='d-flex justify-content-center pb-5' v-if='state.userData'>
          <div class='col-lg-10 col-12'>
            <div class='row d-flex justify-content-center'>
              <div class='col-lg-3 col-8 col-md-6'>
                <label for='file-input' class='d-flex justify-content-center position-relative'>
                  <img :src='avtData' alt='' class='user-img rounded-circle'>
                  <span class='user-img-text'>Thay đổi</span>
                </label>
                <input id='file-input' type='file' accept='image/*' style='display:none' @change='readFile'>
                <span
                    class='d-flex justify-content-center mt-3 font-size-20'><b>{{state.userData.last_name }} {{ state.userData.first_name }}</b></span>
                <p class='text-center text-gray'><img :src='getIconUrl("MapPin.svg")' alt=''> {{ territories }}</p>
              </div>
            </div>

            <div class='row mt-4 px-lg-5 px-2 '>
              <div class='col-12 col-md-6 py-2'>
                <div class=' p-3 border border-gray border8'>
                  <span class='text-gray text-content'>Họ</span>
                  <input v-model='state.userData.last_name' type='text' class='form-control border-white'>
                </div>
              </div>
              <div class='col-12 col-md-6 py-2'>
                <div class=' p-3 border border-gray border8'>
                  <span class='text-gray text-content'>Tên</span>
                  <input v-model='state.userData.first_name' type='text' class='form-control border-white'>
                </div>
              </div>
              <div class='col-12 col-md-6 py-2' v-if="state.userData.extData[0]">
                <div class=' p-3 border border-gray border8'>
                  <span class='text-gray text-content'>Số điện thoại</span>
                  <input v-model='state.userData.extData[0].phone' type='text' class='form-control border-white'>
                </div>
              </div>
              <div class='col-12 col-md-6 py-2'>
                <MultTagField
                    @item-picked='disPicked'
                    @item-removed='disRemoved'
                    :selectedItems='state.userData.extData[0].terData'
                    fieldId='dist-field'
                    title='Khu vực hoạt động'
                    nameAttr='name'
                    sugDataEP='/areas/get_districts_data'
                />
              </div>
              <div class='col-12 col-md-6 py-2'>
                <div class='p-3 border border-gray rounded border8'>
                  <div class='text-gray text-content'>Ngày sinh</div>
                  <input v-model='state.userData.extData[0].dob' type='date' class='form-control border-0 border-white border'>
                </div>
              </div>
              <div class='col-12 col-md-6 py-2'>
                <div class='p-3 border border-gray rounded border8'>
                  <label class='text-gray text-content'>Giới tính</label>
                  <select class='form-control-plaintext' v-model='state.userData.extData[0].gender'>
                    <option v-for='(gender, index) in state.GENDERS' :key="index" :value='gender[0]'>{{ gender[1] }}</option>
                  </select>
                </div>
              </div>
              <div class='col-12 col-md-6 py-2'>
                <div class='p-3 border border-gray border8'>
                  <span class='text-gray text-content'>Email</span>
                  <input v-model='state.userData.extData[0].email' type='text' class='form-control border border-white'>
                </div>
              </div>
              <div class='col-12 col-md-6 py-2'>
                <div class='p-3 border border-gray border8'>
                  <span class='text-gray text-content'>Facebook</span>
                  <input v-model='state.userData.extData[0].fb' type='text' class='form-control border border-white'>
                </div>
              </div>
              <div class='col-12 col-md-6 py-2'>
                <div class='p-3 border border-gray border8'>
                  <span class='text-gray text-content'>Căn cước công dân</span>
                  <input v-model='state.userData.extData[0].nid' type='text' class='form-control border border-white'
                         minlength='12' maxlength='12'>
                </div>
              </div>
              <div class='col-12 col-md-6 py-2'>
                <div class='p-3 border border-gray border8'>
                  <span class='text-gray text-content'>Địa chỉ</span>
                  <input v-model='state.userData.extData[0].address' type='text' class='form-control border border-white'>
                </div>
              </div>
            </div>

            <div class='px-5 row mt-3'>
              <div class='col-lg-4 col-12 '>
                <VerifyModal
                    @func-btn-clicked='deactiveUser'
                    id='a'
                    triggerBtnText='Vô hiệu hóa tài khoản'
                    title='Xác nhận vô hiệu hóa tài khoản'
                    funcBtnText='Xác nhận'
                    triggerBtnClass='btn btn-unstyled'
                />
              </div>
            </div>

            <p class='px-5 mt-3 text-content'>
              <VerifyModal
                  @func-btn-clicked='deleteAvt'
                  id='b'
                  triggerBtnText='Xóa ảnh đại diện'
                  title='Xác nhận xóa ảnh đại diện'
                  funcBtnText='Xác nhận'
                  triggerBtnClass='btn btn-unstyled'
              />
            </p>

            <div class='px-5 mt-3 row text-content'>
              <div class="col-lg-auto col-auto">
                <button class='gray-button rounded' @click='goToChangePw'>Thay đổi mật khẩu
                </button>
              </div>
            </div>

            <div class='row mt-4 d-flex justify-content-center'>
              <div class='col-5 p-2'>
                <button class='gray-button w-100 rounded btn-wrap-text small' @click='updateUserData'>Lưu thay đổi
                </button>
              </div>
              <div class='col-4 p-2'>
                <button class='w-100 btn-wrap-text small gray-button' @click='reload'>Hủy thay đổi</button>
              </div>
            </div>


          </div>
        </div>

      </div>

    </template>
  </FpDefLayout>
</template>

<script lang="ts">

import {getIconUrl} from "@/utils/utils";
import {goToURL} from "@/utils/utils";
import {getCompareValue, post, deleteImage} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {IMG_URL} from "@/utils/constants";

import FpDefLayout from "@/views/FpDefLayout.vue";
import MultTagField from "@/components/FpInput/FpFields/MultTagField.vue";
import VerifyModal from "@/components/Misc/VerifyModal.vue";

import {breadcrumpProp} from "@/models/customProp";
import type {ExtData, UserData, PgMeta} from "@/types/interface";
import {defineComponent, reactive, ref} from "vue";
import {FPU_CHANGE_PW} from "@/router/URLs";

export default defineComponent({
  components: {
    VerifyModal,
    MultTagField,
    FpDefLayout,
  },
  setup() {
    const state = reactive({
      userData : ref<UserData>(),
      IMG_URL : ref(''),
      extData: ref<ExtData>(),
      // GENDERS : <Array<Array<string>>>[],
      GENDERS : ref<string[][]>([]),
      SALE_PROCESS_STATUS : ref<string[]>([]),
      FPU_CHANGE_PW,
      pgMeta: ref<PgMeta>({
        [breadcrumpProp.enableRB]: false,
      })
    })
    const updateUserAvt = async (selectedFile: any) => {
      const response = await post("/mlib/img/user_avt_upload", {
        objId: state.userData?.extData[0].id,
        imgName: selectedFile.name,
        imgData: selectedFile.dataUrl,
      });
      if (response) {
        state.extData ?  state.extData.avtData = response.imgData : '';
        window.alert("Cập nhật ảnh thành công");
        window.location.reload()
      }
    }
    const getDataLib = async () => {
      const res = await getCompareValue([
        DataLibType.GENDERS]
      );
      state.GENDERS = res.GENDERS ? res.GENDERS : [];
      // console.log(state.GENDERS, 'gender')
    }
    const  getUserData = async () => {
      const response = await post("/fp_user/get_detail_data", {});
      state.userData = response.returnData;
      // console.log(state.userData, 'USER DATA');
    }
    return {state,updateUserAvt,getDataLib,getUserData}
  },
  props: {},
  computed: {
    extData(): ExtData | {} {
      return this.state.userData ? this.state.userData.extData[0] : {};
    },
    territories() {
      let ter = "";
      if (this.state.userData?.extData[0]?.terData) {
        for (let i = 0; i < this.state.userData.extData[0].terData.length; i++) {
          ter += this.state.userData.extData[0].terData[i].name + ", ";
        }
      }
      return ter ? ter.trim().slice(0, -1) : "";
    },
    avtData() {
      if (this.state.userData?.extData[0].avtData && Object.keys(this.state.userData.extData[0].avtData).length > 0) {
        return IMG_URL + this.state.userData.extData[0].avtData.imgUrl;
      } else if (this.state.userData?.extData[0].gender === "male") {
        return getIconUrl('maleAvatar.png');
      } else {
        return getIconUrl('female.png');
      }
    },
  },
  methods: {
    getIconUrl,
    goToURL,
    goToChangePw(){
      this.$router.push(FPU_CHANGE_PW);
    },
    disPicked(disData: any) {
      this.state.userData?.extData[0].territory.push(disData.id);
      this.state.userData?.extData[0].terData.push(disData);
    },
    disRemoved(index: number) {
      if (this.state.userData) {
        if (index >= this.state.userData.extData[0].terData.length) {
          // console.log("Xoa item nam ngoai array, wtf man?");
          return;
        }
        this.state.userData?.extData[0].territory.splice(index, 1);
        this.state.userData?.extData[0].terData.splice(index, 1);
      }
    },
    readFile(event: any) {
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
        this.updateUserAvt(selectedFile);
      };
      reader.readAsDataURL(file);
    },
    // async getUserData() {
    //   const response = await post("/fp_user/get_detail_data", {});
    //   this.state.userData = response.returnData;
    //   console.log(this.state.userData, 'USER DATA');
    // },
    async updateUserData() {
      const response = await post("/fp_user/update_user_data", this.state.userData ? this.state.userData : {});
      if (response.succeed) {
        window.alert(response.resText);
        window.location.reload();
      }
    },
    // async updateUserAvt(selectedFile) {
    //   const response = await post("/mlib/img/user_avt_upload", {
    //     objId: this.extData.id,
    //     imgName: selectedFile.name,
    //     imgData: selectedFile.dataUrl,
    //   });
    //   if (response) {
    //     this.extData.avtData = response.imgData;
    //     window.alert("cập nhật ảnh thành công");
    //   }
    // },
    async deleteAvt() {
      if (this.state.userData?.extData[0].avtData) {
        const response = await deleteImage({id: this.state.userData.extData[0].avtData.id});
        if (response.succeed) {
          window.alert("Xóa ảnh thành công");
          this.state.userData.extData[0].avtData = null;
        }
      } else {
        window.alert("Hiện tại bạn chưa có ảnh để có thể xóa");
      }
    },
    async deactiveUser() {
      const response = await post("/fp_user/deactive_user", {});
      if (response.succeed) {
        goToURL('/logout/');
      }
    },
    reload() {
      window.history.back();
    },
  },
  watch: {},
  mounted() {
    this.getDataLib();
    this.getUserData();
  }
})
</script>

<style scoped>
</style>

