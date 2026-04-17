let scene, camera, renderer, pothole;
let initialized = false;

// SWITCH SECTIONS
function showSection(section) {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("analytics").style.display = "none";

  document.getElementById(section).style.display = "block";

  if (section === "analytics" && !initialized) {
    init3D();
    initialized = true;
  }
}

// RANDOM DATA
function randomData() {
  return {
    lat: (12 + Math.random()).toFixed(6),
    lng: (77 + Math.random()).toFixed(6),
    severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)]
  };
}

// ADD ALERT
function addAlert() {
  const data = randomData();
  const div = document.createElement("div");

  div.className = `alert ${data.severity}`;
  div.innerHTML = `Pothole (${data.severity.toUpperCase()})<br>
                   Lat: ${data.lat}, Lng: ${data.lng}`;

  div.onclick = () => {
    showSection("analytics");
    update3D(data);
  };

  document.getElementById("alerts").prepend(div);

  if (document.getElementById("alerts").children.length > 5) {
    document.getElementById("alerts").lastChild.remove();
  }
}

// 3D INIT
function init3D() {
  const container = document.getElementById("threeContainer");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // ROAD
  const planeGeo = new THREE.PlaneGeometry(10, 10);
  const planeMat = new THREE.MeshBasicMaterial({ color: 0x555555 });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // POTHOLE
  const geo = new THREE.SphereGeometry(1, 32, 32);
  const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  pothole = new THREE.Mesh(geo, mat);
  pothole.position.y = -0.5;
  scene.add(pothole);

  animate();
}

// UPDATE 3D BASED ON SEVERITY
function update3D(data) {
  document.getElementById("info").innerText =
    `Lat: ${data.lat}, Lng: ${data.lng}, Severity: ${data.severity}`;

  if (!pothole) return;

  if (data.severity === "low") pothole.scale.y = 0.5;
  if (data.severity === "medium") pothole.scale.y = 1;
  if (data.severity === "high") pothole.scale.y = 1.5;
}

// ANIMATION
function animate() {
  requestAnimationFrame(animate);
  pothole.rotation.y += 0.01;
  renderer.render(scene, camera);
}

// AUTO GENERATE ALERTS
setInterval(addAlert, 3000);