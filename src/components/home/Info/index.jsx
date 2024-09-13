import React, { useEffect, useState } from "react";
import { ModalContainer } from "components/common/ModalContainer";

export default function Info() {
  const [selectItemIdx, setSelectItemIdx] = useState(0);
  const [selectItem, setSelectItem] = useState(null);

  function closeModal() {
    setSelectItemIdx(0);
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
    document.body.style.removeProperty("touch-action");
  }

  function scrollWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }

  useEffect(() => {
    if (selectItemIdx) {
      const item = document
        .querySelectorAll(`.content-wrap`)
        [selectItemIdx - 1].cloneNode(true);
      item.querySelector("ul").classList.remove("hidden");
      if (item) {
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "pan-x";
        document.body.style.paddingRight = `${scrollWidth()}px`
        setSelectItem(item.innerHTML);
      } else {
        setSelectItem(null);
      }
    }
  }, [selectItemIdx]);

  return (
    <section id="info" className="flex items-center justify-center py-12 md:py-16 lg:py-28">
      {selectItemIdx ? (
        <ModalContainer closeModal={closeModal} children={selectItem} />
      ) : null}
      <div className="grid grid-cols-1 grid-rows-6 gap-5 w-72 md:w-3/4 md:grid-cols-2 md:grid-rows-3 md:gap-10 lg:w-1/2">
        <div
          className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
          onClick={() => setSelectItemIdx(1)}
        >
          <h3 className="text-center">CONTACT</h3>
          <ul className="hidden mt-3">
            <li>
              <h4>E-mail</h4>
              <p>
                <a href="mailto:dannyp0930@gmail.com">dannyp0930@gmail.com</a>
                <br />
                <a href="mailto:dannyp0930@daum.net">dannyp0930@daum.net</a>
              </p>
            </li>
            <li>
              <h4>Phone</h4>
              <p>
                <a href="tel:010-8890-9708">010-8890-9708</a>
              </p>
            </li>
          </ul>
        </div>
        <div
          className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
          onClick={() => setSelectItemIdx(2)}
        >
          <h3 className="text-center">EDUCATION</h3>
          <ul className="hidden mt-3">
            <li>
              <h4>광주 금호고등학교</h4>
              <p>2011.03 ~ 2014.02</p>
            </li>
            <li>
              <h4>중앙대학교 기계공학부 기계공학전공</h4>
              <p>2014.03 ~ 2020.02</p>
            </li>
          </ul>
        </div>
        <div
          className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
          onClick={() => setSelectItemIdx(3)}
        >
          <h3 className="text-center">EXPERIENCE</h3>
          <ul className="hidden mt-3">
            <li>
              <h4>삼성청년SW아카데미(SSAFY)</h4>
              <p>
                2021.07 ~ 2022.06
                <br />
                프로젝트 중심의 학습 및 실습
              </p>
            </li>
          </ul>
        </div>
        <div
          className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
          onClick={() => setSelectItemIdx(4)}
        >
          <h3 className="text-center">CAREER</h3>
          <ul className="hidden mt-3">
            <li>
              <h4>한국교통안전공단 인턴</h4>
              <p>
                2018.09.20 ~ 2018.12.31
                <br />
                서울본부안전사업2처
                <br />
                기계식주차장검사업무보조
              </p>
            </li>
            <li>
              <h4>온오프믹스</h4>
              <p>
                2023.02.22 ~
                <br />
                개발팀
                <br />
                프론트엔드엔지니어
              </p>
            </li>
          </ul>
        </div>
        <div
          className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
          onClick={() => setSelectItemIdx(5)}
        >
          <h3 className="text-center">LANGUAGE</h3>
          <ul className="hidden mt-3">
            <li>
              <h4>TOEIC 885</h4>
              <p>2023.11.12 YBM시사</p>
            </li>
            <li>
              <h4>JLPT N1</h4>
              <p>2021.08.09 국제교류기금</p>
            </li>
          </ul>
        </div>
        <div
          className="box-border flex flex-col p-5 bg-white rounded-lg shadow-lg cursor-pointer content-wrap lg:transition-transform lg:hover:-translate-y-5"
          onClick={() => setSelectItemIdx(6)}
        >
          <h3 className="text-center">CERTIFICATE</h3>
          <ul className="hidden mt-3">
            <li>
              <h4>한자능력검정시험 2급</h4>
              <p>2008.09.02 (사)한국어문회</p>
            </li>
            <li>
              <h4>한국사능력검정시험 1급</h4>
              <p>2016.08.30 국사편찬위원회</p>
            </li>
            <li>
              <h4>컴퓨터활용능력 1급</h4>
              <p>2017.04.07 대한상공회의소</p>
            </li>
            <li>
              <h4>일반기계기사</h4>
              <p>2018.08.17 한국산업인력공단</p>
            </li>
            <li>
              <h4>SQLD(SQL 개발자)</h4>
              <p>2021.10.01 한국데이터산업진흥원</p>
            </li>
            <li>
              <h4>정보처리기사</h4>
              <p>2022.09.02 한국산업인력공단</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
