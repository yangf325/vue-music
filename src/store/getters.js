//歌手属性
export const singer = state => state.singer
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

