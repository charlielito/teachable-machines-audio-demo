
const puppeteer = require('puppeteer')

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
        process.stdin.setRawMode(false)
        resolve()
    }))
}

const main = async () => {
    const browser = await puppeteer.launch({
        args: ['--use-fake-ui-for-media-stream'], headless: true
    })
    const page = await browser.newPage()
    await page.goto('file:///Users/carlosalvarez/data/charlie/audio/index.html')
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.evaluate(() => console.log(`url is ${location.href}`));


    console.log("Starting service, to exit press any key")
    await keypress();
    console.log("Finishing")

    return browser.close()

}

main().then(process.exit)