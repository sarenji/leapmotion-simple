/**
 * A simple application to try out the Leap motion API.
 */

// Variables to help set up the application.
var $window = $(window),
    WIDTH   = $window.width(),
    HEIGHT  = $window.height();

// Some camera attributes
var VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

// get the DOM element to attach to
var $container = $("#container");

// create a WebGL renderer, camera and a scene
var renderer = new THREE.WebGLRenderer();
var camera =
  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);
var scene = new THREE.Scene();
scene.add(camera);

// the camera starts at 0, 0, 0, so pull it back
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 300;
camera.lookAt(new THREE.Vector3(0,0,0));

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// create a box and add it to the scene
var boxMaterial = new THREE.MeshLambertMaterial({
  color: 0xCC0000
});
var box = new THREE.Mesh(
  new THREE.CubeGeometry(50, 50, 50),
  boxMaterial
);
scene.add(box);

// create and add a point light
var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;
scene.add(pointLight);

// attach the renderer-supplied DOM element to the container
$container.append(renderer.domElement);

/*
 * This is the main entry point.
 *
 * Leap.loop is part of the Leap API. As discussed in the paper, Leap.loop is a
 * thin abstraction that simply starts running a loop using renderAnimationFrame
 * internally, so that it mimics a real game loop.
 */
Leap.loop(function(frame) {
  var handId, handCount, hand, handsLength, positions, x, y, z;

  // We find the total number of hands.
  if (frame.hands) {
    handsLength = frame.hands.length;
  } else {
    handsLength = 0;
  }

  // Change position of the box based on the average positions of all hands.
  // Note that we normalize the position of each hand by dividing by the maximum
  // possible dimension.
  positions = [];
  for (handId = 0, handCount = handsLength; handId < handCount; handId++) {
    hand = frame.hands[handId];
    x = hand.palmPosition[0] / frame.interactionBox.width;
    y = hand.palmPosition[1] / frame.interactionBox.height;
    z = hand.palmPosition[2] / frame.interactionBox.depth;
    positions.push([ x, y, z ]);
  }

  // Now we average all the positions, if we did in fact find a hand.
  if (handsLength > 0) {
    x = positions.reduce(function(a, b) { return a + b[0]; }, 0) / handsLength;
    y = positions.reduce(function(a, b) { return a + b[1]; }, 0) / handsLength;
    z = positions.reduce(function(a, b) { return a + b[2]; }, 0) / handsLength;
    pos = new THREE.Vector3(x * 500, y * 1000 - 500, z * 500);
    box.position.copy(pos);
  }

  renderer.render(scene, camera);
});
