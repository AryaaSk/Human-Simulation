interface Point {
    x: number;
    y: number;
}

interface Dimensions {
    height: number;
    width: number;
}


//create reference to container
const frame = document.getElementById("container")!;

const RenderComponent = (component: Component) => {
    const element = document.createElement("div");
    element.className = "component";

    //calculate position relative to frame
    const [X, Y] = [component.position.x, component.position.y]
    const [Xc, Yc] = [CURRENT_FRAME.centre.x, CURRENT_FRAME.centre.y]
    const S = CURRENT_FRAME.scale;

    const [x, y] = [S*(X - Xc), S*(Y - Yc)];

    const [xCSS, yCSS] = [x + ORIGINAL_FRAME_DIMENSIONS.width / 2, y + ORIGINAL_FRAME_DIMENSIONS.height / 2];
    element.style.left = `${xCSS}px`;
    element.style.bottom = `${yCSS}px`;

    element.style.height = `${component.dimensions.height * S}px`;
    element.style.width = `${component.dimensions.width * S}px`;

    element.style.backgroundColor = component.colour;

    frame.append(element);

    //also check whether sub-components are activated, and if so, render them;
    if (component.subComponentsActivated == true && component.subComponents != undefined) {
        for (const subComponentID in component.subComponents.components) {
            const subComponent = component.subComponents.components[subComponentID];
            RenderComponent(subComponent);
        }
    }
}



const ORIGINAL_FRAME_DIMENSIONS: Dimensions = { height: 700, width: 400 };
const CURRENT_FRAME: { centre: Point, scale: number } = { centre: { x: 125, y: 75 }, scale: 5 };

let MOUSE_DOWN = false;
frame.onmousedown = () => {
    MOUSE_DOWN = true;
}
frame.onmouseup = () => {
    MOUSE_DOWN = false;
}
frame.onmousemove = ($e) => {
    if (MOUSE_DOWN == false) {
        return;
    }
    console.log('here')
    CURRENT_FRAME.centre.x -= $e.movementX / CURRENT_FRAME.scale;
    CURRENT_FRAME.centre.y += $e.movementY / CURRENT_FRAME.scale;
    Render();
}

frame.onwheel = ($e) => {
    CURRENT_FRAME.scale *= (1 + $e.deltaY / 1000);
    Render();
}

const Render = () => {
    frame.innerHTML = "";
    RenderComponent(heart); //will recursively render sub-components
}
Render();