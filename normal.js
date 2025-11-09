import { Jimp } from 'jimp'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir, readdir } from 'fs/promises'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_DIR = path.join(__dirname, 'normal-output');
const INPUT_DIR = path.join(__dirname, 'input-images');


async function processImage(imagePath, fileName) {

    const outputSubDirPath = path.join(OUTPUT_DIR, fileName.split('.')[0]);

    await mkdir(outputSubDirPath, { recursive: true })

    const image = await Jimp.read(imagePath);

    image.resize({ w: 100 })

    await image.write(path.join(outputSubDirPath, 'resize.jpg'))


}

async function main() {

    const files = await readdir(INPUT_DIR)
    const imageFiles = files.filter((file) => /\.jpg$/i.test(file));

    console.log(files);


    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const filePath = path.join(INPUT_DIR, file)
        await processImage(filePath, file)
    }


    // await readdir()
    // const filePath = path.join(__dirname, 'input-images', 'sample-1.jpg')
    // await processImage(filePath, 'sample-1.jpg')
}


main()