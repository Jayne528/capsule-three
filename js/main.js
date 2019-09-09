var camera, scene, renderer,cameraControl;

//cannon 設定
var world;
var groundBody;
var shapeBody;
var shape;
var friction = 0.3;
var restitution = 0.1;
var shapeGroundContact;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var eggAll = 7

function init() {

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        antialias: true  //渲染毛邊比較少
    })
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enable = true;

    document.body.appendChild(renderer.domElement);

    // 相機
    camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight,0.1,1000)
    camera.position.set(80, 8, 3.5);
    camera.lookAt(scene.position);

    //  // XYZ 輔助線
    var axes = new THREE.AxesHelper(0);
    axes.position.set(0, -5, 0);
    scene.add(axes);

     //cannon 物理世界
     world = new CANNON.World();
     world.gravity.set(0, -55, 0);   // 一般是-9.8 可控制掉落速度
     world.broadphase = new CANNON.NaiveBroadphase()

    // 建立地板剛體
    var groundShape = new CANNON.Plane();
    var groundCM = new CANNON.Material();
    var groundBody = new CANNON.Body({
        mass:0,
        shape: groundShape,
        material: groundCM
    })
    //旋轉 X 軸-90度
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    groundBody.position.set(0,-25,0)
    world.add(groundBody);

    //底部剛體
    downExtents1 = new CANNON.Vec3(0.5, 11, 20)
    downbox1 = new CANNON.Box(downExtents1);
    downCM1 = new CANNON.Material();
    downBody1 = new CANNON.Body({
        mass: 0,
        shape: downbox1,
        material: downCM1
    })
    downBody1.position.set(-20,-14,0); 
    world.add(downBody1);

    downExtents2 = new CANNON.Vec3(0.5, 11, 20)
    downbox2 = new CANNON.Box(downExtents2);
    downCM2 = new CANNON.Material();
    downBody2 = new CANNON.Body({
        mass: 0,
        shape: downbox2,
        material: downCM2
    })
    downBody2.position.set(20,-14,0); 
    world.add(downBody2);

    downExtents3 = new CANNON.Vec3(20, 11, 0.5)
    downbox3 = new CANNON.Box(downExtents3);
    downCM3 = new CANNON.Material();
    downBody3 = new CANNON.Body({
        mass: 0,
        shape: downbox3,
        material: downCM3
    })
    downBody3.position.set(0,-14,-20); 
    world.add(downBody3);

    downExtents4 = new CANNON.Vec3(20, 11, 0.5)
    downbox4 = new CANNON.Box(downExtents4);
    downCM4 = new CANNON.Material();
    downBody4 = new CANNON.Body({
        mass: 0,
        shape: downbox4,
        material: downCM4
    })
    downBody4.position.set(0,-14,20); 
    world.add(downBody4);

    //底部隔板
    boardExtents = new CANNON.Vec3(20, 5, 20)
    boardbox = new CANNON.Box(boardExtents);
    boardCM = new CANNON.Material();
    boardBody = new CANNON.Body({
        mass: 0,
        shape: boardbox,
        material: boardCM
    })
    boardBody.position.set(0,-7.9,0); 
    world.add(boardBody);

    //建立圓形剛體
    var shapeCMC = [];
    for(var x=0; x<eggAll; x++) {
        shapebox = new CANNON.Sphere(6);
        shapeCMD = new CANNON.Material();
        shapeCMC.push(shapeCMD)
        shapeBody = new CANNON.Body({
            mass: 15,
            shape: shapebox,
            material: shapeCMD
        })
        shapeBody.position.set(x+6, x+1.5, x+7); 
        shapeBody.name = name+"ball"+x;
        world.add(shapeBody);
    }
    //玻璃窗剛體
    halfExtents1 = new CANNON.Vec3(19, 15, 0.5);
    shapebox1 = new CANNON.Box(halfExtents1);
    shapeCM1 = new CANNON.Material();
    shapeBody1 = new CANNON.Body({
       mass:0,
       shape: shapebox1,
       material: shapeCM1
    })
    shapeBody1.position.set(0,11,19); 
    world.add(shapeBody1);

    halfExtents2 = new CANNON.Vec3(19, 15, 0.5);
    shapebox2 = new CANNON.Box(halfExtents2);
    shapeCM2 = new CANNON.Material();
    shapeBody2 = new CANNON.Body({
       mass:0,
       shape: shapebox2,
       material: shapeCM2
    })
    shapeBody2.position.set(0,11,-19); 
    world.add(shapeBody2);

    halfExtents3 = new CANNON.Vec3(0.5, 15, 19);
    shapebox3 = new CANNON.Box(halfExtents3);
    shapeCM3 = new CANNON.Material();
    shapeBody3 = new CANNON.Body({
       mass:0,
       shape: shapebox3,
       material: shapeCM3
    })
    shapeBody3.position.set(19,11,0); 
    world.add(shapeBody3);

    halfExtents4 = new CANNON.Vec3(0.5, 15, 19);
    shapebox4 = new CANNON.Box(halfExtents4);
    shapeCM4 = new CANNON.Material();
    shapeBody4 = new CANNON.Body({
       mass:0,
       shape: shapebox4,
       material: shapeCM4
    })
    shapeBody4.position.set(-19,11,0); 
    world.add(shapeBody4);

    //上蓋
    coverExtents = new CANNON.Vec3(20, 3, 20);
    coverbox = new CANNON.Box(coverExtents);
    coverCM = new CANNON.Material();
    coverBody = new CANNON.Body({
       mass:0,
       shape: coverbox,
       material: coverCM
    })
    coverBody.position.set(0,28,0); 
    world.add(coverBody);

    //隔板
    downExtents5 = new CANNON.Vec3(20, 11, 0.5)
    downbox5 = new CANNON.Box(downExtents5);
    downCM5 = new CANNON.Material();
    downBody5 = new CANNON.Body({
        mass: 0,
        shape: downbox5,
        material: downCM5
    })
    downBody5.position.set(0,-14,-2.5); 
    world.add(downBody5);

    //隔板
    downExtents6 = new CANNON.Vec3(0.5, 11, 10)
    downbox6 = new CANNON.Box(downExtents6);
    downCM6 = new CANNON.Material();
    downBody6 = new CANNON.Body({
        mass: 0,
        shape: downbox6,
        material: downCM6
    })
    downBody6.position.set(3,-14,-10); 
    world.add(downBody6);


    for(var i = 0; i<eggAll;i++) {
        shapeGroundContact = new CANNON.ContactMaterial( groundCM, shapeCMC[i], downCM1, downCM2, downCM3, downCM4, downCM5, downCM6, boardCM, coverCM, shapeCM1,  shapeCM2, shapeCM3, shapeCM4,{
            friction: friction,
            restitution: restitution //反彈程度
        })
        world.addContactMaterial(shapeGroundContact)
    }



    
    //THREE 地板網格
    var groundGeometry = new THREE.PlaneGeometry(40, 40);
    var groundMaterial = new THREE.MeshLambertMaterial({
    color: 0xCD3532,
    side: THREE.DoubleSide
    })
    var ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0,-25,0)
    ground.receiveShadow = true;
    scene.add(ground)

    //底座
    var baseGeometry1 = new THREE.BoxGeometry( 1, 22, 40 )
    var baseMaterial1 = new THREE.MeshLambertMaterial({ 
        color: 0xCD3532 ,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    base1 = new THREE.Mesh(baseGeometry1, baseMaterial1)
    base1.name = name+1;
    base1.position.set(-20,-14, 0)
    scene.add(base1)

    var baseGeometry2 = new THREE.BoxGeometry( 1, 22, 40 )
    var baseMaterial2 = new THREE.MeshLambertMaterial({ 
        color: 0xCD3532 ,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    base2 = new THREE.Mesh(baseGeometry2, baseMaterial2)
    base2.name = name+2;
    base2.position.set(20,-14,0)
    scene.add(base2)

    var baseGeometry3 = new THREE.BoxGeometry( 40, 22, 1 )
    var baseMaterial3 = new THREE.MeshLambertMaterial({ 
        color: 0xCD3532 ,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    base3 = new THREE.Mesh(baseGeometry3, baseMaterial3)
    base3.name = name+3;
    base3.position.set(0,-14,-20)
    scene.add(base3)

    var baseGeometry4 = new THREE.BoxGeometry( 40, 22, 1 )
    var baseMaterial4 = new THREE.MeshLambertMaterial({ 
        color: 0xCD3532 ,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    base4 = new THREE.Mesh(baseGeometry4, baseMaterial4)
    base4.name = name+4;
    base4.position.set(0, -14, 20)
    scene.add(base4)

    //底座隔板
    var boardGeometry = new THREE.BoxGeometry( 40, 10, 40)
    var boardMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xCD3532 ,
        side:THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    board = new THREE.Mesh(boardGeometry, boardMaterial)
    board.position.set(0,-5.9,0)
    scene.add(board)

    //圓球網格
    for(var x=0; x<eggAll; x++) {
        var shapeGeometry = new THREE.SphereGeometry(6, 32, 32 );
        var shapeMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color(Math.random() * 0xffffff),
            transparent: true,
            opacity: 1,
        });
        shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
        shape.castShadow = true;
        shape.name = name+"ball"+x;
        shape.position.set(x+7, 10, x+7);
        scene.add(shape);
    }

    //玻璃窗
    var glassGeometry = new THREE.BoxGeometry( 38, 30, 0.5)
    var glassGeometry1 = new THREE.BoxGeometry( 0.5, 30, 38)
    var glassMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xC4DCEF ,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.07
    })
    glass1 = new THREE.Mesh(glassGeometry, glassMaterial)
    glass1.position.set(0,11,19)
    glass2 = new THREE.Mesh(glassGeometry, glassMaterial)
    glass2.position.set(0,11,-19)
    glass3 = new THREE.Mesh(glassGeometry1, glassMaterial)
    glass3.position.set(19,11,0)
    glass4 = new THREE.Mesh(glassGeometry1, glassMaterial)
    glass4.position.set(-19,11,0)
    scene.add(glass1)
    scene.add(glass2)
    scene.add(glass3)
    scene.add(glass4)

    //上蓋
    var coverGeometry = new THREE.BoxGeometry( 40, 5, 40 )
    var coverMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xCD3532 ,
        side: THREE.DoubleSide
    })
    cover = new THREE.Mesh(coverGeometry, coverMaterial)
    cover.position.set(0,28,0)
    scene.add(cover)


    //隔板
    var baseGeometry5 = new THREE.BoxGeometry( 40, 22, 1 )
    var baseMaterial5 = new THREE.MeshLambertMaterial({ 
        color: 0xCD3532 ,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    base5 = new THREE.Mesh(baseGeometry5, baseMaterial5)
    base5.name = name+5;
    base5.position.set(0,-14, -2)
    scene.add(base5)

    //隔板
    var baseGeometry6 = new THREE.BoxGeometry( 1, 22, 20 )
    var baseMaterial6 = new THREE.MeshLambertMaterial({ 
        color: 0xCD3532 ,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    base6 = new THREE.Mesh(baseGeometry6, baseMaterial6)
    base6.name = name+6;
    base6.position.set(0,-14, -10)
    scene.add(base6)

    //底座轉扭部分
    var buttonSideGeometry = new THREE.BoxGeometry( 0.5, 18, 16 )
    var buttonSideMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xC3C1BF ,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    buttonSide = new THREE.Mesh(buttonSideGeometry, buttonSideMaterial)
    buttonSide.position.set(20.5,-12,9)
    scene.add(buttonSide)

    //底座轉扭
    var buttonGeometry =  new THREE.CylinderGeometry( 5, 5, 1.5, 42 )
    var buttonMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xF2F9FD ,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    button = new THREE.Mesh(buttonGeometry, buttonMaterial)
    button.position.set(21,-14.5,9)
    button.rotation.z = -Math.PI / 2;
    scene.add(button)


    //底座轉扭長型
    var buttonRecGeometry = new THREE.BoxGeometry( 2, 1, 8 )
    var buttonRecMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xE3F0F9 ,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    })
    buttonRec = new THREE.Mesh(buttonRecGeometry, buttonRecMaterial)
    buttonRec.position.set(22.5,-14.5,9)
    buttonRec.name = name+"turn";
    scene.add(buttonRec)

    //底座出口
    var buttonRectGeometry = new THREE.BoxGeometry( 0.1, 12, 14 )
    var buttonRectMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x532E38,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    })
    buttonRect = new THREE.Mesh(buttonRectGeometry, buttonRectMaterial)
    buttonRect.position.set(20.5,-15, -10)
    scene.add(buttonRect)

    //THREE 燈光
    var ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); //0.5 是強度  //平行燈
    scene.add(directionalLight);

    var spotLight = new THREE.SpotLight(0xffffff, 1, 1000);  // 聚光燈
    spotLight.position.set( -20, 20, 10 );
    spotLight.castShadow = true;
    scene.add(spotLight);

    //控制攝影機
    cameraControl = new THREE.OrbitControls(camera)
    cameraControl.minDistance = 70;
    cameraControl.maxDistance = 250;

}

