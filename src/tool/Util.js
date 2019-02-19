import { getSkeleton } from "./Skeleton";

export const getSkeletonElements = (currentBboxId, allEles, Skeletons, keyPoints) => {
  const PointNameMap = new Map();
  const EleMap = new Map();
  const SkeletonEles = [];
  const eles = allEles.filter(ele => {
    return ele.bboxId === currentBboxId
  });
  for (let l = 0; l < keyPoints.length; l++){
    PointNameMap.set(l, keyPoints[l])
  }
  for (let l = 0; l < eles.length; l++){
    if(eles[l].name){
      console.log(eles[l].name);
      EleMap.set(eles[l].name, eles[l])
    }
  }
  Skeletons.forEach(sk => {
    const startPointName = PointNameMap.get(sk[0]);
    const endPointName = PointNameMap.get(sk[1]);
    const startPoint = EleMap.get(startPointName);
    const endPoint = EleMap.get(endPointName);
    if(startPoint && endPoint){
      SkeletonEles.push(getSkeleton(startPoint, endPoint))
    }
  });
  return SkeletonEles
};

export const getNum = () => {
  return parseInt(Math.random()*100000000000)
};

export const deepClone = (obj) => {
  const json = JSON.stringify(obj)
  return JSON.parse(json)
};

export const getCurrentKeyPointsLeft = (currentBboxId, elements, keyPoints) => {
  const currentElements = elements.filter(e => {
    return e.bboxId === currentBboxId
  });
  const names = currentElements.map(c => {
    return c.name
  });
  const keyPointsLeft = keyPoints.filter(k => {
    return names.indexOf(k) === -1
  });
  return keyPointsLeft
};

export const getCategoryIdFromElements = (eles, bboxId) => {
  let categoryId = -1
  eles.forEach(e => {
    if(e.bboxId === bboxId){
      categoryId = e.categoryId
    }
  })
  return categoryId
};
