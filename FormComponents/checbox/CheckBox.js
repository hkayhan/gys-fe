import React from 'react';

function CheckBox({ label, value,name, onChange }) {
    return (
        <label className="form-check-label">
            <input
                className="form-check-input"
                type="checkbox"
                name={name}
                checked={value}
                onChange={onChange}
            />
            &nbsp; {label}</label>
/*        <div>
            {/!*<label className="labels">{label}</label>*!/}
            {/!*<div className={"form-check col-12 col-md-4"}>*!/}
                {/!*{//console.log(r)}*!/}

                <label className="form-check-label">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name={name}
                        checked={value}
                        onChange={onChange}
                    />
                    {label}</label>

            {/!*</div>*!/}
        </div>*/
    );
}

export default CheckBox;
