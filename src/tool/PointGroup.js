class PointGroup{
  constructor(){
    this.points = [];
    this.type = '关键点组合';
    this.msg = '';
    this.show = true;
    this.canvas = document.getElementById('canvas')
    this.build();
  }

  build(){
    this.points = [];
    let point = {};
    const clickListener = (e) => {
      point.x = e.offsetX;
      point.y = e.offsetY;
      this.points.push(point);
      point = {};
      this.points.push(point)
    };

    const mousemoveListener = (e) => {
      point.x = e.offsetX;
      point.y = e.offsetY;
    };

    const finish = () => {
      this.points.pop();
      this.canvas.removeEventListener('click', clickListener);
      this.canvas.removeEventListener('mousemove', mousemoveListener);
      this.canvas.removeEventListener('contextmenu', finish)
    };
    this.canvas.addEventListener('click', clickListener);
    this.canvas.addEventListener('mousemove', mousemoveListener);
    this.canvas.addEventListener('contextmenu', finish);
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

  drawOuterRect(pen) {
    const { startPoint, endPoint } = this.getRectPoints();
    let width = endPoint.x - startPoint.x;
    let height = endPoint.y - endPoint.y;
    pen.beginPath();
    pen.fillStyle = '#33C0C0C0';
    pen.rect(startPoint.x, startPoint.y, width, height)
    pen.fill();
    pen.closePath();
  }

  drawPoints(pen) {
    if(this.points.length < 2){
      return
    }
    this.drawOuterRect(pen);
    for(let l = 0; l < this.points.length ; l++) {
      pen.beginPath();
      pen.fillStyle = '#ff0000';
      pen.arc(this.points[l].x, this.points[l].y, 4, 0, Math.PI*2);
      pen.fill();
      pen.closePath();
    }
  }
  draw(pen) {
    pen.beginPath();
    pen.lineWidth="2";
    pen.strokeStyle="#FFFFFF";
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
    //this.drawPoints(pen)
  }
}

export function getPointGroup() {
  return new PointGroup()
}
