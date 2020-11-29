
export default class ActorGurps extends Actor {



    prepareData(){
        super.prepareData();
        const actorData = this.data;
        //console.log("SJGURPS4E   |    prepareData for actor entities:  " + this.data.name);
        actorData.data.baseSpeed = this._basicSpeed(actorData);
        actorData.data.totalPoints.value = this._computePoints(actorData);

        actorData.data.singleDR = this._computeDR(actorData);

    }



    _basicSpeed(data){
        //console.log("SJGURPS4E   |    _basicSpeed for actor entities:  " + data.data);
        let points = (data.data.speedPoints);
        //console.log(points);
        let speedMod = (points/5)*.25;
        //console.log(speedMod);
        let speed = ((data.data.HT.value+data.data.DX.value)/4)+speedMod;
        //console.log(speed);
        return speed;
    }

    _computePoints(actorData){
        console.log("SJGURPS4E   |  actor: " + actorData.name);
        let points = 0;

        //get the points for the attributes

        //st
        let ST = actorData.data.ST.value;
        console.log("SJGURPS4E   |  ST: " + (ST-10)*10);
        points += (ST-10)*10;

        //dx
        let DX = actorData.data.DX.value;
        console.log("SJGURPS4E   |  DX: " + (DX-10)*20);
        points += (DX-10)*20;

         //iq
         let IQ = actorData.data.IQ.value;
         console.log("SJGURPS4E   |  IQ: " + (IQ-10)*20);
         points += (IQ-10)*20;

        //ht
        let HT = actorData.data.HT.value;
        console.log("SJGURPS4E   |  HT: " + (HT-10)*10);
        points += (HT-10)*10;

        //will
        let Will = actorData.data.Will.value;
        console.log("SJGURPS4E   |  Will: " + (Will-10)*5);
        points += (Will-10)*5;

        //per
        let Per = actorData.data.Per.value;
        console.log("SJGURPS4E   |  Per: " + (Per-10)*5);
        points += (Per-10)*5;

        //hp
        let HP = actorData.data.HP.max;
        console.log("SJGURPS4E   |  HP: " + (HP-ST)*2);
        points += (HP-ST)*2;


        //fp
        let FP = actorData.data.FP.max;
        console.log("SJGURPS4E   |  FP: " + (FP-HT)*3);
        points += (FP-HT)*3;


        //get the points for move and speed
        console.log("SJGURPS4E   |  speedPoints: " + actorData.data.speedPoints);
        points += actorData.data.speedPoints;
        console.log("SJGURPS4E   |  movePoints: " + actorData.data.movePoints);
        points += actorData.data.movePoints;


        // get the points for reaction modifiers 
        if(actorData.data.appCost){
            console.log("SJGURPS4E   |  actor appcost: " + actorData.data.appCost);
            points += Number(actorData.data.appCost);
        }
        if(actorData.data.statusCost){
            console.log("SJGURPS4E   |  actor statusCost: " + actorData.data.statusCost);
            points += Number(actorData.data.statusCost);
        }
        if(actorData.data.repCost){
            console.log("SJGURPS4E   |  actor repCost: " + actorData.data.repCost);
            points += Number(actorData.data.repCost);
        }
        if(actorData.data.react1Cost){
            console.log("SJGURPS4E   |  actor react1Cost: " + actorData.data.react1Cost);
            points += Number(actorData.data.react1Cost);
        }

        //get the point cost for all the owned items on the character sheet
        for(let n = 0; n<actorData.items.length; n++){
            console.log("SJGURPS4E   |  Point Calculation: " + actorData.items[n].name);
            console.log("SJGURPS4E   |  Point Calculation: " + actorData.items[n].type);
            
            if(actorData.items[n].type == "trait"){
                console.log("SJGURPS4E   |  Point Calculation Trait: " + actorData.items[n].data.points);
                points += actorData.items[n].data.points; 
            } else if (actorData.items[n].type == "skill") {
                console.log("SJGURPS4E   |  Point Calculation Skill Level: " + actorData.items[n].data.level);
                let skillLevel = actorData.items[n].data.level;
                // Calculate Point Cost
                if(skillLevel<3){
                    //level 1 is 1 level 2 is 2 level 3 is 4
                    points += skillLevel;
                } else {
                    points += (Number(skillLevel)-2)*4;
                }
            }  
          
        }
        
        console.log("SJGURPS4E   |  Point total: " + points);
        return points;
    }

    _computeDR(actorData){
        // determine settings for the dr scope and set up variables for each location

        //fullsuit covers all locations
        //body covers neck torso groin
        //head covers eyes face skull
        //limbs covers arms and legs

        //we need a base dr for flexable armor in case we have layerd it
        let flexdr = 0;
        // a single location dr for the highest dr torso armor item
        let dr= 0;
        //get the highest DR from equiped items on Torso location
        const equip = "equipment"
        for(let n = 0; n<actorData.items.length; n++){
            let currentItem =  actorData.items[n];
            if(currentItem.data.equiped){
                if(currentItem.data.location == "torso"){
                    if(currentItem.data.flexable && currentItem.data.concealable){
                        if(currentItem.data.dr> flexdr){
                            flexdr = currentItem.data.dr
                        }
                    }else{
                        if(currentItem.data.dr > dr){
                            dr = currentItem.data.dr;
                    }}
                }
            }
        }
        // if we are dealing with a single location for scope
        //just return dr 
        dr = dr+flexdr;
        return dr;

    }
    
}