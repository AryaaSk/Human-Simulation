"use strict";
const BPM = 100; //100 beats per minute
//convert beats per minute into milliseconds per beat
const millisecondsPerBeat = 1 / BPM * 60 * 1000;
/*
setInterval(() => {
    COMPONENTS["heart"].Action({ type: "beat", data: {} });
}, millisecondsPerBeat)
*/ 
