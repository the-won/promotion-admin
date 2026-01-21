<template>
  <div class="template-selector">
    <h3 class="section-title">템플릿 선택</h3>
    <div class="template-grid">
      <div 
        v-for="template in templates" 
        :key="template.value"
        class="template-card"
        :class="{ 'active': localValue === template.value }"
        @click="selectTemplate(template.value)"
      >
        <div class="template-icon">{{ template.icon }}</div>
        <div class="template-info">
          <div class="template-name">{{ template.name }}</div>
          <div class="template-desc">{{ template.desc }}</div>
        </div>
        <div class="template-check" v-if="localValue === template.value">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
.template-selector {
  width: 100%;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.template-grid {
  display: grid;
  gap: 8px;
}

.template-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.template-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.5);
}

.template-card.active {
  background: rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.template-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  flex-shrink: 0;
}

.template-card.active .template-icon {
  background: rgba(102, 126, 234, 0.2);
}

.template-info {
  flex: 1;
  min-width: 0;
}

.template-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}

.template-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.template-check {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #667eea;
  border-radius: 50%;
  color: #fff;
  flex-shrink: 0;
}
</style>