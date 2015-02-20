function Autocomplete(attributes) {
  _.bindAll(this);
  attributes = attributes || {};

  if (_.isUndefined(attributes.selector)) {
    throw new Error("Autocomplete: selector is undefined");
  }
  if (_.isUndefined(attributes.items || attributes.url)) {
    throw new Error("Autocomplete: items or url is undefined");
  }

  this.initialize(attributes.selector, attributes.items || attributes.url, attributes.onAutocomplete);
}

_.merge(Autocomplete.prototype, {

  initialize: function(selector, itemsOrUrl, onAutocomplete) {
    this.onAutocomplete = onAutocomplete || function() {};
    this.setupInput(selector);
    this.$el = this.$input.parent();
    this.completionList = new AutocompleteList({ onItemSelect: this.handleItemSelect });
    this.createAdapter(itemsOrUrl);
    this.autocompleteInput = new AutocompleteInput({
      name: this.$input.attr("name"),
      value: this.$input.val(),
      onTextEntry: this.adapter.handleTextEntry,
      onCommandEntry: this.completionList.handleCommandEntry
    });
    this.render();
  },

  setupInput: function(selector) {
    this.$input = $(selector);
    this.$input.wrap("<div class='autocomplete-container' />");
    this.$input.hide();
  },

  createAdapter: function(itemsOrUrl) {
    if (_.isArray(itemsOrUrl)) {
      this.adapter = new AutocompleteLocalAdapter({
        items: itemsOrUrl,
        onAutocomplete: this.completionList.render
      });
    } else {
      this.adapter = new AutocompleteAjaxAdapter({
        url: itemsOrUrl,
        onAutocomplete: this.completionList.render
      });
    }
  },

  render: function() {
    this.$el.append(this.autocompleteInput.$el);
    this.$el.append(this.completionList.$el);
  },

  handleItemSelect: function(item) {
    this.$input.val(item.value);
    this.autocompleteInput.$el.val(item.text);
    this.onAutocomplete(item);
  }

});

