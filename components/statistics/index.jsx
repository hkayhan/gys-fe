import React from 'react';
import styles from './style.module.css'

function Statistics(props) {
    return (
        <section className={styles['statisticsMain'] + " container-xl "}>
            <div className=" text-center d-flex">
                {/*<div className="row ">*/}
                    <div className={styles['statisticsMainItem']+ " col-6  d-flex flex-column shadow"}>
                        <h2>+7.550</h2>
                        <h6>Farklı Soru</h6>
                    </div>
                    <div className={styles['statisticsMainItem']+ " col-6  d-flex flex-column shadow"}>
                        <h2>+17.550</h2>
                        <h6>Sınava Hazırlanan</h6>
                    </div>
                {/*</div>*/}
            </div>
        </section>

    )
        ;
}

export default Statistics;