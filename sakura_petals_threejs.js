// // Three.jsモジュールをESモジュール形式でインポート
// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
// import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';
// import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/postprocessing/UnrealBloomPass.js';

// CDNから直接モジュールをインポート
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/postprocessing/UnrealBloomPass.js';

// ここから先は前回提示したコードと同じです。


// シーン作成
const scene = new THREE.Scene();

// カメラ設定
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);

// レンダラー設定
const renderer = new THREE.WebGLRenderer({ alpha: true }); // 背景を透過に
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// GLTFローダー
const loader = new GLTFLoader();

// 花びらモデルを読み込み
let petals = [];
loader.load("kirschbluede_1.glb", (gltf) => {
  for (let i = 0; i < 30; i++) {
    const petal = gltf.scene.clone();
    petal.position.set(
      (Math.random() - 0.5) * 20, // X座標
      Math.random() * -10, // Y座標
      (Math.random() - 0.5) * 20 // Z座標
    );
    petal.rotation.set(
      Math.random() * Math.PI, // X軸回転
      Math.random() * Math.PI, // Y軸回転
      Math.random() * Math.PI // Z軸回転
    );
    petal.scale.set(0.2, 0.2, 0.2); // サイズ調整
    scene.add(petal);
    petals.push(petal);
  }
});

// ポストプロセッシング設定
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const unrealBloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
composer.addPass(unrealBloomPass);

// ウィンドウリサイズ対応
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);

  petals.forEach((petal) => {
    petal.position.y += 0.02; // ゆっくり上昇
    petal.rotation.x += 0.01;
    petal.rotation.y += 0.01;

    // 花びらが画面上部を超えたら再配置
    if (petal.position.y > 10) {
      petal.position.y = -10;
      petal.position.x = (Math.random() - 0.5) * 20;
      petal.position.z = (Math.random() - 0.5) * 20;
    }
  });

  composer.render();
}

animate();
