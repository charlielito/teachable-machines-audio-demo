const ewelink = require('ewelink-api');
const Zeroconf = require('ewelink-api/src/classes/Zeroconf');

const id = '10008562ea';

(async () => {

    /* load cache files */
    const devicesCache = await Zeroconf.loadCachedDevices();
    const arpTable = await Zeroconf.loadArpTable();
    // console.log(devicesCache, arpTable)

    /* create the connection using cache files */
    const connection = new ewelink({ devicesCache, arpTable });
    console.log(connection);

    /* turn device on */
    await connection.setDevicePowerState(id, 'on');

    /* turn device off */
    await connection.setDevicePowerState(id, 'off');

})();