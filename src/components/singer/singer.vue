<template>
  <div class="singer" ref="singer">
    <listview @select="selectSinger" :data="singers" ref="list"></listview>
    <router-view></router-view>
  </div>
</template>
<script type='text/ecmascript-6'>
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import listview from "base/listview/listview";
import singerClass from "common/js/singerClass";
import {mapMutations} from "vuex"

export default {
  data() {
    return {
      singers: [],
      hotNumber: 10
    };
  },
  components: { listview },
  methods: {
    _getSingerList() {
      getSingerList().then(data => {
        if (data.code === ERR_OK) {
          this.singers = this._normalizeSinger(data.data.list);
        }
      });
    },
    //选中歌手的方法
    selectSinger(singer) {
      this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer);
    },
    // 数据处理方法,传给listview
    _normalizeSinger(data) {
      let _this = this;
      let hot = { title: "热门", items: [] };
      let result = {};
      data.forEach(function(item) {
        //前hotNumber名进入热门
        if (item.Fsort <= _this.hotNumber + 1) {
          hot.items.push(
            new singerClass({ name: item.Fsinger_name, id: item.Fsinger_mid })
          );
        } else {
          // 非热门如果没有该项则初始化
          if (!result[item.Findex]) {
            result[item.Findex] = [];
          }
          result[item.Findex].push(
            new singerClass({ name: item.Fsinger_name, id: item.Fsinger_mid })
          );
        }
      });
      //格式化result数据,转换为数组
      let sortedArray = [];
      for (let i in result) {
        sortedArray.push({ items: result[i], title: i });
      }
      sortedArray.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      sortedArray.unshift(hot);
      return sortedArray;
    },
    ...mapMutations({
      setSinger:"SET_SINGER"
    })
  },
  created() {
    this._getSingerList();
  }
};
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0px;
  width: 100%;
}
</style>
