import { resolve as pathResolve } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { generateMigrationContent } from '../templates/default-migration';

function pad(number: number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

const generate = (
    outputDir: string = 'migrations',
    version: number = null
): void => {
    // Check if outputDir is undefined or null
    const resolvedOutputDir = pathResolve(outputDir || 'migrations');
    if (!existsSync(resolvedOutputDir)) {
        console.log(`Successfully created directory "${resolvedOutputDir}" .`);
        mkdirSync(resolvedOutputDir);
    }

    const now = new Date();
    const versionNumber = version
        ? version
        : parseInt(
              `${now.getFullYear()}${pad(now.getMonth())}${pad(
                  now.getDate()
              )}${pad(now.getHours())}${pad(now.getMinutes())}${pad(
                  now.getSeconds()
              )}`
          );

    const filePath = `${resolvedOutputDir}/migration${versionNumber}.js`;
    const content = generateMigrationContent(versionNumber);

    if (existsSync(filePath)) {
        console.log({ filePath });
        throw new Error(`File "${filePath}" already exists.`);
    }

    writeFileSync(filePath, content);
    console.log(`Successfully generated file: "${filePath}".`);
};

export default generate;
