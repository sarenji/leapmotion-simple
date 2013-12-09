var $window = $(window),
    WIDTH   = $window.width(),
    HEIGHT  = $window.height();

// set some camera attributes
var VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

// get the DOM element to attach to
var $container = $("#container");

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();
var camera =
  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

var scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);

// the camera starts at 0,0,0
// so pull it back
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 300;
camera.lookAt(new THREE.Vector3(0,0,0));

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

var boxMaterial = new THREE.MeshLambertMaterial({
  color: 0xCC0000
});

var box = new THREE.Mesh(
  new THREE.CubeGeometry(50, 50, 50),
  boxMaterial
);

// add the box to the scene
scene.add(box);

var pointLight =
  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

// attach the render-supplied DOM element
$container.append(renderer.domElement);

var previousFrame;

Leap.loop(function(frame) {
  var handId, handCount, hand, handsLength, x, y, z;

  if (frame.hands) {
    handsLength = frame.hands.length;
  } else {
    handsLength = 0;
  }

  // Change position of the box based on position of the hand
  for (handId = 0, handCount = handsLength; handId != handCount; handId++) {
    hand = frame.hands[handId];
    x = hand.palmPosition[0] / frame.interactionBox.width;
    y = hand.palmPosition[1] / frame.interactionBox.height;
    z = hand.palmPosition[2] / frame.interactionBox.depth;
    pos = new THREE.Vector3(x * 500, y * 500 - 250, z * 500);
    box.position.copy(pos);
  }

  // recognize gesture
  for (var gestureId = 0, gestureCount = frame.gestures.length; gestureId < gestureCount; gestureId++) {
    var gesture = frame.gestures[gestureId];
    console.log(gesture);
  }

  renderer.render(scene, camera);
  previousFrame = frame;
});


  // translation from prev.
  // if (previousFrame && previousFrame.valid) {
  //   var translation = frame.translation(previousFrame);
  //   var pos = new THREE.Vector3(translation[0], translation[1], translation[2]);
  //   box.position.add(pos);
  // }
