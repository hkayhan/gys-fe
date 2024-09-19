import React, {useEffect, useState} from 'react';
import {AdminGetRequest} from "@/services/admin";
import swal from "sweetalert2";
import Select from 'react-select'

const SelectBox = ({apiUrl, name, onChange,defaultValue, firstOption}) => {
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState(defaultValue || "");

    useEffect(() => {
        const fetchData = async () => {
            const res = await AdminGetRequest(apiUrl)
            if (res.errorMessage) {
                await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
                return
            }

      /*      console.log(res)
            const transformedOptions = res?.result.map((item) => ({
                value: item.id,
                label: item.name,
            }));

            setOptions(transformedOptions);*/
            console.log(res.result);
            setOptions(res.result)
            if (defaultValue) {
                setSelectedValue(defaultValue); // Varsayılan değeri set ediyoruz
            }else if (res?.result.length===1){
                setFirst(res?.result[0].id); // Varsayılan değeri set ediyoruz

            }
        };


        fetchData();
    }, [apiUrl]);

    const handleChange = (event) => {
        // const selectedValue = event.target.value;
        const selectedValue = parseInt(event.target.value, 10);

        setSelectedValue(selectedValue); // Seçili değeri state'de tutuyoruz
        onChange(name, selectedValue); // name'i ve seçilen değeri geri döndürüyoruz.
    };

    const setFirst=(value)=>{
        setSelectedValue(value); // Seçili değeri state'de tutuyoruz
        onChange(name, value); // name'i ve seçilen değeri geri döndürüyoruz.

    }

    return (
        <>
            <select name={name} onChange={handleChange} value={selectedValue} className={"form-select"}>
                <option value={0 }>{firstOption?firstOption:"Seçiniz"}</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name?option.name  :option.value}
                    </option>
                ))}
            </select>
        </>


        // <Select
        //     name={name} onChange={handleChange}
        //     placeholder="Seçim Türü"
        //     options={options}/>
    );
};

export default SelectBox;
