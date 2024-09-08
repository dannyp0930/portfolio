import React, { useEffect, useState } from "react";
import { ModalContainer } from "components/common/ModalContainer";

export default function Info() {
  const [selectItemIdx, setSelectItemIdx] = useState(0);
  const [selectItem, setSelectItem] = useState(null);

  function closeModal() {
    setSelectItemIdx(0);
    document.body.style.removeProperty("overflow");
  }

  useEffect(() => {
    if (selectItemIdx) {
      const item = document.querySelectorAll(`.content-wrap`)[selectItemIdx - 1];
      if (item) {
        document.body.style.overflow = "hidden";
        setSelectItem(item.innerHTML);
      } else {
        setSelectItem(null);
      }
    }
  }, [selectItemIdx]);

  return (
    <section className="info">
      {selectItemIdx ? (
        <ModalContainer
          closeModal={closeModal}
          children={selectItem}
        />
      ) : null}
      <div className="content-container">
        <div className="content-wrap" onClick={() => setSelectItemIdx(1)}>
          <h3>CONTACT</h3>
          <ul>
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
        <div className="content-wrap" onClick={() => setSelectItemIdx(2)}>
          <h3>EDUCATION</h3>
          <ul>
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
        <div className="content-wrap" onClick={() => setSelectItemIdx(3)}>
          <h3>EXPERIENCE</h3>
          <ul>
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
        <div className="content-wrap" onClick={() => setSelectItemIdx(4)}>
          <h3>CAREER</h3>
          <ul>
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
        <div className="content-wrap" onClick={() => setSelectItemIdx(5)}>
          <h3>LANGUAGE</h3>
          <ul>
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
        <div className="content-wrap" onClick={() => setSelectItemIdx(6)}>
          <h3>CERTIFICATE</h3>
          <ul>
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
