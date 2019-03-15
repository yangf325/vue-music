<template>
  <scroll
    @scroll="scroll"
    :listenScroll="listenScroll"
    :probe-type="probeType"
    :data="data"
    class="listview"
    ref="listview"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li
          @touchstart="onShortcutTouchStart"
          @touchmove.stop.prevent="onShortcutTouchMove"
          v-for="(item, index) in shortcutList"
          :data-index="index"
          class="item"
          :class="{'current':currentIndex===index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  </scroll>
</template>
<script type='text/ecmascript-6'>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from "common/js/dom";
const TITLE_HEIGHT = 30;
const ANCHOR_HEIGHT = 18;
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentIndex: 0,
      listHeight: [],
      diffY: 0,
      scrollY: -1,
      fixedTop: 0
    };
  },
  components: { Scroll, Loading },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    refresh(){
      this.$refs.listview.refresh();
    },
    // 歌手选中事件
    selectItem(item) {
      this.$emit("select", item);
    },
    //侧边栏触摸事件
    onShortcutTouchStart() {
      let anchorIndex = event.target.getAttribute("data-index");
      this._scrollTo(anchorIndex);
      this.currentIndex = anchorIndex;
      //滑动事件起始数据
      let firstTouch = event.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
    },
    //侧边栏移动事件
    onShortcutTouchMove() {
      let firstTouch = event.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let changedIndex = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let newAnchor = parseInt(this.touch.anchorIndex) + changedIndex;
      if (newAnchor < this.$refs.listGroup.length && newAnchor >= 0) {
        this.currentIndex = newAnchor;
      }
      this._scrollTo(newAnchor);
    },
    _scrollTo(index) {
      if (index < 0) {
        index = 0;
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index]);
    },
    _calculateHeight() {
      this.listHeight = [0];
      const listGroup = this.$refs.listGroup;
      let heightSum = 0;
      for (let index = 0; index < listGroup.length; index++) {
        heightSum += listGroup[index].clientHeight;
        this.listHeight.push(heightSum);
      }
    }
  },
  created() {
    this.listenScroll = true;
    this.probeType = 3;
    listHeight: [];
    this.touch = {};
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 50);
    },
    scrollY(newY) {
      let _this = this;
      for (let index = 0; index < _this.listHeight.length - 1; index++) {
        const height1 = _this.listHeight[index];
        const height2 = _this.listHeight[index + 1];
        if (height1 < -newY && height2 > -newY) {
          _this.currentIndex = index;
          _this.diffY = -newY - height1;
          this.diffY = height2 + newY;
          break;
        }
      }
    },
    diffY(newValue) {
      let fixedTop = newValue > 0 && newValue < TITLE_HEIGHT ? newValue - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      // this.$refs.fixed.style.marginTop = `${fixedTop}px`;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: -1px; 
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

