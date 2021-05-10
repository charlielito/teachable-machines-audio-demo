
const puppeteer = require('puppeteer')
const ewelink = require('ewelink-api');
const Zeroconf = require('ewelink-api/src/classes/Zeroconf');
const yargs = require('yargs');

const argv = yargs
    .option('email', {
        alias: 'e',
        description: 'Ewelink registered email',
    })
    .option('password', {
        alias: 'p',
        description: 'Ewelink account password',
    })
    .default("region", "us") //  ewelink account region
    .boolean("lan")
    .boolean("debug")
    .default("deviceid", "XXXX") //  id of the device to toggle
    .default("toggle_class", "Class 2") //  name class to toggle
    .default("threshold", 0.8) //  threshold score to toggle
    .help()
    .alias('help', 'h')
    .argv;

// console.log(argv);

// id of the device to toggle
const id = argv.deviceid;

// whether to use lan mode or through internet
const lan_mode = 'lan' in argv? argv.lan: false;

// whether to debug all messages from chromium
const debug = 'debug' in argv? argv.lan: false;

// initial guess for device in lan mode
var device_state = true;

// name of the class detected that toggles the device
const toggle_class = argv.toggle_class;

// confidence threshold for prediction to toggle device
const THRESHOLD = argv.threshold;

// Password for account
var password = argv.password;
if (!("password" in argv)) {
    password = process.env.PASSWORD;
}


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
        if (!("email" in argv)) {
            throw new Error("email must be provided when not running in LAN mode");
        }
        // fil it with your info and read password from env variable
        connection = new ewelink({
            email: argv.email,
            password: password,
            region: argv.region,
        });
    }

    const browser = await puppeteer.launch({
        args: ['--use-fake-ui-for-media-stream'], headless: true
    })
    const page = await browser.newPage()
    await page.goto('file://' + __dirname + '/index.html')

    var detection_timestamp = Date.now();
    var prediction_count = 0;

    page.on('console', async msg => {
        if (debug)
            console.log('PAGE LOG:', msg.text());
        const msg_str = msg.text();
        var predictions = []

        // Try to parse the msg, if it fails, does not belong to predictions
        try {
            predictions = JSON.parse(msg_str)
            prediction_count++;
          } catch(err) {
            // console.error(err)
            return;
          }

        // Ignore first predictions that are noisy
        if (prediction_count < 5) {
            // console.log("Skipping first predictions")
            return;
        }
        // console.log(msg_str);

        var toggle = false;
        for (let prediction of predictions){
            if (prediction.class === toggle_class && prediction.score > THRESHOLD){
                toggle = true;
            }
        }
        // return;
        
        if (toggle) {
            // if >2 consecutive detections in less than 1 secs, ignore
            if (Date.now() - detection_timestamp < 1000) {
                console.log("Ignoring repeated detection");
                return;
            }

            detection_timestamp = Date.now();
            console.log(new Date(detection_timestamp) + ": Toggling device!");

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