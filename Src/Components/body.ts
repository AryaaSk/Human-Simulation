const body = new ComponentGraph("");

//edges
const pulmonaryVein = body.AddEdge("pulmonaryVein");
pulmonaryVein.Configure("heart");
const aorta = body.AddEdge("aorta");
aorta.Configure("rest of body");

const pulmonaryArtery = body.AddEdge("pulmonaryArtery");
pulmonaryArtery.Configure("lungs");
const venaCava = body.AddEdge("venaCava");
venaCava.Configure("heart");



//components
const heart = body.AddComponent("heart");
const lungs = body.AddComponent("lungs");
const restOfBody = body.AddComponent("rest of body");

restOfBody.position = { x: -150, y: -200 };
restOfBody.dimensions = { height: 75, width: 300 }
restOfBody.colour = "lightBlue"
restOfBody.EventInHeuristic = (data, fromEdgeID) => {
    console.log(data);
}

