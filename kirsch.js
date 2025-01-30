// 必要なThree.jsモジュールをインポート
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// シーン、カメラ、レンダラーのセットアップ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ポストプロセッシング用のコンポーザー
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.0, // 強度
  0.4, // 半径
  0.85 // 閾値
);
composer.addPass(bloomPass);

// GLTFローダー
const loader = new GLTFLoader();

// 花びらデータを格納する配列
const petals = [];

// 花びらの読み込みと初期配置
loader.load('kirschbluede_1.glb', (gltf) => {
  const petalModel = gltf.scene;

  for (let i = 0; i < 30; i++) {
    const petal = petalModel.clone();

    // ランダムな初期位置とスケールを設定
    petal.position.set(
      Math.random() * 40 - 20, // X軸
      Math.random() * 20 - 10, // Y軸
      Math.random() * 5 - 2.5  // Z軸（奥行きでボケ感を出す）
    );
    petal.scale.setScalar(Math.random() * 0.5 + 0.5); // サイズ調整

    // シーンに追加
    scene.add(petal);
    petals.push(petal);
  }
});

// アニメーション
function animatePetals() {
  petals.forEach((petal) => {
    // Y軸方向の上昇
    petal.position.y += 0.02;

    // X軸方向の左右揺れ
    petal.position.x += Math.sin(Date.now() * 0.001 + petal.position.y) * 0.01;

    // Z軸方向の奥行き揺れ
    petal.position.z += Math.cos(Date.now() * 0.001 + petal.position.x) * 0.01;

    // 上に行き過ぎたらリセット
    if (petal.position.y > 15) {
      petal.position.y = -10;
      petal.position.x = Math.random() * 40 - 20;
      petal.position.z = Math.random() * 5 - 2.5;
    }
  });
}

// レスポンシブ対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// レンダリングループ
function animate() {
  requestAnimationFrame(animate);
  animatePetals();
  composer.render();
}

animate();