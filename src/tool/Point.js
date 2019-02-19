import { Setting, HIGH_COLOR, COMMON_COLOR } from "./Setting";

class Point{
  constructor(bboxId, categoryId){
    this.bboxId = bboxId;
    this.categoryId = categoryId;
    this.type = '关键点';
    this.typeCode = 'point';

    this.msg = '';
    this.show = true;
    this.canvas = document.getElementById('canvas');
    this.edit = false;
    this.ondrag = false;
    this.finish = false;
    this.point = {x: -1, y: -1,v: 0};
    this.editMouseMove = (e) => {
      if(this.ondrag){
        this.point.x = e.offsetX;
        this.point.y = e.offsetY;
      }
    };

    this.editMouseDown = (e) => {
      const dis = Math.sqrt(Math.pow((e.offsetX - this.point.x), 2) + Math.pow((e.offsetY - this.point.y),2));
      if (dis < 3){
        this.ondrag = true
      }else{
        this.ondrag = false
      }
    };

    this.editMouseUp = () => {
      this.ondrag = false
    };
  }
  build(){
    this.point.x = -1;
    this.point.y = -1;
    const addPoint = (e) => {
      this.point.x = e.offsetX;
      this.point.y = e.offsetY;
      this.editElement();
      this.canvas.removeEventListener('click', addPoint)
      this.finish = true
    };
    this.canvas.addEventListener('click', addPoint)
    return this
  }
  editElement (del) {
    if(this.edit || del === false){
      this.finish = true;
      this.edit = false;
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
  draw(pen) {
    if(this.point.x > 0 && this.point.y >0){
      pen.beginPath();
      pen.lineWidth="1";
      if(this.edit){
        pen.fillStyle = Setting.prototype[HIGH_COLOR]
      }else{
        pen.fillStyle = Setting.prototype[COMMON_COLOR];
      }
      pen.arc(this.point.x, this.point.y, 3, 0, Math.PI*2);
      pen.fill();
      pen.closePath();
    }
  }
}

export function getPoint(bboxId, categoryId) {
  return new Point(bboxId, categoryId)
}
