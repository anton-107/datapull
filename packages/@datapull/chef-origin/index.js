const util = require('util');
const objectPath = require('object-path');
const chef_api = require("chef-api");

class ChefOrigin {

    constructor(config) {
        this.config = config;
    }

    get originDeclaration() {
        return {
            name: ['Chef', this.config.organization].join(':'),
            runner: this.pullData.bind(this)
        };
    }

    async pullData(config) {
        console.log('[Chef] pulling data for ', this.config.organization);

        const options = {
            user_name: config.username,
            key_path: config.key_path,
            url: config.apiUrl
        };

        const chef = new chef_api();
        chef.config(options);
        const nodes = await util.promisify(chef.getNodes)()
        const results = [];
        for (const nodeName in nodes) {
            if (nodes.hasOwnProperty(nodeName)) {
                const node = util.promisify(chef.getNode)(nodeName);
                results.push(node);
            }
        }

        return await Promise.all(results);
    }
}

exports.datapullStep = {
    isOrigin: true,
    constructor: ChefOrigin
};