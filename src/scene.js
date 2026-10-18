import * as THREE from 'three';
import { sceneTheme as theme } from './theme.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

const STEP = -Math.PI * .31;
const HEIGHT = 420;
export function createExhibition(container, topics, onSelect, onEnter) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(theme.fog, .00017);
  const htmlScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 1, 14000);
  const html = new CSS3DRenderer();
  html.domElement.className = 'spatial-screens';
  container.append(html.domElement);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'architecture';
    container.prepend(renderer.domElement);
  } catch { document.body.classList.add('no-webgl'); }
  scene.add(new THREE.HemisphereLight(theme.skyLight, theme.groundLight, 2.6));
  const light = new THREE.DirectionalLight(theme.keyLight, 3.6);
  light.position.set(-1200, 1800, 2400); scene.add(light);
  const fill = new THREE.DirectionalLight(theme.fillLight, 1.3); fill.position.set(1400, -1000, -800); scene.add(fill);
  const bronze = new THREE.MeshStandardMaterial({color:theme.bronze,metalness:.72,roughness:.5});
  const dark = new THREE.MeshStandardMaterial({color:theme.timber,metalness:.22,roughness:.86});
  const stone = new THREE.MeshStandardMaterial({color:theme.stone,metalness:.1,roughness:.95});
  const center = new THREE.Group(); scene.add(center);
  function mesh(geometry,material,x,y,z){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);center.add(m);return m;}
  // An original monumental pavilion, inspired by timber posts and a ger's roof ribs.
  mesh(new THREE.CylinderGeometry(225,270,5900,16),dark,0,-2200,0);
  for(let k=0;k<16;k++){
    const angle=k*Math.PI/8;
    mesh(new THREE.CylinderGeometry(10,14,5900,6),bronze,Math.sin(angle)*265,-2200,Math.cos(angle)*265);
  }
  for(let level=0;level<12;level++){
    const y=650-level*510;
    mesh(new THREE.CylinderGeometry(325,325,24,32),bronze,0,y,0);
    mesh(new THREE.CylinderGeometry(270,335,100,16),stone,0,y-70,0);
    const ring=mesh(new THREE.TorusGeometry(330,5,6,64),bronze,0,y+13,0);ring.rotation.x=Math.PI/2;
    for(let k=0;k<16;k++){
      const a=k*Math.PI/8;
      const post=mesh(new THREE.BoxGeometry(5,360,5),bronze,Math.sin(a)*278,y-285,Math.cos(a)*278);
      post.rotation.z=.3*(k%2?1:-1);
      for(let q=0;q<3;q++){
        const bar=mesh(new THREE.BoxGeometry(105,5,7),bronze,Math.sin(a)*280,y-180-q*85,Math.cos(a)*280);bar.rotation.y=a;
      }
    }
  }
  mesh(new THREE.CylinderGeometry(45,500,320,16),bronze,0,970,0);
  mesh(new THREE.CylinderGeometry(18,45,210,12),dark,0,1230,0);
  const crown=mesh(new THREE.TorusGeometry(76,10,8,32,Math.PI*1.65),bronze,0,1400,0);crown.rotation.z=.55;
  const ground=new THREE.Mesh(new THREE.CircleGeometry(7000,64),dark);ground.rotation.x=-Math.PI/2;ground.position.y=-5200;scene.add(ground);
  const screens=topics.map((topic,i)=>{
    const element=document.createElement('button');
    element.className='topic-screen';element.setAttribute('aria-label',`${topic.number}. ${topic.title}`);
    element.innerHTML=`<img src="${topic.image}" alt="${topic.short} — тайлбар зураг" ${i>1?'loading="lazy"':''} draggable="false"><div class="screen-shade"></div><span class="screen-top">${topic.number} / 10 <span>${topic.category}</span></span><div class="screen-copy"><span class="screen-date">${topic.date}</span><h2>${topic.short}</h2><span class="screen-action">ТҮҮХИЙГ НЭЭХ <b>↗</b></span></div><span class="screen-caption">МОНГОЛ ГҮРЭН · XIII–XIV ЗУУН</span>`;
    element.addEventListener('click',()=>{if(i===selected)onEnter();else onSelect(i);});
    const object=new CSS3DObject(element);
    const a=i*STEP;
    object.position.set(Math.sin(a)*1040,-i*HEIGHT,Math.cos(a)*1040);
    object.rotation.y=a;
    htmlScene.add(object);
    return object;
  });
  let selected=0, progress=0, target=0, zoom=0, zoomTarget=0, raf=0, last=performance.now(), paused=false;
  const aim=new THREE.Vector3();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer?.setSize(innerWidth,innerHeight);html.setSize(innerWidth,innerHeight);}
  resize();window.addEventListener('resize',resize);
  function animate(now){
    raf=requestAnimationFrame(animate);
    const dt=Math.min((now-last)/1000,.05);last=now;
    if(paused)return;
    const damping=reduced.matches?1:1-Math.exp(-dt*5);
    progress+=(target-progress)*damping;zoom+=(zoomTarget-zoom)*(reduced.matches?1:1-Math.exp(-dt*6));
    const a=progress*STEP,y=-progress*HEIGHT;
    const mobile=innerWidth<760;
    const radius=mobile?4000:2800;
    const lateral=mobile?-130:-1050;
    const normal=new THREE.Vector3(Math.sin(a),0,Math.cos(a));
    const tangent=new THREE.Vector3(Math.cos(a),0,-Math.sin(a));
    const pos=normal.clone().multiplyScalar(radius).addScaledVector(tangent,lateral);pos.y=y+140;
    const focus=normal.clone().multiplyScalar(mobile?580:470);focus.y=y+30;focus.addScaledVector(tangent,mobile?0:-180);
    const near=normal.clone().multiplyScalar(mobile?1810:1670);near.y=y;
    pos.lerp(near,zoom);focus.lerp(normal.clone().multiplyScalar(1040).setY(y),zoom);
    camera.position.copy(pos);aim.copy(focus);camera.lookAt(aim);
    screens.forEach((s,i)=>{
      const distance=Math.abs(i-progress);
      s.visible=distance<3.4;
      s.element.style.opacity=String(Math.max(0,Math.min(1,(3.4-distance)*.65))*(i===selected?1:1-zoom));
      s.element.classList.toggle('focused',i===selected);
      s.element.tabIndex=i===selected?0:-1;
      s.element.style.pointerEvents=distance<2.5&&zoomTarget===0?'auto':'none';
    });
    renderer?.render(scene,camera);html.render(htmlScene,camera);
  }
  raf=requestAnimationFrame(animate);
  return {
    select(i){selected=i;target=i;paused=false;},
    zoom(value){zoomTarget=value;paused=false;},
    pause(value){paused=value;},
    get position(){return progress;},
    dispose(){cancelAnimationFrame(raf);window.removeEventListener('resize',resize);scene.traverse(o=>o.geometry?.dispose());[bronze,dark,stone].forEach(m=>m.dispose());renderer?.dispose();container.replaceChildren();}
  };
}





