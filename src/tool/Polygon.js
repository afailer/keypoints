import { Setting, COMMON_COLOR, HIGH_COLOR } from "./Setting";

const getDragPointIndex = (e, points) => {
  let index = -1;
  for(let l = 0; l < points.length; l++){
    const tempDis = Math.sqrt(Math.pow((e.offsetX - points[l].x), 2) + Math.pow((e.offsetY - points[l].y), 2));
    if (tempDis < 5){
      index = l;
      break;
    }
  }
  return index;
};

class Polygon{
  constructor(bboxId, categoryId){
    this.bboxId = bboxId;
    this.categoryId = categoryId;
    this.type = '轮廓工具';
    this.typeCode = 'polygon'
    this.msg = '';
    this.show = true;
    this.points = [];
    this.edit = false;
    this.onDrag = false;
    this.canvas = document.getElementById('canvas');
    this.showDragShadow = true;
    this.editPointIndex = -1;
    this.dragStartPoint = {

    };
    this.editMouseDown = (e) => {
      this.editPointIndex = getDragPointIndex(e, this.points)
      if(this.showDragShadow && this.editPointIndex < 0){ // 没有点击到圆点，并且点击到了阴影
        this.onDrag = true;
        this.dragStartPoint = {
          x: e.offsetX,
          y: e.offsetY
        }
      }
    };
    this.editMouseMove = (e) => {
      if(this.editPointIndex === 0 || this.editPointIndex === this.points.length -1){
        this.points[0].x = e.offsetX;
        this.points[0].y = e.offsetY;
        this.points[this.points.length - 1].x = e.offsetX;
        this.points[this.points.length - 1].y = e.offsetY;
      }else if(this.editPointIndex > -1){
        this.points[this.editPointIndex].x = e.offsetX;
        this.points[this.editPointIndex].y = e.offsetY;
      }else{
        this.getDragShadow(e)
      }
      if(this.onDrag){
        this.startDrag(e)
      }
    };
    this.editMouseUp = () => {
      this.showDragShadow = false;
      this.editPointIndex = -1;
      this.onDrag = false
      //this.canvas.removeEventListener('mousedown', this.editMouseDown)
      //this.canvas.removeEventListener('mousemove',this.editMouseMove)
      //this.canvas.removeEventListener('mouseup',this.editMouseUp)
    }
  }

  startDrag(e){
    const disX = e.offsetX - this.dragStartPoint.x;
    const disY = e.offsetY - this.dragStartPoint.y;
    for(let l = 0; l < this.points.length; l++){
      this.points[l].x += disX;
      this.points[l].y += disY;
    }
    this.dragStartPoint.x = e.offsetX;
    this.dragStartPoint.y = e.offsetY
  }

  editElement (del) {
    if(this.edit || del === false){
      this.edit = false
      this.canvas.removeEventListener('mousedown', this.editMouseDown)
      this.canvas.removeEventListener('mousemove', this.editMouseMove)
      this.canvas.removeEventListener('mouseup', this.editMouseUp)
    }else{
      this.edit = true;
      this.canvas.addEventListener('mousedown', this.editMouseDown);
      this.canvas.addEventListener('mousemove', this.editMouseMove);
      this.canvas.addEventListener('mouseup', this.editMouseUp)
    }
  }

  build(){
    this.points = [];
    let point = {};
    const finish = () => {
      this.editElement();
      this.canvas.removeEventListener('click', clickLisener);
      this.canvas.removeEventListener('mousemove', resetPoint)
    };
    const clickLisener = (e) => {
      if(this.points.length === 0){
        this.points.push(point)
      }
      let resetIndex = -1;
      for(let l = 1; l< this.points.length -1; l++){
        const x = Math.pow(this.points[l].x - e.offsetX, 2)
        const y = Math.pow(this.points[l].y - e.offsetY, 2)
        const des = Math.sqrt(x + y)
        if(des < 4){
          resetIndex = l
        }
      }
      if(resetIndex !== -1){ // 回选
        this.points.splice(resetIndex + 1, this.points.length - resetIndex -2);
      }else{
        if(this.points.length > 3){
          let absX = Math.pow((point.x - this.points[0].x), 2);
          let absY = Math.pow((point.y - this.points[0].y), 2);
          if(Math.sqrt(absX + absY) < 10){
            point.x = this.points[0].x;
            point.y = this.points[0].y;
            finish()
          }else{
            point = {};
            this.points.push(point)
          }
        }else{
          point = {};
          this.points.push(point)
        }
      }
    };
    const resetPoint = (e) => {
      point.x = e.offsetX;
      point.y = e.offsetY;
    };
    this.canvas.addEventListener('click', clickLisener)
    this.canvas.addEventListener('mousemove', resetPoint)
    return this
  }

