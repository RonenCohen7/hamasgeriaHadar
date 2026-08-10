

import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";


interface UploadedImage {
    originalname: string;
    buffer: Buffer;
}
class ImageService {

    // private readonly productsImagesFolder = path.join(process.cwd(), "src", "assets", "images", "products");

    private readonly productsImagesFolder = path.join(process.cwd(), "storage", "products");

    private readonly eventsImageFolder = path.join(process.cwd(), "storage", "events");

    

    //save images
    public async saveImage(folder:string,image: UploadedImage): Promise<string> {

        await fs.mkdir(folder, {recursive:true})

        const extension = path.extname(image.originalname);

        const fileName = randomUUID() + extension;

        await fs.writeFile(path.join(folder, fileName),image.buffer);

        return fileName;
    }



    //save product image
    public saveProductImage(image: UploadedImage):Promise<string>{
        return this.saveImage(this.productsImagesFolder, image)
    }

    //save event image
    public saveEventImage(image: UploadedImage):Promise<string>{
        return this.saveImage(this.eventsImageFolder,image)
    }
}

export const imageService = new ImageService();