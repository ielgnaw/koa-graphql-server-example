/**
 * @file graphql 相关
 * @author ielgnaw(wuji0223@gmail.com)
 */

import {readFileSync} from 'fs';
import {join} from 'path';

import {makeExecutableSchema} from 'graphql-tools';

const executableSchema = makeExecutableSchema({
    typeDefs: readFileSync(join(__dirname, './data/test.graphql'), 'utf-8'),
    // resolvers: {
    //     Query: {
    //         user: (_, args) => data[args.id]
    //     }
    // }
});

export function getSchema() {
    return executableSchema;
}
