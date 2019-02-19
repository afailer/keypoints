import {getRectObj} from "../tool/RectObj";
import {getPolygon} from "../tool/Polygon";
import {getPoint} from "../tool/Point";
import {getCategoryDetailById} from "../api/categoryApi";
import {getNum} from "../tool/Util";

function getPloygonObjFromAnnotation(bboxId, annotation) {
  const polygon = getPolygon(bboxId, annotation.category_id);
  polygon.initByCocoData(annotation)
  return polygon
}

function getRectObjByAnnotation(bboxId, name, annotation) {
  const rect = getRectObj(bboxId,name,annotation.category_id);
  rect.initByCocoData(annotation);
  return rect
}


function getpointsEleFromAnnotation(bboxId, annotation, keyPointsModel) {
  const points = [];
  for(let l = 0; l < keyPointsModel.length; l++){
    const index = l*3;
    if(annotation.keypoints[index] !== 0 || annotation.keypoints[index + 1] !== 0){
      const point = getPoint(bboxId, annotation.category_id)
      point.point.x = annotation.keypoints[index];
      point.point.y = annotation.keypoints[index + 1];
      point.point.v = annotation.keypoints[index + 2];
      point.name = keyPointsModel[l];
      points.push(point)
    }
  }
  return points
}

function getCategoryNameById(currentBatchInfo, categoryId) {
  let name = 0;
  currentBatchInfo.categories.forEach(c => {
    if(c.id === categoryId){
      name = c.name
    }
  });
  return name
}

const bboxIds = [];

async function getElementsFromAnnotation(annotation, currentBatchInfo) {
  let eles = [];
  const categoryId = annotation.category_id;
  const bboxId = getNum();
  bboxIds.push(bboxId);
  console.log(categoryId+"=====+++===")
  const res = await getCategoryDetailById(categoryId);
  const name = getCategoryNameById(currentBatchInfo, annotation.category_id);
  const rect = getRectObjByAnnotation(bboxId, name, annotation);
  const keypoints = getpointsEleFromAnnotation(bboxId, annotation, res.data.keypoints);
  if(annotation.segmentation.length > 0){
    const polygon = getPloygonObjFromAnnotation(bboxId, annotation);
    eles = [rect, polygon, ...keypoints]
  }else{
    eles = [rect, ...keypoints]
  }
  return eles
}

export function getBBoxIds() {
  return bboxIds
}

export async function getElements(annotations, currentBatchInfo) {
  bboxIds.length = 0;
  let elements = [];
  for(let l = 0; l < annotations.length; l++){
    const eles = await getElementsFromAnnotation(annotations[l],currentBatchInfo)
    elements = [...elements, ...eles];
  }
  console.log(bboxIds)
  console.log(elements)
  return elements
}
