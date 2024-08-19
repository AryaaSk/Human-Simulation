interface Point {
    x: number;
    y: number;
}

interface Dimensions {
    height: number;
    width: number;
}


const ORIGINAL_FRAME_DIMENSIONS: Dimensions = { height: 700, width: 400 };
const CURRENT_FRAME: { centre: Point, scale: number } = { centre: { x: 0, y: 0 }, scale: 1 };


//create reference to container
const container = document.getElementById("container")!;

const RenderComponent = (component: Component) => {
    const element = document.createElement("div");
    element.className = "component";

    element.style.left = `${component.position.x}px`;
    element.style.bottom = `${component.position.y}px`;

    element.style.height = `${component.dimensions.height}px`;
    element.style.width = `${component.dimensions.width}px`;

    element.style.backgroundColor = component.colour;

    container.append(element);

    //also check whether sub-components are activated, and if so, render them
    if (component.subComponentsActivated == true) {
        for (const subComponentID in component.subComponents?.components) {
            const subComponent = component.subComponents?.components[subComponentID];
            RenderComponent(subComponent);
        }
    }
}


