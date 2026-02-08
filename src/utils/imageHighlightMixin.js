/**
 * 이미지 하이라이트 및 스크롤 공통 Mixin
 * 
 * 사용 컴포넌트:
 * - EmType2.vue (ImageLinkGroup)
 * - EmTypeImageMap.vue (ImageMapEditor)
 * - EmType3.vue (기타)
 */

export default {
  data() {
    return {
      highlightTimer: null
    }
  },

  methods: {
    /**
     * ref를 사용하여 이미지로 스크롤
     * @param {string} refKey - 이미지 ref 키 (예: 'image-1-2' 또는 'row-3')
     */
    scrollToImageByRef(refKey) {
      this.$nextTick(() => {
        const imageEl = this.$refs[refKey]
        
        console.log('🔍 스크롤 시도:', { refKey, imageEl })
        
        if (imageEl) {
          // 배열인 경우 첫 번째 요소 사용
          const element = Array.isArray(imageEl) ? imageEl[0] : imageEl
          
          if (element) {
            this.scrollToElement(element)
          } else {
            console.warn('⚠️ 이미지 요소를 찾을 수 없습니다:', refKey)
          }
        } else {
          console.warn('⚠️ ref를 찾을 수 없습니다:', refKey)
        }
      })
    },

    /**
     * DOM 요소로 페이지 스크롤 (중앙 정렬)
     * @param {HTMLElement} element - 스크롤할 대상 요소
     */
    scrollToElement(element) {
      const elementRect = element.getBoundingClientRect()
      
      // 현재 스크롤 위치
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop
      
      // 이미지의 실제 위치 (페이지 기준)
      const elementOffsetTop = elementRect.top + currentScroll
      
      // 중앙 계산값
      const centerOffset = (window.innerHeight / 2) - (elementRect.height / 2)
      let targetScroll = elementOffsetTop - centerOffset
      
      // 최대/최소 스크롤 계산
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      
      console.log('📍 스크롤 계산 중:', {
        이미지위치: elementOffsetTop,
        중앙오프셋: centerOffset,
        계산된목표: targetScroll,
        최대스크롤: maxScroll,
        페이지높이: document.documentElement.scrollHeight,
        윈도우높이: window.innerHeight
      })
      
      // 음수 스크롤 방지 (최소 0으로 보정)
      targetScroll = Math.max(0, targetScroll)
      
      // 최대 스크롤 제한
      targetScroll = Math.min(targetScroll, Math.max(0, maxScroll))
      
      console.log('📍 최종 스크롤 정보:', {
        현재스크롤: currentScroll,
        목표스크롤: targetScroll,
        스크롤이동량: targetScroll - currentScroll,
        이미지높이: elementRect.height
      })
      
      // 페이지 스크롤 실행
      window.scrollTo({ 
        top: targetScroll, 
        behavior: 'smooth' 
      })
      
      console.log('✅ 스크롤 완료')
    },

    /**
     * 하이라이트 타이머 시작 (2초 후 자동 제거)
     * @param {number} delay - 제거 딜레이 (ms, 기본 2000)
     */
    startHighlightTimer(delay = 2000) {
      // 기존 타이머 제거
      this.clearHighlightTimer()
      
      // 새 타이머 시작
      this.highlightTimer = setTimeout(() => {
        console.log('⏰ 타이머 경과 - 하이라이트 제거')
        this.$emit('clear-highlight')
      }, delay)
    },

    /**
     * 하이라이트 타이머 제거
     */
    clearHighlightTimer() {
      if (this.highlightTimer) {
        clearTimeout(this.highlightTimer)
        this.highlightTimer = null
      }
    }
  },

  beforeDestroy() {
    // 컴포넌트 제거 시 타이머 정리
    this.clearHighlightTimer()
  }
}