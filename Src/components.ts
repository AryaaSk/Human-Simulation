const EVENT_LOGGING = true;

interface Edge {
    destinationID: string;

    destinationType: "component" | "edge";
    propogateUp: boolean;
}

interface EventData {
    data: string;
}

class ComponentGraph {
    edges: { [id: string]: Edge } = {};
    components: { [id: string]: Component } = {};

    graphAbove!: ComponentGraph;
    componentAboveID: string;
    constructor(componentAboveID: string, graphAbove?: ComponentGraph) {
        this.componentAboveID = componentAboveID;
        if (graphAbove != undefined) {
            this.graphAbove = graphAbove;
        }
    }

    TransmitEvent(data: EventData, toEdgeID: string, fromID: string) {
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
            //recursively call TransmitEvent on the current
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
}

class Component {
    id: string;
    constructor(id: string, graph: ComponentGraph) {
        this.id = id;
        this.graph = graph;
    }

    substances: any;

    private graph: ComponentGraph;
    EventIn(data: EventData, fromEdgeID: string) {}
    TransmitEvent(data: EventData, toEdgeID: string) {
        this.graph.TransmitEvent(data, toEdgeID, this.id);
    }

    subComponents?: ComponentGraph;
    subComponentsActivated: boolean = false;



    //UI attributes
    position: Point = { x: 0, y: 0 }
    dimensions: Dimensions = { height: 0, width: 0 };
    colour: string = "white"
}














const Edge = (destinationID: string, destinationType?: "component" | "edge", propogateUp?: boolean): Edge => {
    if (destinationType == undefined) { destinationType = "component" }; //defaults to component with no propagation
    if (propogateUp == undefined) { propogateUp = false };
    return { destinationID: destinationID, destinationType: destinationType , propogateUp: propogateUp };
}

class Heart extends Component {
    EventIn(data: EventData, fromEdgeID: string): void {
        if (this.subComponentsActivated == false) { //heuristic
            this.TransmitEvent(data, "aorta");
        }
        else { //propagate event down to sub-components;
            //for a generic component, we need to verify subComponents exists
            this.subComponents!.TransmitEvent(data, "pulmonaryVein", this.id)
        }
    }
}

class LeftAtrium extends Component {
    EventIn(data: EventData, fromEdgeID: string): void {
        if (fromEdgeID == "pulmonaryVein") { //send blood along to left ventricle
            this.TransmitEvent(data, "mitralValve");
        }
    }
}

class LeftVentricle extends Component {
    EventIn(data: EventData, fromEdgeID: string): void { //propagate event back up to heart's graph
        if (fromEdgeID == "mitralValve") {
            this.TransmitEvent(data, "aorta");
        }
    }
}

const body = new ComponentGraph(""); //nothing above
body.components["heart"] = new Heart("heart", body);
body.edges["pulmonaryVein"] = Edge("heart")
body.edges["aorta"] = Edge("rest of body")

const heart = body.components["heart"]; //this is a reference not copy

const heartSubComponents = new ComponentGraph("heart", body)

heartSubComponents.components["leftAtrium"] = new LeftAtrium("leftAtrium", heartSubComponents);
heartSubComponents.components["leftVentricle"] = new LeftVentricle("leftVentricle", heartSubComponents);

heartSubComponents.edges["pulmonaryVein"] = Edge("leftAtrium");
heartSubComponents.edges["mitralValve"] = Edge("leftVentricle");
//pointing to aorta within body's graph
heartSubComponents.edges["aorta"] = { destinationID: "aorta", destinationType: "edge", propogateUp: true };

heart.subComponents = heartSubComponents;
heart.subComponentsActivated = false;

body.components["rest of body"] = new Component("rest of body", body);
body.components["rest of body"].EventIn = (data, fromEdgeID) => {
    console.log(data);
}


body.TransmitEvent({ data: "blood" }, "pulmonaryVein", "Body");








//Rendering; container has width 400px and height 700px, with (0, 0) being the center
heart.position = { x: 100, y: 50 };
heart.dimensions = { height: 50, width: 50 };
heart.colour = "red";

heartSubComponents.components["leftAtrium"].position = { x: 110, y: 60 };
heartSubComponents.components["leftAtrium"].dimensions = { width: 10, height: 10 };
heartSubComponents.components["leftAtrium"].colour = "lime";

heartSubComponents.components["leftVentricle"].position = { x: 130, y: 60 };
heartSubComponents.components["leftVentricle"].dimensions = { width: 10, height: 10 };
heartSubComponents.components["leftVentricle"].colour = "purple";

heart.subComponentsActivated = true;

RenderComponent(heart); //will recursively render sub-components


