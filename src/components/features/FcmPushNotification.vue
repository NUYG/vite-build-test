<template>
</template>

<script>

import {firebaseApp} from "@/utils/firebaseConfig";
import {getMessaging, getToken, onMessage} from "firebase/messaging";
import Push from "push.js";
import {post} from "@/utils/dataQuery";
import {getItemFromLocalStorage, goToURL, setLocalStorageItem} from "@/utils/utils";
import {mapActions} from "vuex";
import {A_CHAT, S_CHAT} from "@/router/URLs";
import {notifyNewChatCode} from "@/utils/contentNotification";
export default {
   data() {
      return {
         message: [],
         // roleNotification,
         notificationsEnabled: false,
         notificationButtonLabel: 'Enable notifications',
         currentToken: '',
         requestPermissionNo: 0,
         notifyNewChatCode
      };
   },
   mounted() {
      this.firebaseToken()
     this.getTtNotSeen()
   },
   emits: ['notification','notiNotSeenTt'],
   computed: {
      isPageHidden() {
         return document.hidden;
      },
   },
   methods: {
     ...mapActions(['setTotalNewPrcChat']),
      notifyIcoShouldActive(notifyData) {
         return notifyData.notification && notifyData.data && !this.isNewChat(notifyData);
      },
     isNewChat(notifyData)
     {
       return notifyNewChatCode.includes(notifyData.data.clf)
     },
     async getTtNotSeen()
     {
       const res = await post('/firebase/get_user_notify_msgs',{})
       const filteredData = res?.returnData.filter(data => data.seen === false);
       const countNotSeen = filteredData.length;
       // set badge notification in icon header of Fp def layout Component
       this.$emit('notiNotSeenTt',countNotSeen)
     },
     async getPrcChatNotSeen()
     {
       const role = sessionStorage.getItem('currentRole')
       const res = await post('/fp_user/get_user_tt_unseen_msgs',{
            role:role
       })
       console.log(res,'lấy tổng tin mới từ sever nò')
       if(this.$route.path !== S_CHAT && this.$route.path !== A_CHAT)
       {
         await this.setTotalNewPrcChat(res.returnData?.spUnseen + res.returnData?.urUnseen)
       }
     },
      async firebaseToken() {
         const messaging = getMessaging(firebaseApp);
         this.getTokenFb(messaging);

         onMessage(messaging, (payload) => {
           console.log('có tin nhắn mới tới kìa',payload)
            if (this.notifyIcoShouldActive(payload)) {
              window.localStorage.setItem('newNotificationTime', new Date().toString());
            }
            else if(this.isNewChat(payload)){
              this.getPrcChatNotSeen()
            }
            this.$emit('notification', payload.data);
            if (this.$route?.params?.spID === payload.data.id) {
               if (this.isPageHidden) {
                  this.message = payload;
               } else {
                  return '';
               }
            } else {
               this.message = payload;
            }
         });
      },
      getTokenFb(messaging) {
         this.requestPermissionNo++;
         getToken(messaging, {
            vapidKey:
               "BEgRo6YGPQ8pJHF0MQSggnVsTmVCKSMlKcvKxKnChTDUc8EHr6A3YWn60WSfEjEtuNVjkREpf_YYIrzqmRdLETw",
         })
            .then(currentToken => {
               if (currentToken) {
                  this.currentToken = currentToken;
                  this.dTokenRegister(currentToken);
                  // window.alert(currentToken)
               } else {
                  console.log(
                     "No registration token available. Request permission to generate one."
                  );
               }
            })
            .catch((err) => {
               console.log("An error occurred while retrieving token. ", err);
               if (this.requestPermissionNo < 2) {
                  setTimeout(() => this.getTokenFb(messaging), 1000);
               }
            });
      },
      pushNotification(notiData) {
         if (!notiData.notification) {
            return;
         }
         Push.create(notiData.notification.title, {
            body: notiData.notification.body,
            icon: '/path/to/icon.png',
            timeout: 5000,
            onClick: function () {
               window.focus();
               goToURL(notiData.data.url);
               this.close();
            }
         });
      },
      async dTokenRegister(currentToken) {
         const res = await post('/firebase/register_device_key', {'dToken': currentToken})
         window.localStorage.setItem('firebaseToken', currentToken);
      }
   },
   watch: {
      message(newVal) {
         this.pushNotification(newVal);
      }
   },
};
</script>
