const topics = [
  { id: 'container', category: 'foundation', icon: '▣', label: 'CONTAINERS', title: '容器', summary: '把应用和依赖打包成可移植的运行单元，让开发与生产更一致。', principle: '镜像是只读模板，容器是运行实例。容器通常共享宿主机内核，通过命名空间与资源限制实现隔离，因此它与完整虚拟机不同。', scenario: '适合统一部署环境、分发应用和快速启动实例。容器本身不保证安全或高可用。', practice: '为一个 HTTP 应用构建镜像，用端口映射启动它，再用环境变量切换配置。' },
  { id: 'kubernetes', category: 'foundation', icon: '⎈', label: 'ORCHESTRATION', title: 'Kubernetes', summary: '声明系统应该是什么样，让控制器持续协调实际状态。', principle: 'Pod 是基本调度单元。Deployment 管理副本与滚动更新，Service 提供稳定的服务入口。控制器不断比较期望状态与实际状态并进行协调。', scenario: '适合管理多个容器化服务、调度资源与自动恢复。需要配置探针、资源和持久化策略；数据库故障不会自动被解决。', practice: '部署两个副本，删除一个 Pod，观察新副本创建；修改镜像版本并查看滚动更新。' },
  { id: 'microservices', category: 'delivery', icon: '◈', label: 'ARCHITECTURE', title: '微服务', summary: '围绕业务能力拆分服务，让团队可以独立开发和交付。', principle: '每个服务具有清晰的业务边界，通过 API 或消息协作。服务独立部署需要配套契约管理、数据所有权和故障隔离。', scenario: '适合边界稳定、团队需要独立交付的系统。小团队或早期产品可先采用模块化单体，避免过早承担分布式系统成本。', practice: '画出订单、库存和支付的边界；说明超时、重复消息和支付失败时怎样恢复。' },
  { id: 'cicd', category: 'delivery', icon: '↻', label: 'CONTINUOUS DELIVERY', title: 'CI/CD 与 GitOps', summary: '用自动化流水线验证变更，把可审计的声明转化为部署。', principle: 'CI 自动集成、测试和构建。持续交付让版本随时可发布，持续部署则自动发布通过验证的变更。GitOps 以 Git 中的声明为依据，由控制器协调运行状态。', scenario: '适合频繁发布、需要审计和可重复部署的团队。自动化不替代质量门禁、权限控制与回滚策略。', practice: '设置提交后运行测试并构建镜像的流水线，用不可变镜像标签记录版本，练习回滚。' },
  { id: 'observability', category: 'operations', icon: '⌁', label: 'OBSERVABILITY', title: '可观测性', summary: '关联指标、日志和链路，解释系统发生了什么以及为什么。', principle: '指标展示趋势，日志记录事件，追踪连接跨服务请求。使用统一服务标识和 Trace ID，并从用户体验定义 SLI 与 SLO。', scenario: '适合定位延迟与错误、制定告警和验证变更。采样、基数、存储成本与敏感信息处理都需要提前设计。', practice: '记录请求量、错误率和延迟分布；为一次请求添加 Trace ID，模拟失败并从日志找到原因。' },
  { id: 'mesh', category: 'operations', icon: '⬡', label: 'SERVICE NETWORKING', title: '服务网格', summary: '把服务之间的通信策略交给基础设施统一管理。', principle: '数据平面代理或节点级组件处理通信，控制平面分发策略。常见能力包括 mTLS、流量路由、遥测和访问控制；具体实现可能采用 sidecar 或无 sidecar 模式。', scenario: '适合服务较多且需要统一通信治理的系统。会增加资源消耗与排障复杂度，并非每个 Kubernetes 集群都需要。', practice: '先了解超时、重试和熔断；评估重试是否可能放大流量，以及写操作是否具备幂等性。' },
];

