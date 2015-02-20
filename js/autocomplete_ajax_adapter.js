function AutocompleteAjaxAdapter(attributes) {
  _.bindAll(this);
  attributes = attributes || {};
  _.defaults(attributes, {
    onAutocomplete: function() {}
  });

  if (_.isUndefined(attributes.url)) {
    throw new Error("AutocompleteAjaxAdapter: url is undefined");
  }

  this.url = attributes.url;
  this.onAutocomplete = attributes.onAutocomplete;
  this.throttleDelay = 250;
}

_.merge(AutocompleteAjaxAdapter.prototype, {

  handleTextEntry: function(text) {
    this.query = text;
    if (this.queuedRequest) {
      clearTimeout(this.queuedRequest);
    }
    if (!text) {
      this.onAutocomplete([]);
      return;
    }
    this.queueRequest();
  },

  fetchItems: function() {
    $.ajax({
      url: this.url,
      type: "get",
      dataType: "json",
      data: { query: this.query }
    })
      .done(this.onAutocomplete);
  },

  queueRequest: function() {
    var _this = this;
    this.queuedRequest = setTimeout(function() {
      _this.fetchItems();
    }, this.throttleDelay);
  }

});