  getDragShadow(e) {
    const { startPoint, endPoint } = this.getRectPoints();
    // 点击的位置x值到startPoint的x值得绝对距离 + 点击位置到endpoint的x的绝对距离
    const xDis = Math.abs(e.offsetX - startPoint.x) + Math.abs(e.offsetX - endPoint.x);
    const yDis = Math.abs(e.offsetY - startPoint.y) + Math.abs(e.offsetY - endPoint.y);
    // startpoint与endPoint值的横坐标（x轴）的绝对距离
    const xVal = Math.abs(startPoint.x - endPoint.x);
    const yVal = Math.abs(startPoint.y - endPoint.y);
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

  getRectPoints(){
    let minX = this.points[0].x;
    let minY = this.points[0].y;
    let maxX = this.points[0].x;
    let maxY = this.points[0].y;
    this.points.forEach(p => {
      if(p.x < minX){
        minX = p.x
      }
      if(p.x > maxX){
        maxX = p.x
      }
      if(p.y < minY) {
        minY = p.y
      }
      if(p.y > maxY) {
        maxY = p.y
      }
    });
    return {
      startPoint:{
        x: minX,
        y: minY
      },
      endPoint: {
        x: maxX,
        y: maxY
      }
    }
  }

  fill(pen) {
    if(this.showDragShadow) {
      const {startPoint, endPoint} = this.getRectPoints();
      let width = Math.abs(endPoint.x - startPoint.x);
      let height = Math.abs(endPoint.y - startPoint.y);
      pen.beginPath();
      pen.fillStyle = '#33484848';
      pen.rect(startPoint.x, startPoint.y, width, height);
      pen.fill();
      pen.closePath();
    }
  }

  drawPoints(pen) {
    if(this.points.length < 2){
      return
    }
    this.fill(pen);
    for(let l = 0; l < this.points.length ; l++) {
      pen.beginPath();
      pen.fillStyle = Setting.prototype[HIGH_COLOR];
      pen.arc(this.points[l].x, this.points[l].y, 4, 0, Math.PI*2);
      pen.fill();
      pen.closePath();
    }
  }

  draw(pen){
    if(this.edit){
      this.drawPoints(pen)
    }
    pen.beginPath();
    pen.lineWidth="1";
    pen.strokeStyle=Setting.prototype[COMMON_COLOR];
    if(this.points.length > 0 ){
      pen.moveTo(this.points[0].x, this.points[0].y);
      for(let l = 0; l < this.points.length; l++){
        pen.arc(this.points[l].x, this.points[l].y, 1, 0, Math.PI*2)
        if((l + 1 !== this.points.length) && this.points[l+1].x && this.points[l+1].y){
          pen.lineTo(this.points[l+1].x, this.points[l+1].y)
        }
      }
    }
    pen.stroke();
    pen.closePath();

  }

  getCoCoData(){
    const segmentation = [];
    for(let l=0; l < this.points.length - 1; l++){
      segmentation.push(this.points[l].x);
      segmentation.push(this.points[l].y)
    }
    return segmentation
  }

  initByCocoData(annotation){
    annotation.segmentation.forEach(segmentation => {
      for(let l = 0; l< segmentation.length; l = l+2){
        this.points.push({
          x: segmentation[l],
          y: segmentation[l+1]
        })
      }
      this.points.push({
        x: segmentation[0],
        y: segmentation[1]
      })
    })

  }
}

export function getPolygon(bboxId, categoryId) {
  return new Polygon(bboxId, categoryId);
}
