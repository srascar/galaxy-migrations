import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { generateMigrationContent } from '../templates/default-migration';

const generate = (
    migrationsDir: string,
    filePath: string,
    versionNumber: number
): void => {
    if (!existsSync(migrationsDir)) {
        console.log(`Successfully created directory "${migrationsDir}" .`);
        mkdirSync(migrationsDir);
    }

    const content = generateMigrationContent(versionNumber);

    if (existsSync(filePath)) {
        throw new Error(`File "${filePath}" already exists.`);
    }

    writeFileSync(filePath, content);
    console.log(`Successfully generated file: "${filePath}".`);
};

export default generate;
