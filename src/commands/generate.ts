import { resolve as pathResolve } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { generateMigrationContent } from '../templates/default-migration';
import { RETURN_CODES } from '../dictionary';

function pad(number: number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

const generate = (
    outputDir: string = 'migrations',
    version: number = null
): number => {
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
        console.error(`ERROR: File "${filePath}" already exists.`);
        return RETURN_CODES.RUNTIME_ERROR;
    }

    try {
        writeFileSync(filePath, content);
    } catch (err) {
        console.error(err);
        return RETURN_CODES.RUNTIME_ERROR;
    }

    console.log(`Successfully generated file: "${filePath}".`);
    return RETURN_CODES.SUCCESS;
};

export default generate;
