# Все дисциплины

## 5 семестр

<div class="features-grid">

<a href="./disciplines/algos/">
    <div class="feature-card">
    <h3>Алгоритмы и структуры данных</h3>
    </div>
</a>

<a href="./disciplines/db/">
    <div class="feature-card">
    <h3>Базы данных</h3>
    </div>
</a>

<a href="./disciplines/kirpo/">
    <div class="feature-card">
    <h3>Кибериммунная методология разработки ПО</h3>
    </div>
</a>

<a href="./disciplines/pis/">
    <div class="feature-card">
    <h3>Проектирование информационных систем</h3>
    </div>
</a>

<a href="./disciplines/prob/">
    <div class="feature-card">
    <h3>Теория вероятностей и математическая статистика</h3>
    </div>
</a>

<a href="./disciplines/tppo/">
    <div class="feature-card">
    <h3>Технология производства программного обеспечения</h3>
    </div>
</a>

<a href="./disciplines/psix/">
    <div class="feature-card">
    <h3>Философия</h3>
    </div>
</a>

<a href="./disciplines/web/">
    <div class="feature-card">
    <h3>Web-проектирование</h3>
    </div>
</a>

</div>

<style scoped>
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin: 40px 0;
}
.feature-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
}
.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  border-color: var(--vp-c-brand);
}
.feature-card h3 {
  margin: 0 0 12px;
  font-size: 1.25rem;
}
a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}
 a:hover {
  color: var(--vp-c-brand);
}
</style>