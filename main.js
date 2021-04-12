import * as THREE from './pkg/three.module.js'; 

window.addEventListener('DOMContentLoaded', DOMContentLoaded => {

    // INIT
    const canvas = document.querySelector('canvas'); 
    const render = new THREE.WebGLRenderer({canvas: canvas}); 
    render.setClearColor(0xFFFFFF); 
    render.shadowMap.enabled = true; 
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000); 
    camera.position.z = 5; 
    const resize = () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight; 
        camera.updateProjectionMatrix(); 
        render.setSize(canvas.clientWidth * window.devicePixelRatio, canvas.clientHeight * window.devicePixelRatio, false); 
    }; 
    resize(); 
    window.addEventListener('resize', resize); 
    const scene = new THREE.Scene(); 
    scene.fog = new THREE.FogExp2(0xFFFFFF, 0.1); 

    // LIGHT
    const light = new THREE.DirectionalLight(); 
    light.color.set(0xFFFFFF); 
    light.position.set(16, 9, 25); 
    light.intensity = 0.9; 
    light.castShadow = true; 
    scene.add(light); 
    
    // CUBE
    const cube_geometry = new THREE.BoxGeometry(); 
    const cube_material = new THREE.MeshStandardMaterial({
        color: 0x00FFFF,
        roughness: 0.9, 
        metalness: 0, 
    }); 
    const cube = new THREE.Mesh(cube_geometry, cube_material); 
    cube.castShadow = true; 
    cube.receiveShadow = true; 
    cube.name = 'hittable'; 
    scene.add(cube); 

    // GROUND
    const ground_geometry = new THREE.PlaneGeometry(10000, 10000); 
    const ground_material = new THREE.MeshStandardMaterial({
        color: 0x008800, 
        roughness: 1, 
        metalness: 0.1, 
    }); 
    const ground = new THREE.Mesh(ground_geometry, ground_material); 
    ground.rotation.x = -0.5 * Math.PI; 
    ground.position.y = -1; 
    ground.receiveShadow = true; 
    scene.add(ground); 

    // INPUT
    const input = {w: false, a: false, s: false, d: false, ArrowLeft: false, ArrowRight: false, f: false}; 
    window.addEventListener('keydown', keydown => {
        if(input.hasOwnProperty(keydown.key)) {
            input[keydown.key] = true; 
        }
        console.log(input); 
    }); 
    window.addEventListener('keyup', keyup => {
        if(input.hasOwnProperty(keyup.key)) {
            input[keyup.key] = false; 
        }
    }); 

    // RAYCASTING
    const player_raycast = new THREE.Raycaster(); 
    
    // ANIMATION
    const animation = timestamp => {

        // CAMERA 
        const speed = 0.1; 
        camera.rotation.y += speed / Math.PI * (input.ArrowLeft - input.ArrowRight); 
        const velocity = new THREE.Vector3(speed * (input.a - input.d), 0, speed * (input.s - input.w)); 
        camera.position.x += velocity.x * -Math.cos(camera.rotation.y) + velocity.z * Math.sin(camera.rotation.y); 
        camera.position.z += velocity.x * Math.sin(camera.rotation.y) + velocity.z * Math.cos(camera.rotation.y); 

        cube.material.color.set(0x00FFFF); 
        if(input.f) {
            player_raycast.setFromCamera(new THREE.Vector2(0, 0), camera); 
            const intersects = player_raycast.intersectObjects(scene.children); 
            intersects?.forEach(hit_object => {
                if(hit_object.object.name === 'hittable') {
                    hit_object.object.material.color.set(0xFF0000); 
                }
            }); 
        }

        // RENDER
        window.requestAnimationFrame(animation); 
        render.render(scene, camera); 
    }; 
    window.requestAnimationFrame(animation); 
}); 