/**
 * @description: 显示模型
 * @author: cnn
 * @createTime: 2021/2/2 17:17
 **/
import React, { useEffect, useState } from 'react';
// @ts-ignore
import * as THREE from '@static/js/build/three.module.js';
// @ts-ignore
import { FBXLoader } from '@static/js/jsm/loaders/FBXLoader.js';
// @ts-ignore
import { CSS2DRenderer } from '@static/js/jsm/renderers/CSS2DRenderer.js';
// @ts-ignore
import { OrbitControls } from '@static/js/jsm/controls/OrbitControls.js';
import '@static/js/jsm/postprocessing/CopyShader.js';
import '@static/js/jsm/postprocessing/EffectComposer.js';
import '@static/js/jsm/postprocessing/OutlinePass.js';
import '@static/js/jsm/postprocessing/RenderPass.js';
import '@static/js/jsm/postprocessing/ShaderPass.js';
import { modelType } from '@utils/CommonVars';
import { ViewPanel, useViewPanel } from '@components/index';

interface Model {
  sourceUrl: string,
  type: modelType
}

interface MixerAction {
  mixer: any,
  action: any
}

interface MaterialData {
  name: string,
  material: any
}

let container: any;
let controls: any;
let camera: any;
let scene: any;
let renderer: any;
let labelRenderer: any;
const clock = new THREE.Clock();
// todo 高亮模型
// let composer: any;
let selectObjectList: Array<any> = [];

