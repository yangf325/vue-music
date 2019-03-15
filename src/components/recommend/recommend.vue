<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" class="needsclick" @load="loadImage">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="item in discList" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <loading class="loading-container" v-if="!discList.length"></loading>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script type='text/ecmascript-6'>
import { getRecommend } from "api/recommend";
import { getDiscList } from "api/recommend";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import { playlistMixin } from "common/js/mixin";
import { mapMutations } from "vuex";
import Loading from "base/loading/loading";
export default {
  data() {
    return {
      recommends: [],
      discList: [],
      checkLoaded: false
    };
  },
  mixins: [playlistMixin],
  components: { Slider, Scroll, Loading },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "50px" : "";
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code == 0) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code == 0) {
          this.discList = res.data.list;
        }
      });
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
      this.setDisc(item);
    },
    loadImage() {
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 20);
    },
    ...mapMutations({
      setDisc: "SET_DISC"
    })
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>




mklink/j "C:\Users\Yang\AppData\Roaming\Apple Computer\MobileSync" "e:\iTunesBackup"