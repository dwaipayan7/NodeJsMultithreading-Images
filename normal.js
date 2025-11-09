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

    const tasks = [
        {
            name: 'thumbnail',
            operation: async () => {
                const cloned = image.clone()
                image.resize({ w: 150, h: 150 })
                await cloned.write(path.join(outputSubDirPath, 'thumbnail.jpg'))
            }
        },
        {
            name: 'medium',
            operation: async () => {
                const cloned = image.clone()
                image.resize({ w: 600, h: 600 })
                await cloned.write(path.join(outputSubDirPath, 'medium.jpg'))
            }
        },
        {
            name: 'large',
            operation: async () => {
                const cloned = image.clone()
                image.resize({ w: 1200, h: 1200 })
                await cloned.write(path.join(outputSubDirPath, 'large.jpg'))
            }
        },
        {
            name: 'grayscale',
            operation: async () => {
                const cloned = image.clone()
                // image.resize({ w: 1200, h: 1200 })
                cloned.greyscale();
                await cloned.write(path.join(outputSubDirPath, 'grayscale.jpg'))
            }
        },
        {
            name: 'blur',
            operation: async () => {
                const cloned = image.clone()
                // image.resize({ w: 1200, h: 1200 })
                cloned.blur(5);
                await cloned.write(path.join(outputSubDirPath, 'blur.jpg'))
            }
        },
    ]


    // image.resize({ w: 100 })

    for (const task of tasks) {
        await task.operation();
    }



}

async function main() {

    const files = await readdir(INPUT_DIR)
    const imageFiles = files.filter((file) => /\.jpg$/i.test(file));

    console.log(files);


    const startTime = Date.now();

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const filePath = path.join(INPUT_DIR, file)
        await processImage(filePath, file)
    }


    const totalTime = Date.now() - startTime;

    console.log('='.repeat(30));
    console.log('Normal Processing: ');
    console.log('='.repeat(30));
    console.log(`Total time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
    console.log('='.repeat(30));


    // await readdir()
    // const filePath = path.join(__dirname, 'input-images', 'sample-1.jpg')
    // await processImage(filePath, 'sample-1.jpg')
}


main()