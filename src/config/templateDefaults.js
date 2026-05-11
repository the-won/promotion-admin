import { privacyPolicyDefaults } from './privacyDefaults.js'

export const templateDefaults = {
  'privacy-policy': privacyPolicyDefaults,
  'em-type-1': {
    title: {
      label: '이벤트 타이틀',
      type: 'text',
      tab: '기본',
      value: '이벤트 타이틀',
      placeholder: '타이틀을 입력하세요'
    },
    subtitle: {
      label: '이벤트 부제목',
      type: 'text',
      tab: '기본',
      value: '이벤트 부제목'
    },
    heroImage: {
      label: '히어로 이미지 URL',
      type: 'url',
      tab: '기본',
      value: 'https://picsum.photos/500/300'
    },
    footerText: {
      label: '푸터 텍스트',
      type: 'text',
      tab: '기본',
      value: '© 2025 회사명 All rights reserved.'
    },
    mainHeading: {
      label: '메인 문구',
      type: 'text',
      tab: '콘텐츠',
      value: '메인 문구'
    },
    mainText: {
      label: '본문 내용',
      type: 'textarea',
      tab: '콘텐츠',
      value: '여기에 본문 내용이 들어갑니다.',
      rows: 4
    },
    buttonText: {
      label: '버튼 텍스트',
      type: 'text',
      tab: '콘텐츠',
      value: '지금 참여하기'
    },
    buttonLink: {
      label: '버튼 링크',
      type: 'url',
      tab: '콘텐츠',
      value: '#'
    },
    buttonColor: {
      label: '버튼 색상',
      type: 'color',
      tab: '스타일',
      value: '#007bff'
    }
  },
  'em-type-2': {
    folderName: {
      label: '폴더명 (ZIP 파일명)',
      type: 'text',
      tab: '기본',
      value: ''
    },
    companyType: {
      label: '도메인',
      type: 'select',
      tab: '기본',
      value: 'normal',
      options: [
        { value: 'normal', label: 'TOBE' },
        { value: 'hynix', label: 'HYNIX' }
      ]
    },
    headerType: {
      label: '헤더 유형',
      type: 'select',
      tab: '기본',
      value: 'benepia',
      options: [
        { value: 'benepia', label: '베네피아' },
        { value: 'hugashop', label: '휴가샵' }
      ]
    },
    sendDate: {
      label: '발송일 기준',
      type: 'date-picker',
      tab: '기본',
      value: {
        year: '2026',
        month: '01',
        day: '01'
      }
    },
    imageLinkGroups: {
      label: '이미지 링크 그룹',
      type: 'image-link-group',
      tab: '이미지',
      value: [
        {
          id: 'grp_t2_001',
          href: '',
          linkType: 'custom',
          linkData: {
            planCode: '',
            productCode: '',
            webEventCode: '',
            mobileEventCode: '',
            searchKeyword: '',
            customUrl: ''
          },
          images: [
            {
              id: 'img_t2_001',
              url: 'https://picsum.photos/id/20/720/300',
              alt: ''
            },
          
          ]
        },
      ]
    } 
  },
  'event-imagelink': {
    folderName: {
      label: 'Zip 폴더 이름',
      type: 'text',
      tab: '기본',
      placeholder: '폴더명을 입력하세요',
      value: ''
    },
    pageTitle: {
      label: '페이지 타이틀',
      type: 'text',
      tab: '기본',
      placeholder: '이벤트 이미지 링크',
      value: '이벤트 이미지 링크'
    },
    showTopBanner: {
      label: '상단 배너 사용',
      type: 'checkbox',
      tab: '설정',
      value: true
    },
    showBottomBanner: {
      label: '하단 배너 사용',
      type: 'checkbox',
      tab: '설정',
      value: true
    },
    showNotice: {
      label: '공지사항 사용',
      type: 'checkbox',
      tab: '설정',
      value: false
    },
    noticeTitle: {
      label: '공지사항 제목',
      type: 'text',
      tab: '설정',
      fullWidth: true,
      showWhen: 'showNotice',
      value: '꼭 확인하세요'
    },
    noticeItems: {
      label: '공지사항 항목',
      type: 'notice-items',
      tab: '설정',
      showWhen: 'showNotice',
      value: []
    },
    imageLinkGroups: {
      label: '이미지 링크 그룹',
      type: 'event-image-link-group',
      tab: '이미지링크',
      value: [
        {
          id: 'grp_el_001',
          images: [
            { id: 'img_el_001', url: 'https://org-i.benepia.co.kr/ckeditor/2026/04/29/d5dbf950-0954-4be6-8587-2b48ca13c57e.jpg', fileName: '', alt: '묶어야 진짜 할인 e쿠폰통합권 출시' }
          ],
          web: {
            linkType: 'plan',
            useLink: false,
            linkData: { code: '', webEventCode: '', mobileEventCode: '', webPartnerCode: '', mobilePartnerCode: '', returnUrl: '', url: '', brandSubType: 'ecoupon', couponType: 'single', couponCodes: '', keyword: '' }
          },
          mobile: {
            linkType: 'plan',
            linkData: { code: '', webEventCode: '', mobileEventCode: '', webPartnerCode: '', mobilePartnerCode: '', returnUrl: '', url: '', brandSubType: 'ecoupon', couponType: 'single', couponCodes: '', keyword: '' }
          }
        }
      ]
    }
  },
  'em-type-3': {
    folderName: {
      label: 'Zip 폴더 이름',
      type: 'text',
      tab: '기본',
      placeholder: '폴더명을 적어주세요',
      value: ''
    },
    pageTitle: {
      label: '페이지 타이틀',
      type: 'text',
      tab: '기본',
      placeholder: '클래스101 신년 프로모션',
      value: '클래스101 신년 프로모션'
    },
    showTopBanner: {
      label: '상단 배너 사용',
      type: 'checkbox',
      tab: '설정',
      value: true
    },
    showBottomBanner: {
      label: '하단 배너 사용',
      type: 'checkbox',
      tab: '설정',
      value: true
    },
    showNotice: {
      label: '공지사항 사용',
      type: 'checkbox',
      tab: '설정',
      value: true
    },
    noticeTitle: {
      label: '공지사항 제목',
      type: 'text',
      tab: '설정',
      fullWidth: true,
      showWhen: 'showNotice',
      value: '꼭 확인하세요'
    },
    noticeItems: {
      label: '공지사항 항목',
      type: 'notice-items',
      tab: '설정',
      showWhen: 'showNotice',
      value: [
        '이용권 할인은 베네피아에서 e쿠폰 구매 시에만 적용됩니다.',
        "구매하신 e쿠폰은 '마이페이지 > 나의 e쿠폰함'에서 확인하실 수 있습니다.",
        '본 이벤트는 제휴사의 사정에 의해 예고 없이 중단 또는 변경될 수 있습니다.'
      ]
    },
    hotspotGroups: {
      label: '이미지 + 핫스팟 그룹',
      type: 'hotspot-group-list',
      tab: '이미지맵',
      value: [
        {
          id: 'hg_t3_001',
          webImageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/04/29/d5dbf950-0954-4be6-8587-2b48ca13c57e.jpg',
          webImageAlt: '웹 이미지 설명',
          mobileImageUrl: '',
          mobileImageAlt: '',
          hotspots: [
          
          ]
        },
        {
          id: 'hg_t3_002',
          webImageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/04/30/aff5fac6-cb27-4707-ab3d-a63503af7c40.jpg',
          webImageAlt: '웹 이미지 설명',
          mobileImageUrl: '',
          mobileImageAlt: '',
          hotspots: [
            {
              id: 'hs_t3_002',
              alt: '더보기 버튼',
              position: { left: 40, top: 5, width: 25, height: 10 },
              web: {
                linkType: 'plan',
                useLink: false,
                linkData: { code: '', webEventCode: '', mobileEventCode: '', webPartnerCode: '', mobilePartnerCode: '', returnUrl: '', url: '', couponType: 'single', couponCodes: '', keyword: '' }
              },
              mobile: {
                linkType: 'plan',
                linkData: { code: '', webEventCode: '', mobileEventCode: '', webPartnerCode: '', mobilePartnerCode: '', returnUrl: '', url: '', couponType: 'single', couponCodes: '', keyword: '' }
              }
            }
          ]
        }
      ]
    }
  },
  'em-type-4': {
    globalDomain: {
      label: '도메인',
      type: 'text',
      tab: '기본',
      placeholder: 'www, sema, happy, victory 등',
      value: 'www'
    },
    sendDate: {
      label: '발송일 기준',
      type: 'date-picker',
      tab: '기본',
      value: {
        year: '2026',
        month: '01',
        day: '01'
      }
    },
    _div_t4_header: {
      type: 'divider',
      label: '헤더 이미지',
      tab: '기본'
    },
    headerImage: {
      label: '상단 이미지 URL',
      type: 'url',
      tab: '기본',
      value: 'https://www.efamilyshop.co.kr/storage/fud/20250513/visual_20250513162322.jpg'
    },
    headerImageAlt: {
      label: '상단 이미지 대체 텍스트',
      type: 'text',
      tab: '기본',
      value: '대체텍스트를 작성하세요'
    },
    headerImageCode: {
      label: '상단 이미지 링크 - 상품코드',
      type: 'text',
      tab: '기본',
      value: '3515'
    },
    productGroups: {
      label: '상품 그룹',
      type: 'product-group-list',
      tab: '상품',
      value: [
        {
          id: 'pg_t4_001',
          titleImage: {
            url: 'http://www.efamilyshop.co.kr/storage/fud/20250414/tit_01_20250414144147.jpg',
            alt: '지금이 운동할 시기!'
          },
          rows: [
            {
              id: 'row_t4_001',
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
              id: 'row_t4_002',
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
          id: 'pg_t4_002',
          titleImage: {
            url: 'https://www.efamilyshop.co.kr/storage/fud/20250513/tit_02_20250513162322.jpg',
            alt: '지금이 운동할 시기!'
          },
          rows: [
            {
              id: 'row_t4_003',
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
              id: 'row_t4_004',
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
    _uploader_t4: {
      type: 'efamily-uploader',
      tab: '업로드',
      label: '일괄 업로드'
    },
    banners: {
      label: '하단 배너',
      type: 'banner-list',
      tab: '배너',
      value: [
        {
          id: 'bn_t4_001',
          eventCode: '3664',
          imageUrl: 'http://www.efamilyshop.co.kr/storage/fud/20250910/bn_01_20250910134541.jpg',
          imageAlt: '주방가전&용품 기획전'
        },
        {
          id: 'bn_t4_002',
          eventCode: '3662',
          imageUrl: 'http://www.efamilyshop.co.kr/storage/fud/20250910/bn_02_20250910134541.jpg',
          imageAlt: '맞춤선물 기획전'
        }
      ]
    },
  },
  // 최저가보상
  'em-type-5': {
    companyType: {
      label: '도메인',
      type: 'select',
      tab: '기본',
      value: 'normal',
      options: [
        { value: 'normal', label: 'TOBE' },
        { value: 'hynix', label: 'HYNIX' }
      ]
    },
    sendDate: {
      label: '발송일 기준',
      type: 'date-picker',
      tab: '기본',
      value: {
        year: '2026',
        month: '01',
        day: '01'
      }
    },
    _div_t5_header: {
      type: 'divider',
      label: '헤더 이미지',
      tab: '기본'
    },
    headerImage: {
      label: '화끈딜 상단 이미지 URL',
      type: 'url',
      tab: '기본',
      value: 'http://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683655605400.png'
    },
    headerImageAlt: {
      label: '상단 이미지 대체 텍스트',
      type: 'text',
      tab: '기본',
      value: '베네피아 5대혜택 - 이번주 최저가 상품! /최저가보상/무료반품/배송지연보상/할인쿠폰/경품증정'
    },
    row1Products: {
      label: '화끈딜 1단 상품',
      type: 'hotdeal-row1-list',
      tab: '상품',
      value: [
        {
          id: 'r1_t5_001',
          productId: '',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683659390510.jpg',
          imageAlt: ''
        },
        {
          id: 'r1_t5_002',
          productId: '',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683659732240.jpg',
          imageAlt: ''
        },
        {
          id: 'r1_t5_003',
          productId: '',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683659880240.jpg',
          imageAlt: ''
        }
      ]
    },
    row3Products: {
      label: '화끈딜 3단 상품',
      type: 'hotdeal-row3-list',
      tab: '상품',
      value: [
        {
          id: 'r3_t5_001',
          products: [
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683660127530.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683660315160.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683660511750.jpg', imageAlt: '' }
          ]
        },
        {
          id: 'r3_t5_002',
          products: [
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683660668020.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683660833360.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683661799670.jpg', imageAlt: '' }
          ]
        },
        {
          id: 'r3_t5_003',
          products: [
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683661348310.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683661060470.jpg', imageAlt: '' },
            { productId: '', imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2026/01/14/8B63F328B909.Tomcat_117683661568600.jpg', imageAlt: '' }
          ]
        }
      ]
    },
    _uploader_t5: {
      type: 'hotdeal-uploader',
      tab: '업로드',
      label: '일괄 업로드'
    }
  },

  'em-type-familysale': {
    folderName: {
      label: 'Zip 폴더 이름',
      type: 'text',
      tab: '기본',
      value: ''
    },
    companyType: {
      label: '도메인',
      type: 'select',
      tab: '기본',
      value: 'normal',
      options: [
        { value: 'normal', label: 'TOBE' },
        { value: 'hynix', label: 'HYNIX' }
      ]
    },
    sendDate: {
      label: '발송일 기준',
      type: 'date-picker',
      tab: '기본',
      value: {
        year: '2026',
        month: '01',
        day: '01'
      }
    },
    _div_fs_header: {
      type: 'divider',
      label: '헤더 이미지',
      tab: '기본'
    },
    headerImage: {
      label: '상단 이미지 URL',
      type: 'url',
      tab: '기본',
      value: ''
    },
    headerImageAlt: {
      label: '상단 이미지 대체텍스트',
      type: 'text',
      tab: '기본',
      value: ''
    },
    productGroups: {
      label: '상품 그룹',
      type: 'family-sale-group',
      tab: '상품',
      value: [
        {
          id: 'pg_fs_001',
          titleImage: { url: '', alt: '' },
          products: [
            { productCode: '', imageUrl: '', imageAlt: '' },
            { productCode: '', imageUrl: '', imageAlt: '' },
            { productCode: '', imageUrl: '', imageAlt: '' },
            { productCode: '', imageUrl: '', imageAlt: '' },
            { productCode: '', imageUrl: '', imageAlt: '' }
          ]
        }
      ]
    }
  },

  // 이미지맵 템플릿형
  'em-type-imagemap': {
    folderName: {
      label: '폴더명 (ZIP 파일명)',
      type: 'text',
      tab: '기본',
      value: ''
    },
    companyType: {
      label: '도메인',
      type: 'select',
      tab: '기본',
      value: 'normal',
      options: [
        { value: 'normal', label: 'TOBE' },
        { value: 'hynix', label: 'HYNIX' }
      ]
    },
    headerType: {
      label: '헤더 유형',
      type: 'select',
      tab: '기본',
      value: 'benepia',
      options: [
        { value: 'benepia', label: '베네피아' },
        { value: 'hugashop', label: '휴가샵' }
      ]
    },
    sendDate: {
      label: '발송일 기준',
      type: 'date-picker',
      tab: '기본',
      value: {
        year: '2026',
        month: '01',
        day: '01'
      }
    },
    imageMapRows: {
      label: '이미지 행 목록',
      type: 'image-map-rows',
      tab: '이미지맵',
      value: [
        {
          id: 'imr_map_001',
          imageUrl: 'https://picsum.photos/id/30/720/300',
          width: 720,
          height: 300,
          imageAlt: '',
          mapName: 'mapContents01'
        }
        
      ]
    },
    imageMapAreas: {
      label: '핫스팟 목록',
      type: 'image-map-areas',
      tab: '이미지맵',
      value: [
      
      ]
    }
  },
  // 이미지맵 템플릿형2
  'em-type-imagemap2': {
    companyType: {
      label: '도메인',
      type: 'select',
      tab: '기본',
      value: 'normal',
      options: [
        { value: 'normal', label: 'TOBE' },
        { value: 'hynix', label: 'HYNIX' }
      ]
    },
    headerType: {
      label: '헤더 유형',
      type: 'select',
      tab: '기본',
      value: 'benepia',
      options: [
        { value: 'benepia', label: '베네피아' },
        { value: 'hugashop', label: '휴가샵' }
      ]
    },
    sendDate: {
      label: '발송일 기준',
      type: 'date-picker',
      tab: '기본',
      value: {
        year: '2026',
        month: '01',
        day: '01'
      }
    },
    imageMapRows: {
      label: '이미지 행 목록',
      type: 'image-map-rows-2',
      tab: '이미지맵',
      value: [
        {
          id: 'imr_map_001',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654295328570.jpg',
          width: 720,
          height: 280,
          imageAlt: '[News01] 따뜻한 진심을 담은 연말 선물',
          mapName: 'mapContents01'
        },
        {
          id: 'imr_map_002',
          imageUrl: 'http://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654296464950.jpg',
          width: 720,
          height: 1478,
          imageAlt: '[News01] 따뜻한 진심을 담은 연말 선물',
          mapName: 'mapContents02'
        },
        {
          id: 'imr_map_003',
          imageUrl: 'http://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654297755070.jpg',
          width: 720,
          height: 1155,
          imageAlt: '[News02] 겨울에 즐기는 따뜻한 홈파티',
          mapName: 'mapContents03'
        },
        {
          id: 'imr_map_004',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654297899630.jpg',
          width: 720,
          height: 1461,
          imageAlt: '[News02] 겨울에 즐기는 따뜻한 홈파티',
          mapName: 'mapContents04'
        },
        {
          id: 'imr_map_005',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/08/11/866100976AD2.Tomcat_117548786243380.jpg',
          width: 720,
          height: 250,
          imageAlt: '[News02] 겨울에 즐기는 따뜻한 홈파티',
          mapName: 'mapContents05'
        },
        {
          id: 'imr_map_006',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/08/11/866100976AD2.Tomcat_117548786439870.jpg',
          width: 720,
          height: 453,
          imageAlt: '[News02] 겨울에 즐기는 따뜻한 홈파티',
          mapName: 'mapContents06'
        }
      ]
    },
    imageMapAreas: {
      label: '핫스팟 목록',
      type: 'image-map-areas',
      tab: '이미지맵',
      value: [
        {
          id: 'ima_map_001',
          rowId: 'imr_map_002',
          href: 'https://example.com/beauty',
          alt: '홀리데이 뷰티 기프트 기획전',
          coords: { x1: 60, y1: 349, x2: 660, y2: 853 }
        },
        {
          id: 'ima_map_002',
          rowId: 'imr_map_002',
          href: 'https://example.com/health',
          alt: '베스트 건강가전 선물 기획전',
          coords: { x1: 60, y1: 893, x2: 660, y2: 1397 }
        },
        {
          id: 'ima_map_003',
          rowId: 'imr_map_003',
          href: 'https://example.com/tree',
          alt: '크리스마스 트리 기획전',
          coords: { x1: 411, y1: 397, x2: 639, y2: 624 }
        },
        {
          id: 'ima_map_004',
          rowId: 'imr_map_003',
          href: 'https://example.com/food',
          alt: '홈파티 간편식 기획전',
          coords: { x1: 77, y1: 686, x2: 305, y2: 914 }
        }
      ]
    }
  },
  // 쿠폰혜택
  'em-type-coupon': {
    folderName: {
      label: '폴더명 (ZIP 파일명)',
      type: 'text',
      tab: '기본',
      value: ''
    },
    companyType: {
      label: '도메인',
      type: 'select',
      tab: '기본',
      value: 'normal',
      options: [
        { value: 'normal', label: 'TOBE' },
        { value: 'hynix', label: 'HYNIX' }
      ]
    },
    sendDate: {
      label: '발송일 기준',
      type: 'date-picker',
      tab: '기본',
      value: {
        year: '2026',
        month: '01',
        day: '01'
      }
    },
    imageLinkGroups: {
      label: '이미지 링크 그룹',
      type: 'image-link-group',
      tab: '이미지',
      value: [
        {
          id: 'grp_cpn_001',
          href: 'https://example.com/product1',
          linkType: 'custom',
          linkData: {
            planCode: '',
            productCode: '',
            webEventCode: '',
            mobileEventCode: '',
            searchKeyword: '',
            customUrl: 'https://example.com/product1'
          },
          images: [
            {
              id: 'img_cpn_001',
              url: 'http://10.71.101.60:13305/Promotion/2025%EB%85%84/20251031_BENEPRO-3522_11%EC%9B%94%20%EC%BF%A0%ED%8F%B0%ED%98%9C%ED%83%9D%20EM/EM/images/img_top_benepia.jpg',
              alt: '11월 혜택이 쏟아진다! 쿠폰혜택'
            },
            {
              id: 'img_cpn_002',
              url: 'http://10.71.101.60:13305/Promotion/2025%EB%85%84/20251031_BENEPRO-3522_11%EC%9B%94%20%EC%BF%A0%ED%8F%B0%ED%98%9C%ED%83%9D%20EM/EM/images/img_01.jpg',
              alt: '브랜드 한정 특가/진행중인 이벤트/놓치면 아까운 여행 특집/인기급상승 e쿠폰 - 자세히 보기'
            },
          ]
        },
      ]
    } 
  },
  // 베네레터
  'em-type-letter': {
    folderName: {
      label: '폴더명 (ZIP 파일명)',
      type: 'text',
      tab: '기본',
      value: ''
    },
    companyType: {
      label: '도메인',
      type: 'select',
      tab: '기본',
      value: 'normal',
      options: [
        { value: 'normal', label: 'TOBE' },
        { value: 'hynix', label: 'HYNIX' }
      ]
    },
    headerType: {
      label: '헤더 유형',
      type: 'select',
      tab: '기본',
      value: 'benepia',
      options: [
        { value: 'benepia', label: '베네피아' },
        { value: 'hugashop', label: '휴가샵' }
      ]
    },
    sendDate: {
      label: '발송일 기준',
      type: 'date-picker',
      tab: '기본',
      value: {
        year: '2026',
        month: '01',
        day: '01'
      }
    },
    imageMapRows: {
      label: '이미지 행 목록',
      type: 'image-map-rows',
      tab: '이미지맵',
      value: [
        {
          id: 'imr_ltr_001',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654295328570.jpg',
          width: 720,
          height: 280,
          imageAlt: '[',
          mapName: 'mapContents01'
        },
        {
          id: 'imr_ltr_002',
          imageUrl: 'http://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654296464950.jpg',
          width: 720,
          height: 1478,
          imageAlt: '[News01] 따뜻한 진심을 담은 연말 선물',
          mapName: 'mapContents02'
        },
        {
          id: 'imr_ltr_003',
          imageUrl: 'http://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654297755070.jpg',
          width: 720,
          height: 1155,
          imageAlt: '[News02] 겨울에 즐기는 따뜻한 홈파티',
          mapName: 'mapContents03'
        },
        {
          id: 'imr_ltr_004',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654297899630.jpg',
          width: 720,
          height: 1461,
          imageAlt: '',
          mapName: 'mapContents04'
        },
        {
          id: 'imr_ltr_005',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654298063530.jpg',
          width: 720,
          height: 1082,
          imageAlt: '',
          mapName: 'mapContents05'
        },
        {
          id: 'imr_ltr_006',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654298209700.jpg',
          width: 720,
          height: 1826,
          imageAlt: '',
          mapName: 'mapContents06'
        },
        {
          id: 'imr_ltr_007',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654298339750.jpg',
          width: 720,
          height: 786,
          imageAlt: '',
          mapName: 'mapContents06'
        },
        {
          id: 'imr_ltr_008',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/12/11/BB588B647500.Tomcat_117654298491240.jpg',
          width: 720,
          height: 491,
          imageAlt: '',
          mapName: 'mapContents07'
        },
         {
          id: 'imr_ltr_009',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/08/11/866100976AD2.Tomcat_117548786243380.jpg',
          width: 720,
          height: 250,
          imageAlt: '',
          mapName: 'mapContents08'
        },
        {
          id: 'imr_ltr_010',
          imageUrl: 'https://org-i.benepia.co.kr/ckeditor/2025/08/11/866100976AD2.Tomcat_117548786439870.jpg',
          width: 720,
          height: 453,
          imageAlt: '',
          mapName: ''
        }
      ]
    },
    imageMapAreas: {
      label: '핫스팟 목록',
      type: 'image-map-areas',
      tab: '이미지맵',
      value: [
        {
          id: 'ima_ltr_001',
          rowId: 'imr_ltr_002',
          href: 'https://example.com/beauty',
          alt: '홀리데이 뷰티 기프트 기획전',
          coords: { x1: 60, y1: 349, x2: 660, y2: 853 }
        },
        {
          id: 'ima_ltr_002',
          rowId: 'imr_ltr_002',
          href: 'https://example.com/health',
          alt: '베스트 건강가전 선물 기획전',
          coords: { x1: 60, y1: 893, x2: 660, y2: 1397 }
        },
        {
          id: 'ima_ltr_003',
          rowId: 'imr_ltr_003',
          href: 'https://example.com/tree',
          alt: '크리스마스 트리 기획전',
          coords: { x1: 411, y1: 397, x2: 639, y2: 624 }
        },
        {
          id: 'ima_ltr_004',
          rowId: 'imr_ltr_003',
          href: 'https://example.com/food',
          alt: '홈파티 간편식 기획전',
          coords: { x1: 77, y1: 686, x2: 305, y2: 914 }
        },
        {
          id: 'ima_ltr_005',
          rowId: 'imr_ltr_004',
          href: '',
          alt: '',
          coords: { x1: 61, y1: 348, x2: 661, y2: 670 }
        },
        {
          id: 'ima_ltr_006',
          rowId: 'imr_ltr_005',
          href: '',
          alt: '',
          coords: { x1: 58, y1: 349, x2: 661, y2: 1012 }
        },
        {
          id: 'ima_ltr_007',
          rowId: 'imr_ltr_006',
          href: '',
          alt: '',
          coords: { x1: 45, y1: 498, x2: 679, y2: 748 }
        },
        {
          id: 'ima_ltr_008',
          rowId: 'imr_ltr_007',
          href: '',
          alt: '',
          coords: { x1: 27, y1: 147, x2: 688, y2: 329 }
        },
        {
          id: 'ima_ltr_009',
          rowId: 'imr_ltr_008',
          href: '',
          alt: '',
          coords: { x1: 98, y1: 198, x2: 220, y2: 262 }
        },
        {
          id: 'ima_ltr_010',
          rowId: 'imr_ltr_009',
          href: '',
          alt: '',
          coords: { x1: 31, y1: 28, x2: 690, y2: 207 }
        },
      
      ]
    }
  }
}