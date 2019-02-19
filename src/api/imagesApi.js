import request from '@/Utils/request'
import { Method } from "@/Utils/request";

export function saveImageAnnotations(imgId, data) {
  return request({
    url: `/api/v1/label/images/${imgId}/`,
    method: Method.PATCH,
    data: data
  })
}

export function getCurrentImgInfo(batchId, pageNo) {
  return request({
    url: `/api/v1/label/images/?batch_id=${batchId}&has_labeled=true&page=${pageNo}`,
    method: Method.GET
  })
}
