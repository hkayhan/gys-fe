import React, { useState } from 'react';

const useSelectedItems = () => {
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelect = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const removeAndAdd = (newItems, oldItems) => {

        const filtered = selectedItems.filter(id => !oldItems.includes(id));
        setSelectedItems([...filtered, newItems]);

        /*if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }*/
    };

    const handleSelectMultiple = (items) => {
/*
        let newArr=[]
        items.forEach(i=>{
            newArr.push(i.propertyId)
        })
*/
        setSelectedItems(items)

/*
        //console.log(newArr)
*/
        // if (selectedItems.includes(item)) {
        //     setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        // } else {
        //     setSelectedItems([...selectedItems, item]);
        // }
    };
    const clearItems = () => {
/*
        let newArr=[]
        items.forEach(i=>{
            newArr.push(i.propertyId)
        })
*/
        setSelectedItems([])

/*
        //console.log(newArr)
*/
        // if (selectedItems.includes(item)) {
        //     setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        // } else {
        //     setSelectedItems([...selectedItems, item]);
        // }
    };

    return [selectedItems, handleSelect, handleSelectMultiple,removeAndAdd,clearItems];
};

export default useSelectedItems;
