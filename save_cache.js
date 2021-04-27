const ewelink = require('ewelink-api');

const Zeroconf = require('ewelink-api/src/classes/Zeroconf');

const myIp = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), []);
console.log("My local IP is: " + myIp);

(async () => {

    const connection = new ewelink({
        email: 'candres.alv@gmail.com',
        password: process.env.PASSWORD,
        region: 'us',
    });

    await connection.saveDevicesCache();

    await Zeroconf.saveArpTable({
        // ip: myIp
        ip: '192.168.0.47'
    });

})();
