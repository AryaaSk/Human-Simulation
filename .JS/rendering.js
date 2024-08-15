"use strict";
//create reference to container
const container = document.getElementById("container");
const RenderComponent = (component) => {
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
};
