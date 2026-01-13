<template>
  <div class="article-list-page">
    <div class="page-header">
      <h1>文章列表</h1>
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索文章..." 
          class="form-input"
          @input="handleSearch"
        >
      </div>
    </div>
    
    <div class="filters">
      <select v-model="selectedCategory" class="form-input" @change="filterArticles">
        <option value="">全部分类</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      
      <select v-model="sortBy" class="form-input" @change="sortArticles">
        <option value="created_at">按时间排序</option>
        <option value="title">按标题排序</option>
      </select>
    </div>
    
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="alert alert-error">{{ error }}</div>
    <div v-else>
      <div class="article-list">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id" 
          class="article-item"
          @click="goToArticle(article.id)"
        >
          <h3 class="article-title">{{ article.title }}</h3>
          <div class="article-meta">
            发布于 {{ formatDate(article.created_at) }} | 
            分类: {{ article.category }}
            <span v-if="article.views"> | 浏览量: {{ article.views }}</span>
          </div>
          <p class="article-excerpt">{{ article.excerpt }}</p>
          <div class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="filteredArticles.length === 0" class="no-results">
        没有找到相关文章
      </div>
      
      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          class="page-item" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        
        <span class="page-info">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
        </span>
        
        <button 
          class="page-item" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

export default {
  name: 'ArticleList',
  setup() {
    const router = useRouter()
    const articles = ref([])
    const loading = ref(true)
    const error = ref('')
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const sortBy = ref('created_at')
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalArticles = ref(0)
    
    // 获取所有分类
    const categories = computed(() => {
      const cats = [...new Set(articles.value.map(a => a.category))]
      return cats.filter(cat => cat)
    })
    
    // 过滤后的文章
    const filteredArticles = computed(() => {
      let result = [...articles.value]
      
      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      // 分类过滤
      if (selectedCategory.value) {
        result = result.filter(article => article.category === selectedCategory.value)
      }
      
      // 排序
      result.sort((a, b) => {
        if (sortBy.value === 'created_at') {
          return new Date(b.created_at) - new Date(a.created_at)
        } else {
          return a.title.localeCompare(b.title)
        }
      })
      
      return result
    })
    
    const fetchArticles = async (page = 1) => {
      try {
        loading.value = true
        const response = await api.get(`/articles?page=${page}&limit=10`)
        articles.value = response.data.articles
        totalPages.value = response.data.totalPages
        totalArticles.value = response.data.total
        currentPage.value = page
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
    
    const handleSearch = () => {
      // 搜索防抖可以在后续优化中添加
    }
    
    const filterArticles = () => {
      // 过滤逻辑已经在computed中处理
    }
    
    const sortArticles = () => {
      // 排序逻辑已经在computed中处理
    }
    
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        fetchArticles(page)
      }
    }
    
    onMounted(() => {
      fetchArticles()
    })
    
    return {
      articles: filteredArticles,
      loading,
      error,
      searchQuery,
      selectedCategory,
      sortBy,
      currentPage,
      totalPages,
      totalArticles,
      categories,
      filteredArticles,
      goToArticle,
      formatDate,
      handleSearch,
      filterArticles,
      sortArticles,
      changePage
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
  color: #333;
}

.search-bar {
  flex: 1;
  max-width: 300px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filters select {
  min-width: 150px;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}

.page-info {
  padding: 8px 15px;
  color: #666;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar {
    max-width: 100%;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filters select {
    width: 100%;
  }
}
</style>