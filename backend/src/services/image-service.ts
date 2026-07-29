

import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";


interface UploadedImage {
    originalname: string;
    buffer: Buffer;
}
class ImageService {

    private readonly productsImagesFolder = path.join(process.cwd(), "src", "assets", "images", "products");

    public async saveProductImage(image: UploadedImage): Promise<string> {
        
        const extension = path.extname(image.originalname);

        const fileName = randomUUID() + extension;

        const absolutePath = path.join(this.productsImagesFolder, fileName);

        await fs.writeFile(absolutePath, image.buffer);

        return fileName;
    }
}

export const imageService = new ImageService();