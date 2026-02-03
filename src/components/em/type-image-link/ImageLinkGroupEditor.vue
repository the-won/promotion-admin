<template>
  <div class="image-link-group-editor">
    <div 
      v-for="(group, groupIndex) in localGroups" 
      :key="group.id"
      class="card mb-4"
    >
      <div class="card-header">
        <span class="card-title">링크 그룹 {{ groupIndex + 1 }}</span>
        <button @click.stop="removeGroup(group.id)" class="btn btn-danger btn-sm">그룹 삭제</button>
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
        <label class="inline">
          <input 
            type="checkbox" 
            v-model="group.targetBlank"
            class="form-checkbox"
            @click.stop
          />
          새 창에서 열기 (target="_blank")
        </label>
      </div>

      <!-- 이미지 목록 -->
      <div class="images-section">
        <div class="section-header">
          <h5>이미지 목록 ({{ group.images.length }}개)</h5>
          <button @click.stop="addImage(group.id)" class="btn btn-success btn-sm">이미지 추가</button>
        </div>

        <div v-if="group.images.length === 0" class="empty-state">
          이미지를 추가하세요.
        </div>

        <div class="items-grid" :class="{ 'cols-2': sidebarExpanded }">
          <div 
            v-for="(image, imageIndex) in group.images" 
            :key="image.id"
            class="card card-nested"
          >
            <div class="card-header card-header-sm">
              <span class="card-title text-muted">이미지 {{ imageIndex + 1 }}</span>
              <button @click.stop="removeImage(group.id, image.id)" class="btn btn-danger btn-sm">삭제</button>
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
    </div>

    <!-- 새 그룹 추가 버튼 -->
    <div class="text-center mt-4">
      <button @click="addGroup" class="btn btn-primary btn-lg">새 링크 그룹 추가</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    sidebarExpanded: {
      type: Boolean,
      default: false
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
  margin-top: 16px;
}

.images-section {
  margin-top: 16px;
  padding: 14px;
  background: var(--color-bg-secondary, #f5f6fa);
  border-radius: var(--form-radius, 8px);
}

.card-nested {
  background: var(--color-bg, #fff);
}

.card-header-sm {
  margin-bottom: 10px;
  padding-bottom: 8px;
}

.card-header-sm .card-title {
  font-size: 11px;
}
</style>