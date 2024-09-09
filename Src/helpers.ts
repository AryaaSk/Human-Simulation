interface BloodStore {
    volume: number; //ml
    oxygenConcentration: number; //0 to 1
    carbonDioxideConcentration: number; //0 to 1
}

const BloodStore = (volume: number, oxygenConcentration: number, carbonDioxideConcentration: number): BloodStore => {
    return { volume: volume, oxygenConcentration: oxygenConcentration, carbonDioxideConcentration: carbonDioxideConcentration };
}

const CalculateResultantConcentration = (bloodStore1: BloodStore, bloodStore2: BloodStore): BloodStore => {
    const vt = bloodStore1.volume + bloodStore2.volume;

    //calculate resultant oxygen and carbon dioxide concentrations
    const oxygenConcentration = 1 / vt * (bloodStore1.oxygenConcentration * bloodStore1.volume + bloodStore2.oxygenConcentration * bloodStore2.volume);
    const carbonDioxideConcentration = 1 / vt * (bloodStore1.carbonDioxideConcentration * bloodStore1.volume + bloodStore2.carbonDioxideConcentration * bloodStore2.volume);

    return { volume: vt, oxygenConcentration: oxygenConcentration, carbonDioxideConcentration: carbonDioxideConcentration };
}

