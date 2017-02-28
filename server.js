/**
 * @file server
 * @author ielgnaw(wuji0223@gmail.com)
 */

// import 'babel-register';
// import 'babel-polyfill';
import http from 'http';
import Koa from 'koa';
import graphQLHTTP from 'koa-graphql';
import mount from 'koa-mount';
import convert from 'koa-convert';
import bodyparser from 'koa-bodyparser';
import json from 'koa-json';
import onerror from 'koa-onerror';

import {getIP} from './util';
import {routes, allowedMethods} from './router/config';
import {getSchema} from './graphql';

const PORT = 8003;

const app = new Koa();

// const executableSchema = makeExecutableSchema({
//     typeDefs: readFileSync(join(__dirname, './test.graphql'), 'utf-8'),
//     // resolvers: {
//     //     Query: {
//     //         user: (_, args) => data[args.id]
//     //     }
//     // }
// });

app.use(mount('/graphiql', convert(graphQLHTTP({
    schema: getSchema(),
    pretty: true,
    graphiql: true
}))));

app.use(convert.compose(routes));
app.use(convert.compose(allowedMethods));

// graphQLServer.use('/schema', (req, res) => {
//     res.set('Content-Type', 'text/plain');
//     res.send(printSchema(schema));
// });

// app.use(async (ctx, next) => {
//     setCtx(ctx);
//     await next();
// });


app.use(convert(bodyparser()));
app.use(convert(json()));

onerror(app);
app.on('error', (err, ctx) => {
    console.log(err);
});


const server = http.createServer(app.callback());
server.listen(PORT);

server.on('error', error => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof PORT === 'string' ? ('Pipe ' + PORT) : 'Port ' + PORT;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    const addr = server.address();
    console.log('Listening at http://localhost:' + addr.port + ' or http://' + getIP() + ':' + addr.port + '\n');
});
