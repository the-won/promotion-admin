<template>
  <div class="image-link-group-editor">
    <div 
      v-for="(group, groupIndex) in localGroups" 
      :key="group.id"
      class="link-group-item"
    >
      <div class="group-header">
        <span class="group-title">링크 그룹 {{ groupIndex + 1 }}</span>
        <button @click.stop="removeGroup(group.id)" class="delete-btn">🗑️ 그룹 삭제</button>
      </div>

      <!-- 링크 URL 설정 -->
      <div class="form-group">
        <label>링크 URL (href)</label>
        <input 
          type="url" 
          v-model="group.href"
          placeholder="https://example.com"
          class="form-input"
          @click.stop
        />
      </div>

      <!-- 타겟 설정 -->
      <div class="form-group">
        <label>
          <input 
            type="checkbox" 
            v-model="group.targetBlank"
            @click.stop
          />
          새 창에서 열기 (target="_blank")
        </label>
      </div>

      <!-- 이미지 목록 -->
      <div class="images-section">
        <div class="images-header">
          <h5>이미지 목록 ({{ group.images.length }}개)</h5>
          <button @click.stop="addImage(group.id)" class="add-image-btn">+ 이미지 추가</button>
        </div>

        <div v-if="group.images.length === 0" class="empty-state">
          이미지를 추가하세요.
        </div>

        <div 
          v-for="(image, imageIndex) in group.images" 
          :key="image.id"
          class="image-item"
        >
          <div class="image-item-header">
            <span class="image-number">이미지 {{ imageIndex + 1 }}</span>
            <button @click.stop="removeImage(group.id, image.id)" class="delete-small-btn">🗑️</button>
          </div>

          <div class="form-group">
            <label>이미지 URL</label>
            <input 
              type="url" 
              v-model="image.url"
              placeholder="https://cdn.example.com/image.jpg"
              class="form-input"
              @click.stop
            />
          </div>

          <div class="form-group">
            <label>대체 텍스트 (alt)</label>
            <input 
              type="text" 
              v-model="image.alt"
              placeholder="이미지 설명"
              class="form-input"
              @click.stop
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 새 그룹 추가 버튼 -->
    <div class="add-group-section">
      <button @click="addGroup" class="add-group-btn">+ 새 링크 그룹 추가</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localGroups: []
    }
  },
  created() {
    this.localGroups = this.value && this.value.length > 0 
      ? JSON.parse(JSON.stringify(this.value)) 
      : [this.createNewGroup()]
  },
  watch: {
    value: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.localGroups)) {
          this.localGroups = newVal && newVal.length > 0
            ? JSON.parse(JSON.stringify(newVal))
            : [this.createNewGroup()]
        }
      },
      deep: true
    },
    localGroups: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.value)) {
          this.$emit('input', JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    }
  },
  methods: {
    createNewGroup() {
      return {
        id: Date.now(),
        href: 'https://example.com',
        targetBlank: true,
        images: [
          {
            id: Date.now() + 1,
            url: '',
            alt: ''
          }
        ]
      }
    },
    
    createNewImage() {
      return {
        id: Date.now(),
        url: '',
        alt: ''
      }
    },
    
    addGroup() {
      this.localGroups.push(this.createNewGroup())
    },
    
    removeGroup(groupId) {
      const index = this.localGroups.findIndex(g => g.id === groupId)
      if (index !== -1) {
        if (this.localGroups.length === 1) {
          alert('최소 1개의 그룹이 필요합니다.')
          return
        }
        this.localGroups.splice(index, 1)
      }
    },
    
    addImage(groupId) {
      const group = this.localGroups.find(g => g.id === groupId)
      if (group) {
        group.images.push(this.createNewImage())
      }
    },
    
    removeImage(groupId, imageId) {
      const group = this.localGroups.find(g => g.id === groupId)
      if (group) {
        const index = group.images.findIndex(img => img.id === imageId)
        if (index !== -1) {
          if (group.images.length === 1) {
            alert('최소 1개의 이미지가 필요합니다.')
            return
          }
          group.images.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style scoped>
.image-link-group-editor {
  margin-top: 20px;
}

.link-group-item {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 3px solid #007bff;
}

.group-title {
  font-weight: bold;
  color: #007bff;
  font-size: 18px;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #c82333;
}

.images-section {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.images-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.images-header h5 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.add-image-btn {
  padding: 6px 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.add-image-btn:hover {
  background: #218838;
}

.image-item {
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 12px;
}

.image-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.image-number {
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.delete-small-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.delete-small-btn:hover {
  background: #c82333;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 13px;
  color: #333;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #999;
  background: white;
  border: 2px dashed #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.add-group-section {
  text-align: center;
  padding: 20px;
}

.add-group-btn {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  transition: background 0.2s;
}

.add-group-btn:hover {
  background: #0056b3;
}
</style>