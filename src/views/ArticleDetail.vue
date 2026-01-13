<template>
  <div class="article-detail">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="alert alert-error">{{ error }}</div>
    <div v-else-if="article" class="article-content">
      <article class="article-card">
        <header class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span>作者: {{ article.author || '匿名' }}</span>
            <span>发布时间: {{ formatDate(article.created_at) }}</span>
            <span>分类: {{ article.category }}</span>
            <span v-if="article.views">浏览量: {{ article.views }}</span>
          </div>
          
          <div v-if="article.tags && article.tags.length" class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </header>
        
        <div class="article-body" v-html="renderedContent"></div>
        
        <footer class="article-footer">
          <div class="article-actions">
            <button @click="likeArticle" class="btn btn-secondary">
              👍 喜欢 ({{ article.likes || 0 }})
            </button>
            <button @click="shareArticle" class="btn btn-secondary">
              📤 分享
            </button>
          </div>
        </footer>
      </article>
      
      <!-- Twikoo 评论系统 -->
      <div class="comments-section">
        <h3>评论</h3>
        <div id="tcomment"></div>
      </div>
      
      <!-- 相关文章推荐 -->
      <div v-if="relatedArticles.length > 0" class="related-articles">
        <h3>相关文章</h3>
        <div class="article-list">
          <div 
            v-for="related in relatedArticles" 
            :key="related.id" 
            class="article-item small"
            @click="goToRelatedArticle(related.id)"
          >
            <h4 class="article-title">{{ related.title }}</h4>
            <div class="article-meta">
              {{ formatDate(related.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../utils/api'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export default {
  name: 'ArticleDetail',
  props: ['id'],
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const article = ref(null)
    const relatedArticles = ref([])
    const loading = ref(true)
    const error = ref('')
    
    // 渲染Markdown内容
    const renderedContent = computed(() => {
      if (!article.value?.content) return ''
      
      marked.setOptions({
        highlight: function(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        },
        langPrefix: 'hljs language-'
      })
      
      return marked(article.value.content)
    })
    
    const fetchArticle = async (articleId) => {
      try {
        loading.value = true
        const response = await api.get(`/articles/${articleId}`)
        article.value = response.data.article
        
        // 获取相关文章
        await fetchRelatedArticles()
        
        // 增加浏览量
        await api.post(`/articles/${articleId}/view`)
      } catch (err) {
        error.value = err.response?.data?.message || '获取文章失败'
        console.error(err)
      } finally {
        loading.value = false
      }
    }
    
    const fetchRelatedArticles = async () => {
      if (!article.value?.tags?.length) return
      
      try {
        const response = await api.get('/articles', {
          params: {
            tags: article.value.tags.join(','),
            limit: 3,
            exclude: article.value.id
          }
        })
        relatedArticles.value = response.data.articles
      } catch (err) {
        console.error('获取相关文章失败:', err)
      }
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    const likeArticle = async () => {
      if (!article.value) return
      
      try {
        await api.post(`/articles/${article.value.id}/like`)
        article.value.likes = (article.value.likes || 0) + 1
      } catch (err) {
        console.error('点赞失败:', err)
      }
    }
    
    const shareArticle = () => {
      if (navigator.share) {
        navigator.share({
          title: article.value.title,
          url: window.location.href
        })
      } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            alert('链接已复制到剪贴板')
          })
          .catch(() => {
            prompt('复制以下链接:', window.location.href)
          })
      }
    }
    
    const goToRelatedArticle = (id) => {
      router.push(`/article/${id}`)
    }
    
    // 初始化Twikoo评论
    const initTwikoo = () => {
      if (window.twikoo && article.value) {
        window.twikoo.init({
          envId: import.meta.env.VITE_TWIKOO_ENV_ID || 'your-env-id',
          el: '#tcomment',
          lang: 'zh-CN',
          onCommentLoaded: function() {
            console.log('评论加载完成')
          }
        })
      }
    }
    
    onMounted(() => {
      const articleId = props.id || route.params.id
      fetchArticle(articleId)
    })
    
    onUpdated(() => {
      // 在DOM更新后初始化评论系统
      setTimeout(initTwikoo, 100)
    })
    
    return {
      article,
      relatedArticles,
      loading,
      error,
      renderedContent,
      formatDate,
      likeArticle,
      shareArticle,
      goToRelatedArticle
    }
  }
}
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
}

.article-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.article-header {
  padding: 30px;
  border-bottom: 1px solid #eee;
}

.article-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.article-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.article-body {
  padding: 30px;
  line-height: 1.8;
  color: #444;
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3) {
  margin: 24px 0 16px 0;
  color: #333;
}

.article-body :deep(p) {
  margin-bottom: 16px;
}

.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 20px 0;
}

.article-body :deep(code) {
  background: #f6f8fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.85em;
}

.article-body :deep(pre) {
  background: #f6f8fa;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 20px 0;
}

.article-body :deep(blockquote) {
  border-left: 4px solid #007bff;
  margin: 20px 0;
  padding: 10px 20px;
  background: #f8f9fa;
  color: #666;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 16px 0;
  padding-left: 30px;
}

.article-body :deep(li) {
  margin-bottom: 8px;
}

.article-footer {
  padding: 20px 30px;
  border-top: 1px solid #eee;
  background: #fafafa;
}

.article-actions {
  display: flex;
  gap: 15px;
}

.comments-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.comments-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.related-articles h3 {
  margin-bottom: 20px;
  color: #333;
}

.article-item.small {
  padding: 15px;
  cursor: pointer;
}

.article-item.small:hover {
  background: #f8f9fa;
}

.article-item.small .article-title {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .article-header,
  .article-body,
  .article-footer {
    padding: 20px;
  }
  
  .article-title {
    font-size: 1.8rem;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .article-actions {
    flex-direction: column;
  }
}
</style>