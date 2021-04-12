import * as THREE from './three.module.js'; 

window.addEventListener('DOMContentLoaded', DOMContentLoaded => {

    // INIT
    const render = new THREE.WebGL1Renderer({canvas: document.querySelector('canvas')}); 
    render.clearColor = 'cyan'; 
    const camera = new THREE.PerspectiveCamera(75, render.domElement.width / render.domElement.height, 0.1, 1000); 
    const scene = new THREE.Scene(); 
    const resize = () => {
        camera.aspect = render.domElement.width / render.domElement.height; 
        camera.updateProjectionMatrix(); 
        render.setSize(render.domElement.width * window.devicePixelRatio, render.domElement.height * window.devicePixelRatio); 
    }; 
    resize(); 
    window.addEventListener('resize', resize); 

    // ANIMATION LOOP
    const animation = timestamp => {

        // RENDER
        window.requestAnimationFrame(animation); 
        render.render(scene, camera); 
    }; 
    window.requestAnimationFrame(animation); 
}); 