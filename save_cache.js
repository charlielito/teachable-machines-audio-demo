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
    .help()
    .alias('help', 'h')
    .argv;

const myIp = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), []);
console.log("My local IP is: " + myIp);

var password = argv.password;
if (!("password" in argv)) {
    password = process.env.PASSWORD;
}

(async () => {

    const connection = new ewelink({
        email: argv.email,
        password: password,
        region: argv.region,
    });

    console.log("Saving devices cache");
    await connection.saveDevicesCache();

    console.log("Saving arp table");
    await Zeroconf.saveArpTable({
        ip: myIp.toString()
    });
    console.log("Done!");

})();
