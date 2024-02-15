import React from "react";

export default function Banner() {
  return (
    <section className="banner">
      <picture>
        <source media="(min-width: 1280px)"/>
        <source media="(min-width: 768px)" />
        <img src="" alt="banner" />
      </picture>
      <h1>
        박상훈
        <br />
        프론트엔드 엔지니어
      </h1>
      <p>
        안녕하세요.
        <br />
        저는 계획을 세우는 것을 좋아합니다.
        <br />
        사용자가 어떤 기능을 필요로 하는지 고민합니다.
      </p>
    </section>
  );
}
