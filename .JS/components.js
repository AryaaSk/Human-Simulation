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
    substances = {
        "blood": BloodStore(0, 0, 0)
    };
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
    position = { x: 0, y: 0 }; //position of bottom-left corner relative to center of frame
    dimensions = { height: 0, width: 0 };
    colour = "white";
}
