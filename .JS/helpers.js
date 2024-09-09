"use strict";
const BloodStore = (volume, oxygenConcentration, carbonDioxideConcentration) => {
    return { volume: volume, oxygenConcentration: oxygenConcentration, carbonDioxideConcentration: carbonDioxideConcentration };
};
const CalculateResultantConcentration = (bloodStore1, bloodStore2) => {
    const vt = bloodStore1.volume + bloodStore2.volume;
    //calculate resultant oxygen and carbon dioxide concentrations
    const oxygenConcentration = 1 / vt * (bloodStore1.oxygenConcentration * bloodStore1.volume + bloodStore2.oxygenConcentration * bloodStore2.volume);
    const carbonDioxideConcentration = 1 / vt * (bloodStore1.carbonDioxideConcentration * bloodStore1.volume + bloodStore2.carbonDioxideConcentration * bloodStore2.volume);
    return { volume: vt, oxygenConcentration: oxygenConcentration, carbonDioxideConcentration: carbonDioxideConcentration };
};
