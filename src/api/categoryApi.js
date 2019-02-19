import request from '@/Utils/request'
import { Method } from "@/Utils/request";
const CATEGORY = '/api/v1/label/categories/';

const PatchCategory = '/api/v1/label/categories/{id}/';

export function postCategory(data) {
  return request({
    method: Method.POST,
    url: CATEGORY,
    data: data
  })
};

export function getCategory(){
  return request({
    method: Method.GET,
    url: CATEGORY
  })
};

export function getCategoryDetailById(categoryId) {
  return request({
    url: `/api/v1/label/categories/${categoryId}/`,
    method: Method.GET
  })
}
export function patchCategory(id, data) {
  const url = PatchCategory.replace(/{id}/, id);
  return request({
    method: Method.PATCH,
    url: url,
    data: data
  })
}
