console.log("safasfasf");   
var contentDiv = document.getElementById("content");
var startDiv = document.getElementById("start");
var main = document.getElementById("main");
var scoreDiv = document.getElementById("score");
var suspendDiv = document.getElementById('suspend');
var continueDiv = document.getElementById('continue');
var settlementDIV = document.getElementById('settlement');

var score = 0;
//获取盒子的样式
var contentClass = contentDiv.currentStyle?contentDiv.currentStyle:window.getComputedStyle(contentDiv,null);
var  stageSizeX  = parseInt(contentClass.width);//获取盒子的宽度，并转换为一个数值
var stageSizeY = parseInt(contentClass.height);//同样获取盒子高度并转换为数值

//创建不同飞机的型号对象
var planeS = {
    width :34,
    height:24,
    imgsrc:'img/enemy-plane-s.png',//飞机的图片路径这个属性
    boomSrc: 'img/enemy-plane-s-boom.gif',
    boomTime: 100,
    hp: 1
}
var planeM = {
    width :46,
    height:60,
    imgsrc:'img/enemy-plane-m.png',
    hitSrc: 'img/enemy-plane-m-hit.png',
    boomSrc: 'img/enemy-plane-m-boom.gif',
    boomTime: 100,
    hp: 5
}
var planeL = {
    width: 110,
    height: 164,
    imgsrc: 'img/enemy-plane-l.png',
    hitSrc: 'img/enemy-plane-l-hit.png',
    boomSrc: 'img/enemy-plane-l-boom.gif',
    boomTime: 100,
    hp: 20
};

var ourPlaneX = {
    width: 66,
    height: 80,
    imgsrc: 'img/our-plane.gif',
    boomSrc: 'img/our-plane-boom.gif',
    boomTime: 100,
    hp: 1
};
var bulletX = {
    width:6,
    height:14,
    imgsrc: 'img/our-bullet.png',
    speed: 20

}
//创建飞机的构造函数，四个参数分别是x坐标，y坐标，飞机型号，加速度
var plane = function(centerX,centerY,planeModel,speed){
    this.centerX= centerX;
    this.centerY = centerY;
    this.sizeX = planeModel.width;//飞机的宽度这属性取飞机型号的宽度
    this.sizeY = planeModel.height;//飞机的高度
    this.imgsrc = planeModel.imgsrc;//飞机路径取它本身型号的路径
    this.boomSrc = planeModel.boomSrc;
    this.boomTime = planeModel.boomTime;
    this.hp = planeModel.hp; 
    this.speed = speed;  //加速度就是它输入的参数
    
    //定位点设置，使坐标点在飞机图片的中心点
    this.currentX = this.centerX-this.sizeX/2;
    this.currentY = this.centerY - this.sizeY/2;
}
    //画一个飞机的方法
    plane.prototype.draw = function(){
        this.imgNode = new Image();//创建一个新的图片节点叫imgNode
        this.imgNode.src = this.imgsrc;
        this.imgNode.style.top = this.centerY-this.sizeY/2+'px';
        this.imgNode.style.left = this.centerX- this.sizeX/2+'px';
        main.appendChild(this.imgNode);
        console.log(this.imgNode.style.top);
    }

    //飞机移动的函数
    plane.prototype.move = function(){
        this.checkoverrange();
        this.currentY +=this.speed;
        this.centerY = this.currentY + this.sizeY/2;
	    this.imgNode.style.top = this.currentY + 'px';
    }

// var enemyplaneS = new plane(17,12,planeS,10);
// enemyplaneS.draw();
// var enemyplaneM = new plane(0,0,planeM,10);
// enemyplaneM.draw();

// //定时器启动移动

// setInterval(function(){
//     enemyplaneS.move();

// },400)

//检测飞机超出隐藏
plane.prototype.checkoverrange = function(){
    // 如果飞机超出画布 就给当前飞机对象添加一个isBottomRange的属性
     this.isBottomRange = this.currentY > (stageSizeY - this.sizeY);
    this.isTopRange = this.currentY<0;
    }


