const { IgnorePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');

const path = require('path');

module.exports = (options, webpack) => {
    return {
        ...options,
        externals: [
            nodeExternals({
                allowlist: ['webpack/hot/poll?100', /^@artifact\//],
                modulesDir: path.resolve(__dirname, '../../node_modules'),
                additionalModuleDirs: [path.resolve(__dirname, 'node_modules')],
            }),
        ],
        plugins: [
            ...options.plugins,
            new IgnorePlugin({
                resourceRegExp: /^mock-aws-s3$/,
            }),
            new IgnorePlugin({
                resourceRegExp: /^aws-sdk$/,
            }),
            new IgnorePlugin({
                resourceRegExp: /^nock$/,
            }),
            new IgnorePlugin({
                resourceRegExp: /^@fastify\/static$/,
            }),
            new IgnorePlugin({
                resourceRegExp: /^fsevents$/,
            }),
        ],
    };
};
