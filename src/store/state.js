import { playMode } from 'common/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequencedList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  // currentSong: {}
}

export default state