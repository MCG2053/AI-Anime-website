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
          <h1 class="legal-card__title">用户协议</h1>
          <p class="legal-card__update">更新日期：2024年1月1日</p>
        </div>

        <div class="legal-card__body">
          <section class="legal-section">
            <h2>一、服务条款的确认和接纳</h2>
            <p>欢迎使用 AnimeVideo（以下简称"本平台"）。在使用本平台提供的各项服务之前，请用户仔细阅读本用户协议（以下简称"本协议"）。</p>
            <p>用户一旦注册、登录、使用本平台服务，即视为用户已了解并完全同意本协议各项内容。如用户不同意本协议的任何条款，请立即停止使用本平台提供的服务。</p>
          </section>

          <section class="legal-section">
            <h2>二、服务内容</h2>
            <p>本平台为用户提供动漫视频在线观看服务，包括但不限于：</p>
            <ul>
              <li>动漫作品信息浏览与搜索</li>
              <li>动漫视频在线播放</li>
              <li>用户个人中心管理</li>
              <li>其他由本平台提供的增值服务</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>三、用户账号</h2>
            <p>用户在本平台注册账号时，应提供真实、准确、完整的个人资料。若用户提供的信息不真实、不准确、不完整，本平台有权暂停或终止用户的账号。</p>
            <p>用户应妥善保管账号和密码，因账号密码泄露造成的损失由用户自行承担。如发现账号被盗用，应立即通知本平台。</p>
          </section>

          <section class="legal-section">
            <h2>四、用户行为规范</h2>
            <p>用户在使用本平台服务时，不得从事以下行为：</p>
            <ul>
              <li>发布、传播违法、有害、淫秽、暴力等信息</li>
              <li>侵犯他人知识产权或其他合法权益</li>
              <li>干扰或破坏本平台的正常运行</li>
              <li>未经授权使用他人账号</li>
              <li>其他违反法律法规或本协议的行为</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>五、知识产权</h2>
            <p>本平台上的所有内容，包括但不限于文字、图片、音频、视频、软件等，均受知识产权法律保护。未经权利人许可，用户不得擅自使用、复制、传播上述内容。</p>
          </section>

          <section class="legal-section">
            <h2>六、免责声明</h2>
            <p>本平台对以下情况不承担责任：</p>
            <ul>
              <li>因不可抗力导致的服务中断或损失</li>
              <li>因用户自身原因造成的损失</li>
              <li>因第三方原因造成的损失</li>
              <li>用户使用本平台服务产生的任何间接损失</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>七、协议修改</h2>
            <p>本平台有权随时修改本协议，修改后的协议将在本平台公布。用户继续使用本平台服务即视为同意修改后的协议。</p>
          </section>

          <section class="legal-section">
            <h2>八、联系我们</h2>
            <p>如有任何问题或建议，请通过以下方式联系我们：</p>
            <p>邮箱：support@animevideo.com</p>
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
</style>
