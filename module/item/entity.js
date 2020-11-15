export default class ItemGurps extends Item {

      /**
   * Prepare an object of chat data used to display a card for the Item in the chat log
   * @param {Object} htmlOptions    Options used by the TextEditor.enrichHTML function
   * @return {Object}               An object of chat data to render
   */
  getChatData(htmlOptions={}) {
    const data = duplicate(this.data.data);
    //console.log(data.description.value);
    const labels = this.labels;

    // Rich text description
    data.description.chat = TextEditor.enrichHTML(data.description.value, htmlOptions);

    // Item type specific properties
    const props = [];
    const fn = this[`_${this.data.type}ChatData`];
    if ( fn ) fn.bind(this)(data, labels, props);

    // Filter properties and return
    data.properties = props.filter(p => !!p);
    return data;
  }

  prepareData(){
      super.prepareData();

      const itemData = this.data;
      const data = itemData.data;
      const C = CONFIG.sjgurps4e;
      const labels = {};

      this.labels = labels
  }
    
}