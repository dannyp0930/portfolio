import React from "react";

export function ModalContainer({ closeModal, children }) {
  function stop(e) {
    e.stopPropagation();
  }
  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-dvw h-dvh bg-black/60" onClick={closeModal}>
      <div
        className="p-4 bg-white rounded-xl md:p-10 md:rounded-2xl"
        onClick={stop}
        dangerouslySetInnerHTML={{ __html: children }}
      ></div>
    </div>
  );
}
