let graph = document.getElementById('graph');
let editMode = false;
let nodes = [];
let connections = [];

document.getElementById('toggleEdit').onclick = () => {
  editMode = !editMode;
};

document.getElementById('addNode').onclick = () => {
  let name = prompt("Nombre del curso:");
  if (!name) return;

  let node = document.createElement('div');
  node.className = 'node';
  node.innerText = name;
  node.style.top = '50px';
  node.style.left = '50px';
  node.draggable = true;

  let nodeData = {
    id: Date.now(),
    name: name,
    element: node,
    x: 50,
    y: 50,
    prerequisites: [],
  };

  node.dataset.id = nodeData.id;
  nodes.push(nodeData);

  node.onmousedown = function (e) {
    if (!editMode) return;
    let offsetX = e.offsetX;
    let offsetY = e.offsetY;

    function moveAt(pageX, pageY) {
      node.style.left = pageX - offsetX + 'px';
      node.style.top = pageY - offsetY + 'px';
      updateConnections();
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);
    node.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      node.onmouseup = null;
    };
  };

  node.ondblclick = function () {
    if (!editMode) return;
    let targetId = prompt("ID del curso prerequisito:");
    if (!targetId) return;
    let sourceId = node.dataset.id;
    addConnection(parseInt(targetId), parseInt(sourceId));
  };

  graph.appendChild(node);
  updateConnections();
};

function addConnection(fromId, toId) {
  let fromNode = nodes.find(n => n.id === fromId);
  let toNode = nodes.find(n => n.id === toId);
  if (!fromNode || !toNode) return;

  toNode.prerequisites.push(fromId);
  connections.push({ from: fromNode, to: toNode });

  updateConnections();
}

function updateConnections() {
  document.querySelectorAll('.connection').forEach(el => el.remove());

  connections.forEach(conn => {
    let line = document.createElement('div');
    line.className = 'connection';

    let from = conn.from.element.getBoundingClientRect();
    let to = conn.to.element.getBoundingClientRect();

    let x1 = from.left + from.width / 2 - graph.offsetLeft;
    let y1 = from.top + from.height / 2 - graph.offsetTop;
    let x2 = to.left + to.width / 2 - graph.offsetLeft;
    let y2 = to.top + to.height / 2 - graph.offsetTop;

    let length = Math.hypot(x2 - x1, y2 - y1);
    let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    line.style.width = length + 'px';
    line.style.left = x1 + 'px';
    line.style.top = y1 + 'px';
    line.style.transform = `rotate(${angle}deg)`;

    graph.appendChild(line);
  });
}

// 🎨 Cambiar estilo visual
document.getElementById('customizeStyle').onclick = () => {
  if (!editMode) {
    alert("Activa el modo edición para cambiar estilos.");
    return;
  }

  let bgColor = prompt("Color de fondo (ej: #ffffff):", document.body.style.backgroundColor || "#f4f4f4");
  let font = prompt("Fuente (ej: Arial, 'Courier New'):", getComputedStyle(document.body).fontFamily);
  let nodeColor = prompt("Color de los cursos:", "#e0f7fa");
  let textColor = prompt("Color del texto en los cursos:", "#000000");
  let lineColor = prompt("Color de las líneas:", "#000000");

  if (bgColor) document.body.style.backgroundColor = bgColor;
  if (font) document.body.style.fontFamily = font;

  document.querySelectorAll('.node').forEach(n => {
    if (nodeColor) n.style.backgroundColor = nodeColor;
    if (textColor) n.style.color = textColor;
    if (font) n.style.fontFamily = font;
  });

  document.querySelectorAll('.connection').forEach(l => {
    if (lineColor) l.style.backgroundColor = lineColor;
  });
};
