describe("AutocompleteList", function() {
  var subject;
  var item1;
  var item2;
  var item3;
  var items;
  var onItemSelectSpy;
  beforeEach(function() {
    item1 = { value: 1, text: "Test item 1" };
    item2 = { value: 2, text: "Test item 2" };
    item3 = { value: 3, text: "Test item 3" };
    items = [item1, item2, item3];
    onItemSelectSpy = sinon.spy();
    subject = new AutocompleteList({ onItemSelect: onItemSelectSpy });
  });

  it("has an element", function() {
    expect(subject.$el).to.exist;
    expect(subject.$el[0].tagName).to.equal("UL");
    expect(subject.$el).to.have.class("autocomplete-list");
    expect(subject.$el).to.have.class("hidden");
  });

  it("has an onItemSelect handler", function() {
    expect(subject.onItemSelect).to.equal(onItemSelectSpy);
  });

  describe("defaults", function() {
    beforeEach(function() {
      subject = new AutocompleteList();
    });

    it("has an onItemSelect handler", function() {
      expect(subject.onItemSelect).to.be.a("function");
    });
  });

  describe("#render", function() {
    beforeEach(function() {
      subject.render(items);
    });

    it("creates an completionListItem for each item", function() {
      expect(subject.items).to.be.an("Array");
      expect(subject.items.length).to.equal(items.length);
      _.each(subject.items, function(item) {
        expect(item).to.be.an.instanceof(AutocompleteListItem);
      });
    });

    it("appends each item to the element", function() {
      expect(subject.$el).to.have.descendants("li");
    });

    it("removes the hidden class", function() {
      expect(subject.$el).not.to.have.class("hidden");
    });

    it("does not double render the items", function() {
      subject.render(items);
      expect(subject.$el.find("li").length).to.equal(items.length);
    });

    describe("when there are no items", function() {
      beforeEach(function() {
        subject.$el.removeClass("hidden");
        subject.$el.empty();
      });

      it("it adds the hidden class", function() {
        subject.render([]);
        expect(subject.$el).to.have.class("hidden");
      });

      it("does not throw an error when items are undefined", function() {
        expect(function() {
          subject.render();
        }).not.to.throw();
      });
    });
  });

  describe("#hide", function() {
    it("adds the hidden class to the element", function() {
      subject.$el.removeClass("hidden");
      subject.hide();
      expect(subject.$el).to.have.class("hidden");
    });
  });

  describe("#show", function() {
    it("removes the hidden class from the element", function() {
      subject.$el.addClass("hidden");
      subject.show();
      expect(subject.$el).not.to.have.class("hidden");
    });
  });

  describe("#handleItemSelect", function() {
    var selectedItem;
    beforeEach(function() {
      subject.render(items);
      subject.show();
      selectedItem = _.first(subject.items);
      subject.handleItemSelect(selectedItem);
    });

    it("calls the onItemSelect callback, passing the item clicked", function() {
      expect(subject.onItemSelect).to.have.been.calledWith(selectedItem);
    });

    it("hides the completion list", function() {
      expect(subject.$el).to.have.class("hidden");
    });
  });

  describe("#activeItem", function() {
    beforeEach(function() {
      subject.createListItems(items);
    });

    it("returns undefined when no item is active", function() {
      expect(subject.activeItem()).to.be.undefined;
    });

    it("returns the active item when one is active", function() {
      var activeItem = _.first(subject.items);
      activeItem.activate();
      expect(subject.activeItem()).to.equal(activeItem);
    });
  });

  describe("#nextItem", function() {
    beforeEach(function() {
      subject.createListItems(items);
    });

    describe("when no items are active", function() {
      it("returns the first item", function() {
        expect(subject.nextItem()).to.equal(_.first(subject.items));
      });
    });

    describe("when an item is active", function() {
      beforeEach(function() {
        _.first(subject.items).activate();
      });

      it("returns the next item in the items array", function() {
        expect(subject.nextItem()).to.equal(subject.items[1]);
      });
    });

    describe("when the last item is already active", function() {
      it("returns the first item", function() {
        _.last(subject.items).activate();
        expect(subject.nextItem()).to.equal(_.first(subject.items));
      });
    });
  });

  describe("#activateNextItem", function() {
    beforeEach(function() {
      subject.createListItems(items);
    });

    describe("when no items are active", function() {
      it("activates the first item", function() {
        subject.activateNextItem();
        expect(_.first(subject.items).active).to.be.true;
      });
    });

    describe("when an item is active", function() {
      beforeEach(function() {
        _.first(subject.items).activate();
        subject.activateNextItem();
      });

      it("activates the next item in the items array", function() {
        expect(subject.items[1].active).to.be.true;
      });

      it("deactivates the previously active item", function() {
        expect(_.first(subject.items).active).to.be.false;
      });
    });

    describe("when the last item is already active", function() {
      it("activates the first item", function() {
        _.last(subject.items).activate();
        subject.activateNextItem();
        expect(_.first(subject.items).active).to.be.true;
      });
    });
  });

  describe("#previousItem", function() {
    beforeEach(function() {
      subject.createListItems(items);
    });

    describe("when no items are active", function() {
      it("returns the last item", function() {
        expect(subject.previousItem()).to.equal(_.last(subject.items));
      });
    });

    describe("when an item is active", function() {
      beforeEach(function() {
        _.last(subject.items).activate();
      });

      it("returns the next item in the items array", function() {
        expect(subject.previousItem()).to.equal(subject.items[1]);
      });
    });

    describe("when the first item is already active", function() {
      it("returns the last item", function() {
        _.first(subject.items).activate();
        expect(subject.previousItem()).to.equal(_.last(subject.items));
      });
    });
  });

  describe("#activatePreviousItem", function() {
    beforeEach(function() {
      subject.createListItems(items);
    });

    describe("when no items are active", function() {
      it("activates the last item", function() {
        subject.activatePreviousItem();
        expect(_.last(subject.items).active).to.be.true;
      });
    });

    describe("when an item is active", function() {
      beforeEach(function() {
        _.last(subject.items).activate();
        subject.activatePreviousItem();
      });

      it("activates the previous item in the items array", function() {
        expect(subject.items[1].active).to.be.true;
      });

      it("deactivates the previously active item", function() {
        expect(_.last(subject.items).active).to.be.false;
      });
    });

    describe("when the first item is already active", function() {
      it("activates the last item", function() {
        _.first(subject.items).activate();
        subject.activatePreviousItem();
        expect(_.last(subject.items).active).to.be.true;
      });
    });
  });

  describe("#handleCommandEntry", function() {
    beforeEach(function() {
      sinon.stub(subject, "handleUp");
      sinon.stub(subject, "handleDown");
      sinon.stub(subject, "handleEnter");
      sinon.stub(subject, "handleEscape");
    });

    describe("up", function() {
      beforeEach(function() {
        subject.handleCommandEntry("up");
      });

      it("handles up", function() {
        expect(subject.handleUp).to.have.been.called;
        expect(subject.handleDown).to.not.have.been.called;
        expect(subject.handleEnter).to.not.have.been.called;
        expect(subject.handleEscape).to.not.have.been.called;
      });
    });

    describe("down", function() {
      beforeEach(function() {
        subject.handleCommandEntry("down");
      });

      it("handles down", function() {
        expect(subject.handleDown).to.have.been.called;
        expect(subject.handleUp).to.not.have.been.called;
        expect(subject.handleEnter).to.not.have.been.called;
        expect(subject.handleEscape).to.not.have.been.called;
      });
    });

    describe("enter", function() {
      beforeEach(function() {
        subject.handleCommandEntry("enter");
      });

      it("handles enter", function() {
        expect(subject.handleEnter).to.have.been.called;
        expect(subject.handleUp).to.not.have.been.called;
        expect(subject.handleDown).to.not.have.been.called;
        expect(subject.handleEscape).to.not.have.been.called;
      });
    });

    describe("escape", function() {
      beforeEach(function() {
        subject.handleCommandEntry("escape");
      });

      it("handles escape", function() {
        expect(subject.handleEscape).to.have.been.called;
        expect(subject.handleUp).to.not.have.been.called;
        expect(subject.handleDown).to.not.have.been.called;
        expect(subject.handleEnter).to.not.have.been.called;
      });
    });
  });

  describe("#handleDown", function() {
    beforeEach(function() {
      sinon.spy(subject, "activateNextItem");
      subject.createListItems(items);
      subject.handleDown();
    });

    it("activates the next item", function() {
      expect(subject.activateNextItem).to.have.been.called;
    });
  });

  describe("#handleUp", function() {
    beforeEach(function() {
      subject.createListItems(items);
      sinon.spy(subject, "activatePreviousItem");
      subject.handleUp();
    });

    it("activates the previous item", function() {
      expect(subject.activatePreviousItem).to.have.been.called;
    });
  });

  describe("#handleEscape", function() {
    beforeEach(function() {
      sinon.spy(subject, "hide");
      subject.handleEscape();
    });

    it("hides the list", function() {
      expect(subject.hide).to.have.been.called;
    });
  });

  describe("#handleEnter", function() {
    describe("when an item is active", function() {
      var item;
      beforeEach(function() {
        subject.createListItems(items);
        item = _.first(subject.items);
        item.activate();
        sinon.spy(item, "select");
        subject.handleEnter();
      });

      it("selects the active item", function() {
        expect(item.select).to.have.been.called;
      });
    });

    describe("when there is no active item", function() {
      it("does not throw an error", function() {
        expect(function() {
          subject.handleEnter();
        }).not.to.throw();
      });
    });
  });
});
