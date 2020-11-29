import {sjgurps4e} from '../config.js';


export default class ActorGurps extends Actor {



    prepareData(){
        super.prepareData();
        const actorData = this.data;
        console.log("SJGURPS4E   |    prepareData for actor entities:  " + this.data.name);
        actorData.data.baseSpeed = this._basicSpeed(actorData);

    }



    _basicSpeed(data){
        console.log("SJGURPS4E   |    _basicSpeed for actor entities:  " + data.data);
        let points = (data.data.speedPoints);
        //console.log(points);
        let speedMod = (points/5)*.25;
        //console.log(speedMod);
        let speed = ((data.data.HT.value+data.data.DX.value)/4)+speedMod;
        //console.log(speed);
        return speed;
    }



    
}