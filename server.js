'use strict';
const Hapi = require('@hapi/hapi');

const couchbase = require('couchbase');
const cluster = new couchbase.Cluster('couchbase://localhost/');
cluster.authenticate('Administrator', 'Jeedigunta');
const bucket = cluster.openBucket('beer-sample');
const N1qlQuery = couchbase.N1qlQuery;
const query = N1qlQuery.fromString("SELECT * FROM `beer-sample` LIMIT 1");  
//bucket.query(query, function (err, result) { console.log(result) });

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            return new Promise(resolve => {
                let beerList = bucket.query(query, (err, result) => {
                    console.dir(result);
                    resolve(result);
                });
                return beerList;
            });
        }
    });    

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();