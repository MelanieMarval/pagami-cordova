import { Injectable } from '@angular/core';
// @ts-ignore
import imageCompression from 'browser-image-compression';

@Injectable({
    providedIn: 'root'
})
export class CompressImageProvider {

    constructor() {
    }


    static async handleImageUpload(isTest: boolean, image: any, name = 'pagami') {
        const imageFile = isTest ? image.target.files[0] : await imageCompression.getFilefromDataUrl(`data:image/jpg;base64,${image}`, name);
        const options = {
            maxSizeMB: 0.100,
            maxWidthOrHeight: 1020,
            onProgress: undefined,
        };
        try {
            return await imageCompression(imageFile, options);
        } catch (error) {
            console.log(error);
        }

    }


}

