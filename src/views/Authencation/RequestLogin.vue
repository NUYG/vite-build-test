<script>
import Swal from "sweetalert2";
export default {
  name: "RequestLogin",
  props: {
    showPopup: Boolean,
    textContent:{
      type:String,
    }
  },
  components:{
  },
  methods: {
    openPopup() {
      Swal.fire({
        title: "Yêu cầu đăng nhập",
        text: this.textContent && this.textContent!=='' ? this.textContent : 'Bạn cần một tài khoản để có thể sử dụng tính năng này.',
        confirmButtonText: "Đăng ký ngay",
        footer: "<a class='text-gray cursor-pointer' href='/login'>Đã có tài khoản? Đăng nhập</a>",
        customClass: {
          confirmButton: "more-btn",
          popup: "custom-modal border8"
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleConfirmButtonClicked();
        }
        this.$emit("popupClosed", result);
      });
    },
    handleConfirmButtonClicked() {
      this.$router.push('/register')
    },
  },
  mounted() {
    this.openPopup()
  },
  emits:['popupClosed']
};
</script>

<style >
.more-btn{
  background-color: #5E52FF !important;
}
.swal2-html-container {
  margin: 1em 3em 0.3em !important;
}
</style>
