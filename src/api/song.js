import jsonp from 'common/js/jsonp'
import {
  commonParams
} from './config'
import Axios from 'axios';

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    hostUin: 0,
    pcachetime: +new Date(),
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 67232076,
    format: "json"
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
