import { imageListToMaxNumGroupList } from '@/utils'
import { telegramConfig } from './dependencies'

// 将图片数组分组，每组中不超过10个，且平均，组中图片较多的在后
export const tgImageListToMax10GroupList = <T>(imageList: T[]) => {
  return imageListToMaxNumGroupList({
    imageList,
    maxNum: telegramConfig.maxImageNumberOnSend
  })
}
