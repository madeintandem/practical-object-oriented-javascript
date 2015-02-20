function AutocompleteInput(attributes) {
  _.bindAll(this);
  attributes = attributes || {};
  _.defaults(attributes, {
    onTextEntry: function() {},
    onCommandEntry: function() {}
  });

  if (_.isUndefined(attributes.name)) {
    throw new Error("AutocompleteInput: name is undefined");
  }
  if (_.isUndefined(attributes.value)) {
    throw new Error("AutocompleteInput: value is undefined");
  }

  this.name = attributes.name + "_autocomplete_input";
  this.value = attributes.value;
  this.onTextEntry = attributes.onTextEntry;
  this.onCommandEntry = attributes.onCommandEntry;
  this.$el = $(this.template({
    name: this.name,
    value: this.value
  }));
  this.$el.on("keyup", this.handleKeyup);
}

AutocompleteInput.CMD_KEYCODES = {
  up: 38,
  down: 40,
  escape: 27,
  enter: 13
};

AutocompleteInput.CMD_KEYCODES = _.merge(AutocompleteInput.CMD_KEYCODES, _.invert(AutocompleteInput.CMD_KEYCODES));

_.merge(AutocompleteInput.prototype, {

  template: _.template("<input name='<%= name %>' class='autocomplete-input' value='<%= value %>' />"),

  isCommandKey: function(keyCode) {
    return _.contains(AutocompleteInput.CMD_KEYCODES, keyCode);
  },

  handleKeyup: function(evnt) {
    if (this.isCommandKey(evnt.keyCode)) {
      var command = AutocompleteInput.CMD_KEYCODES[evnt.keyCode];
      this.onCommandEntry(command);
    } else {
      this.onTextEntry(this.$el.val());
    }
  }

});
