<template>
  <div class="scrolling-words-container">
    <ul class="scrolling-words">
      <li
        v-for="(item, index) in bannerItems"
        :key="index"
        :class="{
          'words-in': currentIndex === index && isAnimating,
          'words-out': currentIndex === index && isAnimatingOut
        }"
      >
        <button 
          type="button" 
          @click="handleClick(item.url, item.gaParams)"
        >
          <span v-html="item.content"></span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ScrollingBanner',
  data() {
    return {
      currentIndex: 0,
      isAnimating: false,
      isAnimatingOut: false,
      textInTimer: 3000,
      textOutTimer: 2800,
      animationInterval: null,
      bannerItems: [
        {
          content: '우리회사 복지몰 <strong class="col-orange">베네피아</strong>',
          url: '/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene',
          gaParams: {
            category: 'PC_프로모션',
            action: 'LF몰',
            label: '상단배너(개인결제유도)'
          }
        },
        {
          content: '비교검색 끝 <strong class="col-red">최저가보상</strong>',
          url: '/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene',
          gaParams: {
            category: 'PC_프로모션',
            action: 'LF몰',
            label: '상단배너(개인결제유도)'
          }
        },
        {
          content: '17시 전 주문하면 <strong class="col-blue">오늘출발</strong> <img src="https://www.benepia.co.kr/event/cm/topBnrPersPayInd/pc/images/ico_delivery.png" alt="" style="width: 43px; margin-top: 3px;">',
          url: '/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene',
          gaParams: {
            category: 'PC_프로모션',
            action: 'LF몰',
            label: '상단배너(개인결제유도)'
          }
        },
        {
          content: '놓치면 아까운 <strong class="col-orange2">여행딜특가</strong>',
          url: '/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene',
          gaParams: {
            category: 'PC_프로모션',
            action: 'LF몰',
            label: '상단배너(개인결제유도)'
          }
        },
        {
          content: '<img src="https://www.benepia.co.kr/event/cm/topBnrPersPayInd/pc/images/ico_pay2.png" alt="" style="width: 182px;"> <strong>100% 안전결제</strong>',
          url: '/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene',
          gaParams: {
            category: 'PC_프로모션',
            action: 'LF몰',
            label: '상단배너(개인결제유도)'
          }
        }
      ]
    };
  },
  mounted() {
    this.startAnimation();
  },
  beforeUnmount() {
    this.stopAnimation();
  },
  methods: {
    startAnimation() {
      if (this.bannerItems.length === 1) {
        this.isAnimating = true;
        return;
      }

      this.animateText();
    },
    animateText() {
      this.isAnimating = true;
      this.isAnimatingOut = false;

      setTimeout(() => {
        this.isAnimatingOut = true;
      }, this.textOutTimer);

      this.animationInterval = setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.bannerItems.length;
        this.animateText();
      }, this.textInTimer);
    },
    stopAnimation() {
      if (this.animationInterval) {
        clearTimeout(this.animationInterval);
      }
    },
    handleClick(url, gaParams) {
      // GA 이벤트 트래킹
      if (window.gaEvtAction && gaParams) {
        window.gaEvtAction(gaParams.category, gaParams.action, gaParams.label);
      }
      
      // 페이지 이동
      window.open(url);
    }
  }
};
</script>

<style scoped>
.scrolling-words-container {
  padding: 20px 0 16px 0;
  background-color: #303030;
  width: 100%;
  margin: 0 auto;
}

.scrolling-words-container .scrolling-words {
  height: 34px;
  background-color: #303030;
  overflow: hidden;
}

.scrolling-words-container .scrolling-words li {
  line-height: 0;
  text-align: center;
  display: none;
}

