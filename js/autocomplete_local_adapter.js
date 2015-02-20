function AutocompleteLocalAdapter(attributes) {
  _.bindAll(this);
  attributes = attributes || {};
  _.defaults(attributes, {
    onAutocomplete: function() {}
  });

  if (_.isUndefined(attributes.items)) {
    throw new Error("AutocompleteLocalAdapter: items is undefined");
  }

  this.items = attributes.items;
  this.onAutocomplete = attributes.onAutocomplete;
}

_.merge(AutocompleteLocalAdapter.prototype, {

  handleTextEntry: function(text) {
    var items = [];
    if (text) {
      this.filter = new RegExp("^" + text, "i");
      items = _.filter(this.items, this.itemMatchesFilter);
    }
    this.onAutocomplete(items);
  },

  itemMatchesFilter: function(item) {
    return item.text.match(this.filter);
  }

});
