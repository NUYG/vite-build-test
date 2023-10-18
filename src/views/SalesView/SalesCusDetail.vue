<template>
  <FpDefLayout
      :bc-props="pgMeta"
  >
    <template #comp>

      <div v-if="cusData" class="row">
        <div class="col-lg col-md p-4 col-12">
          <div class="row d-flex justify-content-center">
            <UploadAvt  :currentAvt="getUrlTypeAvtOfCusData(cusData)" @updateAvt="onUpdateAvt" :sizeAvt="150" :hoverImg="true" :isPopup="true"/>
          </div>
          <div class="row justify-content-around mt-4">
            <div class="col-lg-8 col-12">
              <div class="col-12 mt-2">
                <div class="p-3  border-gray border rounded">
                  <div class="d-flex p-2 col-lg-6 col-12 x">
                    <div class="form-check me-4">
                      <input @click="setGender('male')" class="form-check-input" type="checkbox"
                             :checked="gender==='Nam'">
                      <label class="form-check-label"> Anh </label>
                    </div>
                    <div class="form-check ms-4">
                      <input @click="setGender('female')" class="form-check-input" type="checkbox"
                             :checked="gender==='Nữ'">
                      <label class="form-check-label"> Chị </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 mt-2">
                <div class="p-3 border border-gray rounded">
                  <div class="text-gray text-content fst-italic">Tên khách hàng</div>
                  <input v-model="cusData.name" type="text" class="form-control border-white "
                         placeholder="Nhập tên khách hàng"/>
                </div>
              </div>
              <div class="col-12 mt-2">
                <div class="p-3 border border-gray rounded">
                  <div class="text-gray text-content fst-italic">Số điện thoại</div>
                  <input v-model="cusData.phone" type="text" class="form-control border-white text-gray" id="phoneInp"
                         placeholder="Nhập số điện thoại "/>
                </div>
              </div>
              <div class="col-12 mt-3">
                <div class="p-3 border border-gray rounded">
                <EmailField  labelClass="fst-italic text-gray" :defValue="cusData.email" inputClass="p-3 " :borderNone="true" placeholder="Nhập email khách hàng" :required="true"
                            @fieldVal="onEmailChange"/>
                </div>
              </div>
              <div class="col-12 mt-3">
                <div class="p-3 border border-gray rounded">
                <Fbfield  labelClass="fst-italic text-gray" :defValue="cusData.fb" inputClass="p-3 " :borderNone="true" placeholder="Nhập facebook khách hàng" :required="true"
                         @fieldVal="onFbChange"/>
                </div>
              </div>
              <div class="col-12 mt-3">
                <div class="p-3 border border-gray rounded">
                  <div class="text-gray fst-italic">Nguồn</div>
                  <select v-model="cusData.source" class="form-control-plaintext ">
                    <option v-for="(source, index) in CUSTOMER_SOURCE()" :key="index" :value="source[0]" selected>
                      {{ source[1] }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="d-flex mt-4 pb-5 justify-content-around">
                <div class="col-5">
                  <button @click="goCusGeneral(cusData.id)" class="w-100 p-2 gray-button">Lưu</button>
                </div>
                <div class="col-5">
                  <button class="w-100 p-2 gray-button" @click="$router.back()">Trở về</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #rightBar>
    </template>
  </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import {getIconUrl, translate, goToURL, getUserIdFromFb, queryImgUserFb} from "@/utils/utils";
import {deleteImage, getCompareValue, post} from "@/utils/dataQuery";
import {DataLibType} from "@/utils/dataLib";
import {breadcrumpProp} from "@/models/customProp";
import {favObj} from "@/utils/favAPI";
import { S_CUS_DETAIL_URL} from "@/router/URLs";
import FpUserAvt from "@/components/FpImg/FpUserAvt.vue";
import EmailField from "@/components/FpInput/FpFields/EmailField.vue";
import Fbfield from "@/components/FpInput/FpFields/Fbfield.vue";
import CreateCusAvt from "@/views/SalesView/SalesCusCreatedInMobile/CreateCusAvt.vue";
import UploadAvt from "@/components/FpImg/UploadAvt.vue";
import {getUrlTypeAvtOfCusData} from "@/utils/avataFunction";
import {CUSTOMER_SOURCE, GENDERS} from "@/utils/TransContent";


export default {
  components: {
    CreateCusAvt,
    FpDefLayout,
    FpUserAvt,
    EmailField,
    Fbfield,
    UploadAvt
  },
  data() {
    return {
      cusData: false,
      // Server communication
      serverResText: "",
      upLocked: false,
      upWaiting: false,
      // Trans value
      // Meta
      pgMeta: {
        [breadcrumpProp.title]: '',
        [breadcrumpProp.enableFav]: true,
        [breadcrumpProp.defFav]: false,
        [breadcrumpProp.favObjType]: favObj.CONTACTOR,
        [breadcrumpProp.favObjId]: this.cusID ? this.cusID : -1,
        [breadcrumpProp.enableRB]: false,
      },
      // state value
      imgQueryFromFbField:'',
    }
  },
  computed: {
    gender() {
      for (let i = 0; i < GENDERS.length; i++) {
        if (this.cusData.gender === GENDERS[i][0])
          return GENDERS[i][1]
      }
      return '';
    },
    cusID() {
      return this.$route?.params.cusID
    }
  },
  methods: {
    CUSTOMER_SOURCE() {
      return CUSTOMER_SOURCE
    },
    getUrlTypeAvtOfCusData,
    setGender(gender) {
      this.cusData.gender = gender
      // console.log(this.cusData.gender, 'GENDER')
    },
    getIconUrl,
    goToURL,
    goCusGeneral(id) {
      this.$router.push({name:'Sales cus detail general',params:{cusID:id}})
      // return S_CUS_DETAIL_URL + "-" + id;
    },
    transCusSource(status) {
      return translate(this.CUSTOMER_SOURCE, status);
    },
    // region: APIs
    async getCusData() {
      const res = await post("/sales/up_page_cus_data", {
        id: this.cusID ? this.cusID : -1,
        role: "Sales",
      })
      // this.serverResText = res.resText;
      // console.log(res.returnData)
      if (res && res.succeed) {
        this.cusData = res.returnData;
        const cusName = this.cusData.name;
        this.cusData.gender = 'male'
        this.pgMeta[breadcrumpProp.title] = `Khách ${cusName}`;
        this.pgMeta[breadcrumpProp.defFav] = this.cusData.fav;
      }
    },
    async updateCusData() {
      const trimPhoneData = this.cusData.phone.replace(/\s/g, '')
      const res = await post("/sales/update_customer_data_api", {
        id: this.cusData.id,
        name: this.cusData.name,
        phone: trimPhoneData,
        email: this.cusData.email,
        fb: this.cusData.fb,
        source: this.cusData.source,
        gender: this.cusData.gender,
        preset_avt:this.cusData.preset_avt ? this.cusData.preset_avt : ''
      })
      if (!res.succeed) {
        window.alert(res.resText);
        return;
      }
      // console.log(res)
      if (this.upWaiting) {
        this.upWaiting = false;
        await this.updateCusData();
      } else {
        this.upLocked = false;
      }
    },
    onUploadAvt(avtData) {
      this.updateUserAvt(avtData)
    },
    async updateUserAvt(selectedFile) {
      const response = await post("/mlib/img/user_avt_upload", {
        objId: this.cusData.id,
        imgName: selectedFile.name,
        imgData: selectedFile.dataUrl,
      });
      if (response) {
        this.cusData.avtData = response.imgData;
        window.alert("Cập nhật ảnh thành công");
      }
    },
    async deleteAvt() {
      if (this.cusData.avtData) {
        const response = await deleteImage({id: this.cusData.avtData.id});
        if (response.succeed) {
          window.alert("Xóa ảnh thành công");
          this.cusData.avtData = null;
        }
      } else {
        window.alert("Hiện tại bạn chưa có ảnh để có thể xóa");
      }
    },
    onEmailChange(val) {
      this.cusData.email = val.email
      this.updateCusData()
    },
    async onFbChange(val)
    {
      this.cusData.fb = val.facebook
      if(!this.cusData.avtData)
      {
        const res = await queryImgUserFb(val.facebook)
        res.name=getUserIdFromFb(val.facebook)+'.jpg'
        await this.updateUserAvt(res)
        this.imgQueryFromFbField=res.url
      }
      await this.updateCusData()
    },
    onUpdateAvt(avt)
    {
      if(avt.dataUrl)
      {
        this.updateUserAvt(avt)
      }
      else {
        this.cusData.preset_avt=avt
        this.updateCusData()
      }
    }
  },
  watch: {
    cusData: {
      handler(val, oldVal) {
        if (oldVal === false) {
          return;
        }
        if (this.upLocked) {
          this.upWaiting = true;
          return;
        }
        this.upLocked = true;
        this.updateCusData();
      },
      deep: true,
    },
  },
  mounted() {

    this.getCusData();
  }
}
</script>

<style scoped>
</style>
