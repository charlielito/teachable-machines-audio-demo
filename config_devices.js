const ewelink = require('ewelink-api');

const Zeroconf = require('ewelink-api/classes/Zeroconf');

// const myIp = '192.168.1.56';
const myIp = '192.168.1.52';

(async () => {

    const connection = new ewelink({
        email: 'candres.alv@gmail.com',
        password: process.env.PASSWORD,
        region: 'us',
    });

    await connection.saveDevicesCache();

    await Zeroconf.saveArpTable({
        ip: myIp
    });

})();
