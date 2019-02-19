import request from '@/Utils/request'
import { Method } from "@/Utils/request";

export function getBatches() {
  return request({
    url: '/api/v1/label/batchs/',
    method: Method.GET
  })
}

export function postBatches(data) {
  return request({
    url: '/api/v1/label/batchs/',
    method: Method.POST,
    data: data
  })
}

export function patchBatches(id, data) {
  const url = '/api/v1/label/batchs/{id}/'.replace(/{id}/, id);
  return request({
    url: url,
    data: data,
    method: Method.PATCH
  })
}

export function uploadImgs(id, data) {
  const url = '/api/v1/label/batchs/image_upload/{id}/'.replace(/{id}/, id)
  return request({
    headers: { "Content-Type": "multipart/form-data" },
    method: Method.POST,
    url: url,
    data: data
  })
}

export function getImageInfoByBatchId(batchId){
  return request({
    url: `/api/v1/label/images/?batch_id=${batchId}`,
    method: Method.GET
  })
}

export function getCurrentBatchInfo(batchId) {
  return request({
    url: `/api/v1/label/batchs/${batchId}/`,
    method: Method.GET
  })
}

export function pathImageInfo(imgId,bboxIds, elements) {
  return request({

  })
}
