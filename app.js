const planets = {
  mars: {
    name: '火星',
    type: '类地行星',
    description: '富含氧化铁的尘埃为火星染上红色。这里有太阳系最高的火山之一奥林帕斯山，也有绵延数千公里的水手谷。',
    distance: '1.5 AU',
    orbit: '687 地球日',
  },
  saturn: {
    name: '土星',
    type: '气态巨行星',
    description: '从远处看，土星环像一张薄薄的唱片。近看则是数不清的冰块与岩石碎片，各自沿轨道绕着土星运行。',
    distance: '9.5 AU',
    orbit: '29.4 地球年',
  },
  neptune: {
    name: '海王星',
    type: '冰巨行星',
    description: '海王星位于太阳系的外缘，大气中的甲烷吸收部分红光，使它呈蓝色。这里的强风速度可超过每小时 1900 公里。',
    distance: '30 AU',
    orbit: '约 165 地球年',
  },
};

const choices = document.querySelectorAll('[data-planet]');
const image = document.querySelector('#planet-image');
const fields = {
  name: document.querySelector('#planet-name'),
  type: document.querySelector('#planet-type'),
  description: document.querySelector('#planet-description'),
  distance: document.querySelector('#planet-distance'),
  orbit: document.querySelector('#planet-orbit'),
};
const source = document.querySelector('#planet-source');

for (const choice of choices) {
  choice.addEventListener('click', () => {
    const key = choice.dataset.planet;
    for (const button of choices) {
      button.setAttribute('aria-pressed', String(button === choice));
    }
    for (const [field, element] of Object.entries(fields)) {
      element.textContent = planets[key][field];
    }
    image.className = `orb ${key}`;
    source.href = `https://science.nasa.gov/${key}/`;
  });
}
