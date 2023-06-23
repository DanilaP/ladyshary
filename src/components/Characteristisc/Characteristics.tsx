import React, { useEffect, useState } from 'react';
import './Characteristics.scss';
import { CharacteristicType } from '../Interfaces';

function Characteristics(props: {uploadCharacteristics: Function}) {

    const [characteristics, setCharacteristics] = useState<CharacteristicType[]>([
        {title: "Страна производства", value: ""},
        {title: "Размер", value: ""},
        {title: "Цвет", value: ""},
    ]);

    const addCharactaristic = () => {
        setCharacteristics([...characteristics, {title: "", value: ""}]);
    }
    const changeCharacteristicValue = (name: string, value: string, index: number) => {
        let newCharacteristics = characteristics;
        if (name !== "") {
            newCharacteristics[index].title = name;
        }
        else {
            newCharacteristics[index].value = value;
        }
    }
    const deleteCharacteristic = (indexOfElement: number) => {
        let newChars = characteristics.filter((el, index) => index !== indexOfElement);
        setCharacteristics(newChars);
    }
    useEffect(() => {
        props.uploadCharacteristics(characteristics);
    }, [characteristics])
    return (
        <div className="characteristics">
            <h3>Выберите характеристики товара</h3>
            <button onClick={addCharactaristic}>Добавить характеристику</button>
            <div className="list">
            {
                characteristics.map((el, index) => {
                    return (
                        <div key = {index} className='char'>
                            <div className='characteristic__name'>
                                <input onChange={(e) => changeCharacteristicValue(e.target.value, "", index)} 
                                placeholder={el.title !== "" ? `${el.title}` : 'Наименование'}/>
                            </div>
                            <div className='characteristic__value'> 
                                <input onChange={(e) => changeCharacteristicValue("", e.target.value, index)} 
                                placeholder={el.value !== "" ? `${el.value}` : 'Значение'}/>
                            </div>
                            <div onClick={() => deleteCharacteristic(index)} className="delete__button">x</div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    );
}

export default Characteristics;
