'use strict';

const cosmos = jest.genMockFromModule('@azure/cosmos');

let response = {};

function __setNextResponse(nextResponse) {
    response.resources = nextResponse;
}

function fetchAll() {
    return new Promise(resolve => resolve(response));
}

class Container {
    constructor() {
        this.items = {
            query: () => ({
                fetchAll,
            }),
        };
        this.item = () => ({
            replace: obj => Promise.resolve(obj),
        });
    }
}

class CosmosClient {
    constructor() {
        this.database = () => ({
            container: () => new Container(),
        });
    }
}
class FeedResponse {
    constructor(resources, headers, hasMoreResults) {
        this.resources = resources;
        this.headers = headers;
        this.hasMoreResults = hasMoreResults;
    }
}

cosmos.__setNextResponse = __setNextResponse;
cosmos.Container = Container;
cosmos.CosmosClient = CosmosClient;
cosmos.FeedResponse = FeedResponse;

module.exports = cosmos;
