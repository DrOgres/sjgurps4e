
export default class ActorGurps extends Actor {



    prepareData(){
        super.prepareData();
        const actorData = this.data;
        console.log("SJGURPS4E   |    prepareData for actor entities:  " + this.data.name);
        actorData.data.baseSpeed = this._basicSpeed(actorData);
        actorData.data.totalPoints.value = this._computePoints(actorData);
        
        //calculate DR by location for the selected scope of that DR
        actorData.data.singleDR = this._computeDR(actorData, "basic");
        actorData.data.intermediateDR = this._computeDR(actorData, "intermediate");    
        actorData.data.detailedDR = this._computeDR(actorData, "detailed");    
        

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

    _computeDR(actorData, scope){
        // determine settings for the dr scope and set up variables for each location
         //fullsuit covers all locations except head
        //body covers neck torso groin
        //head covers eyes face skull
        //limbs covers arms and legs but not feet or hands

        let faceDR = 0;
        let flexFace = 0;
        let eyesDR = 0;
        let flexEyes = 0;
        let skullDR = 0;
        let flexSkull = 0;
        let neckDr = 0;
        let felxNeck = 0;
        let torsoDR = 0;
        let flexTorso = 0;
        let groinDr = 0;
        let flexGroin = 0;
        let rArmDR = 0;
        let flexRArm = 0;
        let lArmDR = 0;
        let flexLArm = 0;
        let rHandDR = 0;
        let flexRHand = 0;
        let lHandDR = 0;
        let flexLHand = 0;
        let rLegDR = 0;
        let flexRLeg = 0;
        let lLegDR = 0;
        let flexLLeg = 0;
        let rFootDR = 0;
        let flexRFoot = 0;
        let lFootDR = 0;
        let flexLFoot = 0;
        
        console.log("SJGURRPS 4E | DR Scope: " + scope);      
        
        if(scope === "basic"){
            //we need a base dr for flexable armor in case we have layerd it
            let flexdr = 0;
            // a single location dr for the highest dr torso armor item
            let dr= 0;
            //get the highest DR from equiped items on Torso location
            for(let n = 0; n<actorData.items.length; n++){
                let currentItem =  actorData.items[n];
                if(currentItem.data.equiped){
                    if(currentItem.data.location == "torso" || currentItem.data.location == "body" || currentItem.data.location == "fullSuit" ){
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(currentItem.data.dr> flexdr){
                                flexdr = currentItem.data.dr
                            }
                        }else{
                            if(currentItem.data.dr > dr){
                                dr = currentItem.data.dr;
                             }
                        }
                    }
                }
            }
            // if we are dealing with a single location for scope
            //just return dr 
            dr = dr+flexdr;
            return dr;
        } else if (scope === "intermediate"){
            //set up six items for an array for the six hit locations
            let headDR = 0;
            let flexHead = 0;
            let torsoDR = 0;
            let flexTorso = 0;
            let armsDR = 0;
            let flexArms = 0;
            let handsDR = 0;
            let flexHands = 0;
            let legsDR = 0;
            let flexLegs = 0;
            let feetDR = 0;
            let flexFeet = 0;
            for(let n = 0; n<actorData.items.length; n++){
                let currentItem = actorData.items[n];
                let location = currentItem.data.location;
                if(currentItem.data.equiped){
                    if (location == "head" || location == "skull" || location == "face" || location == "eyes"){
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(currentItem.data.dr> flexHead){
                                flexHead = currentItem.data.dr;
                            }
                        }else{
                            if(currentItem.data.dr > headDR){
                                headDR = currentItem.data.dr;
                            }
                        }
                        
                    } else if (location == "body" || location == "neck" || location == "torso" || location == "groin"){
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(currentItem.data.dr> flexTorso){
                                flexTorso = currentItem.data.dr;
                            }
                        }else{
                            if(currentItem.data.dr > torsoDR){
                                torsoDR = currentItem.data.dr;
                            }
                        }
                    } else if (location == "arms" || location == "rArm" || location == "lArm"){
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(currentItem.data.dr> flexArms){
                                flexArms = currentItem.data.dr;
                            }
                        }else{
                            if(currentItem.data.dr > armsDR){
                                armsDR = currentItem.data.dr;
                            }
                        }
                    } else if (location == "legs" || location == "rLeg" || location == "lLeg"){
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(currentItem.data.dr> flexLegs){
                                flexLegs = currentItem.data.dr;
                            }
                        }else{
                            if(currentItem.data.dr > legsDR){
                                legsDR = currentItem.data.dr;
                            }
                        }
                    } else if (location == "hands" || location == "rHand" || location == "lHand"){
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(currentItem.data.dr> flexHands){
                                flexHands = currentItem.data.dr;
                            }
                        }else{
                            if(currentItem.data.dr > handsDR){
                                handsDR = currentItem.data.dr;
                            }
                        }
                    } else if (location == "feet" || location == "rFoot" || location == "lFoot"){
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(currentItem.data.dr> flexFeet){
                                flexFeet = currentItem.data.dr;
                            }
                        }else{
                            if(currentItem.data.dr > feetDR){
                                feetDR = currentItem.data.dr;
                            }
                        }
                    } else if (location == "limbs"){
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(currentItem.data.dr> flexArms){
                                flexArms = currentItem.data.dr;
                            }
                            if (currentItem.data.dr > flexLegs){
                                flexLegs = currentItem.data.dr;
                            }
                        } else {
                            if(currentItem.data.dr > armsDR){
                                armsDR = currentItem.data.dr;
                            }
                            if (currentItem.data.dr > legsDR){
                                legsDR = currentItem.data.dr;
                            }
                        }
                    } else if (location == "fullSuit"){
                        const curDR = currentItem.data.dr;
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(curDR> flexArms){
                                flexArms = curDR;
                            } 
                            if (curDR > flexLegs){
                                flexLegs = curDR;
                            } 
                            if (curDR > flexHead){
                                flexHead = curDR;
                            } 
                            if (curDR > flexHands){
                                flexHands = curDR;
                            } 
                            if (curDR > flexFeet){
                                flexFeet = curDR;
                            } 
                            if (curDR > flexTorso){
                                flexTorso = curDR;
                            }
                        } else {
                            if(curDR > armsDR){
                                armsDR = curDR;
                            }
                            if (curDR> legsDR){
                                legsDR = curDR;
                            } 
                            if (curDR > torsoDR){
                                torsoDR = curDR;
                            }
                            if (curDR > headDR){
                                headDR = curDR;
                            }
                            if (curDR > handsDR){
                                handsDR = curDR;
                            } 
                            if (curDR > feetDR){
                                feetDR = curDR;
                            }
                        }
                    }
                }
            }

            // put the values into an appropriate array that we pass back to get stored 
            // into the data model.
            let dr = [(headDR+flexHead), (torsoDR+flexTorso), (armsDR+flexArms), (handsDR+flexHands), (legsDR+flexLegs), (feetDR+flexFeet)];
            return dr;

        } else if (scope === "detailed"){
            // set up 14 items in an array for the 14 detailed hit locations
           
            
            // face, eyes, skull, neck, torso, groin, r arm, l arm, r hand, l hand
            // r leg, l leg, r foot, l foot
            // head covers skull eyes and face
            // body covers neck, torso and groin
            // limbs cover arms and legs
            // full sut covers all except the head items


            //iterate our items and set the dr to the highest or highest plus flexable concealable armor
            for(let n=0; n<actorData.items.length; n++){
                let currentItem = actorData.items[n];
                let location = currentItem.data.location;
                const curDR = currentItem.data.dr;
                if(currentItem.data.equiped){
                    switch (location){
                        case "face":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(curDR> flexFace){
                                    flexFace = curDR;
                                }
                            }else{
                                if(curDR > faceDR){
                                    faceDR = curDR;
                                }
                            }
                        break;
                        case "eyes":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(curDR> flexEyes){
                                    flexEyes = curDR;
                                }
                            }else{
                                if(curDR > eyesDR){
                                    eyesDR = curDR;
                                }
                            }
                        break;
                        case "skull":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(currentItem.data.dr> flexSkull){
                                    flexSkull = currentItem.data.dr;
                                }
                            }else{
                                if(currentItem.data.dr > skullDR){
                                    skullDR = currentItem.data.dr;
                                }
                            }
                        break;
                        case "neck":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(currentItem.data.dr> felxNeck){
                                    felxNeck = currentItem.data.dr;
                                }
                            }else{
                                if(currentItem.data.dr > neckDr){
                                    neckDr = currentItem.data.dr;
                                }
                            }
                        break;
                        case "torso":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(currentItem.data.dr> flexTorso){
                                    flexTorso = currentItem.data.dr;
                                }
                            }else{
                                if(currentItem.data.dr > torsoDR){
                                    torsoDR = currentItem.data.dr;
                                }
                            }
                        break;
                        case "groin":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(currentItem.data.dr> flexGroin){
                                    flexGroin = currentItem.data.dr;
                                }
                            }else{
                                if(currentItem.data.dr > groinDr){
                                    groinDr = currentItem.data.dr;
                                }
                            }
                            break;
                        case "rArm":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(currentItem.data.dr> flexRArm){
                                    flexRArm = currentItem.data.dr;
                                }
                            }else{
                                if(currentItem.data.dr > rArmDR){
                                    rArmDR = currentItem.data.dr;
                                }
                            }
                            break;
                        case "lArm":
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(currentItem.data.dr> flexLArm){
                                flexLArm = currentItem.data.dr;
                            }
                        }else{
                            if(currentItem.data.dr > lArmDR){
                                lArmDR = currentItem.data.dr;
                            }
                        }
                        break;
                        case "rHand":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(currentItem.data.dr> flexRHand){
                                    flexRHand = currentItem.data.dr;
                                }
                            }else{
                                if(currentItem.data.dr > rHandDR){
                                    rHandDR = currentItem.data.dr;
                                }
                            }
                            break;
                        case "lHand":
                        if(currentItem.data.flexable && currentItem.data.concealable){
                            if(currentItem.data.dr> flexLHand){
                                flexLHand = currentItem.data.dr;
                            }
                        }else{
                            if(currentItem.data.dr > lHandDR){
                                lHandDR = currentItem.data.dr;
                            }
                        }
                        break;
                        case "rLeg":
                                if(currentItem.data.flexable && currentItem.data.concealable){
                                    if(currentItem.data.dr> flexRLeg){
                                        flexRLeg = currentItem.data.dr;
                                    }
                                }else{
                                    if(currentItem.data.dr > rLegDR){
                                        rLegDR = currentItem.data.dr;
                                    }
                                }
                        break;
                        case "lLeg":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(currentItem.data.dr> flexLLeg){
                                    flexLLeg = currentItem.data.dr;
                                }
                            }else{
                                if(currentItem.data.dr > lLegDR){
                                    lLegDR = currentItem.data.dr;
                                }
                            }
                        break;
                        case "rFoot":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(currentItem.data.dr> flexRFoot){
                                    flexRFoot = currentItem.data.dr;
                                }
                            }else{
                                if(currentItem.data.dr > rFootDR){
                                    rFootDR = currentItem.data.dr;
                                }
                            }
                        break;
                        case "lFoot":
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(currentItem.data.dr> flexLFoot){
                                    flexLFoot = currentItem.data.dr;
                                }
                            }else{
                                if(currentItem.data.dr > lFootDR){
                                    lFootDR = currentItem.data.dr;
                                }
                            }
                        break;
                        case "head":  
                           
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(curDR> flexSkull){
                                    flexSkull = curDR;
                                }
                                if (curDR > flexEyes){
                                    flexEyes = curDR;
                                } 
                                if (curDR > flexFace){
                                    flexFace = curDR;
                                }
                            } else {
                                if(curDR > skullDR){
                                    skullDR = curDR;
                                }
                                if (curDR> eyesDR){
                                    eyesDR = curDR;
                                } 
                                if (curDR > faceDR){
                                    faceDR = curDR;
                                }
                            }
                        break;

                        case "body":  
                            
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(curDR> felxNeck){
                                    felxNeck = curDR;
                                } 
                                if (curDR > flexTorso){
                                    flexTorso = curDR;
                                } 
                                if (curDR > flexGroin){
                                    flexGroin = curDR;
                                }
                            } else {
                                if(curDR > neckDr){
                                    neckDr = curDR;
                                }
                                if (curDR> torsoDR){
                                    torsoDR = curDR;
                                } 
                                if (curDR > groinDr){
                                    groinDr = curDR;
                                }
                            }
                        break;
                        case "limbs":  
                            
                                if(currentItem.data.flexable && currentItem.data.concealable){
                                    if (curDR > flexRArm){
                                        flexRArm = curDR;
                                    } 
                                    if (curDR > flexLArm){
                                        flexLArm = curDR;
                                    }
                                    if (curDR > flexRLeg){
                                        flexRLeg = curDR;
                                    }  
                                    if (curDR > flexLLeg){
                                        flexLLeg = curDR;
                                    } 
                                    
                                } else {
                                    
                                    if (curDR > rArmDR){
                                        rArmDR = curDR;
                                    }
                                    if (curDR > lArmDR){
                                        lArmDR = curDR;
                                    }
                                    
                                    if (curDR > rLegDR){
                                        rLegDR = curDR;
                                    } 
                                    if (curDR > lLegDR){
                                        lLegDR = curDR;
                                    }
                                
                                }
                        break;
                        case "fullSuit":  
                            
                            if(currentItem.data.flexable && currentItem.data.concealable){
                                if(curDR> felxNeck){
                                    felxNeck = curDR;
                                } 
                                if (curDR > flexTorso){
                                    flexTorso = curDR;
                                } 
                                if (curDR > flexGroin){
                                    flexGroin = curDR;
                                } 
                                if (curDR > flexRArm){
                                    flexRArm = curDR;
                                } 
                                if (curDR > flexLArm){
                                    flexLArm = curDR;
                                }
                                if (curDR > flexRHand){
                                    flexRHand = curDR;
                                }
                                if (curDR > flexLHand){
                                    flexLHand = curDR;
                                }
                                if (curDR > flexRLeg){
                                    flexRLeg = curDR;
                                }  
                                if (curDR > flexLLeg){
                                    flexLLeg = curDR;
                                } 
                                if (curDR > flexRFoot){
                                    flexRFoot = curDR;
                                } 
                                if (curDR > flexLFoot){
                                    flexLFoot = curDR;
                                }
                            } else {
                                if(curDR > neckDr){
                                    neckDr = curDR;
                                }
                                if (curDR> torsoDR){
                                    torsoDR = curDR;
                                } 
                                if (curDR > groinDr){
                                    groinDr = curDR;
                                }
                                if (curDR > rArmDR){
                                    rArmDR = curDR;
                                }
                                if (curDR > lArmDR){
                                    lArmDR = curDR;
                                }
                                if (curDR > rHandDR){
                                    rHandDR = curDR;
                                }
                                if (curDR > lHandDR){
                                    lHandDR = curDR;
                                }
                                if (curDR > rLegDR){
                                    rLegDR = curDR;
                                } 
                                if (curDR > lLegDR){
                                    lLegDR = curDR;
                                }
                                if (curDR > rFootDR){
                                    rFootDR = curDR;
                                }
                                if (curDR > lFootDR){
                                    lFootDR = curDR;
                                }
                            }
                       
                    }
                }
            }

           let dr = [(faceDR+flexFace),(eyesDR+flexEyes),(skullDR+flexSkull),(neckDr+felxNeck),(torsoDR+flexTorso),(groinDr+flexGroin),(rArmDR+flexRArm),(lArmDR+flexLArm),(rHandDR+flexRHand),(lHandDR+flexLHand),(rLegDR+flexRLeg),(lLegDR+flexLLeg),(rFootDR+flexRFoot),(lFootDR+flexLFoot)];
           return dr;
        }
        console.log("SJGURPS4E    |     ERROR ON DR CALCULATION SETTING FOR LOCATION SCOPE FAILED TO READ");
        return null;

    }
    
}