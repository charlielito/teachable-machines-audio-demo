
const ewelink = require('ewelink-api');

// light ID
const id = '10008562ea';

(async () => {

    const connection = new ewelink({
        email: 'candres.alv@gmail.com',
        password: process.env.PASSWORD,
        region: 'us',
    });

    // const region = await connection.getRegion();
    // console.log(region);

    /* get all devices */
    // const devices = await connection.getDevices();
    // console.log(devices);

    // // /* get specific devide info */
    // const device = await connection.getDevice(id);
    // console.log(device);

    /* toggle device */
    const result = connection.toggleDevice(id);
    console.log(await result);
    // console.log(await connection.toggleDevice(id));

    // setTimeout(() =>  connection.toggleDevice(id), 5000);
})();
