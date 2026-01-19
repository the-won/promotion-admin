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
    bannerTitle: {
      label: '배너 타이틀',
      type: 'text',
      value: '배너 타이틀'
    },
    bannerImage: {
      label: '배너 이미지 URL',
      type: 'url',
      value: 'https://picsum.photos/600/400'
    },
    description: {
      label: '이벤트 설명',
      type: 'textarea',
      value: '이벤트 설명 내용입니다.',
      rows: 3
    },
    eventDate: {
      label: '이벤트 날짜',
      type: 'date',
      value: '2025-10-15'
    },
    actionText: {
      label: '액션 버튼 텍스트',
      type: 'text',
      value: '자세히 보기'
    },
    actionLink: {
      label: '액션 링크',
      type: 'url',
      value: '#'
    },
    themeColor: {
      label: '테마 색상',
      type: 'color',
      value: '#ff6b35'
    },
    bannerOpacity: {
      label: '배너 투명도',
      type: 'range',
      value: 100,
      min: 0,
      max: 100,
      step: 5,
      unit: '%'
    },

    imageLinkGroups: {
      label: '이미지 링크 그룹',
      type: 'image-link-group',
      value: [
        {
          id: 1,
          href: 'https://example.com/product1',
          targetBlank: true,
          images: [
            {
              id: 1,
              url: 'https://via.placeholder.com/630x300',
              alt: '상품 이미지 1'
            }
          ]
        },
        {
          id: 2,
          href: 'https://example.com/product2',
          targetBlank: true,
          images: [
            {
              id: 2,
              url: 'https://via.placeholder.com/630x200',
              alt: '상품 이미지 2'
            },
            {
              id: 3,
              url: 'https://via.placeholder.com/630x150',
              alt: '상품 이미지 3'
            }
          ]
        }
      ]
    } 


  },
  'em-type-3': {
    backgroundImage1: {
      label: '이미지 1 URL',
      type: 'url',
      value: 'https://d2odciwzsa8zjd.cloudfront.net/public/editorImage/202503/fbca6135-d59d-4be7-b483-6e2577e4e4c3.png'
    },
    backgroundImage2: {
      label: '이미지 2 URL',
      type: 'url',
      value: 'https://d2odciwzsa8zjd.cloudfront.net/public/editorImage/202503/fbca6135-d59d-4be7-b483-6e2577e4e4c3.png'
    },
    hotspots1: {
      label: '이미지 1 핫스팟',
      type: 'hotspot-group',
      value: [
        {
          id: 1,
          text: '지금 신청하기',
          href: 'https://example.com/apply',
          alt: '신청하기 버튼',
          title: '신청하기',
          position: {
            left: 30,
            top: 70,
            width: 30,
            height: 10
          }
        }
      ]
    },
    hotspots2: {
      label: '이미지 2 핫스팟',
      type: 'hotspot-group',
      value: [
        {
          id: 2,
          text: '더 알아보기',
          href: 'https://example.com/more',
          alt: '더보기 버튼',
          title: '더 알아보기',
          position: {
            left: 40,
            top: 60,
            width: 25,
            height: 10
          }
        }
      ]
    }
  },
  'em-type-4': {
    headerText: {
      label: '헤더 텍스트',
      type: 'text',
      value: '특별한 이벤트'
    },
    backgroundImage: {
      label: '배경 이미지 URL',
      type: 'url',
      value: 'https://d2odciwzsa8zjd.cloudfront.net/public/editorImage/202509/8dae3bd8-5e33-4d1c-af7e-3cdbc39b3b1a.png'
    },
    hotspots: {
      label: '클릭 가능한 버튼 영역',
      type: 'hotspot-list',
      value: [
        {
          id: 1,
          text: '지금 신청하기',
          href: 'https://example.com/apply',
          alt: '신청하기 버튼',
          position: {
            left: 30,
            top: 70,
            width: 30,
            height: 10
          }
        }
      ]
    },
    footerText: {
      label: '푸터 텍스트',
      type: 'text',
      value: '© 2025 회사명 All rights reserved.'
    }
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
      value: 'http://i.benepia.co.kr/ckeditor/2023/11/22/8D3218FBB6DF.Tomcat_117006390481290.jpg'
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
          imageUrl: '',
          imageAlt: ''
        },
        {
          id: 2,
          productId: '',
          imageUrl: '',
          imageAlt: ''
        },
        {
          id: 3,
          productId: '',
          imageUrl: '',
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
            { productId: '', imageUrl: '', imageAlt: '' },
            { productId: '', imageUrl: '', imageAlt: '' },
            { productId: '', imageUrl: '', imageAlt: '' }
          ]
        },
        {
          id: 2,
          products: [
            { productId: '', imageUrl: '', imageAlt: '' },
            { productId: '', imageUrl: '', imageAlt: '' },
            { productId: '', imageUrl: '', imageAlt: '' }
          ]
        },
        {
          id: 3,
          products: [
            { productId: '', imageUrl: '', imageAlt: '' },
            { productId: '', imageUrl: '', imageAlt: '' },
            { productId: '', imageUrl: '', imageAlt: '' }
          ]
        }
      ]
    }
  }

}