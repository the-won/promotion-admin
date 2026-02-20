export function generateEventMapHtml(data, deviceType = 'web', options = {}) {
  const showTopBanner = !!options.showTopBanner
  const showBottomBanner = !!options.showBottomBanner
  const showNotice = !!options.showNotice
  const noticeTitle = options.noticeTitle || '꼭 확인하세요'
  const noticeItems = Array.isArray(options.noticeItems) ? options.noticeItems : []
	const pageTitle = data.pageTitle || '프로모션'
	const gaPrefix = deviceType === 'mobile' ? 'MO_프로모션' : 'PC_프로모션'

  // 공지사항 HTML 생성 헬퍼
  const generateNoticeHtml = () => {
    if (!showNotice || noticeItems.length === 0) return ''
    const liItems = noticeItems.map(item => '<li>' + item + '</li>').join('\n\t\t\t')
    return '<div class="evt-cnt cnt-notice">\n\t\t<h2>' + noticeTitle + '</h2>\n\t\t<ul class="evt-notice-list">\n\t\t\t' + liItems + '\n\t\t</ul>\n\t</div>'
  }

  // deviceType에 따라 이미지 URL 선택
  const getImageUrl = (group) => {
    if (deviceType === 'mobile') {
      return group.mobileImageUrl || group.webImageUrl
    }
    return group.webImageUrl
  }
  
  // deviceType에 따라 이미지 Alt 선택
  const getImageAlt = (group) => {
    if (deviceType === 'mobile') {
      return group.mobileImageAlt || group.webImageAlt || ''
    }
    return group.webImageAlt || ''
  }
  
  // 각 이미지 섹션 생성 (핫스팟 포함)
  const generateImageSection = (group) => {
    const imageUrl = getImageUrl(group)
    const imageAlt = getImageAlt(group)
    
    if (!imageUrl) return ''
    
    // 핫스팟이 없으면 단순 이미지
    if (!group.hotspots || !Array.isArray(group.hotspots) || group.hotspots.length === 0) {
      return `
              ${imageAlt ? `<div class="sr-only">${imageAlt}</div>` : ''}
              <img 
                src="${imageUrl}" 
                alt=""
              />`
    }
    
    // 핫스팟 오버레이 생성
    const hotspotOverlays = group.hotspots.map((hotspot, index) => {
      const pos = hotspot.position || { left: 0, top: 0, width: 20, height: 10 }
      const useLink = hotspot.useLink !== false
      const href = hotspot.href || '#'
      const alt = hotspot.alt || ''
      
      const style = `position: absolute; left: ${pos.left}%; top: ${pos.top}%; width: ${pos.width}%; height: ${pos.height}%; display: block; z-index: ${10 + index}; text-decoration: none; border: none; background: transparent; padding: 0; cursor: pointer; font-size: 0; line-height: 0;`
      
      if (useLink) {
        return `
              <a href="${href}" target="_blank" onclick="gaEvtAction('${gaPrefix}', '${pageTitle}', '${alt}')" style="${style}">
                ${alt ? `<span class="sr-only">${alt}</span>` : ''}
              </a>`
      } else {
        return `
              <button type="button" onclick="gaEvtAction('${gaPrefix}', '${pageTitle}', '${alt}')" style="${style}">
                ${alt ? `<span class="sr-only">${alt}</span>` : ''}
              </button>`
      }
    }).join('\n')
    
    return `
          <div style="position: relative;">
            ${imageAlt ? `<div class="sr-only">${imageAlt}</div>` : ''}
            <img src="${imageUrl}" alt="" />
            ${hotspotOverlays}
          </div>`
  }
  
  // 모바일 HTML 템플릿
  if (deviceType === 'mobile') {
    return `
    <!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="author" content="SKMNS">
<title>APP ${pageTitle} | 베네피아</title>
<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
<meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'/>
<link rel="stylesheet" type="text/css" href="https://m.benepia.co.kr/resources/benepia/css/base.css">
<link rel="stylesheet" type="text/css" href="https://m.benepia.co.kr/resources/benepia/css/evt_common_mobile.css">
<style>
/* evt_common_mobile.css 내용 copy */
.evt-wrap {width:100%; font-size:2.222222222222vw; font-family:'Pretendard', '맑은 고딕', 'Droid Sans', AppleSDGothicNeo, Helvetica,sans-serif;}
.evt-wrap .hide {position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; text-indent:-9999px; z-index:0; overflow:hidden;}
.evt-wrap .evt-cnt {position:relative; background-color: #ffffff;}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* event common */
a {-webkit-tap-highlight-color:rgba(0,0,0,0); -webkit-tap-highlight-color: transparent;}
.evt-wrap a,
.evt-wrap button {position:relative; z-index:8; display:block; width:100%;}
.evt-wrap .floated-button {position:absolute; top:0; left:0%; height: 0; overflow:hidden; text-indent:-5000px; outline: none; 
    /* background-color: rgba(0, 255, 0, 0.483); */
}

/**********************
*   최상단 띠배너 
***********************/
.col-red {color: #f8605b;}
.col-orange {color: #f58f00;}
.col-orange2 {color: #fb6236;}
.col-blue {color: #57d5ff;}
.txt-italic {font-style: italic;}
.scrolling-words-container {padding: 3.3333vw 0 2.7777vw 0; background-color: #303030;}
.scrolling-words-container .scrolling-words {height: 5vw; background-color: #303030; overflow: hidden;}
.scrolling-words-container .scrolling-words li {line-height: 0; text-align: center; display: none;}
.scrolling-words-container .scrolling-words li a,
.scrolling-words-container .scrolling-words li button {position: relative; display: inline-block; width: auto; font-size: 1em;}
.scrolling-words-container .scrolling-words li a::after,
.scrolling-words-container .scrolling-words li button::after {content: ''; display: inline-block; width: 4.72222vw; height: 4.72222vw; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3xpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAzIDc5LjE2NDUyNywgMjAyMC8xMC8xNS0xNzo0ODozMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iOEY0NUI2Qzg1MTg0NUZBRjVCRTYwODM2QjdGRUFFNzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0NFM0Q3Rjg2NEU0MTFFRkFGQjZFQTc0OUI0MTUzQUIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0NFM0Q3Rjc2NEU0MTFFRkFGQjZFQTc0OUI0MTUzQUIiIHhtcDpDcmVhdG9yVG9vbD0iQW5kcm9pZCBUUDFBLjIyMDYyNC4wMTQuTjk4Nk5LU1MzSFhGMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmI2ZTgyY2ZkLTFmYjQtNzg0Zi04NjY0LTA1MjEzZDc0YzlmMiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmM3ZGFkN2MwLTRkYmQtOGE0ZS1hNjYxLTA3MGJlMTlmYzBkMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq1x80oAAAKzSURBVHja7JjPTxNBFMe3AlqoF6URLIIk9SJgArFVvKEX4axe9OAf4j+jUU/eaTlQEj1AQDk1GBM5VMqvBDAeaBqx1u9LvptMtzs7O7s0cuAln8wm3X3vuzPv7bxpotlsOmfBLjhnxLrdi72dnTD3d4EsyYArIMnf6uAnEEebpGFyOJjJtAoxmASbBnmQ0txzmQyD+6AGVsEKRYabkQCbALMMIrYPNsAPcMCAYn0gDUbAGBgAMyAHiqAcFCThJqvP0kj+zHEWxCqgxDGM3QSPOIqtgQL4a7M0IuIZuA3+8I2+AJsSE8GvwV3OaJ6z+sErJkjILEXI2r4HW943CGOYZRH+mcv5nD7F93yY8pWcuAdOwDtVRIzS3+ILndD3hMlZknkhtgCqGsej4BV4YiGoyiV2GCMZJGSa5VlhTujsEr8pdyzFrNN3irF8hXQpFVIyJOY3sMjrcQsxTeW5PGO2CclS6X7IEv0UUYx8f/YYK6sTIvbVIgmjinFj3PITcl2pf6fDYiqemC0P9HM8iLB5esXMGO4/5HjVT4hbTrWIO7kk8G9eDxnurXlinlo/cg28BBf5NS7FaYzqyi4aRUSKPt6CbcMzfZ6YLUKOOKY7LELNxyM/IW4fMNJhEY7SGuz6CdnkOBbCUTqGCIe7sBqzTUiNnZVpViZjiBDfg+AYfPcT0mCP6bCzSgQ4W2Mv+sZSRIK+XR8NXfmuUOkoOyud/eKWvmtZYVP0fcxY2g6tzr7yKXjMzanq6bqifmtuKL1OwdvZ+33QylyiHvCCx4O4NkxfPfRdDtvuFblD9rI6coacCcqJHH300mfxfxwnHjInjMeJICFqMz2nnPBsDlgOE7OgO2DZHDnLrPcHnJ0BJYhph5VZWD6tI6dbTUvgo3IIH9IcwrdtDuFtOXL+/wjtnwADAAw3yIr3cZv8AAAAAElFTkSuQmCC'); background-repeat: no-repeat; background-size: 100%; margin-left: 1.38888vw;}
.scrolling-words-container .scrolling-words li a span,
.scrolling-words-container .scrolling-words li button span {font-size: 3.8888vw;/*28px;*/ font-weight: 300; letter-spacing: .01em; color: #ffffff; vertical-align: top; line-height: 4.7222vw;}
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

/* 꼭 확인하세요 */
.cnt-notice {padding: 8.33333333333333vw 5.41666666666667vw; background-color: #f8f8f8 !important;}
.cnt-notice h2 {font-size: 4.44444444444444vw; font-weight: bold; line-height: 5.27777777777778vw; color:#000000;}
.cnt-notice .evt-notice-list {margin-top: 3.88888888888889vw;}
.cnt-notice .evt-notice-list li {position:relative; padding-left: 2.36111111111111vw; font-size: 3.33333333333333vw; font-weight: 400; line-height: 4.02777777777778vw; color: #212121; word-break: keep-all;}
.cnt-notice .evt-notice-list li:before {content:'*'; position: absolute; top: .4vw; left: 0;}
.cnt-notice .evt-notice-list li + li {margin-top: 2.5vw;}
</style>
</head>

<body> 
<div class="evt-wrap">
	${showTopBanner ? `<!-- 상단배너(개인결제유도) -->
	<div class="scrolling-words-container">
		<ul class="scrolling-words">
			<li><button type="button" onclick="handleInternalUrl('/main/mainHotDeal.bene'); gaEvtAction('MO_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>우리회사 복지몰 <strong class="col-orange">베네피아</strong></span></a></li>
			<li><button type="button" onclick="handleInternalUrl('/main/mainHotDeal.bene'); gaEvtAction('MO_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>비교검색 끝 <strong class="col-red">최저가보상</strong></span></a></li>
			<li><button type="button" onclick="handleInternalUrl('/main/mainHotDeal.bene'); gaEvtAction('MO_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>17시 전 주문하면 <strong class="col-blue">오늘출발</strong> <img src="https://www.benepia.co.kr/event/cm/topBnrPersPayInd/mobile/images/ico_delivery.png" alt="" style="width: 7.45vw;"></span></a></li>
			<li><button type="button" onclick="handleInternalUrl('/main/mainHotDeal.bene'); gaEvtAction('MO_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>놓치면 아까운 <strong class="col-orange2">여행딜특가</strong></span></a></li>
			<li><button type="button" onclick="handleInternalUrl('/main/mainHotDeal.bene'); gaEvtAction('MO_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span> <img src="https://www.benepia.co.kr/event/cm/topBnrPersPayInd/mobile/images/ico_pay2.png" alt="" style="width: 25.45vw;"> <strong>100% 안전결제</strong></span></a></li>
		</ul>
	</div>
	<script>
	/*
	* 최상단 띠배너 
	*/
	const { children: titles } = document.querySelector(".scrolling-words");
	const txtsLen = titles.length;
	let index = 0;
	const textInTimer = 3000;
	const textOutTimer = 2800;

	if(txtsLen != 1) {
		function animateText() {
			for (let i = 0; i < txtsLen; i++) {
				titles[i].classList.remove("words-in", "words-out");
			}
			titles[index].classList.add("words-in");

			setTimeout(function () {
				titles[index].classList.add("words-out");
			}, textOutTimer);

			setTimeout(function () {
				if (index == txtsLen - 1) {
				index = 0;
				} else {
				index++;
				}
				animateText();
				
			}, textInTimer);
		}
	} else {
		titles[index].classList.add("words-in");
	}
	animateText();
	<\/script>
	<!-- //상단배너(개인결제유도) -->` : ''}

	<!-- 상단 -->
	<div class="evt-cnt">
		<div class="hide">
			<h1>새해에 꼭 배우고 싶은 CLASS101, 가격 인상 전 마지막 할인</h1>
		</div>
		<img src="./images/img_visual.jpg" alt="">
	</div>
	<!-- // 상단 -->

	<!-- e쿠폰 -->
	<div class="evt-cnt">
		${(data.hotspotGroups || []).map(group => generateImageSection(group)).join('\n')}
	</div>
	<!-- // e쿠폰 -->

	<!-- 꼭 확인하세요 -->
	${generateNoticeHtml()}
	<!-- // 꼭 확인하세요 -->

	${showBottomBanner ? `<!-- 배너 - 활용백서 -->
	<div class="evt-cnt banner-howto" id="section_howto">
		<a href="/disp/eventUsesWhiteNew.bene" onclick="gaEvtAction('MO_프로모션', '${pageTitle}', '배너(활용백서)')" style="width:100%"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_info_mo_20250904.jpg" alt="베네피아 활용백서"></a>
	</div>
	<!-- // 배너 - 활용백서 -->
	<!-- 배너 - 리뷰 혜택 -->
	<div class="evt-cnt banner-review" id="section_review">
		<button type="button" onclick="handleInternalUrl('/frnt/mypage/reviewWritableList.bene'); gaEvtAction('MO_프로모션', '${pageTitle}', '배너(리뷰 혜택)');" style="width:100%"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_review_mo_20240306.jpg" alt="리뷰쓰고 혜택받자!"></button>
	</div>
	<!-- // 배너 - 리뷰 혜택 -->
	<!-- 배너 - 카카오톡 플러스 친구 -->
	<div class="evt-cnt banner-kakao-plus" id="section_kakao">
		<button type="button" onclick="AppWeblink('https://pf.kakao.com/_mxbBkT'); gaEvtAction('MO_프로모션', '${pageTitle}', '배너(카카오톡 플러스 친구)');" style="width:100%"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_kakao_plus_mo_20240306.jpg" alt="베네피아와 카카오톡 친구해요"></button>
	</div>
	<!-- // 배너 - 카카오톡 플러스 친구 -->` : ''}
</div>

</body>
</html>`
  }

  // 웹 HTML 템플릿
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="author" content="SKMNS">
<title>WEB ${pageTitle} | 베네피아</title>
<link rel="stylesheet" type="text/css" href="https://newfront.benepia.co.kr/resources/css/evt_common.css">
<style>
.evt-wrap {width: 1080px; font-family: 'Pretendard', sans-serif;font-size: 24px;}
.evt-wrap .evt-cnt {position:relative; width: 1080px; margin: 0 auto; }
a {-webkit-tap-highlight-color: rgba(0,0,0,0); -webkit-tap-highlight-color: transparent; }
.evt-wrap a,
.evt-wrap button {position:relative;z-index: 50;display:block;width:100%; font-family: 'Pretendard', sans-serif;}
.evt-wrap .floated-button {display: block;position: absolute;text-indent: -5000px;overflow: hidden;top:0;height:0; outline:none;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=);}
.evt-wrap .hide {display: none;}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.col-red {color: #f8605b;}
.col-orange {color: #f58f00;}
.col-orange2 {color: #fb6236;}
.col-blue {color: #57d5ff;}
.txt-italic {font-style: italic;}
.scrolling-words-container {padding: 20px 0 16px 0; background-color: #303030; width: 100%; margin: 0 auto;}
.scrolling-words-container .scrolling-words {height: 34px; background-color: #303030; overflow: hidden;}
.scrolling-words-container .scrolling-words li { line-height: 0; text-align: center; display: none;}
.scrolling-words-container .scrolling-words li a,
.scrolling-words-container .scrolling-words li button {position: relative; display: inline-block; width: auto;}
.scrolling-words-container .scrolling-words li a::after,
.scrolling-words-container .scrolling-words li button::after {content: ''; display: inline-block; width: 29px; height: 34px; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAiCAYAAACjv9J3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAzIDc5LjE2NDUyNywgMjAyMC8xMC8xNS0xNzo0ODozMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4OTNkY2RjNi0wM2IxLWVlNGQtYWJjYy1kNDMyM2QxM2NiMmIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qjk2QjZDMDQ2NEU5MTFFRkJDQkZCNUU4MkUzRkQ0NDYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qjk2QjZDMDM2NEU5MTFFRkJDQkZCNUU4MkUzRkQ0NDYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzNkNzI2ZjEtMzNhZC0xNzRkLWE1MTMtZTI5ODBiOGNiZjViIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg5M2RjZGM2LTAzYjEtZWU0ZC1hYmNjLWQ0MzIzZDEzY2IyYiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg2Znv8AAAKdSURBVHja7JfdS1RBGMbPqrvahx+JlR2spSiMQsGizIsSou4iKBKC8Eqwvym88iK1bvq48UbvrG5Kol0pzUIyVluj3LJPze154VkYZs+cmbMtBebAj3N2z848836cd96N5fN572+PCu8fjP9HtKpws5jJuM6pAQ2gGvwEn5p9/0tJopaxAxwHrWCn/hAbzuHyEkxiA9bdxwrZa7B0CzgHOpRQrIIP4Aef14OEMmcGjEL8Yymie8BVLvoLpEEKzIE1dQ3QDNrojWpu6A6EX0QRbQG9XOAtuAeWHMKwHVwAh8E6hVMuonXgOthGy+6KpZjsFHysI5afBafpoUHMfWN7ZS5ScFZ2yolq4p0He0N0xYpx8BhUgkvYSDxM9CD5RgvXtee1oIuuT1qMHmVIJPM7w0RP8ToBVgIWkoy8T4uvWYTFQ2O8P0m3F4lK+h9gZk6GLPY0grC8PjnmSTJIdB8/z9O9XhmEJb7TvA8UbeJ1wbFK6cK7DL97p61f5F4ZXyOUUXn5l1mRTNauaOs7115TiZQsbgSvaLnJxZ76JlQE7Kg+gqBPwRHW5KBRq3tQFc3y6pdRUE2gbJDoPCf7IdYmFMFZB0GpSId4/zpIVCY/56nRZVhktyJ4yyIo4xg9k0X9XTRVpIcM/AnDKyDeuAGGHQS3gm7ePwgrg7KbJ3RLD1sTfSxoh4DJrT086mSjz2xHm8Stj67M0KrPEVugy+AIkN5pAK5dth1t0mzdZEvi82w9yljbhpTSfgpKKR3SBW3tipypV8B+JeXTLOJLdHGcmS7na7vy2/fgNgSzpTRmMfY9Z3hSeFq2x7XvpDd6JIkDwdVSu0E1Tq2khX1vITQ5Jpe0oFMQ+/6nLWjYSDD+nmv/VCS6+Qdqw4j+FmAAmo/YYIVqkioAAAAASUVORK5CYII='); background-repeat: no-repeat; background-size: 100%; margin-left: 10px;}
.scrolling-words-container .scrolling-words li a span,
.scrolling-words-container .scrolling-words li button span {font-size: 24px; font-weight: 300; letter-spacing: .01em; vertical-align: top; line-height: 34px; color: #ffffff;}
.scrolling-words-container .scrolling-words li strong {font-weight: 600;}
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

.cnt-notice {padding: 60px 39px 60px 187px; background-color: #f8f8f8 !important; box-sizing: border-box;}
.cnt-notice h2 {font-size: 32px; font-weight: bold; line-height: 38px; color:#000000;}
.cnt-notice .evt-notice-list {margin-top: 28px;}
.cnt-notice .evt-notice-list li {position:relative; padding-left: 17px; font-size: 24px; font-weight: 400; line-height: 29px; color: #212121; word-break: keep-all;}
.cnt-notice .evt-notice-list li:before {content:'*'; position: absolute; top: 3px; left: 0;}
.cnt-notice .evt-notice-list li + li {margin-top: 18px;}
</style>
</head>
<body>
<div class="evt-wrap">
	${showTopBanner ? `<div class="scrolling-words-container">
		<ul class="scrolling-words">
			<li class=""><button type="button" onclick="window.open('/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene'); gaEvtAction('PC_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>우리회사 복지몰 <strong class="col-orange">베네피아</strong></span></button></li>
			<li class="words-in"><button type="button" onclick="window.open('/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene'); gaEvtAction('PC_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>비교검색 끝 <strong class="col-red">최저가보상</strong></span></button></li>
			<li class=""><button type="button" onclick="window.open('/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene'); gaEvtAction('PC_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>17시 전 주문하면 <strong class="col-blue">오늘출발</strong> <img src="https://www.benepia.co.kr/event/cm/topBnrPersPayInd/pc/images/ico_delivery.png" alt="" style="width: 43px; margin-top: 3px;"></span></button></li>
			<li class=""><button type="button" onclick="window.open('/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene'); gaEvtAction('PC_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>놓치면 아까운 <strong class="col-orange2">여행딜특가</strong></span></button></li>
			<li class=""><button type="button" onclick="window.open('/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene'); gaEvtAction('PC_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span> <img src="https://www.benepia.co.kr/event/cm/topBnrPersPayInd/pc/images/ico_pay2.png" alt="" style="width: 182px;"> <strong>100% 안전결제</strong></span></button></li>
		</ul>
	</div>
	<script>
	const { children: titles } = document.querySelector(".scrolling-words");
	const txtsLen = titles.length;
	let index = 0;
	const textInTimer = 3000;
	const textOutTimer = 2800;
	
	if(txtsLen != 1) {
		function animateText() {
			for (let i = 0; i < txtsLen; i++) {
				titles[i].classList.remove("words-in", "words-out");
			}
			titles[index].classList.add("words-in");
	
			setTimeout(function () {
				titles[index].classList.add("words-out");
			}, textOutTimer);
	
			setTimeout(function () {
				if (index == txtsLen - 1) {
				index = 0;
				} else {
				index++;
				}
				animateText();
				
			}, textInTimer);
		}
	} else {
		titles[index].classList.add("words-in");
	}
	animateText();
	<\/script>` : ''}

	<div class="evt-cnt">
		<div class="hide">
			<h1>새해에 꼭 배우고 싶은 CLASS101, 가격 인상 전 마지막 할인</h1>
			<h2>6,000개 이상 강의를 무제한 구독하세요</h2>
		</div>
		${(data.hotspotGroups || []).map(group => generateImageSection(group)).join('\n')}
	</div>

	${generateNoticeHtml()}

	${showBottomBanner ? `<div class="evt-cnt banner-howto" id="section_howto">
		<button type="button" onclick="window.open('/frnt/event/eventUsesWhiteNew.do');"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_info_pc_20250904.jpg?date=20250910172538" alt="베네피아 활용백서"></button>
	</div>
	<div class="evt-cnt banner-review" id="section_review">
		<button type="button" onclick="window.open('/frnt/pointmall/pointmall.do?returnUrl=/mypg/prdReviewList.bene');"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_review_pc_20240306.jpg?date=20250910172538" alt="리뷰쓰고 혜택받자!"></button>
	</div>
	<div class="evt-cnt banner-kakao-plus" id="section_kakao">
		<button type="button" onclick="window.open('https://pf.kakao.com/_mxbBkT');"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_kakao_plus_pc_20240306.jpg?date=20250910172538" alt="베네피아와 카카오톡 친구해요"></button>
	</div>` : ''}

</div>

</body>
</html>`
}