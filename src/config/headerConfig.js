export const HEADER_CONFIGS = {
  benepia: {
    logoUrl: 'https://newfront.benepia.co.kr/upload/xquared/b9d3364e-f386-4138-a6a4-6d61ed93422c.gif',
    logoAlt: 'BENEPIA',
    logoWidth: 148,
    logoHeight: 88,
    bannerUrl: 'https://i.benepia.co.kr/ckeditor/D9E5A1E20280.mns0115844189801720.gif',
    bannerAlt: '의 베네피아 잔여 포인트를 지금 확인하세요!',
    bannerWidth: 325,
    bannerHeight: 88,
    detailUrls: {
      normal: 'https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://$:domain:$.benepia.co.kr/frnt/mypage/main.do?mnuTopLevel=0%26mnuLevel=0&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=$:domain:$%26linkUrl=/frnt/mypage/pointInfo.bene',
      hynix: 'https://newfront.benepia.co.kr/gatepage/emGateway.do?pcUrl=https://skhynix.benepia.co.kr/hynix/myPointCondition.do&mbUrl=https://mr2.benepia.co.kr/gateLink.bene?domain=skhynix%26linkUrl=/frnt/mypage/pointUseTrMonthlyList.bene'
    }
  },
  hugashop: {
    // TODO: 아래 URL들을 실제 휴가샵 이미지/링크로 교체하세요
    logoUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/04/04/4497759d-fe0f-4f92-a2f8-5c1081f97fb7.gif',
    logoAlt: '휴가샵',
    logoWidth: 140,
    logoHeight: 88,
    bannerUrl: 'https://i.benepia.co.kr/ckeditor/D9E5A1E20280.mns0115844189801720.gif',
    bannerAlt: '의 휴가샵 포인트를 지금 확인하세요!',
    bannerWidth: 325,
    bannerHeight: 88,
    detailUrls: {
      normal: 'https://vacation.benepia.co.kr/frnt/mypage/main.do?mnuTopLevel=0&mnuLevel=0',
      hynix: 'TODO_HUGASHOP_HYNIX_DETAIL_URL'
    }
  }
}

export function getHeaderConfig(headerType) {
  return HEADER_CONFIGS[headerType] || HEADER_CONFIGS.benepia
}

export function getHeaderDetailUrl(headerType, companyType) {
  const config = getHeaderConfig(headerType)
  return config.detailUrls[companyType] || config.detailUrls.normal
}
