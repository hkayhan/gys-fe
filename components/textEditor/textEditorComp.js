import React from 'react';
import styles from './textEditor.module.css'
import {CKEditor} from 'ckeditor4-react';

function TextEditorComp(props) {
    const {value, name, onChange, height} = props

    const handleChange = (e) => {
        //console.log(e.editor.getData());
    };

    return (
        <div className={`${styles['textEditorMain']} h-50 p-1`} >
            <CKEditor


                initData={value}
                name={name}
                onChange={onChange}
                config={{
                    versionCheck: false,
                }}/>
        </div>
    );
}

export default TextEditorComp;