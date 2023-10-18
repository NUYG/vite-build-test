<template>
   <div class="d-none d-md-block">
      <div v-for="(menu, index) in sideBarContent" :key="index">
         <div class="w-100 d-md-flex justify-content-md-center justify-content-xl-start " @click="goToURL(menu.href)">
            <div :class="{'bg-currentSidebar': currentPage === menu.href}"
                 class="sidebar-menu_item mt-4 w-100 d-md-flex justify-content-md-center justify-content-xl-start p-2"
                 @click="dropItem(index)">
              <span v-show="checkCurrentPage(menu)" class="currentSideBar"></span>
              <span style="margin-right: 15px"></span>
                <FpIconRotate src-icon="chevron-right-solid.svg" v-show="menu.children && showText"
                              style="margin-left: -25px" :class="currentId===index ? 'rotate90' : ''" :size="24">
                </FpIconRotate>
                <ButtonBadge :badge-numb="totalNewChat(menu?.href)">
                    <template #objectBadged>
                      <FpIcon class="dashboardIcon" :class="{'iconSize left-sub-10': !showText}" :size="22"
                              :src-icon="menu.icon" alt="call_icon"></FpIcon>
                    </template>
                </ButtonBadge>

                <span v-if="showText" class="u-tab-text-s d-xl-flex d-none">{{ menu.content }}</span>
            </div>
         </div>
         <div v-if="menu.children && showText">
            <div v-show="currentId===index" class="tooltip-menu_items p-3">
               <div class="d-flex d-xl-none text-dark border-bottom mb-3">{{ menu.content }}</div>
               <div v-for="(items,index) in menu.children" class="row" :key="index">
                  <div @click="goToURL(items.href)" class="mt-2 sidebar-menu_item p-2"
                       :class="{'bg-currentSidebar': currentPage === items.href}">
                     <span v-show="childrenInlinePage(items.href,index)" class="currentSideBar">
                     </span>
                     <span style="margin-left:40px ; font-size: 14px " class="text-dark">{{ items.content }}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {roleSidebar} from './sidebarVal'
import {getIconUrl} from '@/utils/utils'
import {scrWdtEnum, scrWdtFrom} from "@/utils/windowWidth";
import FpIconRotate from "@/components/FpIcon/FpIconRotate.vue";
import FpIcon from "@/components/FpIcon/FpIcon.vue";
import ButtonBadge from "@/components/FpButton/ButtonBadge.vue";
import {A_CHAT, S_CHAT} from "@/router/URLs";
import {mapActions, mapGetters} from "vuex";
export default {
   data() {
      return {
         sideBarContent: {},
         getIconUrl,
         currentPage: '',
         currentId: -1,
      }
   },
  computed:{
    ...mapGetters(['getTotalNewPrcChat']),
  },
   props: {
      currentRole: {
         type: String,
         default: ''
      },
      showText: {
         type: Boolean,
         default: false
      },
      defaultPage: {
         type: String,
         default: ''
      },
      pageName:{
        type:String,
      },
   },
   methods: {
     ...mapActions(['setTotalNewPrcChat']),
     totalNewChat(href)
     {
        return ( href && (href === S_CHAT || href === A_CHAT )) ? this.getTotalNewPrcChat : 0
     },
      goToURL(url) {
         if (url) {
           this.$router.push(url)
           this.$emit('sidebarMenuClicked', url)
           this.currentId= this.currentId !== 3 ? -1 : 3
         }
      },
      menuSideBar(currentRole) {
         const sidebarData = roleSidebar[currentRole]
         if (Array.isArray(sidebarData)) {
            this.sideBarContent = sidebarData
         } else {
            this.sideBarContent = Object.values(sidebarData)
         }
      },
      childrenInlinePage(itemsHref) {
         return this.currentPage === itemsHref;
      },
      dropItem(id) {
         this.currentId = id === this.currentId ? -1 : id;
      },
      checkCurrentPage(menu)
      {
          return this.currentPage === menu.href
      },
      removeBadgeWhenIsChatPage(url)
      {
        if(url === S_CHAT || url === A_CHAT)
        {
          this.setTotalNewPrcChat(0)
        }
      }
   },
    mounted() {
      this.currentPage = window.location.pathname
      if(scrWdtFrom(scrWdtEnum.LG))
      {
        this.currentId = 3
      }
   },
   watch: {
      currentRole(newVal) {
         this.menuSideBar(newVal)
      },
     '$route.path'(newPath)
     {
       this.removeBadgeWhenIsChatPage(newPath)
       this.currentPage = newPath
     }
   },
   emits:['sidebarMenuClicked'],
   components: {ButtonBadge, FpIcon, FpIconRotate}
}
</script>

<style scoped>
.iconSize {
    width: 50px !important;
    height: 30px !important;
}
</style>
