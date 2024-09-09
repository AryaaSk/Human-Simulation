heart.subComponentsActivated = false;

const Render = () => {
    frame.innerHTML = "";
    RenderComponent(heart); //will recursively render sub-components
    RenderComponent(lungs);
    RenderComponent(restOfBody)
}
StartRendering(Render); //function utilises render function



heart.substances["blood"].volume = 100;
heart.substances["blood"].oxygenConcentration = 0.1;
heart.substances["blood"].carbonDioxideConcentration = 0.1;


body.TransmitEvent({ id: "bloodIn", data: {} }, "pulmonaryVein", "body");