import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Construct the absolute path to the data file
    const dataPath = path.join(__dirname, '..', 'RoofTopData.txt');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const projectData: any[] = JSON.parse(fileContent);

    const ppaData = projectData[0];
    const upfrontData = projectData[1];

    await prisma.financialModel.upsert({
        where: { modelType: 'PPA' },
        update: { data: ppaData },
        create: {
            modelType: 'PPA',
            data: ppaData,
        },
    });
    console.log('Seeded PPA model.');

    await prisma.financialModel.upsert({
        where: { modelType: 'UPFRONT' },
        update: { data: upfrontData },
        create: {
            modelType: 'UPFRONT',
            data: upfrontData,
        },
    });
    console.log('Seeded UPFRONT model.');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });