# Galaxy migrations

## What is Galaxy migrations

Galaxy migrations is a lightweight migration library in Node.js for NoSQL Document database.
It is originally created to provide field update in Azure Cosmos DB since this is not natively supported.
This is where the name `Galaxy` comes from.

## Requirements

Galaxy migrations requires Node.js in version 8 and up

## Installation

```
npm install --save-dev @srascar/galaxy-migrations
```

## Usage

```
npx galaxy-migration -h
```

## Documentation

Before you start, you will have to create a configuration file.

By default, the command will look for a file called `migrations_config.yml` at the root of your project.
But you can use the `--config-file` option to specify your own.

Here is an example of config.

```
migrations_dir: migrations
database:
    connector: azure_cosmos_db
    endpoint: https://localhost.cosmosdb:443/
    primary_key: abcd
    name: my_database
    container: my_container

```

Note: Only `azure_cosmos_db` connector is supported for now.

### Usage

#### Create a migration

```
npx galaxy-migrations generate
```

This will create a new file in you migration directory.
Edit this file and change it to you needs.

```
// migrations/migration20190712120924.js
...
    checkQueryUp: 'SELECT VALUE count(1) FROM Families f WHERE NOT is_defined(f._migrationVersion),
    queryUp: {
      query: "SELECT * FROM Families f WHERE  f.lastName = @lastName",
      parameters: [
        {
          name: "@lastName",
          value: "Andersen"
        }
      ]
    },
    up: (itemBody) => ({ ...itemBody, transformed: true }),
...
    documentMeta: { idField: 'id', partitionKey: 'id' },

```

We will only focus on the query up for this example.

-   **checkQueryUp**: if this count returns 0, the migration is skiped
-   **queryUp**: both checkQueryUp and queryUp supports a queryspec object (cf Azure documentation https://github.com/Azure/azure-cosmos-js/blob/master/samples/ItemManagement.ts#L58-L67)
-   **up**: The callback to apply on each item
-   **documentMeta**: required object with the keys for id and partition key fields

#### Execute a migration

Migrate up

```
npx galaxy-migrations execute 20190712120924
```

Migrate down (eg: rollback)

```
npx galaxy-migrations execute 20190712120924 -w down
```

Dry run

```
npx galaxy-migrations execute 20190712120924 -w up -d
```

#### Execute all migrations in the directory (based on the config)

```
npx galaxy-migrations migrate
```

Options are the same as execute

### Known issues

#### Some options are only displayed for the parent command

For the list of options that you can apply on all commands, use

```
npx galaxy-migrations -h
```

#### Update a document when your container doesn't have partition key

If your container was created before the implementation of partition key, it is now
assigned a default partition key with the path `/_partitionKey`.
See https://github.com/Azure/azure-cosmos-js/issues/261

In order to update a document from this container, in your callback, attach a new property `_partitionKey` to your items with the value `undefined`

```
// migrationXXXXXXXXXXXXXX.js

...

up: itemBody => ({ ...itemBody, _partitionKey: undefined })

...
// Don't forget to specify the DEFAULT_PARTITION_KEY_PATH in the document meta
documentMeta: { idField: 'id', partitionKey: '_partitionKey' },
```
