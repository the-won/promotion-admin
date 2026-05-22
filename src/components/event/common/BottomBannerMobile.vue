<template>
  <div>
    <!-- 배너 - 활용백서 -->
    <div class="evt-cnt banner-howto" id="section_howto">
      <a href="javascript:void(0);" onclick="handleInternalUrl('/disp/eventUsesWhiteNew.bene'); gaEvtAction('MO_프로모션', '2026 FIFA 북중미 월드컵 이벤트', '배너(활용백서)');" style="width:100%; display:block;"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_info_mo_20250904.jpg?date=20250910172538" alt="베네피아 활용백서"></a>
    </div>
    <!-- // 배너 - 활용백서 -->

    <!-- 리뷰혜택 배너 -->
    <div class="evt-cnt banner-review" id="section_review">
      <button type="button" onclick="handleInternalUrl('/frnt/mypage/reviewWritableList.bene'); gaEvtAction('MO_프로모션', '2026 FIFA 북중미 월드컵 이벤트', '배너(리뷰 혜택)')" style="width:100%; vertical-align:top;">
        <img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_review_mo_20240306.jpg" alt="리뷰쓰고 혜택받자!">
      </button>
    </div>
    <!-- //리뷰혜택 배너 -->	
    <!-- 카카오 배너 -->
    <div class="evt-cnt banner-kakao-plus" id="section_kakao">
      <button type="button" onclick="AppWeblink('https://pf.kakao.com/_mxbBkT'); gaEvtAction('MO_프로모션', '2026 FIFA 북중미 월드컵 이벤트', '배너(카카오톡 플러스 친구)')" style="width:100%; vertical-align:top;">
        <img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_kakao_plus_mo_20240306.jpg" alt="베네피아와 카카오톡 친구해요">
      </button>
    </div>
    <!-- //카카오 배너 -->
  </div>
</template>

<style scoped>
  /* 프리뷰 화면에서만 적용된다.*/
  #section_howto a img {
    height: 106px;
  }
</style>