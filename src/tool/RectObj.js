import { Setting, COMMON_COLOR, HIGH_COLOR } from "./Setting";

const DRAG = 'drag';
const TRANSFORM = 'transform';

class RectObj{
  constructor(bboxId,name, categoryId){
    this.type = '矩形工具';
    this.typeCode = 'bbox';
    this.msg = '';
    this.show = true;
    this.bboxId = bboxId;
    this.name = name;
    this.categoryId = categoryId
    this.startPoint = false;
    this.endPoint = false;
    this.edit = false;
    this.canvas = document.getElementById('canvas');
    this.transNum = -1;
    this.mouseMoveAction = ''; // 'drag','transform'
    this.dragStart = {};
    this.showDragShadow = false;
    this.editMouseDown = (e) => {
      const judgeSamePos = (pos1, pos2) => {
        return Math.sqrt(Math.pow((pos2.x - pos1.x), 2) + Math.pow((pos2.y - pos1.y),2)) < 5
      };
      const points = this.getPoints();
      for(let num=0; num < points.length; num++){
        if(judgeSamePos({x: e.offsetX, y: e.offsetY}, points[num])){
          this.mouseMoveAction = TRANSFORM;
          this.transNum = num
        }
      }
      if (this.mouseMoveAction === ''){
        // 点击的位置x值到startPoint的x值得绝对距离 + 点击位置到endpoint的x的绝对距离
        const xDis = Math.abs(e.offsetX - this.startPoint.x) + Math.abs(e.offsetX - this.endPoint.x);
        const yDis = Math.abs(e.offsetY - this.startPoint.y) + Math.abs(e.offsetY - this.endPoint.y);
        // startpoint与endPoint值的横坐标（x轴）的绝对距离
        const xVal = Math.abs(this.startPoint.x - this.endPoint.x);
        const yVal = Math.abs(this.startPoint.y - this.endPoint.y);
        // 绝对距离的和xDis如果与真实距离的差值大于半径，则这个点一定在矩形之外
        if (Math.abs(xVal - xDis) < 2 && Math.abs(yVal - yDis) < 2){
          this.mouseMoveAction = DRAG;
          this.dragStart.x = e.offsetX;
          this.dragStart.y = e.offsetY;
        }
      }
    };

    this.editMouseMove = (e) => {
      if(this.mouseMoveAction === DRAG) {
        let disX = e.offsetX - this.dragStart.x;
        let disY = e.offsetY - this.dragStart.y;
        this.startPoint.x = this.startPoint.x + disX;
        this.startPoint.y = this.startPoint.y + disY;
        this.endPoint.x = this.endPoint.x + disX;
        this.endPoint.y = this.endPoint.y + disY
        this.dragStart.x = e.offsetX;
        this.dragStart.y = e.offsetY;
      } else if(this.mouseMoveAction === TRANSFORM){
        if(this.transNum === 0){
          this.startPoint.x = e.offsetX;
          this.startPoint.y = e.offsetY;
        }
        if(this.transNum === 1){
          this.startPoint.y = e.offsetY;
          this.endPoint.x = e.offsetX;
        }
        if(this.transNum === 2){
          this.endPoint.x = e.offsetX;
          this.endPoint.y = e.offsetY;
        }
        if(this.transNum === 3){
          this.startPoint.x = e.offsetX;
          this.endPoint.y = e.offsetY;
        }
      } else{
        // 点击的位置x值到startPoint的x值得绝对距离 + 点击位置到endpoint的x的绝对距离
        const xDis = Math.abs(e.offsetX - this.startPoint.x) + Math.abs(e.offsetX - this.endPoint.x);
        const yDis = Math.abs(e.offsetY - this.startPoint.y) + Math.abs(e.offsetY - this.endPoint.y);
        // startpoint与endPoint值的横坐标（x轴）的绝对距离
        const xVal = Math.abs(this.startPoint.x - this.endPoint.x);
        const yVal = Math.abs(this.startPoint.y - this.endPoint.y);
        // 绝对距离的和xDis如果与真实距离的差值大于半径，则这个点一定在矩形之外
        if (Math.abs(xVal - xDis) < 2 && Math.abs(yVal - yDis) < 2){
          if(!this.showDragShadow){
            this.showDragShadow = true
          }
        }else {
          if(this.showDragShadow){
            this.showDragShadow = false
          }
        }
      }
    };
    this.editMouseUp = (e) => {
      this.transNum = -1;
      this.mouseMoveAction = ''
    };
  }

