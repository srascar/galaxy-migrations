import { Migration, DEFAULT_MIGRATION_DIR } from './dictionary';
import { resolve as pathResolve } from 'path';
import { pad } from '../utils';
import { readdirSync } from 'fs';

interface MigrationResolverInterface {
    getMigrationDir: (migrationsDir?: string) => string;
    readMigrationDir: (migrationsDir: string) => string[];
    getMigrationPath: (migrationsDir: string, versionNumber: number) => string;
    generateVersionNumber: () => number;
    getMigration: (migrationsPath: string) => Migration;
}

const MigrationResolver: MigrationResolverInterface = {
    getMigrationDir: (migrationsDir: string = DEFAULT_MIGRATION_DIR) => {
        // Fallback to default value when migrationsDir is null
        let trimedPath = migrationsDir || DEFAULT_MIGRATION_DIR;
        if (trimedPath.slice(-1) === '/') {
            trimedPath = trimedPath.slice(0, -1);
        }

        return pathResolve(trimedPath);
    },
    readMigrationDir: (migrationsDir: string): string[] => {
        return readdirSync(migrationsDir);
    },
    getMigrationPath: (
        migrationsDir: string = DEFAULT_MIGRATION_DIR,
        versionNumber: number
    ) => {
        const resolvedMigrationsDir = MigrationResolver.getMigrationDir(
            migrationsDir
        );

        return `${resolvedMigrationsDir}/migration${versionNumber}.js`;
    },
    generateVersionNumber: () => {
        const now = new Date();
        return parseInt(
            `${now.getFullYear()}${pad(now.getMonth())}${pad(
                now.getDate()
            )}${pad(now.getHours())}${pad(now.getMinutes())}${pad(
                now.getSeconds()
            )}`
        );
    },
    getMigration: (migrationPath: string): Migration => {
        try {
            return require(migrationPath);
        } catch (err) {
            throw new Error(
                `An error occured when trying to get migration "${migrationPath}"`
            );
        }
    },
};

export default MigrationResolver;
