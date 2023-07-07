import React from 'react';
import './chooseSizesModal.scss';
import { useState } from 'react';
import { StockInfo } from '../Interfaces';
import { useEffect } from 'react';

function ChooseSizesModal(props: {changeBaseChars: Function}) {
    const [stockInfo, setStockInfo] = useState<StockInfo[]>([]);
    
    const changeStockInfo = (index: number, size: string, stockCount: number) => {
        let newStockInfo = stockInfo;
        if (size !== "") {
            newStockInfo[index].size = size;
        }
        else if (stockCount !== 0) {
            newStockInfo[index].stockCount = stockCount;
        }
        setStockInfo(newStockInfo);
    }
    const deleteSize = (indexOfElement: number) => {
        let newSizes = stockInfo.filter((el, index) => index !== indexOfElement);
        setStockInfo(newSizes);
    }
    useEffect(() => {
        props.changeBaseChars(stockInfo);
    }, [stockInfo])
    return (
        <div className="choose__sizes__modal">
            <h3>Выбор размеров: </h3>
            <button onClick={() => setStockInfo([...stockInfo!, {size: "0", stockCount: 0}])}>Добавить размер</button>
            <div className="sizes">
                {stockInfo?.map((el, index) => {
                    return (
                        <div key={index} className='size'>
                            <input onChange={(e) => changeStockInfo(index, e.target.value, 0)} placeholder='Размер' />
                            <input onChange={(e) => changeStockInfo(index, "", Number(e.target.value))} placeholder='Количество товара' />
                            <div onClick={() => deleteSize(index)} className='delete__button'>x</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default ChooseSizesModal;
