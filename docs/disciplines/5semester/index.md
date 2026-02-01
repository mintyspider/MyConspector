# 5 семестр

<div class="features-grid">

<a href="./psix/">
    <div class="feature-card">
    <h3>Философия</h3>
    </div>
</a>

<a href="./db/">
    <div class="feature-card">
    <h3>Базы данных</h3>
    </div>
</a>

<a href="./algos/">
    <div class="feature-card">
    <h3>Алгоритмы и структуры данных</h3>
    </div>
</a>

<a href="./pis/">
    <div class="feature-card">
    <h3>Проектирование информационных систем</h3>
    </div>
</a>

<a href="./prob/">
    <div class="feature-card">
    <h3>Теория вероятностей и математическая статистика</h3>
    </div>
</a>

<a href="./tppo/">
    <div class="feature-card">
    <h3>Технология производства программного обеспечения</h3>
    </div>
</a>

</div>

<style scoped>
/* Базовая сетка */
.features-grid {
  display: grid;
  gap: 24px;
  margin: 40px 0;
  padding: 0 4px;
}

/* Большие экраны (десктопы) - 2 колонки */
@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
  }
}

/* Стили карточек - компактные */
.feature-card {
  background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  border: 2px solid transparent;
  border-radius: 14px;
  padding: 24px 20px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgba(var(--vp-c-brand-rgb, 64, 158, 255), 0.08),
              0 20px 14px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-light);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  font-size: 2.2rem;
  margin-bottom: 16px;
  display: inline-block;
  transition: all 0.3s ease;
  color: var(--vp-c-brand);
  line-height: 1;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) translateY(-3px);
}

.feature-card h3 {
  margin: 0 0 12px;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--vp-c-text);
  position: relative;
  display: inline-block;
  width: 100%;
}

.feature-card h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: var(--vp-c-brand);
  opacity: 0.5;
  transition: width 0.3s ease;
}

.feature-card:hover h3::after {
  width: 60px;
  opacity: 0.8;
}

a {
  text-decoration: none;
}

/* Эффект свечения - более легкий */
@keyframes subtle-glow {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  }
  50% {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08),
                0 0 0 1px rgba(var(--vp-c-brand-rgb, 64, 158, 255), 0.15);
  }
}

.feature-card:hover {
  animation: subtle-glow 2s ease-in-out infinite;
}

/* Чередование для десктопов */
@media (min-width: 1024px) {
  .feature-card:nth-child(odd):hover {
    transform: translateY(-6px) rotateZ(0.5deg);
  }
  
  .feature-card:nth-child(even):hover {
    transform: translateY(-6px) rotateZ(-0.5deg);
  }
}

/* Темная тема */
@media (prefers-color-scheme: dark) {
  .feature-card {
    background: linear-gradient(145deg, 
      var(--vp-c-bg-soft),
      rgba(var(--vp-c-bg-soft-rgb), 0.9));
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  .feature-card:hover {
    box-shadow: 0 16px 32px rgba(var(--vp-c-brand-rgb, 64, 158, 255), 0.1),
                0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  .feature-link {
    background: rgba(var(--vp-c-brand-rgb, 64, 158, 255), 0.08);
  }
}
</style>