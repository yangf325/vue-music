<template>
  <transition name="slide">
    <!-- <music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list> -->
    <music-list :bg-image="bgImage" :title="title"></music-list>
  </transition>
</template>
<script type='text/ecmascript-6'>
// import { getSingerDetail } from "api/singer";
// import { ERR_OK } from "api/config";
// import { createSong } from "common/js/song";
import { mapGetters } from "vuex";
import musicList from "components/music-list/music-list";
export default {
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(["disc"]),
    bgImage(){
      return this.disc.imgurl
    },
    title(){
      return this.disc.dissname
    }
   
  },
  components: {musicList},
  methods: {
    
  },
  created() {
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
