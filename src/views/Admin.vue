<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>博客管理后台</h1>
      <div class="user-info">
        <span>欢迎, {{ user?.username || '管理员' }}</span>
        <button @click="logout" class="btn btn-secondary">退出登录</button>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="stats-cards">
        <div class="stat-card">
          <h3>{{ stats.articles || 0 }}</h3>
          <p>文章总数</p>
        </div>
        <div class="stat-card">
          <h3>{{ stats.categories || 0 }}</h3>
          <p>分类数量</p>
        </div>
        <div class="stat-card">
          <h3>{{ stats.tags || 0 }}</h3>
          <p>标签数量</p>
        </div>
        <div class="stat-card">
          <h3>{{ stats.views || 0 }}</h3>
          <p>总浏览量</p>
        </div>
      </div>
      
      <div class="dashboard-actions">
        <div class="action-buttons">
          <button @click="showCreateModal = true" class="btn btn-primary">
            ✏️ 新建文章
          </button>
          <button @click="refreshStats" class="btn btn-secondary">
            🔄 刷新统计
          </button>
        </div>
        
        <div class="article-management">
          <h2>文章管理</h2>
          <div class="table-controls">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索文章..." 
              class="form-input search-input"
            >
            <select v-model="filterStatus" class="form-input">
              <option value="">全部状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
            </select>
          </div>
          
          <div class="articles-table">
            <div class="table-header">
              <div class="table-cell">标题</div>
              <div class="table-cell">分类</div>
              <div class="table-cell">状态</div>
              <div class="table-cell">创建时间</div>
              <div class="table-cell">操作</div>
            </div>
            
            <div 
              v-for="article in filteredArticles" 
              :key="article.id" 
              class="table-row"
            >
              <div class="table-cell title-cell">
                <span @click="editArticle(article)" class="article-title-link">
                  {{ article.title }}
                </span>
              </div>
              <div class="table-cell">{{ article.category }}</div>
              <div class="table-cell">
                <span :class="['status-badge', article.status]">
                  {{ article.status === 'published' ? '已发布' : '草稿' }}
                </span>
              </div>
              <div class="table-cell">{{ formatDate(article.created_at) }}</div>
              <div class="table-cell actions-cell">
                <button @click="editArticle(article)" class="btn btn-secondary btn-small">
                  编辑
                </button>
                <button @click="deleteArticle(article.id)" class="btn btn-danger btn-small">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 创建/编辑文章模态框 -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑文章' : '新建文章' }}</h3>
          <button @click="closeModals" class="modal-close">×</button>
        </div>
        
        <form @submit.prevent="saveArticle" class="article-form">
          <div class="form-group">
            <label class="form-label">文章标题 *</label>
            <input 
              v-model="currentArticle.title" 
              type="text" 
              class="form-input"
              required
            >
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">分类</label>
              <input 
                v-model="currentArticle.category" 
                type="text" 
                class="form-input"
                placeholder="技术/生活/随笔..."
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">状态</label>
              <select v-model="currentArticle.status" class="form-input">
                <option value="draft">草稿</option>
                <option value="published">发布</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">标签 (用逗号分隔)</label>
            <input 
              v-model="tagInput" 
              type="text" 
              class="form-input"
              placeholder="Vue,JavaScript,前端..."
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">文章摘要</label>
            <textarea 
              v-model="currentArticle.excerpt" 
              class="form-input"
              rows="3"
              placeholder="简短的文章介绍..."
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">文章内容 (Markdown) *</label>
            <textarea 
              v-model="currentArticle.content" 
              class="form-input content-input"
              rows="15"
              required
              placeholder="支持Markdown语法..."
            ></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn btn-secondary">
              取消
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? '保存中...' : '保存文章' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../utils/api'

