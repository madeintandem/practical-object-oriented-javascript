describe("Autocomplete", function() {
  var subject;
  var items;
  beforeEach(function() {
    appendFixture("input", { id: "autocomplete", type: "text", name: "autocomplete" });
    items = [
      { value: 1, text: "Test item 1" },
      { value: 2, text: "Test item 2" },
      { value: 3, text: "Test item 3" }
    ];
    subject = new Autocomplete({ selector: "#autocomplete", url: "test" });
  });

  it("requires a selector", function() {
    expect(function() {
      new Autocomplete;
    }).to.throw("Autocomplete: selector is undefined");
  });

  it("requires a url or an items array", function() {
    expect(function() {
      new Autocomplete({ selector: "#autocomplete" });
    }).to.throw("Autocomplete: items or url is undefined");
  });

  describe("initialize", function() {
    it("has a reference to the input", function() {
      expect(subject.$input).to.exist;
      expect(subject.$input).to.have.id("autocomplete");
      expect(subject.$input[0].tagName).to.equal("INPUT");
    });

    it("wraps the element in an .autocomplete-container", function() {
      expect(subject.$el).to.exist;
      expect(subject.$el).to.have.class("autocomplete-container");
    });

    it("hides the original input", function() {
      expect(subject.$input).not.to.be.visible;
    });

    it("creates a filter input", function() {
       var expectedName = subject.$input.attr("name") + "_autocomplete_input";
      expect(subject.autocompleteInput).to.be.an.instanceof(AutocompleteInput);
      expect(subject.autocompleteInput.name).to.equal(expectedName);
      expect(subject.autocompleteInput.value).to.equal(subject.$input.val());
      expect(subject.autocompleteInput.onTextEntry).to.equal(subject.adapter.handleTextEntry);
      expect(subject.autocompleteInput.onCommandEntry).to.equal(subject.completionList.handleCommandEntry);
    });

    it("creates a list for autocompleted items", function() {
      expect(subject.completionList).to.be.an.instanceof(AutocompleteList);
      expect(subject.completionList.onItemSelect).to.equal(subject.handleItemSelect);
    });

    it("has a default onAutocomplete callback", function() {
      expect(subject.onAutocomplete).to.be.a("function");
    });

    describe("onAutocomplete callback", function() {
      it("sets the onAutocomplete callback", function() {
        var callback = function() {};
        subject = new Autocomplete({
          selector: "#autocomplete",
          items: items,
          onAutocomplete: callback
        });

        expect(subject.onAutocomplete).to.equal(callback);
      });
    });

    describe("when items are passed", function() {
      it("has a local adapter", function() {
        subject = new Autocomplete({
          selector: "#autocomplete",
          items: items
        });
        expect(subject.adapter).to.be.an.instanceof(AutocompleteLocalAdapter);
      });
    });
  });

  describe("#render", function() {
    it("appends the autocomplete input to the element", function() {
      expect(subject.$el).to.have.descendants(".autocomplete-input");
    });

    it("appends the autocomplete list to the element", function() {
      expect(subject.$el).to.have.descendants(".autocomplete-list");
    });
  });

  describe("#handleItemSelect", function() {
    var item;
    beforeEach(function() {
      sinon.spy(subject, "onAutocomplete");
      item = new AutocompleteListItem({ item: _.first(items) });
      subject.handleItemSelect(item);
    });

    it("sets the $input's value to the item's value", function() {
      expect(subject.$input.val()).to.equal(item.value.toString());
    });

    it("displays the item's text in the autocomplete input", function() {
      expect(subject.autocompleteInput.$el).to.have.value(item.text);
    });

    it("calls the onAutocomplete callback, passing it the selected item", function() {
      expect(subject.onAutocomplete).to.have.been.calledWith(item);
    });
  });
});
