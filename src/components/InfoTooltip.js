import React from 'react';

function InfoTooltip({ isOpen, onClose, title, icon }) {
    return (
        <div className={`popup popup-tool ${isOpen ? 'popup_opened' : false}`}>
            <div className="popup__container">
                <button className="popup__close-button" type="button" onClick={onClose}></button>
                <img className="popup__tool-logo" src={icon} alt="Лого статус" />
                <h3 className="popup__title popup__title_small">{title}</h3>
            </div>
        </div>
    );
}

export default InfoTooltip;
