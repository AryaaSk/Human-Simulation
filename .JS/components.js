"use strict";
const Edge = (ID, connectedToID) => {
    return { ID: ID, connectedToID: connectedToID };
};
class Component {
    ID = "";
    bloodStore;
    constructor() {
        this.bloodStore = { volume: 0, oxygenConcentration: 0, carbonDioxideConcentration: 0 };
    }
    async Action(event) {
        //method called whenever a possible trigger event occurs, e.g. blood flows in
        if (event.type == "bloodIn") {
            const newBlood = event.data;
            const resultantBloodStore = CalculateResultantConcentration(this.bloodStore, newBlood);
            this.bloodStore = resultantBloodStore;
        }
    }
    async TransmitBlood() {
        const transmitableBloodVolume = this.bloodStore.volume;
        //split blood equally across all connected components
        const numberOfOutgoingNodes = CONNECTIONS[this.ID].length;
        const bloodPortion = transmitableBloodVolume / numberOfOutgoingNodes;
        const O2Conc = this.bloodStore.oxygenConcentration;
        const CO2Conc = this.bloodStore.carbonDioxideConcentration;
        for (const edge of CONNECTIONS[this.ID]) {
            const recipientID = edge.connectedToID;
            if (this.bloodStore.volume >= bloodPortion) {
                this.bloodStore.volume -= bloodPortion;
                COMPONENTS[recipientID].Action({ type: "bloodIn", data: { "volume": bloodPortion, "oxygenConcentration": O2Conc, "carbonDioxideConcentration": CO2Conc } });
            }
            else {
                console.error(`${this.ID} trying to transmit ${bloodPortion} ml of blood, however it only contains ${this.bloodStore.volume} ml`);
            }
        }
    }
}
class Heart extends Component {
    constructor() {
        super();
        this.ID = "heart";
    }
    async Action(event) {
        await super.Action(event);
        if (event.type == "beat") {
            this.TransmitBlood(); //trigger a heartbeat
        }
    }
}
class Lungs extends Component {
    constructor() {
        super();
        this.ID = "lungs";
    }
    async Action(event) {
        await super.Action(event);
        if (event.type == "bloodIn") { //after blood has entered, the lungs set O2 conc. to 1 and CO2. conc to 0.
            this.bloodStore.oxygenConcentration = 1;
            this.bloodStore.carbonDioxideConcentration = 0;
            console.log("Oxygenated blood in lungs, now transmitting back to the heart.");
            this.TransmitBlood(); //once oxygenated, the lungs simply re-transmit the blood outwards
        }
    }
}
class Body extends Component {
    constructor() {
        super();
        this.ID = "body";
    }
    async Action(event) {
        await super.Action(event);
        if (event.type == "bloodIn") {
            this.bloodStore.oxygenConcentration = 0;
            this.bloodStore.carbonDioxideConcentration = 1;
            console.log("Used up oxygen in the rest of the body, sending blood back to heart.");
            this.TransmitBlood();
        }
    }
}
const CONNECTIONS = {};
CONNECTIONS["heart"] = [
    Edge("pulmonaryArtery", "lungs"),
    Edge("aorta", "body")
];
CONNECTIONS["lungs"] = [
    Edge("pulmonaryVein", "heart")
];
CONNECTIONS["body"] = [
    Edge("venaCava", "heart")
];
const COMPONENTS = {};
COMPONENTS["heart"] = new Heart();
COMPONENTS["lungs"] = new Lungs();
COMPONENTS["body"] = new Body();
const OutputBloodStore = (id) => {
    const bloodStore = COMPONENTS[id].bloodStore;
    console.log(`${id} blood volume: ${bloodStore.volume}, O2 conc: ${bloodStore.oxygenConcentration}, CO2 conc: ${bloodStore.carbonDioxideConcentration}`);
};
COMPONENTS["heart"].bloodStore.volume = 100;
COMPONENTS["heart"].bloodStore.oxygenConcentration = 0;
COMPONENTS["heart"].bloodStore.carbonDioxideConcentration = 1;
OutputBloodStore("heart");
OutputBloodStore("lungs");
OutputBloodStore("body");
COMPONENTS["heart"].TransmitBlood();
OutputBloodStore("heart");
OutputBloodStore("lungs");
OutputBloodStore("body");