//敌机的构造函数，它是一个数组
var Enemy = function(){
    this.segment= [];
    this.generatedCount = 0;
};

//随机生成最小值和最大值之间的随机数
var randomNumber = function(min,max){
    return Math.round(Math.random()*(max-min))+ min;
}
//随机数的范围为min到max

//生成所有新飞机的函数
Enemy.prototype.createNewEnemy = function(){
    this.generatedCount++;

    if(this.generatedCount%17 ===0){
        this.newEnemy = new plane(randomNumber(planeL.width/2,stageSizeX-planeL.width/2),12,planeL,1)
    }else if(this.generatedCount%5 === 0){
        this.newEnemy = new plane(randomNumber(planeM.width/2,stageSizeX-planeM.width/2),12,planeM,randomNumber(2,3))
    }else{
        this.newEnemy = new plane(randomNumber(planeS.width/2,stageSizeX-planeS.width/2),12,planeS,randomNumber(3,5))
    }
    //把新飞机写入数组当中
    this.segment.push(this.newEnemy);
    //把新飞机画出来
    this.newEnemy.draw();
    
}
//移动所有的飞机
Enemy.prototype.moveAllEnemy = function () {
	// 遍历敌机对象里面的保存敌机的数组 让每一个都移动
	for (var i = 0; i < this.segment.length; i++) {
		this.segment[i].move();
		// 如果超出画布怎么样
		if (this.segment[i].isBottomRange) {
			main.removeChild(this.segment[i].imgNode);
			this.segment.splice(i,1);
		}
        
        //检测子弹碰撞
        for(var j= 0;j<ourPlane.segement.length;j++){

            //如果飞机还未死亡的话就挡住子弹
            if(this.segment[i].hp>0){
                var horizontalCollision = Math.abs(this.segment[i].centerX - ourPlane.segement[j].centerX) < (this.segment[i].sizeX/2 + ourPlane.segement[j].sizeX/2)
                var verticalCollision = Math.abs(this.segment[i].centerY - ourPlane.segement[j].centerY) < (this.segment[i].sizeY/2 + ourPlane.segement[j].sizeY/2)
                var checkBulletCollision = horizontalCollision && verticalCollision;

                if(checkBulletCollision){
                    //敌机被击中
                    score++;
                    scoreDiv.innerHTML = score;
                    this.segment[i].imgNode.src = this.segment[i].hitSrc ? this.segment[i].hitSrc:this.segment[i].boomSrc;
                    this.segment[i].hp--;
                    if(score>50){
                        ourPlane.newBullet1 = new Bullet(ourPlane.centerX-22,ourPlane.centerY-ourPlane.sizeY/2+20,bulletX,-6);
                        ourPlane.newBullet2 = new Bullet(ourPlane.centerX+22,ourPlane.centerY-ourPlane.sizeY/2+20,bulletX,-6);
                        ourPlane.segement.push(ourPlane.newBullet2);
                        ourPlane.segement.push(ourPlane.newBullet1); 
                        ourPlane.newBullet1.draw();
                        ourPlane.newBullet2.draw();
                    }

                    //把子弹去掉
                    main.removeChild(ourPlane.segement[j].imgNode);
                    ourPlane.segement.splice(j,1);
                }
            }
        }

        //检测与我方飞机的碰撞
        var ourHorizontalCollision = Math.abs(this.segment[i].centerX - ourPlane.centerX)<(this.segment[i].sizeX/2 + ourPlane.sizeX/2);
        var ourVerticalCollision = Math.abs(this.segment[i].centerY - ourPlane.centerY) < (this.segment[i].sizeY/2 + ourPlane.sizeY/2);
        var checkOurCollision = ourHorizontalCollision && ourVerticalCollision;

        if(checkOurCollision){  
            this.segment[i].hp = 0;
            ourPlane.hp--;
        }

        //检测飞机是否击毁
        if(this.segment[i].hp<=0){
            this.segment[i].imgNode.src = this.segment[i].boomSrc;
            this.segment[i].boomTime-=10;
            //把飞机干掉
            if(this.segment[i].boomTime<=0){
                main.removeChild(this.segment[i].imgNode);
                this.segment.splice(i,1);
            }
        }
 
	}
}

