heart.position = { x: 100, y: 50 };
heart.dimensions = { height: 50, width: 50 };
heart.colour = "red";
heart.EventInHeuristic = (event, fromEdgeID) => {

    if (event.id == "heartbeat") {
        //try to pump the [stroke volume] of blood



        //heart.TransmitEvent({ id: "blood", data: })
    }




    heart.TransmitEvent(event, "aorta");
}
heart.EventInNonHeuristic = (data, fromEdgeID) => {
    //propagate event down to sub-components;
    heart.TransmitEvent(data, "pulmonaryVein", true)
}

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
leftVentricle.position = { x: 130, y: 60 };
leftVentricle.dimensions = { width: 10, height: 10 };
leftVentricle.colour = "purple";
leftVentricle.EventInHeuristic = (data, fromEdgeID) => {
    if (fromEdgeID == "pulmonaryVein") { //send blood along to left ventricle
        leftVentricle.TransmitEvent(data, "mitralValve");
    }
}

const leftAtrium = heartSubComponents.AddComponent("leftVentricle");
leftAtrium.position = { x: 110, y: 60 };
leftAtrium.dimensions = { width: 10, height: 10 };
leftAtrium.colour = "lime";
leftAtrium.EventInHeuristic = (data, fromEdgeID) => {
    if (fromEdgeID == "mitralValve") {
        leftAtrium.TransmitEvent(data, "aorta");
    }
}