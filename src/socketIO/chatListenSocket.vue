<script>
// Cấp cha
// sẽ gửi request call api 30 tin ban đầu nếu đã connect tới socket
// sau đó cấp cha nhận được thông tin, tin nhắn và truyền vào props: chatData và tên room chat qua listen in room

// Trong comp này
// ở đây sẽ báo cho sever tổng room mà ng dùng này có mặt
// ở đây sẽ nhận được thông tin chat mới và tên room trực tiếp qua sever

export default {
  props: {
    listenInRoom: {
      type: Array,
      default: []
    },
    chatData: {
      default: () => undefined
    }
  },
  inject: ['socket'],
  mounted() {


  },

}
</script>
