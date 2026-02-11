export const templateDefaults = {
  'em-type-1': {
    title: {
      label: '이벤트 타이틀',
      type: 'text',
      value: '이벤트 타이틀',
      placeholder: '타이틀을 입력하세요'
    },
    subtitle: {
      label: '이벤트 부제목',
      type: 'text',
      value: '이벤트 부제목'
    },
    heroImage: {
      label: '히어로 이미지 URL',
      type: 'url',
      value: 'https://picsum.photos/500/300'
    },
    mainHeading: {
      label: '메인 문구',
      type: 'text',
      value: '메인 문구'
    },
    mainText: {
      label: '본문 내용',
      type: 'textarea',
      value: '여기에 본문 내용이 들어갑니다.',
      rows: 4
    },
    buttonText: {
      label: '버튼 텍스트',
      type: 'text',
      value: '지금 참여하기'
    },
    buttonLink: {
      label: '버튼 링크',
      type: 'url',
      value: '#'
    },
    buttonColor: {
      label: '버튼 색상',
      type: 'color',
      value: '#007bff'
    },
    footerText: {
      label: '푸터 텍스트',
      type: 'text',
      value: '© 2025 회사명 All rights reserved.'
    }
  },
  'em-type-2': {
    
    imageLinkGroups: {
      label: '이미지 링크 그룹',
      type: 'image-link-group',
      value: [
        {
          id: 1,
          href: 'https://example.com/product1',
          linkType: 'custom',  // 👈 추가
          linkData: {  // 👈 이미 있음 (Good!)
            planCode: '',
            productCode: '',
            webEventCode: '',
            mobileEventCode: '',
            searchKeyword: '',
            customUrl: 'https://example.com/product1'  // 👈 기본값 추가
          },
          images: [
            {
              id: 1,
              url: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654295328570.jpg',
              alt: '상품 이미지 1'
            },
            {
              id: 2,
              url: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654296464950.jpg',
              alt: '상품 이미지 1'
            },

          ]
        },
      ]
    } 


  },
  'em-type-3': {
   
    
  },
  'em-type-4': {
    // 전역 도메인
    globalDomain: {
      label: '도메인',
      type: 'text',
      placeholder: 'sema, www, happy, victory 등',
      value: 'sema'
    },
    headerImage: {
      label: '상단 이미지 URL',
      type: 'url',
      value: 'https://www.efamilyshop.co.kr/storage/fud/20250513/visual_20250513162322.jpg'
    },
    headerImageAlt: {
      label: '상단 이미지 대체 텍스트',
      type: 'text',
      value: '대체텍스트를 작성하세요'
    },
    headerImageCode: {
      label: '상단 이미지 링크 - 상품코드',
      type: 'text',
      value: '3515'
    },

    productGroups: {
      label: '상품 그룹',
      type: 'product-group-list',
      value: [
        {
          id: 1,
          titleImage: {
            url: 'http://www.efamilyshop.co.kr/storage/fud/20250414/tit_01_20250414144147.jpg',
            alt: '지금이 운동할 시기!'
          },
          rows: [
            {
              id: 101,
              products: [
                { 
                  productCode: 'GD2024183099', 
                  imageUrl: 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_1_20250414144147.jpg', 
                  imageAlt: '프로-스펙스 밸런스쿠션 33cm 자세교정 스트레칭 돌기' 
                },
                { 
                  productCode: '', 
                  imageUrl: 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_2_20250414144147.jpg', 
                  imageAlt: '프로-스펙스 땅콩 마사지볼 실리콘재질 NON-SLIP' 
                },
                { 
                  productCode: '', 
                  imageUrl: 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_3_20250414144147.jpg', 
                  imageAlt: '프로-스펙스 안티버스트 짐볼 55cm 스트레칭 요가 임산부' 
                }
              ]
            },
            {
              id: 102,
              products: [
                { 
                  productCode: '', 
                  imageUrl: 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_4_20250414144147.jpg', 
                  imageAlt: '프로-스펙스 S라인체중계 디지털 저울 다이어트' 
                },
                { 
                  productCode: '', 
                  imageUrl: 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_5_20250414144147.jpg', 
                  imageAlt: '프로-스펙스 멀티 짐볼 65cm  스트레칭 요가 임산부' 
                },
                { 
                  productCode: '', 
                  imageUrl: 'http://www.efamilyshop.co.kr/storage/fud/20250414/item_01_6_20250414144147.jpg', 
                  imageAlt: '( Ez-Hula Fit ) 스마트 훌라후프 / 조립식 홈트 스마트 실내 뱃살 다이어트' 
                }
              ]
            }
          ]
        },
        {
          id: 2,
          titleImage: {
            url: 'https://www.efamilyshop.co.kr/storage/fud/20250513/tit_02_20250513162322.jpg',
            alt: '지금이 운동할 시기!'
          },
          rows: [
            {
              id: 101,
              products: [
                { 
                  productCode: 'G9', 
                  imageUrl: 'https://www.efamilyshop.co.kr/storage/fud/20250513/item_02_1_20250513162322.jpg', 
                  imageAlt: '' 
                },
                { 
                  productCode: '', 
                  imageUrl: 'https://www.efamilyshop.co.kr/storage/fud/20250513/item_02_2_20250513162322.jpg', 
                  imageAlt: '' 
                },
                { 
                  productCode: '', 
                  imageUrl: 'https://www.efamilyshop.co.kr/storage/fud/20250513/item_02_3_20250513162322.jpg', 
                  imageAlt: '' 
                }
              ]
            },
            {
              id: 102,
              products: [
                { 
                  productCode: '', 
                  imageUrl: 'https://www.efamilyshop.co.kr/storage/fud/20250513/item_02_4_20250513162322.jpg', 
                  imageAlt: '' 
                },
                { 
                  productCode: '', 
                  imageUrl: 'https://www.efamilyshop.co.kr/storage/fud/20250513/item_02_5_20250513162322.jpg', 
                  imageAlt: '' 
                },
                { 
                  productCode: '', 
                  imageUrl: 'https://www.efamilyshop.co.kr/storage/fud/20250513/item_02_6_20250513162322.jpg', 
                  imageAlt: '' 
                }
              ]
            }
          ]
        }
      ]
    },
    banners: {
      label: '하단 배너',
      type: 'banner-list',
      value: [
        {
          id: 1,
          eventCode: '3664',
          imageUrl: 'http://www.efamilyshop.co.kr/storage/fud/20250910/bn_01_20250910134541.jpg',
          imageAlt: '주방가전&용품 기획전'
        },
        {
          id: 2,
          eventCode: '3662',
          imageUrl: 'http://www.efamilyshop.co.kr/storage/fud/20250910/bn_02_20250910134541.jpg',
          imageAlt: '맞춤선물 기획전'
        }
      ]
    },
    
  },

  'em-type-5': {
    companyType: {
      label: '도메인',
      type: 'select',
      value: 'normal',
      options: [
        { value: 'normal', label: 'TOBE' },
        { value: 'hynix', label: 'HYNIX' }
      ]
    },
    sendDate: {
      label: '발송일 기준',
      type: 'date-picker',
      value: {
        year: '2025',
        month: '01',
        day: '01'
      }
    },
    headerImage: {
      label: '화끈딜 상단 이미지 URL',
      type: 'url',
      value: 'http://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683655605400.png'
    },
    headerImageAlt: {
      label: '상단 이미지 대체 텍스트',
      type: 'text',
      value: '베네피아 5대혜택 - 이번주 최저가 상품! /최저가보상/무료반품/배송지연보상/할인쿠폰/경품증정'
    },
    row1Products: {
      label: '화끈딜 1단 상품',
      type: 'hotdeal-row1-list',
      value: [
        {
          id: 1,
          productId: '',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683659390510.jpg',
          imageAlt: ''
        },
        {
          id: 2,
          productId: '',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683659732240.jpg',
          imageAlt: ''
        },
        {
          id: 3,
          productId: '',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683659880240.jpg',
          imageAlt: ''
        }
      ]
    },
    row3Products: {
      label: '화끈딜 3단 상품',
      type: 'hotdeal-row3-list',
      value: [
        {
          id: 1,
          products: [
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683660127530.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683660315160.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683660511750.jpg', imageAlt: '' }
          ]
        },
        {
          id: 2,
          products: [
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683660668020.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683660833360.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683661799670.jpg', imageAlt: '' }
          ]
        },
        {
          id: 3,
          products: [
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683661348310.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683661060470.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683661568600.jpg', imageAlt: '' }
          ]
        }
      ]
    }
  },
  
  // templateDefaults.js 파일에 추가할 내용
  // 새로운 템플릿 타입 (예: em-type-7) 또는 기존 타입에 추가

  // templateDefaults.js 파일에 추가할 내용

  'em-type-imagemap': {
     companyType: {
      label: '도메인',
      type: 'select',
      value: 'normal',
      options: [
        { value: 'normal', label: 'TOBE' },
        { value: 'hynix', label: 'HYNIX' }
      ]
    },
    sendDate: {
      label: '발송일 기준',
      type: 'date-picker',
      value: {
        year: '2026',
        month: '01',
        day: '01'
      }
    },
    imageMapRows: {
      label: '이미지 행 목록',
      type: 'image-map-rows',
      value: [
         {
          id: 1,
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654295328570.jpg',
          width: 720,
          height: 280,
          imageAlt: '[News01] 따뜻한 진심을 담은 연말 선물',
          mapName: 'mapContents01'
        },
        {
          id: 2,
          imageUrl: 'http://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654296464950.jpg',
          width: 720,
          height: 1478,
          imageAlt: '[News01] 따뜻한 진심을 담은 연말 선물',
          mapName: 'mapContents02'
        },
        {
          id: 3,
          imageUrl: 'http://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654297755070.jpg',
          width: 720,
          height: 1155,
          imageAlt: '[News02] 겨울에 즐기는 따뜻한 홈파티',
          mapName: 'mapContents03'
        },
        {
          id: 4,
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654297899630.jpg',
          width: 720,
          height: 1461,
          imageAlt: '[News02] 겨울에 즐기는 따뜻한 홈파티',
          mapName: 'mapContents04'
        },
        {
          id: 5,
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/08/11/866100976AD2.Tomcat_117548786243380.jpg',
          width: 720,
          height: 250,
          imageAlt: '[News02] 겨울에 즐기는 따뜻한 홈파티',
          mapName: 'mapContents05'
        },
        {
          id: 6,
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/08/11/866100976AD2.Tomcat_117548786439870.jpg',
          width: 720,
          height: 453,
          imageAlt: '[News02] 겨울에 즐기는 따뜻한 홈파티',
          mapName: 'mapContents02'
        }
      ]
    },
    imageMapAreas: {
      label: '핫스팟 목록',
      type: 'image-map-areas',
      value: [
        {
          id: 1,
          rowId: 2,
          href: 'https://example.com/beauty',
          alt: '홀리데이 뷰티 기프트 기획전',
          coords: { x1: 60, y1: 349, x2: 660, y2: 853 }
        },
        {
          id: 2,
          rowId: 2,
          href: 'https://example.com/health',
          alt: '베스트 건강가전 선물 기획전',
          coords: { x1: 60, y1: 893, x2: 660, y2: 1397 }
        },
        {
          id: 3,
          rowId: 3,
          href: 'https://example.com/tree',
          alt: '크리스마스 트리 기획전',
          coords: { x1: 411, y1: 397, x2: 639, y2: 624 }
        },
        {
          id: 4,
          rowId: 3,
          href: 'https://example.com/food',
          alt: '홈파티 간편식 기획전',
          coords: { x1: 77, y1: 686, x2: 305, y2: 914 }
        }
      ]
    }
  }
}