function ballmove() {

    var randomY = THREE.Math.randFloat(0, 2)
    var randomX = THREE.Math.randFloat(-12, 12)
    var randomZ = THREE.Math.randFloat(-12, 12)

    var tl = new TimelineMax({
        // yoyo: true,
        ease: Elastic.easeOut,
    });

    for(var i=6; i<eggAll+6;i++) {
        tl.to(world.bodies[i].position, 0, {y: randomY})
        tl.to(world.bodies[i].position, 0, {x: randomX})
        tl.to(world.bodies[i].position, 0, {z: randomZ})
    }
}

//滾球出來
function ballOut() {

    setTimeout(() => {
        world.bodies[Number].mass= 0
    }, 1.3);
    setTimeout(() => {
        world.bodies[Number].mass= 1
    }, 1.7);

    var Number = Math.floor(Math.random()*eggAll+6);

    console.log(Number)
    var tl = new TimelineMax({
        // yoyo: true,
        ease: Elastic.easeOut,
    });

    tl.to(world.bodies[Number].position, 0.7, { 
        z: -13
    })
    tl.to(world.bodies[Number].position, 0.7, { 
        x: 13,
    })
    tl.to(world.bodies[Number].position, 0.7, {
        y: -20, 
    })

}

function turn() {
    var tl = new TimelineMax({
        // yoyo: true,
        ease: Elastic.easeOut,
    });

    tl.to(buttonRec.rotation, 1, {x: -Math.PI,})
    tl.to(buttonRec.rotation, 1, {x: -Math.PI*2})
    tl.to(buttonRec.rotation, 0, {x: 0})

}
var timeStart, timeEnd, time;