export default {
  name: 'Admin',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const user = computed(() => authStore.user)
    const stats = ref({})
    const articles = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const searchQuery = ref('')
    const filterStatus = ref('')
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    
    const currentArticle = ref({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      status: 'draft',
      tags: []
    })
    
    const tagInput = ref('')
    
    // 过滤后的文章
    const filteredArticles = computed(() => {
      let result = [...articles.value]
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
        )
      }
      
      if (filterStatus.value) {
        result = result.filter(article => article.status === filterStatus.value)
      }
      
      return result
    })
    
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats')
        stats.value = response.data
      } catch (err) {
        console.error('获取统计失败:', err)
      }
    }
    
    const fetchArticles = async () => {
      try {
        loading.value = true
        const response = await api.get('/admin/articles')
        articles.value = response.data.articles
      } catch (err) {
        console.error('获取文章失败:', err)
      } finally {
        loading.value = false
      }
    }
    
    const refreshStats = async () => {
      await Promise.all([fetchStats(), fetchArticles()])
    }
    
    const saveArticle = async () => {
      if (!currentArticle.value.title || !currentArticle.value.content) {
        alert('请填写必填字段')
        return
      }
      
      try {
        saving.value = true
        
        // 处理标签
        currentArticle.value.tags = tagInput.value
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag)
        
        const endpoint = showEditModal.value 
          ? `/admin/articles/${currentArticle.value.id}`
          : '/admin/articles'
          
        const method = showEditModal.value ? 'put' : 'post'
        
        await api[method](endpoint, currentArticle.value)
        
        closeModals()
        await refreshStats()
        alert(showEditModal.value ? '文章更新成功' : '文章创建成功')
      } catch (err) {
        console.error('保存文章失败:', err)
        alert('保存失败，请重试')
      } finally {
        saving.value = false
      }
    }
    
    const editArticle = (article) => {
      currentArticle.value = { ...article }
      tagInput.value = article.tags?.join(', ') || ''
      showEditModal.value = true
    }
    
    const deleteArticle = async (id) => {
      if (!confirm('确定要删除这篇文章吗？')) return
      
      try {
        await api.delete(`/admin/articles/${id}`)
        await refreshStats()
        alert('文章删除成功')
      } catch (err) {
        console.error('删除文章失败:', err)
        alert('删除失败，请重试')
      }
    }
    
    const closeModals = () => {
      showCreateModal.value = false
      showEditModal.value = false
      currentArticle.value = {
        title: '',
        content: '',
        excerpt: '',
        category: '',
        status: 'draft',
        tags: []
      }
      tagInput.value = ''
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('zh-CN')
    }
    
    const logout = () => {
      authStore.logout()
      router.push('/')
    }
    
    onMounted(async () => {
      // 验证权限
      const isValid = await authStore.checkAuth()
      if (!isValid) {
        router.push('/login')
        return
      }
      
      await refreshStats()
    })
    
    return {
      user,
      stats,
      articles: filteredArticles,
      loading,
      saving,
      searchQuery,
      filterStatus,
      showCreateModal,
      showEditModal,
      currentArticle,
      tagInput,
      filteredArticles,
      refreshStats,
      saveArticle,
      editArticle,
      deleteArticle,
      closeModals,
      formatDate,
      logout
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.dashboard-header h1 {
  margin: 0;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #007bff;
}

.stat-card p {
  margin: 0;
  color: #666;
}

.dashboard-actions {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.article-management h2 {
  margin-bottom: 20px;
  color: #333;
}

.table-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.articles-table {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  background: #f8f9fa;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-cell {
  padding: 12px 15px;
  display: flex;
  align-items: center;
}

.title-cell {
  font-weight: 500;
}

.article-title-link {
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
}

.article-title-link:hover {
  text-decoration: underline;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.published {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.draft {
  background-color: #fff3cd;
  color: #856404;
}

.actions-cell {
  gap: 8px;
}

.btn-small {
  padding: 5px 10px;
  font-size: 12px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.article-form {
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.content-input {
  font-family: 'Courier New', monospace;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .user-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .table-controls {
    flex-direction: column;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .table-cell {
    padding: 8px 10px;
    border-bottom: 1px solid #eee;
  }
  
  .actions-cell {
    flex-direction: column;
    gap: 5px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 10px;
    max-height: 95vh;
  }
}
</style>