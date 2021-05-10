const ewelink = require('ewelink-api');
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
    .help()
    .alias('help', 'h')
    .argv;


var password = argv.password;
if (!("password" in argv)) {
    password = process.env.PASSWORD;
}


(async () => {

    const connection = new ewelink({
        email: argv.email,
        password: password,
        region: 'us',
    });

    /* get all devices */
    const devices = await connection.getDevices();
    console.log(devices);

})();