.scrolling-words-container .scrolling-words li button {
  position: relative;
  display: inline-block;
  width: auto;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.scrolling-words-container .scrolling-words li button::after {
  content: '';
  display: inline-block;
  width: 29px;
  height: 34px;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAiCAYAAACjv9J3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAzIDc5LjE2NDUyNywgMjAyMC8xMC8xNS0xNzo0ODozMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4OTNkY2RjNi0wM2IxLWVlNGQtYWJjYy1kNDMyM2QxM2NiMmIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qjk2QjZDMDQ2NEU5MTFFRkJDQkZCNUU4MkUzRkQ0NDYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qjk2QjZDMDM2NEU5MTFFRkJDQkZCNUU4MkUzRkQ0NDYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzNkNzI2ZjEtMzNhZC0xNzRkLWE1MTMtZTI5ODBiOGNiZjViIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg5M2RjZGM2LTAzYjEtZWU0ZC1hYmNjLWQ0MzIzZDEzY2IyYiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg2Znv8AAAKdSURBVHja7JfdS1RBGMbPqrvahx+JlR2spSiMQsGizIsSou4iKBKC8Eqwvym88iK1bvq48UbvrG5Kol0pzUIyVluj3LJPze154VkYZs+cmbMtBebAj3N2z848836cd96N5fN572+PCu8fjP9HtKpws5jJuM6pAQ2gGvwEn5p9/0tJopaxAxwHrWCn/hAbzuHyEkxiA9bdxwrZa7B0CzgHOpRQrIIP4Aef14OEMmcGjEL8Yymie8BVLvoLpEEKzIE1dQ3QDNrojWpu6A6EX0QRbQG9XOAtuAeWHMKwHVwAh8E6hVMuonXgOthGy+6KpZjsFHysI5afBafpoUHMfWN7ZS5ScFZ2yolq4p0He0N0xYpx8BhUgkvYSDxM9CD5RgvXtee1oIuuT1qMHmVIJPM7w0RP8ToBVgIWkoy8T4uvWYTFQ2O8P0m3F4lK+h9gZk6GLPY0grC8PjnmSTJIdB8/z9O9XhmEJb7TvA8UbeJ1wbFK6cK7DL97p61f5F4ZXyOUUXn5l1mRTNauaOs7115TiZQsbgSvaLnJxZ76JlQE7Kg+gqBPwRHW5KBRq3tQFc3y6pdRUE2gbJDoPCf7IdYmFMFZB0GpSId4/zpIVCY/56nRZVhktyJ4yyIo4xg9k0X9XTRVpIcM/AnDKyDeuAGGHQS3gm7ePwgrg7KbJ3RLD1sTfSxoh4DJrT086mSjz2xHm8Stj67M0KrPEVugy+AIkN5pAK5dth1t0mzdZEvi82w9yljbhpTSfgpKKR3SBW3tipypV8B+JeXTLOJLdHGcmS7na7vy2/fgNgSzpTRmMfY9Z3hSeFq2x7XvpDd6JIkDwdVSu0E1Tq2khX1vITQ5Jpe0oFMQ+/6nLWjYSDD+nmv/VCS6+Qdqw4j+FmAAmo/YYIVqkioAAAAASUVORK5CYII=');
  background-repeat: no-repeat;
  background-size: 100%;
  margin-left: 10px;
}

.scrolling-words-container .scrolling-words li button :deep(span) {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: 0.01em;
  vertical-align: top;
  line-height: 34px;
  color: #ffffff;
}

.scrolling-words-container .scrolling-words li :deep(strong) {
  font-weight: 600;
}

.scrolling-words-container .scrolling-words li :deep(.col-orange) {
  color: #ff8c00;
}

.scrolling-words-container .scrolling-words li :deep(.col-red) {
  color: #ff0000;
}

.scrolling-words-container .scrolling-words li :deep(.col-blue) {
  color: #0066ff;
}

.scrolling-words-container .scrolling-words li :deep(.col-orange2) {
  color: #ff6600;
}

.scrolling-words-container .scrolling-words li.words-in {
  display: block;
  animation: textIn 0.5s ease;
}

.scrolling-words-container .scrolling-words li.words-out {
  animation: textOut 2s ease;
}

@keyframes textIn {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes textOut {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
}
</style>