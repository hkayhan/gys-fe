import React from 'react';
import Topbar from "@/components/topbar/TopbarComponent";
import SelectCategoryComp from "@/components/selectCategory/selectCategoryComp";

function SelectCategoryCont(props) {
    return (
        <div>

            <Topbar/>
            <SelectCategoryComp/>

        </div>
    );
}

export default SelectCategoryCont;
