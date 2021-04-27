
const puppeteer = require('puppeteer')
const ewelink = require('ewelink-api');
const Zeroconf = require('ewelink-api/src/classes/Zeroconf');

//  id of the device to toggle
const id = '10008562ea';

// whether to use lan mode or through internet
const lan_mode = true;
// initial guess for device in lab mode
var device_state = true;

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', () => {
        process.stdin.setRawMode(false)
        resolve()
    }))
}

const main = async () => {
    var connection = null;
    if (lan_mode){
        /* load cache files */
        const devicesCache = await Zeroconf.loadCachedDevices();
        const arpTable = await Zeroconf.loadArpTable();
    
        /* create the connection using cache files */
        connection = new ewelink({ devicesCache, arpTable });
    }
    else{
        // fil it with your info and read password from env variable
        connection = new ewelink({
            email: 'candres.alv@gmail.com',
            password: process.env.PASSWORD,
            region: 'us',
        });
        const region = await connection.getRegion();
        console.log(region);
    }

    const browser = await puppeteer.launch({
        args: ['--use-fake-ui-for-media-stream'], headless: true
    })
    const page = await browser.newPage()
    await page.goto('file://' + __dirname + '/index.html')

    var detection_timestamp = Date.now();
    var prediction_count = 0;

    page.on('console', async msg => {
        // console.log('PAGE LOG:', msg.text());
        if (msg.text().includes("Prediction")) {
            prediction_count++;
        }
        // Ignore first predictions that are noisy
        if (prediction_count < 10) {
            return;
        }
        
        if (msg.text().includes("TOGGLE")) {
            // if >2 consecutive detections in less than 1 secs, ignore
            if (Date.now() - detection_timestamp < 1000) {
                console.log("Ignoring repeated detection");
                return;
            }

            console.log("Toggling device!");
            detection_timestamp = Date.now();

            if (!lan_mode){
                /* toggle device */
                await connection.toggleDevice(id);
            }
            else{ // in lan mode, the ewelink api doesn't support toggleDevice method
                const set_state = device_state ? 'on' : 'off'
                await connection.setDevicePowerState(id, set_state);
                device_state = !device_state;  
            }
        }
    });

    await page.evaluate(() => console.log(`url is ${location.href}`));


    console.log("Starting service, to exit press any key")
    await keypress();
    console.log("Finishing")

    return browser.close()
}

main().then(process.exit)