const layers = {
  client: ['用户与客户端', '请求从浏览器、移动端或其他 API 客户端发出。入口协议、身份凭证和用户感知的延迟，在这一层就开始影响体验。', '客户端应合理处理超时和错误。避免盲目重试非幂等请求；不要在前端保存服务器密钥。'],
  gateway: ['入口与网关', '入口组件把外部请求转发给内部服务，并按配置处理 TLS、路由、认证和流量策略。Kubernetes 可通过 Ingress 或 Gateway API 配合相应控制器实现入口。', '入口是关键依赖，需要高可用、限流和证书管理。API 网关、负载均衡器与服务网格的职责可能重叠，应避免重复配置。'],
  service: ['应用服务', '业务代码运行在容器中。Kubernetes 根据声明调度 Pod，Service 提供稳定寻址；就绪探针影响是否接收流量，存活探针可触发重启。', '应用应支持优雅退出、外置配置和合理超时。副本增加前先确认共享状态、连接池和下游容量能够承受。'],
  data: ['数据服务', '数据库保存持久状态，缓存降低读取开销，消息队列解耦异步工作。它们可使用托管服务，也可由团队自行运维。', '考虑备份与恢复、数据一致性和访问权限。容器重建不等于数据恢复；持久化卷也不替代备份。'],
};

let filter = 'all';
const cards = document.querySelector('#cards');
function renderTopics() {
  const query = document.querySelector('#search').value.trim().toLowerCase();
  const visible = topics.filter(t => (filter === 'all' || t.category === filter) && `${t.title} ${t.label} ${t.summary} ${t.principle}`.toLowerCase().includes(query));
  cards.replaceChildren();
  for (const t of visible) {
    const article = document.createElement('article');
    article.className = 'card';
    // Content comes exclusively from the static topic definitions, never search input.
    article.innerHTML = `<div class="card-top"><span class="topic-icon">${t.icon}</span><span>${t.label}</span></div><h3>${t.title}</h3><p>${t.summary}</p><details><summary>展开学习笔记 <span>＋</span></summary><div class="topic-notes"><h4>工作原理</h4><p>${t.principle}</p><h4>何时使用</h4><p>${t.scenario}</p><h4>动手试试</h4><p>${t.practice}</p></div></details>`;
    cards.append(article);
  }
  document.querySelector('#empty').hidden = visible.length > 0;
}
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.classList.toggle('selected', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    renderTopics();
  });
});
document.querySelector('#search').addEventListener('input', renderTopics);

function showLayer(key) {
  const [title, description, note] = layers[key];
  document.querySelector('#layer-title').textContent = title;
  document.querySelector('#layer-description').textContent = description;
  document.querySelector('#layer-note').textContent = note;
  document.querySelectorAll('[data-layer]').forEach(b => {
    b.classList.toggle('active', b.dataset.layer === key);
    b.setAttribute('aria-pressed', String(b.dataset.layer === key));
  });
}
document.querySelectorAll('[data-layer]').forEach(b => b.addEventListener('click', () => showLayer(b.dataset.layer)));

const steps = [...document.querySelectorAll('[data-step]')];
let saved = [];
try {
  const value = JSON.parse(localStorage.getItem('cloud-native-progress') || '[]');
  if (Array.isArray(value)) saved = value;
} catch { /* Storage is optional; learning works without it. */ }
function updateProgress() {
  const completed = steps.filter(step => step.checked).map(step => step.dataset.step);
  document.querySelector('#progress').textContent = `已完成 ${completed.length} / ${steps.length} 步 · ${completed.length === steps.length ? '继续用真实项目练习！' : '每一步，都让概念更清晰。'}`;
  try { localStorage.setItem('cloud-native-progress', JSON.stringify(completed)); } catch { /* Ignore unavailable storage. */ }
}
steps.forEach(step => {
  step.checked = saved.includes(step.dataset.step);
  step.addEventListener('change', updateProgress);
});
renderTopics();
showLayer('client');
updateProgress();