const Engine3D = () => {
  const { panelTop, panelLeft, display, viewChildren, setViewPanel, hiddenViewPanel } = useViewPanel();
  const [modelList, setModelList] = useState<Array<Model>>([]);
  const [mixerActionList, setMixerActionList] = useState<Array<MixerAction>>([]);
  const [materialList, setMaterialList] = useState<Array<MaterialData>>([]);
  const [initSceneDone, setInitSceneDone] = useState<boolean>(false);
  useEffect(() => {
    getModelList();
  }, []);
  useEffect(() => {
    if (modelList.length > 0) {
      initScene();
    }
  }, [modelList]);
  useEffect(() => {
    // 带动画的模型数量
    const animationModelCount: number = modelList.filter((item: Model) => item.type === modelType.animation).length;
    // 如果场景加载完成，且有模型，且带动画的模型加载完成
    if (initSceneDone && modelList.length > 0 && animationModelCount === mixerActionList.length) {
      animate();
    }
  }, [modelList, mixerActionList, initSceneDone]);
  // 初始化场景
  const initScene = () => {
    container = document.getElementById('container');
    // 相机位置（模型在视野内放大缩小）
    camera = new THREE.PerspectiveCamera(800, window.innerWidth / window.innerHeight, 800, 80000);
    camera.position.set(0, 4500, 4500);
    // 场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#050404');
    // 光源
    const light1 = new THREE.HemisphereLight(0xffffff, 0x444444);
    light1.position.set(0, 200, 0);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(0, 200, 100);
    light2.castShadow = true;
    light2.shadow.camera.top = 180;
    light2.shadow.camera.bottom = -100;
    light2.shadow.camera.left = -120;
    light2.shadow.camera.right = 120;
    scene.add(light2);
    // 加载模型
    initModelList();
    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight - 6);
    container.appendChild(renderer.domElement);
    // 2D 渲染器
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight - 6);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    container.appendChild(labelRenderer.domElement);
    // 轨道控制器
    controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();
    // 浏览器事件监听
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', onMouseClick, false);
    setInitSceneDone(true);
  };
  // 加载模型
  const initModelList = () => {
    // 加载模型
    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].type === modelType.static) {
        initStaticModel(modelList[i].sourceUrl);
      } else if (modelList[i].type === modelType.animation) {
        initAnimationModel(modelList[i].sourceUrl);
      }
    }
  };
  // 获取模型列表
  const getModelList = () => {
    const modelList: Array<Model> = [{
      sourceUrl: '/modelStatic/models/fixed.fbx',
      type: modelType.static
    }, {
      sourceUrl: '/modelStatic/models/gd1.fbx',
      type: modelType.animation
    }, {
      sourceUrl: '/modelStatic/models/gd2.fbx',
      type: modelType.animation
    }, {
      sourceUrl: '/modelStatic/models/gd3.fbx',
      type: modelType.animation
    }];
    setModelList(modelList);
  };
  // 加载静态模型
  const initStaticModel = (src: string) => {
    const loader = new FBXLoader();
    loader.load(src, (object: any) => {
      dealMeshMaterial(object.children);
      object.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(object);
    });
  };
  // 加载动态模型
  const initAnimationModel = (src: string, isPlay = true) => {
    const loader = new FBXLoader();
    loader.load(src, (object: any) => {
      dealMeshMaterial(object.children);
      const mixer = new THREE.AnimationMixer(object);
      const action = mixer.clipAction(object.animations[0]);
      mixerActionList.push({
        mixer,
        action
      });
      setMixerActionList([...mixerActionList]);
      if (isPlay) {
        action.play();
      }
      scene.add(object);
    });
  };
  // 监听拉伸浏览器事件
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
  };
  // 监听鼠标单击事件
  const onMouseClick = (event: MouseEvent) => {
    // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
    const intersects = getIntersects(event);
    // 清空所有高亮材质
    resetMaterial();
    // 获取选中最近的 Mesh 对象
    if (intersects.length !== 0 && intersects[0].object instanceof THREE.Mesh) {
      const selectObject = intersects[0].object;
      selectObjectList.push(selectObject);
      onSelectObject(selectObject, event);
    } else {
      // 隐藏面板
      hiddenViewPanel();
    }
  };
  // 获取与射线相交的对象数组
  const getIntersects = (event: MouseEvent) => {
    event.preventDefault();
    // 声明 raycaster 和 mouse 变量
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // 通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    raycaster.setFromCamera(mouse, camera);
    // 找到场景中所有外部模型
    const scensObjs: Array<any> = [];
    scene.children.forEach((child: any) => {
      for (let i = 0; i < child.children.length; i++) {
        const obj = child.children[i];
        scensObjs.push(obj);
      }
    });
    // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
    return raycaster.intersectObjects(scensObjs);
  };
  // 选中某个对象
  const onSelectObject = (tempSelectObject: any, event: MouseEvent) => {
    // // 1. 发光
    // // 特效组件
    // composer = new THREE.EffectComposer(renderer);
    // const renderPass = new THREE.RenderPass(scene, camera);
    // // 特效渲染
    // composer.addPass(renderPass);
    // const outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    // // 加入高光特效
    // composer.addPass(outlinePass);
    // outlinePass.pulsePeriod = 2; // 数值越大，律动越慢
    // outlinePass.visibleEdgeColor.set(0xff0000); // 高光颜色
    // outlinePass.hiddenEdgeColor.set(0x000000);// 阴影颜色
    // outlinePass.usePatternTexture = false; // 使用纹理覆盖？
    // outlinePass.edgeStrength = 5; // 高光边缘强度
    // outlinePass.edgeGlow = 1; // 边缘微光强度
    // outlinePass.edgeThickness = 1; // 高光厚度
    // outlinePass.selectedObjects = [tempSelectObject]; // 需要高光的obj
    // 2. 高亮模型（不知道是不是白膜的原因，不会高亮，而是变成这个颜色）
    let oldOneMaterial = materialList.filter(item => item.name === tempSelectObject.name)[0];
    tempSelectObject.material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      map: oldOneMaterial.material.map
    });
    // 两种情况，点击生产线看生产线数据
    if (tempSelectObject.name === '生产线') {
      // 显示面板
      getComponentData(event, '测试', 'line');
    }
    // 点击管道看管道数据
    else {
      // 显示面板
      getComponentData(event, '测试', 'piping');
    }
  };
  // 重置材质
  const resetMaterial = ()=> {
    for (let i = 0; i < selectObjectList.length; i++) {
      selectObjectList[i].material = materialList.filter(item => item.name === selectObjectList[i].name)[0].material;
    }
    selectObjectList = [];
  };
  // 动画
  const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    for (let i = 0; i < mixerActionList.length; i++) {
      mixerActionList[i].mixer.update(delta);
    }
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    // todo 高亮模型
    // // 会导致模型锯齿状，需改进
    // if(composer){
    //   composer.render();
    // }
  };
  // 保留模型材质
  const dealMeshMaterial = (arrList: Array<any>) => {
    for (let i = 0; i < arrList.length; i++) {
      materialList.push({
        name: arrList[i].name,
        material: arrList[i].material
      });
    }
    setMaterialList([...materialList]);
  };
  // 点击构件获取数据，区分不同类型，
  const getComponentData = (event: MouseEvent, name: string, type: string) => {
    setViewPanel(event.clientY, event.clientX, (
      <div>
        <p>棕化线</p>
        <div>硫酸钠：500L/S</div>
        <div>硫酸钠：500L/S</div>
        <div>硫酸钠：500L/S</div>
        <div>硫酸钠：500L/S</div>
        <div>硫酸钠：500L/S</div>
      </div>
    ));
  };
  return (
    <div id="container">
      <ViewPanel top={panelTop} left={panelLeft} viewChildren={viewChildren} display={display} />
    </div>
  );
};
export default Engine3D;
