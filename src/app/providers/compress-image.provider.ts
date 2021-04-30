import { Injectable } from '@angular/core';
// @ts-ignore
import imageCompression from 'browser-image-compression';
import { ImageCompressorService, CompressorConfig } from 'ngx-image-compressor';

const DEFAULT_WIDTH = 600;

@Injectable({
    providedIn: 'root',
})
export class CompressImageProvider {

    constructor(private imageCompressor: ImageCompressorService) {
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

    compressImage(isTest: boolean, image: any, name?: 'pagami'): Promise<{fileData: Blob | File, previewUrl: string | ArrayBuffer}> {
        return new Promise(async resolve => {

            console.log('-> image', image);
            if (isTest) {
                image = await imageCompression.getDataUrlFromFile(image.target.files[0]);
            } else {
                image = 'data:image/jpg;base64,' + image;
            }
            const im = new Image();
            im.src = image;
            im.onload = async () => {
                const width = im.width;

                if (width > DEFAULT_WIDTH) {
                    const ratio = (100 * DEFAULT_WIDTH) / width;
                    const imageFile = await imageCompression.getFilefromDataUrl(image, name);
                    console.log('-> imageFile', imageFile);

                    // Compress
                    const config: CompressorConfig = {orientation: 1, ratio, quality: 50, enableLogs: true};
                    const compressedFile: File = await this.imageCompressor.compressFile(imageFile, config);

                    const reader = new FileReader();
                    reader.readAsDataURL(compressedFile);
                    reader.onloadend = async () => {
                        resolve({fileData: compressedFile, previewUrl: reader.result});
                    };
                } else {
                    const imageFile = await imageCompression.getFilefromDataUrl(image, name);
                    const reader = new FileReader();
                    reader.readAsDataURL(imageFile);
                    reader.onloadend = async () => {
                        resolve({fileData: imageFile, previewUrl: reader.result});
                    };
                }
            };
        });
    }


}

