describe("AutocompleteLocalAdapter", function() {
  var subject;
  var items;
  var onAutocompleteSpy;
  beforeEach(function() {
    items = [
      { value: 1, text: "Test item 1" },
      { value: 2, text: "Test item 2" },
      { value: 3, text: "Test item 3" }
    ];
    onAutocompleteSpy = sinon.spy();
    subject = new AutocompleteLocalAdapter({
      items: items,
      onAutocomplete: onAutocompleteSpy
    });
  });

  it("requires items", function() {
    expect(function() {
      new AutocompleteLocalAdapter;
    }).to.throw("AutocompleteLocalAdapter: items is undefined");
  });

  it("has an onAutocomplete callback", function() {
    expect(subject.onAutocomplete).to.equal(onAutocompleteSpy);
  });

  describe("defaults", function() {
    beforeEach(function() {
      subject = new AutocompleteLocalAdapter({
        items: items
      });
    });

    it("has a default onAutocomplete handler", function() {
      expect(subject.onAutocomplete).to.be.a("function");
    });
  });

  describe("#handleTextEntry", function() {
    describe("when empty text is passed", function() {
      it("calls the onAutocomplete callback, passing an empty array of items", function() {
        subject.handleTextEntry("");
        expect(subject.onAutocomplete).to.have.been.calledWith([]);
      });
    });

    describe("when text is passed", function() {
      beforeEach(function() {
        subject.handleTextEntry("Test item 3");
      });

      it("calls the onAutocomplete callback, passing an array of matching items", function() {
        expect(subject.onAutocomplete).to.have.been.calledWith([_.last(items)]);
      });
    });
  });
});
