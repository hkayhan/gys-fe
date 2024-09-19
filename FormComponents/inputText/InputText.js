import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";
import styles from './inputText.module.css'
function InputText({ label, value,name,error,icon,type, onChange }) {


    useEffect(()=>{
        let timer;

        document.addEventListener('input', e => {
            const el = e.target;

            if( el.matches('[data-color]') ) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    document.documentElement.style.setProperty(`--color-${el.dataset.color}`, el.value);
                }, 100)
            }
        })
    },[])

    return (
        <div className={`${styles['form-group']} `}>
            {/*<label className={`${styles['label']} `}>{icon&&<FontAwesomeIcon icon={icon}/>}</label>*/}
            {/*<input*/}
            {/*    type={type?type:"text"}*/}
            {/*    className={`${styles['input']} ${error&&"border-danger"}`}*/}
            {/*    placeholder={label}*/}
            {/*    value={value?value:""}*/}
            {/*    name={name}*/}
            {/*    onChange={onChange}*/}
            {/*>*/}


            {/*</input>*/}

            {/*{error&&<div className={"text-danger"}>{error}</div>}*/}


            <div className={`${styles['form__group']} ${styles['field']} `}>
                <input type={type?type:"text"}
                       className={`${styles['form__field']} ${error && "border-danger"}\`}`}
                       placeholder={label}
                       name={name}
                       value={value?value:""}
                       onChange={onChange}
                       id={name}
                />
                <label htmlFor={name}
                       className={`${styles['form__label']} `}>{label}</label>
            </div>
            {error&&<div className={`${styles['horizontal-shake']} text-danger text-start`}>{error}</div>}

        </div>
    );
}

export default InputText;