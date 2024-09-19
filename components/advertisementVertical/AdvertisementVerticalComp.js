import React from 'react';
import styles from './AdvertisementVertical.module.css'

function AdvertisementVerticalComp(props) {
        const {location}=props
    return (
        <div className={`${styles['']} container mainContent  p-2  d-none d-lg-block `}>
            <div className="border h-100">
                reklam alanı
                <br/>{location}

            </div>
        </div>

    );
}

export default AdvertisementVerticalComp;