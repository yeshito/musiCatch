// 'use strict';
//
// let redisConfig;
// if (process.env.NODE_ENV === 'production') {
//   redisConfig = {
//     redis: {
//       port: process.env.REDIS_PORT,
//       host: process.env.REDIS_HOST,
//       auth: process.env.REDIS_PASS
//     }
//   };
// } else {
//   redisConfig = {};
// }
//
// const queue = require('kue').createQueue(redisConfig);
//
// queue.watchStuckJobs(1000 * 10);
//
// queue.on('ready', () => {
//   // If you need to
//   console.info('Queue is ready!');
// });
//
// queue.on('error', (err) => {
//   // handle connection errors here
//   console.error('There was an error in the main queue!');
//   console.error(err);
//   console.error(err.stack);
// });
//
// function getArtistId(data, done) {
//   queue.create('payment', data)
//     .attempts(1)
//     .backoff(true)
//     .removeOnComplete(false)
//     .ttl(milliseconds)
//     .save((err) => {
//       if (err) {
//         console.error(err);
//         done(err);
//       }
//       if (!err) {
//         done();
//       }
//     });
// }
// queue.process('payment', 20, (job, done) => {
//
//   // other processing work
//
//   done();
// })
//
// module.exports = {
//   getArtistId: (data, done) => {
//     getArtistId(data, done);
//   }
// };
