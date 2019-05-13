class Vector { 
    // 수정완료
    //atan2 아크탄젠트 함수는 범위가 -pi ~ pi이라서 모든 점 표현 가능 sin은 -pi/2 ~ pi/2  cos은  0 ~ pi인거 같아서 오류가 있을 수있음 
    constructor(x, y){ // coordinate x, y 
        this.x = x;
        this.y = y;
    }
    get angle(){ // return radian 
        return Math.atan2(this.y, this.x)
    }
    get mag(){
        return Math.sqrt(this.x^2 + this.y^2);
    }
    fromAngle(angle,mag){
        return new Vector(mag * cos(angle), mag * sin(angle));
    }
    fromCoords(x, y){    
        return new Vector(x, y);
    }
    fromVector(vector){ 
        return new Vector(vector.x, vector.y);
    }

    add(vector){ //getter 이용하여 vector의 x,y값을 얻고  새로운 벡터 생성
        return new Vector(this.x + vector.x , this.y + vector.x);
    }
    sub(vector) {
        return new Vector(this.y + vector.y , this.y + vector.y);
    }

    mult(scalar){
       this.x  =  scalar * this.x;
       this.y  =  scalar * this.y;
    }
    div(scalar){
        this.x = this.x / scalar;
        this.y = this.y / scalar;
    }
    setAngle(angle) { //cos과 sin은 angle이 radian 이여야함
        this.x = this.mgag * Math.cos(angle);
        this.y = this.mag * Math.sin(angle);
    }
    setCoords(x,y){
        this.x = x;
        this.x = y;
    }
    setVector(vector){
        this.x = vector.x;
        this.y = vector.y;
    }
    setMagnitude(mag){ //현재 벡터의 크기로 나누면 크기가 1 다시 스칼라 배를 하면 원하는 크기 가짐
        this.x  = mag * this.x / this.mag; 
        this.y = mag * this.y / this.mag;
    }

}
export {Vector};
