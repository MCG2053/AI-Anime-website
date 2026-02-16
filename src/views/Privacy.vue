<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="legal-page">
    <div class="legal-page__content">
      <div class="legal-card">
        <div class="legal-card__header">
          <button class="back-btn" @click="goBack">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            <span>返回</span>
          </button>
          <h1 class="legal-card__title">隐私政策</h1>
          <p class="legal-card__update">更新日期：2024年1月1日</p>
        </div>

        <div class="legal-card__body">
          <section class="legal-section">
            <h2>一、引言</h2>
            <p>AnimeVideo（以下简称"本平台"）非常重视用户的隐私保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。</p>
            <p>请您在使用本平台服务前，仔细阅读并理解本隐私政策的全部内容。</p>
          </section>

          <section class="legal-section">
            <h2>二、信息收集</h2>
            <p>我们可能收集以下类型的信息：</p>
            <ul>
              <li><strong>账户信息：</strong>用户名、邮箱地址、密码（加密存储）</li>
              <li><strong>使用信息：</strong>浏览记录、观看历史、搜索记录</li>
              <li><strong>设备信息：</strong>设备型号、操作系统、浏览器类型</li>
              <li><strong>日志信息：</strong>IP地址、访问时间、操作记录</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>三、信息使用</h2>
            <p>我们收集的信息将用于以下目的：</p>
            <ul>
              <li>提供、维护和改进我们的服务</li>
              <li>个性化推荐内容和优化用户体验</li>
              <li>发送服务通知和更新信息</li>
              <li>保障平台安全，防止欺诈行为</li>
              <li>遵守法律法规的要求</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>四、信息共享</h2>
            <p>我们承诺不会向第三方出售您的个人信息。但在以下情况下，我们可能会共享您的信息：</p>
            <ul>
              <li>获得您的明确同意后</li>
              <li>与我们的服务提供商共享（他们需遵守保密义务）</li>
              <li>法律法规要求或政府机关依法要求</li>
              <li>保护我们或用户的合法权益</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>五、信息存储与保护</h2>
            <p>我们采取多种安全措施保护您的个人信息：</p>
            <ul>
              <li>使用加密技术存储和传输敏感信息</li>
              <li>限制员工访问个人信息的权限</li>
              <li>定期进行安全评估和漏洞修复</li>
              <li>建立数据备份和灾难恢复机制</li>
            </ul>
            <p>您的信息将存储在中华人民共和国境内的服务器上。</p>
          </section>

          <section class="legal-section">
            <h2>六、用户权利</h2>
            <p>您对您的个人信息享有以下权利：</p>
            <ul>
              <li><strong>访问权：</strong>您可以查看您的账户信息和使用记录</li>
              <li><strong>更正权：</strong>您可以修改您的个人信息</li>
              <li><strong>删除权：</strong>您可以申请删除您的账户和相关数据</li>
              <li><strong>撤回同意权：</strong>您可以撤回之前给予的同意</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>七、Cookie政策</h2>
            <p>我们使用Cookie和类似技术来：</p>
            <ul>
              <li>记住您的登录状态</li>
              <li>分析网站流量和使用情况</li>
              <li>提供个性化内容推荐</li>
            </ul>
            <p>您可以通过浏览器设置管理Cookie，但这可能影响部分功能的使用。</p>
          </section>

          <section class="legal-section">
            <h2>八、未成年人保护</h2>
            <p>我们非常重视未成年人的隐私保护。如果您是未成年人，请在监护人的陪同下阅读本政策，并在取得监护人同意后使用我们的服务。</p>
          </section>

          <section class="legal-section">
            <h2>九、政策更新</h2>
            <p>我们可能会不时更新本隐私政策。更新后的政策将在本平台公布，建议您定期查阅。如果您继续使用我们的服务，即表示您同意接受更新后的政策。</p>
          </section>

          <section class="legal-section">
            <h2>十、联系我们</h2>
            <p>如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：</p>
            <p>邮箱：privacy@animevideo.com</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-page {
  min-height: 100vh;
  background-color: var(--bg-color);
  padding: var(--spacing-xl) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.legal-page__content {
  width: 100%;
  max-width: 800px;
}

.legal-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.legal-card__header {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding: var(--spacing-xs) 0;
  transition: all var(--transition-fast);
  margin-bottom: var(--spacing-md);
  background: transparent;
  border: none;
}

.back-btn:hover {
  color: var(--color-primary);
}

.back-btn svg {
  width: 16px;
  height: 16px;
}

.legal-card__title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
}

.legal-card__update {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.legal-card__body {
  padding: var(--spacing-xl);
}

.legal-section {
  margin-bottom: var(--spacing-xl);
}

.legal-section:last-child {
  margin-bottom: 0;
}

.legal-section h2 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
  padding-left: var(--spacing-sm);
  border-left: 3px solid var(--color-primary);
}

.legal-section p {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-sm);
}

.legal-section ul {
  list-style: disc;
  padding-left: var(--spacing-xl);
  margin-bottom: var(--spacing-sm);
}

.legal-section li {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-xs);
}

.legal-section li strong {
  color: var(--text-color);
}
</style>
