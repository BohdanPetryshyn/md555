// const Md5HashStream = require('./md5HashStream');
//
// const { Readable } = require('stream');
// const fs = require('fs');
//
// const buffer = new Buffer('12345678901234567890123456789012345678901234567890123456789012345678901234567890', 'utf-8')
// const readable = new Readable()
// readable._read = () => {} // _read is required but you can noop it
// readable.push(buffer)
// readable.push(null)
//
// const test = fs.createReadStream('ZoomService-web-22441_181_117-1601982408597-2-dainty_fog.iad02.hubspot_networks.net-us_east_1a_0-1602127799965-service.log-2020-10-08-1602127384.log')
// .pipe(new Md5HashStream()).on('data', data => console.log(data.toString('hex').toUpperCase()));

const a = new Int32Array([2000000000])[0];
const b = new Int32Array([2000000000])[0];

console.log(a + b)