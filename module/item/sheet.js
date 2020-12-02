
export default class ItemSheetGurps extends ItemSheet{

    constructor(...args) {
        super(...args);
    }


    static get defaultOptions(){
        return mergeObject(super.defaultOptions, {
            width : 650, 
            height: 350,
            classes: ["sjgurps4e", "sheet", "item"],
            resizable: true,
            scrollY: [".tab.details"],
            tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "description"}]
        });
    }

    get template() {
        const path = "systems/sjgurps4e/templates/items";
        return `${path}/${this.item.data.type}.hbs`;
    }

    async getData(options) {
        const data = super.getData(options);
        data.labels = this.item.labels;
        data.config = CONFIG.sjgurps4e;
        
        //uncomment to debug item data
        //console.log("SJGURPS 4E   |    Item Data: " + data.data.damageFormula);

        //Item Type and details
        data.itemClass = data.item.type.titleCase();
       // console.log(data.itemClass + " itemClass data from itemsheet");        
        data.weaponType = data.item.data.weaponType;
        data.isRangedWeapon = this._isRangedWeapon(data.item);
        data.isSkill = this._isSkill(data.item.type);
        data.isSpell = this.__isSpell(data.item.type);
        data.isLanguage = this._isLanguage(data.item);
        //data.skillUsed = data.item.data.skillUsed;

        //console.log(data.item.data.skillUsed + " item data from itemsheet");
        //console.log(data.item.data.cost);
        //console.log(data.item.data.weight);
        //console.log(data.weaponType);
        //console.log(data.weaponType + " getdata()");
        //console.log(this.item.data.type  + " getdata()");
        //console.log(data.isSkill);
        return data;

    }

     /* -------------------------------------------- */
  /*  Form Submission                             */
	/* -------------------------------------------- */

  /** @override */
  _getSubmitData(updateData={}) {

    // Create the expanded update data object
    const fd = new FormDataExtended(this.form, {editors: this.editors});
    let data = fd.toObject();
    if ( updateData ) data = mergeObject(data, updateData);
    else data = expandObject(data);

    // Handle Damage array
    const damage = data.data?.damage;
    if ( damage ) damage.parts = Object.values(damage?.parts || {}).map(d => [d[0] || "", d[1] || "", d[2] || ""]);

    // Return the flattened submission data
    return flattenObject(data);
  }

    activateListeners(html){
        super.activateListeners(html);
        //console.log("*-* activated listener");

        if ( this.isEditable ) {
            html.find('.rollable').click(this._onRoll.bind(this));
            html.find('.damage-control').click(this._onDamageControl.bind(this));
            }

        if (!this.isEditable) {
            //console.log("*-* not editable");
            return;
        }
    }

    /** if this is a ranged weapon we want to know that so we can use the correct data fields */
    
    _isLanguage(item) {
        const data = item.data;
        //console.log(data.traitType); 

        if(data.traitType === "traitLanguage"){
            data.isLanguage = true;
        }

        return data.isLanguage;

    }
    _isRangedWeapon(item) {
        const data = item.data;
        //console.log(data.weaponType + " is ranged weapon");
        //console.log(item.weaponType);
        if(data.itemType === "weaponRanged"){
            data.isRangedWeapon = true;
        }
        return (data.isRangedWeapon);
    }

    _isSkill(type) {
        //console.log(type + " isSkill");
        return (type === "skill");
    }

    __isSpell(type) {
        return (type === "spell");
    }

    
    _updateObject(event, formData){
        //console.log("*-* updated");
        // Update the Item
        super._updateObject(event, formData);
    }

    _onRoll(event){
            event.preventDefault();
            const element = event.currentTarget;
            const dataset = element.dataset;
        
            if(dataset.roll){
                let roll = new roll(dataset.roll, this.actor.data.data);
                let label = dataset.label ? `Rolling ${dataset.label}` : '';
                roll.roll().toMessage({
                    speaker: ChatMessage.getSpeaker({ actor: this.actor}),
                    flavor: label
                });
        
            }
    }

     /**
   * Add or remove a damage part from the damage formula
   * @param {Event} event     The original click event
   * @return {Promise}
   * @private
   */
    async _onDamageControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
        console.log(this.item.data.data);
    // Add new damage component
    
    if ( a.classList.contains("add-damage") ) {
        await this._onSubmit(event);  // Submit any unsaved changes
        const damage = this.item.data.data.damage;
        //console.log("peeking" + damage);
        return this.item.update({"data.damage.parts": damage.parts.concat([["", "", ""]])});
      }
  
      // Remove a damage component
      if ( a.classList.contains("delete-damage") ) {
        await this._onSubmit(event);  // Submit any unsaved changes
        const li = a.closest(".damage-part");
        const damage = duplicate(this.item.data.data.damage);
        damage.parts.splice(Number(li.dataset.damagePart), 1);
        return this.item.update({"data.damage.parts": damage.parts});
      }
  }

 
    async _onSubmit(...args) {
    if ( this._tabs[0].active === "details" ) this.position.height = "auto";
    await super._onSubmit(...args);
  }


}
