import React from "react";
import BannerDesktop from "assets/images/banner-desktop.webp";
import BannerTablet from "assets/images/banner-tablet.webp";
import BannerMobile from "assets/images/banner-mobile.webp";

export default function Banner() {
  return (
    <section className="banner">
      <picture>
        <source media="(min-width: 1280px)" srcSet={BannerDesktop} />
        <source media="(min-width: 768px)" srcSet={BannerTablet} />
        <img src={BannerMobile} alt="banner" />
      </picture>
      <div className="content">
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
      </div>
    </section>
  );
}
