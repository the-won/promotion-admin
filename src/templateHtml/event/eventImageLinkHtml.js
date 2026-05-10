import { buildWebAction, buildMobileAction } from '../../utils/hotspotLinkBuilder.js'

export function generateEventImageLinkHtml(data, deviceType = 'web', options = {}) {
  const showTopBanner = !!options.showTopBanner
  const showBottomBanner = !!options.showBottomBanner
  const showNotice = !!options.showNotice
  const noticeTitle = options.noticeTitle || '꼭 확인하세요'
  const noticeItems = Array.isArray(options.noticeItems) ? options.noticeItems : []
  const pageTitle = data.pageTitle || '프로모션'
  const gaPrefix = deviceType === 'mobile' ? 'MO_프로모션' : 'PC_프로모션'

  const generateNoticeHtml = () => {
    if (!showNotice || noticeItems.length === 0) return ''
    const liItems = noticeItems.map(item => '<li>' + item + '</li>').join('\n\t\t\t')
    return '<div class="evt-cnt cnt-notice">\n\t\t<h2>' + noticeTitle + '</h2>\n\t\t<ul class="evt-notice-list">\n\t\t\t' + liItems + '\n\t\t</ul>\n\t</div>'
  }

  const generateGroupHtml = (group) => {
    const images = (group.images || []).filter(img => img.url)
    if (images.length === 0) return ''

    const cfg = group[deviceType] || {}
    const gaCall = `gaEvtAction('${gaPrefix}', '${pageTitle}', '이미지링크');`
    const imagesHtml = images
      .map(img => `\t\t<img src="${img.url}" alt="${img.alt || ''}" width="100%" style="display:block;" border="0">`)
      .join('\n')

    if (deviceType === 'web') {
      const { tag, action, extra } = buildWebAction(cfg)
      const combinedOnclick = action
        ? action.startsWith('href=') ? gaCall : `${action.replace(/^onclick="/, '').replace(/"$/, '')} ${gaCall}`
        : gaCall
      if (tag === 'a' && action && action.startsWith('href=')) {
        const hrefVal = action.replace(/^href="/, '').replace(/"$/, '')
        const extraAttr = extra ? ` ${extra}` : ''
        return `\t<div class="evt-cnt">
\t\t<a href="${hrefVal}"${extraAttr} onclick="${gaCall}" style="display:block;">
${imagesHtml}
\t\t</a>
\t</div>`
      }
      if (tag === 'a') {
        const extraAttr = extra ? ` ${extra}` : ''
        return `\t<div class="evt-cnt">
\t\t<a href="#"${extraAttr} onclick="${combinedOnclick}" style="display:block;">
${imagesHtml}
\t\t</a>
\t</div>`
      }
      return `\t<div class="evt-cnt">
\t\t<button type="button" onclick="${combinedOnclick}" style="display:block;width:100%;border:none;padding:0;background:none;cursor:pointer;">
${imagesHtml}
\t\t</button>
\t</div>`
    } else {
      const { action } = buildMobileAction(cfg)
      const onclick = action
        ? `${action.replace(/^onclick="/, '').replace(/"$/, '')} ${gaCall}`
        : gaCall
      return `\t<div class="evt-cnt">
\t\t<button type="button" onclick="${onclick}" style="display:block;width:100%;border:none;padding:0;background:none;cursor:pointer;">
${imagesHtml}
\t\t</button>
\t</div>`
    }
  }

  const groups = data.imageLinkGroups || []
  const contentHtml = groups.map(generateGroupHtml).filter(Boolean).join('\n')

  if (deviceType === 'mobile') {
    return `<!DOCTYPE html>
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
.evt-wrap {width:100%; font-size:2.222222222222vw; font-family:'Pretendard', '맑은 고딕', 'Droid Sans', AppleSDGothicNeo, Helvetica,sans-serif;}
.evt-wrap .evt-cnt {position:relative; background-color: #ffffff;}
a {-webkit-tap-highlight-color:rgba(0,0,0,0); -webkit-tap-highlight-color: transparent;}
.evt-wrap a,
.evt-wrap button {position:relative; z-index:8; display:block; width:100%;}
.col-red {color: #f8605b;}
.col-orange {color: #f58f00;}
.col-orange2 {color: #fb6236;}
.col-blue {color: #57d5ff;}
.scrolling-words-container {padding: 3.3333vw 0 2.7777vw 0; background-color: #303030;}
.scrolling-words-container .scrolling-words {height: 5vw; background-color: #303030; overflow: hidden;}
.scrolling-words-container .scrolling-words li {line-height: 0; text-align: center; display: none;}
.scrolling-words-container .scrolling-words li a,
.scrolling-words-container .scrolling-words li button {position: relative; display: inline-block; width: auto; font-size: 1em;}
.scrolling-words-container .scrolling-words li a span,
.scrolling-words-container .scrolling-words li button span {font-size: 3.8888vw; font-weight: 300; letter-spacing: .01em; color: #ffffff; vertical-align: top; line-height: 4.7222vw;}
.scrolling-words-container .scrolling-words li strong {font-weight: 600; font-size: 1em;}
.scrolling-words-container .scrolling-words li.words-in {display: block; animation: textIn .5s ease;}
.scrolling-words-container .scrolling-words li.words-out {animation: textOut 2s ease;}
@keyframes textIn { 0% {transform: translateY(-100%);} 100% {transform: translateY(0%);} }
@keyframes textOut { 0% {transform: translateY(0%);} 100% {transform: translateY(100%);} }
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
\t${showTopBanner ? `<!-- 상단배너(개인결제유도) -->
\t<div class="scrolling-words-container">
\t\t<ul class="scrolling-words">
\t\t\t<li><button type="button" onclick="handleInternalUrl('/main/mainHotDeal.bene'); gaEvtAction('MO_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>우리회사 복지몰 <strong class="col-orange">베네피아</strong></span></button></li>
\t\t\t<li><button type="button" onclick="handleInternalUrl('/main/mainHotDeal.bene'); gaEvtAction('MO_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>비교검색 끝 <strong class="col-red">최저가보상</strong></span></button></li>
\t\t\t<li><button type="button" onclick="handleInternalUrl('/main/mainHotDeal.bene'); gaEvtAction('MO_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>놓치면 아까운 <strong class="col-orange2">여행딜특가</strong></span></button></li>
\t\t</ul>
\t</div>
\t<script>
\tconst { children: titles } = document.querySelector(".scrolling-words");
\tconst txtsLen = titles.length;
\tlet index = 0;
\tconst textInTimer = 3000;
\tconst textOutTimer = 2800;
\tif(txtsLen != 1) {
\t\tfunction animateText() {
\t\t\tfor (let i = 0; i < txtsLen; i++) { titles[i].classList.remove("words-in", "words-out"); }
\t\t\ttitles[index].classList.add("words-in");
\t\t\tsetTimeout(function () { titles[index].classList.add("words-out"); }, textOutTimer);
\t\t\tsetTimeout(function () { if (index == txtsLen - 1) { index = 0; } else { index++; } animateText(); }, textInTimer);
\t\t}
\t} else { titles[index].classList.add("words-in"); }
\tanimateText();
\t<\/script>
\t<!-- //상단배너(개인결제유도) -->` : ''}

${contentHtml}

\t${generateNoticeHtml()}

\t${showBottomBanner ? `<!-- 배너 - 활용백서 -->
\t<div class="evt-cnt banner-howto">
\t\t<a href="/disp/eventUsesWhiteNew.bene" onclick="gaEvtAction('MO_프로모션', '${pageTitle}', '배너(활용백서)')" style="width:100%"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_info_mo_20250904.jpg" alt="베네피아 활용백서"></a>
\t</div>
\t<!-- // 배너 - 활용백서 -->
\t<!-- 배너 - 리뷰 혜택 -->
\t<div class="evt-cnt banner-review">
\t\t<button type="button" onclick="handleInternalUrl('/frnt/mypage/reviewWritableList.bene'); gaEvtAction('MO_프로모션', '${pageTitle}', '배너(리뷰 혜택)');" style="width:100%"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_review_mo_20240306.jpg" alt="리뷰쓰고 혜택받자!"></button>
\t</div>
\t<!-- // 배너 - 리뷰 혜택 -->` : ''}
</div>

</body>
</html>`
  }

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="author" content="SKMNS">
<title>WEB ${pageTitle} | 베네피아</title>
<link rel="stylesheet" type="text/css" href="https://newfront.benepia.co.kr/resources/css/evt_common.css">
<style>
.evt-wrap {width: 1080px; font-family: 'Pretendard', sans-serif; font-size: 24px;}
.evt-wrap .evt-cnt {position:relative; width: 1080px; margin: 0 auto;}
a {-webkit-tap-highlight-color: rgba(0,0,0,0); -webkit-tap-highlight-color: transparent;}
.evt-wrap a,
.evt-wrap button {position:relative; z-index: 50; display:block; width:100%; font-family: 'Pretendard', sans-serif;}
.col-red {color: #f8605b;}
.col-orange {color: #f58f00;}
.col-orange2 {color: #fb6236;}
.col-blue {color: #57d5ff;}
.scrolling-words-container {padding: 20px 0 16px 0; background-color: #303030; width: 100%; margin: 0 auto;}
.scrolling-words-container .scrolling-words {height: 34px; background-color: #303030; overflow: hidden;}
.scrolling-words-container .scrolling-words li {line-height: 0; text-align: center; display: none;}
.scrolling-words-container .scrolling-words li a,
.scrolling-words-container .scrolling-words li button {position: relative; display: inline-block; width: auto;}
.scrolling-words-container .scrolling-words li a span,
.scrolling-words-container .scrolling-words li button span {font-size: 24px; font-weight: 300; letter-spacing: .01em; vertical-align: top; line-height: 34px; color: #ffffff;}
.scrolling-words-container .scrolling-words li strong {font-weight: 600;}
.scrolling-words-container .scrolling-words li.words-in {display: block; animation: textIn .5s ease;}
.scrolling-words-container .scrolling-words li.words-out {animation: textOut 2s ease;}
@keyframes textIn { 0% {transform: translateY(-100%);} 100% {transform: translateY(0%);} }
@keyframes textOut { 0% {transform: translateY(0%);} 100% {transform: translateY(100%);} }
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
\t${showTopBanner ? `<div class="scrolling-words-container">
\t\t<ul class="scrolling-words">
\t\t\t<li class="words-in"><button type="button" onclick="window.open('/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene'); gaEvtAction('PC_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>우리회사 복지몰 <strong class="col-orange">베네피아</strong></span></button></li>
\t\t\t<li class=""><button type="button" onclick="window.open('/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene'); gaEvtAction('PC_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>비교검색 끝 <strong class="col-red">최저가보상</strong></span></button></li>
\t\t\t<li class=""><button type="button" onclick="window.open('/frnt/pointmall/pointmall.do?returnUrl=/main/hotDeal.bene'); gaEvtAction('PC_프로모션', '${pageTitle}', '상단배너(개인결제유도)');"><span>놓치면 아까운 <strong class="col-orange2">여행딜특가</strong></span></button></li>
\t\t</ul>
\t</div>
\t<script>
\tconst { children: titles } = document.querySelector(".scrolling-words");
\tconst txtsLen = titles.length;
\tlet index = 0;
\tconst textInTimer = 3000;
\tconst textOutTimer = 2800;
\tif(txtsLen != 1) {
\t\tfunction animateText() {
\t\t\tfor (let i = 0; i < txtsLen; i++) { titles[i].classList.remove("words-in", "words-out"); }
\t\t\ttitles[index].classList.add("words-in");
\t\t\tsetTimeout(function () { titles[index].classList.add("words-out"); }, textOutTimer);
\t\t\tsetTimeout(function () { if (index == txtsLen - 1) { index = 0; } else { index++; } animateText(); }, textInTimer);
\t\t}
\t} else { titles[index].classList.add("words-in"); }
\tanimateText();
\t<\/script>` : ''}

${contentHtml}

\t${generateNoticeHtml()}

\t${showBottomBanner ? `<div class="evt-cnt banner-howto">
\t\t<button type="button" onclick="window.open('/frnt/event/eventUsesWhiteNew.do');"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_info_pc_20250904.jpg" alt="베네피아 활용백서"></button>
\t</div>
\t<div class="evt-cnt banner-review">
\t\t<button type="button" onclick="window.open('/frnt/pointmall/pointmall.do?returnUrl=/mypg/prdReviewList.bene');"><img src="https://www.benepia.co.kr/event/2023/07/0726_kakao_friends/images/banner_review_pc_20240306.jpg" alt="리뷰쓰고 혜택받자!"></button>
\t</div>` : ''}

</div>

</body>
</html>`
}
