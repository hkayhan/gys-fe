import React from 'react';
import styles from './AddAdvertSteps.module.css'

function AddAdvertStepsComp({count}) {
    return (
        <div className={`${styles['']} w-100 d-flex justify-content-center my-1`}>
            <div
                className={`${styles['stepsStep']} d-flex flex-column justify-content-center align-items-center   ${count === 1 && styles['stepsStepActive']} ${count > 1 && styles['stepsStepChecked']}`}>
                <div className={`${styles['stepsNumber']}  `}>1</div>
                <div className={`${styles['stepsText']} text-decoration`}> Kategori Seçimi</div>
            </div>

            <div className={`${count>1 ? styles['stepsStepCheckedLine']: styles['stepsStepLine']} `}></div>
            <div
                className={`${styles['stepsStep']} d-flex flex-column justify-content-center align-items-center   ${count === 2 && styles['stepsStepActive']} ${count > 2 && styles['stepsStepChecked']}`}>
                <div className={`${styles['stepsNumber']}  bg-secondary `}>2</div>
                <div className={`${styles['stepsText']} text-decoration`}> Temel Bilgiler</div>
            </div>

            <div className={`${count>2 ? styles['stepsStepCheckedLine']: styles['stepsStepLine']} `}></div>
            <div
                className={`${styles['stepsStep']} d-flex flex-column justify-content-center align-items-center   ${count === 3 && styles['stepsStepActive']} ${count > 3 && styles['stepsStepChecked']}`}>
                <div className={`${styles['stepsNumber']}  bg-secondary `}>3</div>
                <div className={`${styles['stepsText']} text-decoration`}> İlan Özellikleri</div>
            </div>

            <div className={`${count>3 ? styles['stepsStepCheckedLine']: styles['stepsStepLine']} `}></div>
            <div
                className={`${styles['stepsStep']} d-flex flex-column justify-content-center align-items-center   ${count === 4 && styles['stepsStepActive']} ${count > 4 && styles['stepsStepChecked']}`}>
                <div className={`${styles['stepsNumber']}  bg-secondary `}>4</div>
                <div className={`${styles['stepsText']} text-decoration`}> Önizleme</div>
            </div>

            <div className={`${count>4 ? styles['stepsStepCheckedLine']: styles['stepsStepLine']} `}></div>
            <div
                className={`${styles['stepsStep']} d-flex flex-column justify-content-center align-items-center   ${count === 5 && styles['stepsStepActive']} ${count > 5 && styles['stepsStepChecked']}`}>
                <div className={`${styles['stepsNumber']}  bg-secondary `}>5</div>
                <div className={`${styles['stepsText']} text-decoration`}> Ödeme</div>
            </div>


        </div>

    );
}

export default AddAdvertStepsComp;