  getPoints() {// points 从左上角顺时针旋转到左下角
    return [
        this.startPoint,

        {
          x: this.endPoint.x,
          y: this.startPoint.y,
        },

        this.endPoint,

        {
          x: this.startPoint.x,
          y: this.endPoint.y
        }
      ]
  }

  editElement(del) {
    if(this.edit || del === false){
      this.edit = false;
      this.canvas.removeEventListener('mousedown', this.editMouseDown);
      this.canvas.removeEventListener('mousemove', this.editMouseMove);
      this.canvas.removeEventListener('mousedown', this.editMouseUp);
    }else{
      this.edit = true;
      this.canvas.addEventListener('mousedown', this.editMouseDown);
      this.canvas.addEventListener('mousemove', this.editMouseMove);
      this.canvas.addEventListener('mouseup', this.editMouseUp);
    }

  }

  build() {
    this.startPoint = false;
    this.endPoint = false;
    const getStartPoint = (e) => {
      this.startPoint = {
        x: e.offsetX,
        y: e.offsetY
      };
      this.canvas.addEventListener('mousemove', getEndPoint);
    };

    const getEndPoint = (e) => {
      this.endPoint = {
        x: e.offsetX,
        y: e.offsetY
      }
    };

    const mouseUp = () => {
      this.canvas.removeEventListener('mousedown', getStartPoint);
      this.canvas.removeEventListener('mousemove', getEndPoint);
      this.canvas.removeEventListener('mouseup', mouseUp)
      this.editElement();
    };

    this.canvas.addEventListener('mousedown', getStartPoint);
    this.canvas.addEventListener('mouseup', mouseUp)
    return this
  }

  fill(pen) {
    if(this.showDragShadow){
      pen.beginPath();
      pen.fillStyle = '#33484848';
      pen.rect(this.startPoint.x, this.startPoint.y, (this.endPoint.x - this.startPoint.x), (this.endPoint.y - this.startPoint.y));
      pen.fill();
      pen.closePath()
    }
  }
  drawPoints(pen) {
    const points = this.getPoints();
    for(let p = 0; p<points.length; p++) {
      pen.beginPath();
      pen.fillStyle = Setting.prototype[HIGH_COLOR];
      pen.arc(points[p].x, points[p].y, 5, 0, Math.PI * 2);
      pen.fill();
      pen.closePath()
    }
    this.fill(pen)
  }
  draw(pen) {
    if(this.startPoint && this.endPoint){
      pen.beginPath();
      pen.lineWidth="1";
      pen.strokeStyle=Setting.prototype[COMMON_COLOR];
      pen.rect(this.startPoint.x, this.startPoint.y, (this.endPoint.x - this.startPoint.x), (this.endPoint.y - this.startPoint.y))
      pen.stroke();
      pen.closePath();
      if(this.edit){
        this.drawPoints(pen)
      }
    }
  }
  getCoCoData(){
    const points = this.getPoints();
    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;
    for(let index=0; index < points.length; index++){
      if(points[index].x < minX){
        minX = points[index].x
      }
      if(points[index].y < points[index].y){
        minY = points[index].y
      }
      if(points[index].x > maxX){
        maxX = points[index].x
      }
      if(points[index].y > maxY){
        maxY = points[index].y
      }
    }
    const width = Math.abs(maxX - minX);
    const height = Math.abs(maxY - minY);
    return [minX, minY, width, height]
  }
  initByCocoData(annotation){
    this.startPoint = {
      x: annotation.bbox[0],
      y: annotation.bbox[1]
    };
    this.endPoint = {
      x: this.startPoint.x + annotation.bbox[2],
      y: this.startPoint.y + annotation.bbox[3]
    }
  }
}

export function getRectObj(bboxId, name, categoryId) {
  return new RectObj(bboxId,name,categoryId)
}