//获取此刻时间
function getTimeNow() {
    var now = new Date();
    return now.getTime();
}


function holdDown( event ) {
    timeStart = getTimeNow()

    //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    raycaster.setFromCamera( mouse, camera );

    // 获取raycaster直线和所有模型相交的数组集合
    var intersects = raycaster.intersectObjects( scene.children);
    time = setInterval(function () {
        timeEnd = getTimeNow();

        //如果此时检测到的时间与第一次获取的时间差有1000毫秒
        if (timeEnd - timeStart > 1000) {
            clearInterval(time)

            for ( var i = 0; i < intersects.length; i++ ) {

                var obj = intersects[0].object
                //轉動
                if(obj.name=="turn") {
                    turn() 
                    ballmove()
                    if(i==0) {
                        ballOut()
                    }
                }
            }
        }
    }, 100);

}
function holdUp() {
    //如果按下时间不到1000毫秒便弹起，
    clearInterval(time);
}

window.addEventListener( 'mousedown', holdDown, false );
window.addEventListener( 'mouseup', holdUp, false );



var timeStep = 1 / 60; 

function render() {

    world.step(timeStep)

    renderer.render(scene, camera);

    //更新攝影機
    cameraControl.update();

    
    for(i=0; i<world.bodies.length; i++) {
        scene.children[i+1].position.copy(world.bodies[i].position);
        scene.children[i+1].quaternion.copy(world.bodies[i].quaternion);
    }

    requestAnimationFrame(render)
}

init()
render()