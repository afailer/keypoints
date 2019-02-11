import { Setting, SKELETON_COLOR } from "./Setting";

class Skeleton {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint
  }
  draw(pen) {
    if(this.startPoint.point.x > 0 && this.startPoint.point.y > 0 && this.endPoint.point.x > 0 && this.endPoint.point.y){
      pen.beginPath();
      pen.lineWidth = "1";
      pen.strokeStyle = Setting.prototype[SKELETON_COLOR];
      pen.moveTo(this.startPoint.point.x, this.startPoint.point.y);
      pen.lineTo(this.endPoint.point.x, this.endPoint.point.y)
      pen.stroke();
      pen.closePath();
    }
  }
}

export const getSkeleton = (startPoint, endPoint) => {
  return new Skeleton(startPoint, endPoint)
};
