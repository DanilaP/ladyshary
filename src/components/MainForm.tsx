import React, { useEffect, useState, useRef } from 'react';
import './MainForm.scss';
import Characteristics from './Characteristisc/Characteristics';
import { CharacteristicType, StockInfo } from './Interfaces';
import axios from 'axios';
import ChooseSizesModal from './ChooseSizesModal/chooseSizeModal';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import { getCroppedImg, inputFileImageToBase64 } from './Cropper/cropFunctions';

function MainForm() {
    const [choosenPhotos, setChoosenPhotos] = useState<any[]>([]);
    const [productCard, setProductCard] = useState<CharacteristicType[]>([]);
    const [baseChars, setBaseChars] = useState<any>({categorysId: "Новинки"});
    const [categories, setCategories] = useState<any>();
    const [filesOfChoosenPhotos, setFilesOfChoosenPhotos] = useState<any[]>([]);
    
    //cropper States
    const [isCrop, setIsCrop] = useState<boolean>(false);
    const [crop, setCrop] = useState<Crop>({
        unit: 'px',
        x: 0,
        y: 0,
        width: 300,
        height: 465
    });
    const [image, setImage] = useState();
    const refTest = useRef(null);

    const handleAddImage = (element: any) => {
        console.log(element.target.files[0]);
        if (element.target.files && element.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
                setImage(() => e.target.result);
                setIsCrop(true);
            };
            reader.readAsDataURL(element.target.files[0]);
        }
    };
    const safePhoto = async () => {
        const croppedImg = await getCroppedImg(refTest.current, crop, 'cropped.jpeg');
        const file = await new File([croppedImg], "cropped.jpeg");
        setFilesOfChoosenPhotos([...filesOfChoosenPhotos, file]);

        let fr = new FileReader();
        fr.onload = function () {
            setChoosenPhotos([...choosenPhotos, fr.result])
        }
        fr.readAsDataURL(file);

        setIsCrop(false);
    }
    const uploadCharacteristics = (characteristics: CharacteristicType[]) => {
        setProductCard(characteristics);
    }
    const changeBaseChars = (newChar: StockInfo) => {
        setBaseChars({...baseChars, stockInfo: newChar});
    }
    const sendProdcutCard = async () => {
        let formData = new FormData;
        let newBaseChars: any = {
            articleNumber: baseChars.articleNumber,
            title: baseChars.title,
            categorysId: categories.filter((el: any) => el.title == baseChars.categorysId)[0].categoryId,
        }
        for (let i = 0; i < filesOfChoosenPhotos.length; i++) {
            formData.append("img" + `${i}`, filesOfChoosenPhotos[i]);
        }
        console.log(filesOfChoosenPhotos);
        for (let key in newBaseChars) {
            formData.append(key, newBaseChars[key]);
        }
        formData.append("stockInfo", JSON.stringify(baseChars.stockInfo));
        formData.append("specifications", JSON.stringify(productCard));

        await axios.post("https://lady-shery-egorplat.amvera.io/product/addProduct", formData)
        .then((res) => {
            console.log(res);
            //window.location.reload();
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
            <input type="file" onChange={handleAddImage} />
            { isCrop ? 
                <div className='cropper'>
                    <div className="cropper__content">
                        <div className='main__content'>
                            <ReactCrop crop={crop} onChange={setCrop} minWidth={300} minHeight={465} maxWidth={300}  maxHeight={465}>
                                <img src={image} ref={refTest} />
                            </ReactCrop>
                            <button onClick={safePhoto}>Сохранить фото</button>
                        </div> 
                    </div>
                </div>
                : null
            }
            <div className="photos">
                {choosenPhotos?.map((el, index) => {
                    return (
                        <div key={index} className="photo">
                            <img width={"100px"} height={"150px"} src = {el} />
                        </div>
                    )
                })}
            </div>
            <div className="base__characteristics">
                <input onChange={(e) => setBaseChars({...baseChars, articleNumber: e.target.value})} type = "text" placeholder='Артикул' />
                <input onChange={(e) => setBaseChars({...baseChars, title: e.target.value})} type = "text" placeholder='Название' />
                <select onChange={(e) => setBaseChars({...baseChars, categorysId: e.target.value})}>
                    {categories?.map((el: any, index: number) => {
                        return (
                            <option key = {index}>{el.title}</option>
                        )
                    })}
                </select>
            </div>
            <ChooseSizesModal changeBaseChars = {changeBaseChars} />
            <Characteristics uploadCharacteristics = {uploadCharacteristics} />
            <button className='upload__button' onClick={sendProdcutCard}>Загрузить товар в базу</button>
        </div>
    );
}

export default MainForm;
