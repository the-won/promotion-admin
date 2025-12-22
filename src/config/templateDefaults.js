

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
    }
  },
  'em-type-3': {
    headerText: {
      label: '헤더 텍스트',
      type: 'text',
      value: '헤더 텍스트'
    },
    bodyContent: {
      label: '본문 내용',
      type: 'textarea',
      value: '본문 내용',
      rows: 5
    },
    ctaText: {
      label: 'CTA 버튼',
      type: 'text',
      value: 'CTA 버튼'
    },
    ctaLink: {
      label: 'CTA 링크',
      type: 'url',
      value: '#'
    },
    alignment: {
      label: '정렬',
      type: 'select',
      value: 'center',
      options: [
        { value: 'left', label: '왼쪽' },
        { value: 'center', label: '가운데' },
        { value: 'right', label: '오른쪽' }
      ]
    },
    fontSize: {
      label: '폰트 크기',
      type: 'radio',
      value: 'medium',
      options: [
        { value: 'small', label: '작게' },
        { value: 'medium', label: '보통' },
        { value: 'large', label: '크게' }
      ]
    },
    backgroundImage: {
      label: '배경 이미지 URL',
      type: 'url',
      value: 'https://d2odciwzsa8zjd.cloudfront.net/public/editorImage/202503/fbca6135-d59d-4be7-b483-6e2577e4e4c3.png'
    },
    buttonText: {
      label: '버튼 텍스트',
      type: 'text',
      value: '지금 신청하기'
    },
    buttonLink: {
      label: '버튼 링크',
      type: 'url',
      value: '#'
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
  }
}