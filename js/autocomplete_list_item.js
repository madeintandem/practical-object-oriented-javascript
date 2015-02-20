function AutocompleteListItem(attributes) {
  _.bindAll(this);
  attributes = attributes || {};
  _.defaults(attributes, {
    onSelect: function() {}
  });

  this.value = attributes.item.value;
  this.text = attributes.item.text;
  this.onSelect = attributes.onSelect;
  this.$el = $(this.template({
    value: this.value,
    text: this.text
  }));
  this.active = false;

  this.registerEvents();
}

_.merge(AutocompleteListItem.prototype, {

  template: _.template('<li class="autocomplete-list-item"><a href="#"><%= text %></a></li>'),

  activate: function() {
    this.active = true;
    this.$el.addClass("active");
  },

  deactivate: function() {
    this.active = false;
    this.$el.removeClass("active");
  },

  registerEvents: function() {
    this.$el.on("click", this.select);
  },

  select: function() {
    this.onSelect(this);
  }

});
