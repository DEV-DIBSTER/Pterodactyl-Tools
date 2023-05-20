const Axios = require('axios');
const Config = require('./config.json');
const { RequestURL } = require('./request.js');
const Table = require('ascii-table');
const fs = require('fs');

Axios(RequestURL('/api/application/nodes')).then(async (Response) => {
    const JSON = Response.data;

    console.log(JSON.data.length);

    const ServerTable = new Table();
    ServerTable.setHeading('Node Name:', 'Node ID:', 'Node URL:', 'Server Count:', 'Location ID:');

    Promise.all(JSON.data.map(async (Node) => {
            await Axios(
                RequestURL("/api/application" + "/nodes" + `/${Node.attributes.id}` + "?include=servers,location,allocations")
            ).then(async (Response) => {
                const JSON = Response.data;

                ServerTable.addRow(JSON.attributes.name, JSON.attributes.id, JSON.attributes.fqdn, JSON.attributes.relationships.servers.data.length, JSON.attributes.relationships.location.attributes.id);
                
                console.log(JSON.attributes.name + " is now done!");
            });
    })).then(async () => {
        await fs.writeFileSync('./Nodes.txt', ServerTable.toString());
    });
});