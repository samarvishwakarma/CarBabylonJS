import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders'

const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas);

var createScene = function () {
  engine.enableOfflineSupport = false;

  // Scene and Camera
  var scene = new BABYLON.Scene(engine);

  var camera1 = new BABYLON.ArcRotateCamera("camera1", 0, 3, 30, new BABYLON.Vector3(0, -5, 0), scene);
  scene.activeCamera = camera1;
  camera1.lowerRadiusLimit = 2;
  camera1.upperRadiusLimit = 10;
  camera1.wheelDeltaPercentage = 0.01;
  camera1.upperBetaLimit = Math.PI/2.5;

  // Lights
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.6;
  light.specular = BABYLON.Color3.Black();

  var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
  light2.position = new BABYLON.Vector3(0, 5, 5);

  // // Skybox
  // var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
  // var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  // skyboxMaterial.backFaceCulling = false;
  // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox2", scene);
  // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  // skybox.material = skyboxMaterial;

  // Ground
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { height: 500, width: 500, subdivisions: 4 }, scene);
  var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("public/wood.jpg", scene);
  groundMaterial.diffuseTexture.uScale = 300;
  groundMaterial.diffuseTexture.vScale = 300;
  groundMaterial.specularColor = new BABYLON.Color3(.1, .1, .1);
  ground.material = groundMaterial;

  const pivot = new BABYLON.Mesh("pivot", scene); //current centre of rotation


  // Load hero character and play animation
  var car = BABYLON.SceneLoader.ImportMesh("", "/public/", 'Car.glb', scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
      var hero = scene.getMeshByName("CarBody_primitive0").parent.parent;
      var backRight = scene.getMeshByName("BackRightWheel_primitive0").parent; 
      var backLeft = scene.getMeshByName("BackLeftWheel_primitive0").parent; 
      var frontRight = scene.getMeshByName("FrontRightWheel_primitive0").parent; 
      var frontLeft = scene.getMeshByName("FrontLeftWheel_primitive0").parent; 
     
      // //Rotate the model down        
      // hero.rotation.y = -Math.PI/2;
      hero.rotationQuaternion = undefined;
      frontRight.rotationQuaternion = undefined;
      frontLeft.rotationQuaternion = undefined;
      frontRight.rotation.x = Math.PI/2;
      frontLeft.rotation.x = Math.PI/2;

      pivot.position.z = 4;
      hero.parent = pivot;
      hero.position = new BABYLON.Vector3(0, 0, -4);

      //Lock camera on the character 
      camera1.target = hero;

      var keypress = {};
      var acc = 0;
      
      scene.registerBeforeRender(function() {
      if(acc < 0)
      {
          pivot.translate(BABYLON.Axis.X, acc, BABYLON.Space.LOCAL);
      }
      })
      
      scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
          case BABYLON.KeyboardEventTypes.KEYDOWN:
              if(kbInfo.event.key == "ArrowUp")
                  { 
                      if(acc > -0.5)
                      {
                          acc -= 0.0005
                      }
                      else ;
                      pivot.translate(BABYLON.Axis.X, acc, BABYLON.Space.LOCAL);
                      frontRight.rotation.y = 0
                      frontLeft.rotation.y = 0
                  }
              else if(kbInfo.event.key == "ArrowDown")
                  { 
                      if(acc < 0.05)
                      {
                          acc += 0.0005
                      }
                      else ;
                      pivot.translate(BABYLON.Axis.X, acc, BABYLON.Space.LOCAL);
                      frontRight.rotation.y = 0
                      frontLeft.rotation.y = 0
                  }
              else if(kbInfo.event.key == "ArrowLeft")
                  { 
                      if(hero.position.z == 4);
                      else
                          {
                              pivot.translate(BABYLON.Axis.Z, 4, BABYLON.Space.WORLD);
                              hero.translate(BABYLON.Axis.Z, -8, BABYLON.Space.LOCAL);
                          }
                      pivot.rotate(BABYLON.Axis.Y, -0.01, BABYLON.Space.LOCAL); 

                      if(frontRight.rotation.y < Math.PI/4 )
                      {
                          frontRight.rotation.y += Math.PI/32
                          frontLeft.rotation.y += Math.PI/32
                      }
                      
                  }
              else if(kbInfo.event.key == "ArrowRight")
                  {
                      if(hero.position.z == -4);
                      else
                          {
                              pivot.translate(BABYLON.Axis.Z, -4, BABYLON.Space.WORLD);
                              hero.translate(BABYLON.Axis.Z, 8, BABYLON.Space.LOCAL);
                          }
                      pivot.rotate(BABYLON.Axis.Y, 0.01, BABYLON.Space.LOCAL);

                      if(frontRight.rotation.y > -Math.PI/4 )
                      {
                          frontRight.rotation.y -= Math.PI/32
                          frontLeft.rotation.y -= Math.PI/32
                      }
                  }
              else ;
          break;
          case BABYLON.KeyboardEventTypes.KEYUP:
              if(kbInfo.event.code == "ArrowUp")
                  console.log("ArowUp");
              else if(kbInfo.event.code == "ArrowDown")
                  console.log("ArrowDown");
              else ;
          break;
  }
  });   

  

  // var util = new BABYLON.UtilityLayerRenderer(scene);
  // var fiz = new BABYLON.PositionGizmo(util);
  //  fiz.attachedMesh = pivot;

  });



  return scene;
}

const scene = createScene();

engine.runRenderLoop(function() {
  scene.render();
});

window.addEventListener('resize', function() {
  engine.resize();
})