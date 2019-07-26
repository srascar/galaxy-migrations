'use strict';

const cosmos = jest.genMockFromModule('@azure/cosmos');

let response = {};

function __setNextResponse(nextResponse) {
    response.resources = nextResponse;
}

function fetchAll() {
    return new Promise((resolve, reject) => resolve(response));
}

class Container {
    items = {
        query: () => ({
            fetchAll,
        }),
    };
}

class CosmosClient {
    database = () => ({
        container: () => new Container(),
    });
}

cosmos.__setNextResponse = __setNextResponse;
cosmos.Container = Container;
cosmos.CosmosClient = CosmosClient;

module.exports = cosmos;
