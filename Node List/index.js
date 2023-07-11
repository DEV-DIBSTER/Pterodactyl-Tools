const Axios = require('axios');
const { RequestURL } = require('./request.js');
const Table = require('ascii-table');
const fs = require('fs');

Axios(RequestURL('/api/application/nodes')).then(async (Response) => {
    const JSON = Response.data.data;

    const ServerTable = new Table();
    ServerTable.setHeading('Node Name:', 'Node ID:', 'Node URL:', 'Server Count:', 'Node Allocation Count:', 'Location ID:');

    function customSort(array) {
        return array.sort((a, b) => {
          const pattern1 = /^(Node) (\d+)$/;
          const pattern2 = /^(Dono)-(\d+)$/;
          const pattern3 = /^(PNode) (\d+)$/;
      
          const aName = a.attributes.name;
          const bName = b.attributes.name;
      
          const aMatch1 = pattern1.exec(aName);
          const aMatch2 = pattern2.exec(aName);
          const aMatch3 = pattern3.exec(aName);
      
          const bMatch1 = pattern1.exec(bName);
          const bMatch2 = pattern2.exec(bName);
          const bMatch3 = pattern3.exec(bName);
      
          if (aMatch1 && bMatch1) {
            const aNumber = parseInt(aMatch1[2]);
            const bNumber = parseInt(bMatch1[2]);
            return aNumber - bNumber;
          }
      
          if (aMatch2 && bMatch2) {
            const aNumber = parseInt(aMatch2[2]);
            const bNumber = parseInt(bMatch2[2]);
            return aNumber - bNumber;
          }
      
          if (aMatch3 && bMatch3) {
            const aNumber = parseInt(aMatch3[2]);
            const bNumber = parseInt(bMatch3[2]);
            return aNumber - bNumber;
          }
      
          if (aMatch1) {
            return -1;
          }
      
          if (bMatch1) {
            return 1;
          }
      
          if (aMatch2) {
            return -1;
          }
      
          if (bMatch2) {
            return 1;
          }
      
          if (aMatch3) {
            return -1;
          }
      
          if (bMatch3) {
            return 1;
          }
      
          return aName.localeCompare(bName);
        });
    };

    let Data = [];

    Promise.all(JSON.map(async (Node) => {
        await Axios(
            RequestURL("/api/application" + "/nodes" + `/${Node.attributes.id}` + "?include=servers,location,allocations")
        ).then(async (Response) => {
            const JSON = Response.data;

            Data.push(JSON);
        });
    })).then(async () => {
        Data = customSort(Data);

        Data.forEach(Node => {
            ServerTable.addRow(Node.attributes.name, Node.attributes.id, Node.attributes.fqdn, Node.attributes.relationships.servers.data.length, Node.attributes.relationships.allocations.data.length, Node.attributes.relationships.location.attributes.id);
        });

        await fs.writeFileSync('./Nodes.txt', ServerTable.toString());
    });
});
