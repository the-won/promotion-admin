<template>
  <div class="template-selector-deel">
    <h4 class="selector-title">템플릿 선택</h4>
    <div class="template-grid">
      <div 
        v-for="template in templates" 
        :key="template.value"
        class="template-card"
        :class="{ 'is-selected': localValue === template.value }"
        @click="selectTemplate(template.value)"
      >
        <div class="card-icon">{{ template.icon }}</div>
        <div class="card-content">
          <div class="card-name">{{ template.name }}</div>
          <div class="card-desc">{{ template.desc }}</div>
        </div>
        <div class="card-check" v-if="localValue === template.value">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11.6667 3.5L5.25 9.91667L2.33334 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      templates: [
        {
          value: 'em-type-1',
          name: 'Type 1',
          desc: '기본 템플릿',
          icon: '📄'
        },
        {
          value: 'em-type-2',
          name: 'Type 2',
          desc: '이미지 중심',
          icon: '🖼️'
        },
        {
          value: 'em-type-3',
          name: 'Type 3',
          desc: '제품 소개',
          icon: '📦'
        },
        {
          value: 'em-type-4',
          name: 'Type 4',
          desc: '뉴스레터',
          icon: '📰'
        },
        {
          value: 'em-type-5',
          name: 'Type 5',
          desc: '화끈딜',
          icon: '🔥'
        },
        {
          value: 'em-type-imagemap',
          name: 'Image Map',
          desc: '이미지맵 사용',
          icon: '🗺️'
        }
      ]
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    selectTemplate(value) {
      this.localValue = value
    }
  }
}
</script>

<style scoped>
.template-selector-deel {
  width: 100%;
}

.selector-title {
  margin: 0 0 16px 0;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.template-grid {
  display: grid;
  gap: 10px;
}

.template-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f9fafb;
  border: 2px solid #f3f4f6;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.template-card:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
  transform: translateY(-1px);
}

.template-card.is-selected {
  background: #ede9fe;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.card-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  font-size: 20px;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
}

.template-card.is-selected .card-icon {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: transparent;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.card-desc {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-check {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6366f1;
  border-radius: 50%;
  color: #fff;
  flex-shrink: 0;
}
</style>