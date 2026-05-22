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
  name: 'ScrollingBannerMobile',
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
          url: '/main/mainHotDeal.bene',
          gaParams: {
            category: 'MO_프로모션',
            action: '2026 FIFA 북중미 월드컵 이벤트',
            label: '상단배너(개인결제유도)'
          }
        },
        {
          content: '비교검색 끝 <strong class="col-red">최저가보상</strong>',
          url: '/main/mainHotDeal.bene',
          gaParams: {
            category: 'MO_프로모션',
            action: '2026 FIFA 북중미 월드컵 이벤트',
            label: '상단배너(개인결제유도)'
          }
        },
        {
          content: '17시 전 주문하면 <strong class="col-blue">오늘출발</strong> <img src="https://www.benepia.co.kr/event/cm/topBnrPersPayInd/mobile/images/ico_delivery.png" alt="" style="width: 7.45%; margin-top: 0.55%;">',
          url: '/main/mainHotDeal.bene',
          gaParams: {
            category: 'MO_프로모션',
            action: '2026 FIFA 북중미 월드컵 이벤트',
            label: '상단배너(개인결제유도)'
          }
        },
        {
          content: '놓치면 아까운 <strong class="col-orange2">여행딜특가</strong>',
          url: '/main/mainHotDeal.bene',
          gaParams: {
            category: 'MO_프로모션',
            action: '2026 FIFA 북중미 월드컵 이벤트',
            label: '상단배너(개인결제유도)'
          }
        },
        {
          content: '<img src="https://www.benepia.co.kr/event/cm/topBnrPersPayInd/mobile/images/ico_pay2.png" alt="" style="width: 25.45%;"> <strong>100% 안전결제</strong>',
          url: '/main/mainHotDeal.bene',
          gaParams: {
            category: 'MO_프로모션',
            action: '2026 FIFA 북중미 월드컵 이벤트',
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
      if (window.gaEvtAction && gaParams) {
        window.gaEvtAction(gaParams.category, gaParams.action, gaParams.label);
      }

      if (window.handleInternalUrl) {
        window.handleInternalUrl(url);
      }
    }
  }
};
</script>

<style scoped>
.scrolling-words-container {container-type: inline-size; padding: 5px 0 3px 0; background-color: #303030;}
.scrolling-words-container .scrolling-words {height: 5cqw; background-color: #303030; overflow: hidden;}
.scrolling-words-container .scrolling-words li {line-height: 0; text-align: center; display: none;}
.scrolling-words-container .scrolling-words li a,
.scrolling-words-container .scrolling-words li button {position: relative; display: inline-block; width: auto; font-size: 1em;}
.scrolling-words-container .scrolling-words li a::after,
.scrolling-words-container .scrolling-words li button::after {content: ''; display: inline-block; width: 4.72222cqw; height: 4.72222cqw; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3xpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAzIDc5LjE2NDUyNywgMjAyMC8xMC8xNS0xNzo0ODozMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iOEY0NUI2Qzg1MTg0NUZBRjVCRTYwODM2QjdGRUFFNzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0NFM0Q3Rjg2NEU0MTFFRkFGQjZFQTc0OUI0MTUzQUIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0NFM0Q3Rjc2NEU0MTFFRkFGQjZFQTc0OUI0MTUzQUIiIHhtcDpDcmVhdG9yVG9vbD0iQW5kcm9pZCBUUDFBLjIyMDYyNC4wMTQuTjk4Nk5LU1MzSFhGMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmI2ZTgyY2ZkLTFmYjQtNzg0Zi04NjY0LTA1MjEzZDc0YzlmMiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmM3ZGFkN2MwLTRkYmQtOGE0ZS1hNjYxLTA3MGJlMTlmYzBkMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq1x80oAAAKzSURBVHja7JjPTxNBFMe3AlqoF6URLIIk9SJgArFVvKEX4axe9OAf4j+jUU/eaTlQEj1AQDk1GBM5VMqvBDAeaBqx1u9LvptMtzs7O7s0cuAln8wm3X3vuzPv7bxpotlsOmfBLjhnxLrdi72dnTD3d4EsyYArIMnf6uAnEEebpGFyOJjJtAoxmASbBnmQ0txzmQyD+6AGVsEKRYabkQCbALMMIrYPNsAPcMCAYn0gDUbAGBgAMyAHiqAcFCThJqvP0kj+zHEWxCqgxDGM3QSPOIqtgQL4a7M0IuIZuA3+8I2+AJsSE8GvwV3OaJ6z+sErJkjILEXI2r4HW943CGOYZRH+mcv5nD7F93yY8pWcuAdOwDtVRIzS3+ILndD3hMlZknkhtgCqGsej4BV4YiGoyiV2GCMZJGSa5VlhTujsEr8pdyzFrNN3irF8hXQpFVIyJOY3sMjrcQsxTeW5PGO2CclS6X7IEv0UUYx8f/YYK6sTIvbVIgmjinFj3PITcl2pf6fDYiqemC0P9HM8iLB5esXMGO4/5HjVT4hbTrWIO7kk8G9eDxnurXlinlo/cg28BBf5NS7FaYzqyi4aRUSKPt6CbcMzfZ6YLUKOOKY7LELNxyM/IW4fMNJhEY7SGuz6CdnkOBbCUTqGCIe7sBqzTUiNnZVpViZjiBDfg+AYfPcT0mCP6bCzSgQ4W2Mv+sZSRIK+XR8NXfmuUOkoOyud/eKWvmtZYVP0fcxY2g6tzr7yKXjMzanq6bqifmtuKL1OwdvZ+33QylyiHvCCx4O4NkxfPfRdDtvuFblD9rI6coacCcqJHH300mfxfxwnHjInjMeJICFqMz2nnPBsDlgOE7OgO2DZHDnLrPcHnJ0BJYhph5VZWD6tI6dbTUvgo3IIH9IcwrdtDuFtOXL+/wjtnwADAAw3yIr3cZv8AAAAAElFTkSuQmCC'); background-repeat: no-repeat; background-size: 100%; margin-left: 1.38888cqw;}
.scrolling-words-container .scrolling-words li a span,
.scrolling-words-container .scrolling-words li button span {font-size: 3.8888cqw; font-weight: 300; letter-spacing: .01em; color: #ffffff; vertical-align: top; line-height: 4.7222cqw;}
.scrolling-words-container .scrolling-words li strong {font-weight: 600; font-size: 1em;}
.scrolling-words-container .scrolling-words li em {font-size: 1em;}
.scrolling-words-container .scrolling-words li.words-in {display: block; animation: textIn .5s ease;}
.scrolling-words-container .scrolling-words li.words-out {animation: textOut 2s ease;}
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
