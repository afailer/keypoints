import { getSkeleton } from "./Skeleton";

export const getSkeletonElements = (eles, Skeletons, keyPoints) => {
  const PointNameMap = new Map();
  const EleMap = new Map();
  const SkeletonEles = [];
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

export const deepClone = (obj) => {
  const json = JSON.stringify(obj)
  return JSON.parse(json)
};
