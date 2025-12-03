import React from 'react';

export default function Modal({ open, onClose, title, children, width = 640 }){
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth: width}} onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
