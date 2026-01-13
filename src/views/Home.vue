<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">欢迎来到 Mu Blog</h1>
      <p class="hero-subtitle">分享技术，记录生活</p>
    </div>
    
    <div class="latest-articles">
      <h2 class="section-title">最新文章</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="alert alert-error">{{ error }}</div>
      <div v-else class="article-list">
        <div 
          v-for="article in articles" 
          :key="article.id" 
          class="article-item"
          @click="goToArticle(article.id)"
        >
          <h3 class="article-title">{{ article.title }}</h3>
          <div class="article-meta">
            发布于 {{ formatDate(article.created_at) }} | 
            分类: {{ article.category }}
          </div>
          <p class="article-excerpt">{{ article.excerpt }}</p>
          <div class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div v-if="articles.length > 0" class="view-more">
        <router-link to="/articles" class="btn btn-primary">查看更多文章</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const articles = ref([])
    const loading = ref(true)
    const error = ref('')
    
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles?limit=5')
        articles.value = response.data.articles
      } catch (err) {
        error.value = '获取文章失败'
        console.error(err)
      } finally {
        loading.value = false
      }
    }
    
    const goToArticle = (id) => {
      router.push(`/article/${id}`)
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('zh-CN')
    }
    
    onMounted(() => {
      fetchArticles()
    })
    
    return {
      articles,
      loading,
      error,
      goToArticle,
      formatDate
    }
  }
}
</script>

<style scoped>
.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 15px;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.view-more {
  text-align: center;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>