<template>
  <div class="youtube-video">
    <iframe
        ref="iframe"
        :src="embedUrl"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    videoUrl: {
      type: String,
      required: true,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      player: null,
    };
  },
  computed: {
    embedUrl() {
      const videoId = this.extractVideoId(this.videoUrl);
      const loopParam = this.loop ? '&loop=1' : '';
      const playlistParam = this.loop ? `&playlist=${videoId}` : '';
      const controlsParam = '&controls=0';
      return `https://www.youtube.com/embed/${videoId}?autoplay=1${loopParam}${playlistParam}${controlsParam}`;
    },
  },
  mounted() {
    this.initializePlayer();
  },
  beforeUnmount() {
    if (this.player) {
      this.player.destroy();
    }
  },
  methods: {
    extractVideoId(url) {
      const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|.*[?&]vi=)([^"&?/ ]{11})|youtu\.be\/([^"&?/ ]{11}))/;
      const match = url.match(regex);
      return match && (match[1] || match[2]) ? match[1] || match[2] : null;
    },
    initializePlayer() {
      if (window.YT) {
        this.createPlayer();
      } else {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = this.createPlayer;
      }
    },
    createPlayer() {
      this.player = new window.YT.Player(this.$refs.iframe, {
        events: {
          onStateChange: this.onPlayerStateChange,
        },
      });
    },
    onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.ENDED && this.loop) {
        this.player.playVideo();
      }
    },
  },
};
</script>

<style>
.youtube-video {
  position: relative;
  width: 100%;
  margin: 0 auto;
  height: 100%;
}

.youtube-video iframe {
  width: 100%;
  height: 100%;
}
</style>
