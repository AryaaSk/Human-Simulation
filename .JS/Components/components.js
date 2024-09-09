"use strict";
const EVENT_LOGGING = true;
class ComponentGraph {
    edges = {};
    components = {};
    graphAbove;
    componentAboveID;
    constructor(componentAboveID, graphAbove) {
        this.componentAboveID = componentAboveID;
        if (graphAbove != undefined) {
            this.graphAbove = graphAbove;
        }
    }
    TransmitEvent(data, toEdgeID, fromID) {
        const edge = this.edges[toEdgeID];
        if (EVENT_LOGGING == true) {
            const propogatingDown = fromID == this.componentAboveID;
            console.log(`${fromID} sending event to ${toEdgeID}`);
            console.log(`${toEdgeID} sending event to ${edge.destinationID}${edge.propogateUp == true ? " (PROPOGATING UP)" : ""}${propogatingDown == true ? " (PROPOGATING DOWN)" : ""}`);
        }
        if (edge.destinationType == "component") {
            const component = this.components[edge.destinationID];
            component.EventIn(data, toEdgeID);
        }
        else { //destinationType == "edge"
            //recursively call TransmitEvent on the current graph
            //or graph above depending on if propogateUp is true
            const nextEdgeID = edge.destinationID;
            if (edge.propogateUp == false) {
                this.TransmitEvent(data, nextEdgeID, toEdgeID);
            }
            else {
                this.graphAbove.TransmitEvent(data, nextEdgeID, toEdgeID);
            }
        }
    }
    //Abstraction
    AddComponent(id) {
        const component = new Component(id, this);
        this.components[id] = component;
        return component;
    }
    AddEdge(id) {
        const edge = new Edge();
        this.edges[id] = edge;
        return edge;
    }
}
class Edge {
    destinationID;
    destinationType;
    propogateUp;
    Configure(destinationID, destinationType, propogateUp) {
        if (destinationType == undefined) {
            destinationType = "component";
        }
        ; //defaults to component with no propagation
        if (propogateUp == undefined) {
            propogateUp = false;
        }
        ;
        this.destinationID = destinationID;
        this.destinationType = destinationType;
        this.propogateUp = propogateUp;
    }
}
class Component {
    id;
    constructor(id, graph) {
        this.id = id;
        this.graph = graph;
    }
    substances;
    graph;
    EventIn(data, fromEdgeID) {
        if (this.subComponentsActivated == true && this.subComponents != undefined) {
            this.EventInNonHeuristic(data, fromEdgeID);
        }
        else {
            this.EventInHeuristic(data, fromEdgeID);
        }
    }
    EventInHeuristic(data, fromEdgeID) { }
    EventInNonHeuristic(data, fromEdgeID) { }
    TransmitEvent(data, toEdgeID, propogateDown) {
        if (propogateDown != true) {
            this.graph.TransmitEvent(data, toEdgeID, this.id);
        }
        else {
            this.subComponents.TransmitEvent(data, toEdgeID, this.id);
        }
    }
    subComponents;
    subComponentsActivated = false;
    //Abstraction
    InitialiseSubComponents() {
        const graph = new ComponentGraph(this.id, this.graph);
        this.subComponents = graph;
        return graph;
    }
    //UI attributes
    position = { x: 0, y: 0 };
    dimensions = { height: 0, width: 0 };
    colour = "white";
}
//under a component graph, we need to define both the edges
//and components between those edges
const body = new ComponentGraph(""); //nothing above
//edges
const pulmonaryVein = body.AddEdge("pulmonaryVein");
pulmonaryVein.Configure("heart");
const aorta = body.AddEdge("aorta");
aorta.Configure("rest of body");
//components
const heart = body.AddComponent("heart");
heart.EventInHeuristic = (data, fromEdgeID) => {
    heart.TransmitEvent(data, "aorta");
};
heart.EventInNonHeuristic = (data, fromEdgeID) => {
    //propagate event down to sub-components;
    heart.TransmitEvent(data, "pulmonaryVein", true);
};
heart.position = { x: 100, y: 50 };
heart.dimensions = { height: 50, width: 50 };
heart.colour = "red";
const heartSubComponents = heart.InitialiseSubComponents();
//edges
const pulmonaryVeinInner = heartSubComponents.AddEdge("pulmonaryVein");
pulmonaryVeinInner.Configure("leftAtrium");
const mitralValve = heartSubComponents.AddEdge("mitralValve");
mitralValve.Configure("leftVentricle");
const aortaInner = heartSubComponents.AddEdge("aorta");
aortaInner.Configure("aorta", "edge", true);
//components
const leftVentricle = heartSubComponents.AddComponent("leftAtrium");
leftVentricle.EventInHeuristic = (data, fromEdgeID) => {
    if (fromEdgeID == "pulmonaryVein") { //send blood along to left ventricle
        leftVentricle.TransmitEvent(data, "mitralValve");
    }
};
leftVentricle.position = { x: 130, y: 60 };
leftVentricle.dimensions = { width: 10, height: 10 };
leftVentricle.colour = "purple";
const leftAtrium = heartSubComponents.AddComponent("leftVentricle");
leftAtrium.EventInHeuristic = (data, fromEdgeID) => {
    if (fromEdgeID == "mitralValve") {
        leftAtrium.TransmitEvent(data, "aorta");
    }
};
leftAtrium.position = { x: 110, y: 60 };
leftAtrium.dimensions = { width: 10, height: 10 };
leftAtrium.colour = "lime";
const restOfBody = body.AddComponent("rest of body");
restOfBody.EventInHeuristic = (data, fromEdgeID) => {
    console.log(data);
};
heart.subComponentsActivated = true;
const Render = () => {
    frame.innerHTML = "";
    RenderComponent(heart); //will recursively render sub-components
};
body.TransmitEvent({ id: "bloodIn", data: {} }, "pulmonaryVein", "Body");
