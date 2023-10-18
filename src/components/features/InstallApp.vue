<template>
  <div></div>
</template>

<script setup>
import Swal from "sweetalert2";

// Run when app starts
Swal.fire({
  title: "Cài đặt FPLand CRM",
  icon: "question",
  iconColor: "#060",
  text: "Đưa công cụ FPLAND CRM về màn hình chính giúp nâng cao hiệu suất công việc",
  confirmButtonText: "Cài đặt",
  showCancelButton: true,
  cancelButtonText: "Để sau",
  footer: "<button class='btn btn-link ignore-pwa'>Không nhắc lại</button>"
});

// Install button feature
/*let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  deferredPrompt = e;
});
const installButton = document.getElementById('install-button');
installButton.addEventListener('click', async () => {
  if (deferredPrompt !== null) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt = null;
    }
  }
});

// Hide install button on app installed
if (window.navigator.getInstalledRelatedApps) {
  window.navigator.getInstalledRelatedApps()
  .then(relatedApps => {
    console.log(relatedApps);
    const isInstalled = relatedApps.length > 0;

    if (isInstalled) {
      console.log('test');
      installButton.remove();
    }
  });
}*/
</script>

<script>
export default {
  name: "InstallApp",
  props: {
    showPopup: Boolean,
  },
};
</script>

<style scoped>

</style>
