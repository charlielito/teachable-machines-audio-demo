
const puppeteer = require('puppeteer')
const ewelink = require('ewelink-api');

//  id of the device to toogle
const id = '10008562ea';

// fil it with your info and read password from env variable
const connection = new ewelink({
    email: 'candres.alv@gmail.com',
    password: process.env.PASSWORD,
    region: 'us',
});

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
        process.stdin.setRawMode(false)
        resolve()
    }))
}

const main = async () => {

    const region = await connection.getRegion();
    console.log(region);

    const browser = await puppeteer.launch({
        args: ['--use-fake-ui-for-media-stream'], headless: true
    })
    const page = await browser.newPage()
    await page.goto('file://' + __dirname + '/index.html')

    page.on('console', async msg => {
        console.log('PAGE LOG:', msg.text());
        if (msg.text().includes("TOOGLE")) {
            console.log("Eureka");
            /* toggle device */
            await connection.toggleDevice(id);
        }
    });

    await page.evaluate(() => console.log(`url is ${location.href}`));


    console.log("Starting service, to exit press any key")
    await keypress();
    console.log("Finishing")

    return browser.close()

}


main().then(process.exit)