import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to transform the raw database JSON into a structured format
const transformRawData = (rawData: any[]) => {
    const ppa = rawData.find(m => m.modelType === 'PPA')?.data as any;
    const upfront = rawData.find(m => m.modelType === 'UPFRONT')?.data as any;

    if (!ppa || !upfront) {
        throw new Error("PPA or UPFRONT model data is missing from the database.");
    }
    return { ppa, upfront };
};

// --- Calculation Functions ---

function calculateKpis(ppa: any, upfront: any) {
    const annualEnergyProduction = ppa.monthly_energy_production * 12;
    const lifetimeCO2Offset = ppa.ESG.annual_tonnes_of_CO2_reduced * 20;
    const equivalentTrees = ppa.ESG.trees_planted_per_year;
    const ppaLifetimeSavings = Object.values(ppa.projection["Annual Savings (RM)"])
        .map(v => Number(v))
        .reduce((a, b) => a + b, 0);

    const upfrontRoiYearsEntry = Object.entries(upfront.projection["Upfront Purchase ROI"]).find(([_, roi]) => (roi as number) > 0);
    let upfrontRoiPeriod = ">20";
    if (upfrontRoiYearsEntry) {
        const yearIndex = parseInt(upfrontRoiYearsEntry[0]);
        const year = upfront.projection.Year[yearIndex];
        upfrontRoiPeriod = year.toString();
    }

    return {
        annualEnergyProduction,
        lifetimeCO2Offset,
        equivalentTrees,
        ppa: {
            lifetimeSavings: ppaLifetimeSavings,
            roiPeriod: "Immediate"
        },
        upfront: {
            lifetimeSavings: Object.values(upfront.projection["Upfront Purchase ROI"]).pop(),
            roiPeriod: upfrontRoiPeriod
        }
    };
}

function calculateChartData(ppa: any, upfront: any) {
    const ppaSavingsData = Object.keys(ppa.projection.Year).map(key => ({
        name: `Year ${ppa.projection.Year[key]}`,
        "Annual Savings (MYR)": ppa.projection["Annual Savings (RM)"][key],
    }));

    const upfrontRoiData = Object.keys(upfront.projection.Year).map(key => ({
        name: `Year ${upfront.projection.Year[key]}`,
        "Cumulative ROI (MYR)": upfront.projection["Upfront Purchase ROI"][key],
    }));

    const pshByMonth: { [key: number]: number[] } = {};
    Object.values(ppa.monthly_data.month).forEach((month: any, i: number) => {
        if (!pshByMonth[month]) pshByMonth[month] = [];
        pshByMonth[month].push(Object.values(ppa.monthly_data.peak_sun_hours)[i] as number);
    });

    const pshData = Object.keys(pshByMonth).map(monthStr => {
        const month = parseInt(monthStr);
        return {
            name: new Date(2021, month - 1, 1).toLocaleString('default', { month: 'short' }),
            month: month,
            "Peak Sun Hours": pshByMonth[month].reduce((a, b) => a + b, 0) / pshByMonth[month].length,
        };
    });

    return {
        ppaSavings: ppaSavingsData,
        upfrontRoi: upfrontRoiData,
        psh: pshData,
    };
}

function formatMonthlyData(ppa: any) {
    const allMonthlyData: any[] = [];
    Object.keys(ppa.monthly_data.year).forEach(key => {
        allMonthlyData.push({
            year: ppa.monthly_data.year[key],
            month: ppa.monthly_data.month[key],
            energyConsumed: ppa.monthly_data.E_consumed[key],
            energyProduced: ppa.monthly_data.E_produced[key],
            billWithSolar: ppa.total_monthly_bill_with_solar,
            billWithoutSolar: ppa.monthly_data.bill_without_solar[key]
        });
    });
    return allMonthlyData;
}


// --- Main Service Function ---

export const getDashboardData = async () => {
    try {
        const rawData = await prisma.financialModel.findMany({
            orderBy: { modelType: 'asc' },
        });

        if (rawData.length < 2) {
            return null;
        }

        const { ppa, upfront } = transformRawData(rawData);
        const kpis = calculateKpis(ppa, upfront);
        const charts = calculateChartData(ppa, upfront);
        const monthlyData = formatMonthlyData(ppa);

        return { kpis, charts, monthlyData };
    } catch (error) {
        console.error("Error in getDashboardData service:", error);
        throw error;
    }
};

export const getRawProjectData = async () => {
    try {
        const financialModels = await prisma.financialModel.findMany({
            orderBy: { modelType: 'asc' },
        });

        if (financialModels.length === 0) {
            return null;
        }

        const { ppa } = transformRawData(financialModels);
        return ppa;
    } catch (error) {
        console.error("Error fetching raw project data:", error);
        throw error;
    }
}