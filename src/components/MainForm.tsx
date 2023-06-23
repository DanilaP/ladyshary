import React, { useEffect, useState } from 'react';
import './MainForm.scss';
import Characteristics from './Characteristisc/Characteristics';
import { CharacteristicType } from './Interfaces';
import axios from 'axios';

function MainForm() {
    const [choosenPhotos, setChoosenPhotos] = useState<string[]>([]);
    const [productCard, setProductCard] = useState<CharacteristicType[]>([]);
    const [baseChars, setBaseChars] = useState<any>({});
    const [categories, setCategories] = useState<any>();
    const [filesOfChoosenPhotos, setFilesOfChoosenPhotos] = useState<FileList | null>();

    const choosePhotos = (photos: FileList | null) => {
        let imagesURL: string[] = [];
        for (let i = 0; i < photos!.length; i++) {
            let image = URL.createObjectURL(photos![i]);
            imagesURL = [...imagesURL, image];
        }
        setFilesOfChoosenPhotos(photos);
        setChoosenPhotos(imagesURL);
    }
    const uploadCharacteristics = (characteristics: CharacteristicType[]) => {
        setProductCard(characteristics);
    }
    const sendProdcutCard = async () => {
        let formData = new FormData;
        let newBaseChars: any = {
            articleNumber: baseChars.articleNumber,
            title: baseChars.title,
            categorysId: categories.filter((el: any) => el.title == baseChars.categorysId)[0].categoryId,
            specifications: productCard,
            stockNumber: Number(baseChars.stockNumber),
        }
        console.log(newBaseChars);
        for (let i = 0; i < filesOfChoosenPhotos!.length; i++) {
            formData.append(`img` + `${i}`, filesOfChoosenPhotos![i]);
        }
        for (let key in newBaseChars) {
            formData.append(key, newBaseChars[key]);
        }
        await axios.post("https://lady-shery-egorplat.amvera.io/product/addProduct", formData)
        .then((res) => {
            console.log(res);
            window.location.reload();
        })
        .catch((err) => {
            console.log(err);
        })
    }
    useEffect(() => {
        axios.get("https://lady-shery-egorplat.amvera.io/category/getCategorys")
        .then((res) => {
            setCategories(res.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])
    return (
        <div className="main__form">
            <input onChange={(e) => choosePhotos(e.target.files)} type = "file" accept="image/gif, image/jpeg, image/png" multiple />
            <div className="photos">
                {choosenPhotos?.map((el, index) => {
                    return (
                        <div key={index} className="photo">
                            <img width={"100px"} height={"100px"} src = {el} />
                        </div>
                    )
                })}
            </div>
            <div className="base__characteristics">
                <input onChange={(e) => setBaseChars({...baseChars, articleNumber: e.target.value})} type = "text" placeholder='Артикул' />
                <input onChange={(e) => setBaseChars({...baseChars, title: e.target.value})} type = "text" placeholder='Название' />
                <input onChange={(e) => setBaseChars({...baseChars, stockNumber: e.target.value})} type = "text" placeholder='Количество на складе' />
                <select onChange={(e) => setBaseChars({...baseChars, categorysId: e.target.value})}>
                    {categories?.map((el: any, index: number) => {
                        return (
                            <option key = {index}>{el.title}</option>
                        )
                    })}
                </select>
            </div>
            <Characteristics uploadCharacteristics = {uploadCharacteristics} />
            <button className='upload__button' onClick={sendProdcutCard}>Загрузить товар в базу</button>
        </div>
    );
}

export default MainForm;