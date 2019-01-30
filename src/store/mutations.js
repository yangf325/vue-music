import * as types from "./mutaion-types"

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  //播放器属性
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequencedList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
}
export default mutations



//播放器属性
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequencedList = state => state.sequencedList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.sequencedList[state.currentIndex]
}
