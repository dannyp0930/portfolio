import React from 'react'

export default function Career() {
  const career_list = [
    {
      id: 1,
      companyName: '온오프믹스',
      position: '프론트엔드 개발자',
      period: '2023.02 ~ (재직중)',
      content: '종합 이벤트 비즈니스 플랫폼\n외주 프로젝트 작업 및 솔루션 개발',
      detail: [
        {
          id: 1,
          title: 'MICE 외주 프로젝트 서비스 개발 및 유지보수',
          content: [
            "회의, 컨벤션, 전시회 등의 산업 또는 행사 관련 서비스 프로젝트",
            "Vue.js, React, Jquery 등을 사용한 Javascript 기반 프론트엔드 서비스 개발",
            "Sass(SCSS), Tailwind CSS, Bootstrap 등을 사용한 CSS 스타일링",
            "Google, Kakao, Naver OAuth 로그인",
            "KCP 결제 모듈을 사용한 결제 서비스 구축",
            "Nginx 파일 압축 전송 및 캐싱을 통한 성능 최적화",
            "Docker 배포환경구축",
          ]
        },
        {
          id: 2,
          title: "Web CMS(가칭)",
          content: [
            "Headless CMS(Payload CMS)를 사용한 웹 서비스 제작 솔루션",
            "비개발자가 쉽게 홈페이지를 만들 수 있는 서비스",
            "Backend + Frontend + DB + Proxy 인스턴스로 이루어진 서버 구성",
            "React, Express.js 를 사용한 백엔드 서비스 개발",
            "Nuxt.js를 사용한 프론트엔드 컴포넌트 개발",
            "KCP 결제 모듈을 사용한 상품 결제 서비스",
          ]
        }
      ]
    }
    
  ];
  return (
    <section id="career" className="flex flex-col items-center justify-center gap-12 py-12 md:py-16 lg:py-28 bg-pale-beige">
      <h1>Career</h1>
      <ul className="flex flex-col gap-12">
        {career_list.map(item => <li key={item.id}>
          <h2>{item.companyName} <span className="text-sm">{item.period}</span></h2>
          <h3 className="mt-3">{item.position}</h3>
          <p className="mt-2 whitespace-pre-wrap">{item.content}</p>
          <ul className="flex flex-col gap-5 mt-10">
            {item.detail.map(detail => <li key={detail.id}>
              <h4>{detail.title}</h4>
              <ul className="mt-5 list-disc list-inside">
                {detail.content.map(content => <li key={content.id}>{content}</li>)}
              </ul>
            </li>)}
          </ul>
        </li>)}
      </ul>
    </section>
  )
}