//实例化所有敌机
var enemies = new Enemy();

//制作我们的飞机
var ourPlane = new plane(stageSizeX/2,stageSizeY-ourPlaneX.height/2,ourPlaneX,0);
ourPlane.draw();
main.onmousemove =  function(ev){

    //限制飞机超出画布
    ourPlane.centerX = ev.clientX - contentDiv.offsetLeft;
    if(ourPlane.centerX<0){
        ourPlane.centerX = 0;
    }
    if(ourPlane.centerX >stageSizeX){
        ourPlane.centerX = stageSizeX;
    }
    ourPlane.centerY = ev.clientY - contentDiv.offsetTop;
    if(ourPlane.centerY<0){
        ourPlane.centerY = 0;
    }
    if(ourPlane.centerY>(stageSizeY - ourPlane.sizeY/2)){
        ourPlane.centerY =( stageSizeY - ourPlane.sizeY/2);
    }

    ourPlane.currentX = ourPlane.centerX - ourPlane.sizeX/2;
    ourPlane.currentY = ourPlane.centerY - ourPlane.sizeY/2;

    ourPlane.imgNode.style.left = ourPlane.currentX + 'px';
    ourPlane.imgNode.style.top = ourPlane.currentY + 'px';
    
}

//给我方子弹添加一个数组
ourPlane.segement = []

//子弹构造函数
var Bullet = plane;
function creatNewBullet(){
    ourPlane.newBullet = new Bullet(ourPlane.centerX,ourPlane.centerY-ourPlane.sizeY/2,bulletX,-10);
    ourPlane.segement.push(ourPlane.newBullet);
    ourPlane.newBullet.draw();
}
function moveNewBullet(){
    for(var i = 0;i<ourPlane.segement.length;i++){
        ourPlane.segement[i].move();
        if(ourPlane.segement[i].isTopRange){
            main.removeChild(ourPlane.segement[i].imgNode);
            ourPlane.segement.splice(i,1);
        }
    }
}
//游戏结束时
var gameOver = function(){
    ourPlane.imgNode.src = ourPlane.boomSrc;
    clearInterval(timeID);
    settlementDIV.style.display = "block";
    document.querySelector("p#final-score").innerText = score;

}
var time = 0;
var timeID;
var start = function(){
    //隐藏开始页面
    startDiv.style.display ="none";
    //显示游戏页面
    main.style.display ="block";
    //其他的页面也隐藏
    suspendDiv.style.display ="none";
    settlementDIV.style.display = "none";

    timeID = setInterval(function(){
        time++;
        if(time%10===0){
            enemies.createNewEnemy();
        }
        enemies.moveAllEnemy();
        if(time%3===0){
            creatNewBullet();
        }
        moveNewBullet();

        if(ourPlane.hp<=0){
            gameOver();
        }
    },30)
}
// timeID = setInterval(function(){
//     time++;
//     if(time%50 === 0){
//         enemies.createNewEnemy();
//     }

//     if (time%5 === 0) {
//         creatNewBullet();
//     }
//     moveNewBullet();
//     enemies.moveAllEnemy();
//     if(ourPlane.hp<=0){
//         gameOver();
//     }
// },30)

//重新加载文档
var restart = function(){
    window.location.reload();
}
continueDiv.onclick = function(ev){
    ev.stopPropagation();
    start();
};

main.onclick = function(){
    clearTimeout(timeID);
    suspendDiv.style.display = "block";
}
