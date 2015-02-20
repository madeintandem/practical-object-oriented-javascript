function AutocompleteList(attributes) {
  _.bindAll(this);
  attributes = attributes || {};
  _.defaults(attributes, {
    onItemSelect: function() {}
  });

  this.onItemSelect = attributes.onItemSelect;
  this.$el = $("<ul class='autocomplete-list hidden'/>");
}

_.merge(AutocompleteList.prototype, {

  render: function(items) {
    this.$el.empty();
    if (_.isEmpty(items)) {
      this.hide();
    } else {
      this.createListItems(items);
      this.renderItems();
      this.show();
    }
  },

  hide: function() {
    this.$el.addClass("hidden");
  },

  show: function() {
    this.$el.removeClass("hidden");
  },

  handleItemSelect: function(item) {
    this.onItemSelect(item);
    this.hide();
  },

  createListItems: function(items) {
    this.items = _.map(items, this.createListItem);
  },

  createListItem: function(item) {
    return new AutocompleteListItem({ item: item, onSelect: this.handleItemSelect });
  },

  renderItems: function() {
    _.each(this.items, this.renderItem);
  },

  renderItem: function(item) {
    this.$el.append(item.$el);
  },

  activeItem: function() {
    return _.find(this.items, "active");
  },

  nextItem: function() {
    var nextIndex = _.indexOf(this.items, this.activeItem()) + 1;
    var nextItem = this.items[nextIndex] || _.first(this.items);
    return nextItem;
  },

  activateNextItem: function() {
    var currentlySelected = this.activeItem();
    this.nextItem().activate();
    if (currentlySelected) {
      currentlySelected.deactivate();
    }
  },

  previousItem: function() {
    var previousIndex = _.indexOf(this.items, this.activeItem()) - 1;
    var previousItem = this.items[previousIndex] || _.last(this.items);
    return previousItem;
  },

  activatePreviousItem: function() {
    var currentlySelected = this.activeItem();
    this.previousItem().activate();
    if (currentlySelected) {
      currentlySelected.deactivate();
    }
  },

  handleCommandEntry: function(command) {
    this["handle" + _.capitalize(command)]();
  },

  handleDown: function() {
    this.activateNextItem();
  },

  handleUp: function() {
    this.activatePreviousItem();
  },

  handleEnter: function() {
    var activeItem = this.activeItem();
    if (activeItem) {
      activeItem.select();
    }
  },

  handleEscape: function() {
    this.hide();
  }

});
