import React from "react";

export function ModalContainer({ closeModal, children }) {
  function stop(e) {
    e.stopPropagation();
  }
  return (
    <div className="modal-container" onClick={closeModal}>
      <div
        className="modal-wrap"
        onClick={stop}
        dangerouslySetInnerHTML={{ __html: children }}
      ></div>
    </div>
  );
}
