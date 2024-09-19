import React from 'react';
import styles from './Loading.module.css'
import './Loading.css'

function LoadingComp(props) {
    const {text}=props
    return (
        <div className={`${styles['']} container mainContent d-flex justify-content-center align-items-center`}>
            <div className="loading-container">
                <div className="loading"></div>
                <div id="loading-text">{text?text:"yükleniyor"}</div>
            </div>

        </div>

    );
}

export default LoadingComp;