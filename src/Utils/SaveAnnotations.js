import { getCategoryDetailById } from "../api/categoryApi";

function getBbox(eles, bboxId) {
  let bbox = {};
  for(let l = 0; l<eles.length; l++){
    if (eles[l].bboxId === bboxId && eles[l].typeCode === 'bbox'){
      bbox = eles[l];
    }
  }
  return bbox
}

function getSegementationData(eles, bboxId) {
  const segmentations = [];
  for(let l = 0; l < eles.length; l++ ){
    if(eles[l].bboxId === bboxId && eles[l].typeCode === 'polygon'){
      segmentations.push(eles[l].getCoCoData())
    }
  }
  return segmentations
}

async function getKeyPoints(eles, bboxId, categoryId) {
  let keyPoints = [];
  const res = await getCategoryDetailById(categoryId);

  res.data.keypoints.forEach(key => {
    let notLabel = true;
    for(let l = 0; l < eles.length; l++ ){
      if(eles[l].bboxId === bboxId && eles[l].typeCode === 'point' && eles[l].name === key){
        keyPoints = [...keyPoints, eles[l].point.x, eles[l].point.y, eles[l].point.v]
        notLabel = false
      }
    }
    if(notLabel){
      keyPoints = [...keyPoints, 0, 0, 0]
    }
  });
  return keyPoints
}

function getKeyPointNum(eles, bboxId) {
  const keyPoints = eles.filter(e => {
    if (e.bboxId === bboxId && e.typeCode === 'point'){
      return true
    }else{
      return false
    }
  });
  return keyPoints.length
}

async function getAnnotation(elements, bboxId) {
  const bbox = getBbox(elements, bboxId);
  const keyPoints = await getKeyPoints(elements, bboxId,bbox.categoryId)
  return {
    bbox: bbox.getCoCoData(),
    segmentation: getSegementationData(elements, bboxId),
    area: 0,
    iscrowd: 0,
    category_id: bbox.categoryId,
    num_keypoints: getKeyPointNum(elements, bboxId),
    keypoints: keyPoints
  }
}

export async function getAnnotations(elements, bboxIds) {
  let annotations = [];
  for(let l=0; l<bboxIds.length; l++){
    const annotation = await getAnnotation(elements,bboxIds[l]);
    annotations.push(annotation)
  }
  return {
    annotations: annotations
  }
}
