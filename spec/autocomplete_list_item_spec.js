describe("AutocompleteListItem", function() {
  var subject;
  var testText;
  var testValue;
  var onSelectSpy;

  beforeEach(function() {
    testText = "Test Item";
    testValue = 1;
    onSelectSpy = sinon.spy();
    subject = new AutocompleteListItem({
      onSelect: onSelectSpy,
      item: {
        value: testValue,
        text: testText
      }
    });
  });

  xit("has an element", function() {
    expect(subject.$el).to.exist;
    expect(subject.$el).to.have.class("autocomplete-list-item");
    expect(subject.$el[0].tagName).to.equal("LI");
  });

  xit("has a value", function() {
    expect(subject.value).to.equal(testValue);
  });

  xit("has text", function() {
    expect(subject.text).to.equal(testText);
  });

  xit("has a template", function() {
    expect(subject.template).to.be.a("function");
    var renderedTemplate = subject.template({ text: "foo" });
    expect(renderedTemplate).to.match(/foo/);
  });

  xit("has an onSelect handler", function() {
    expect(subject.onSelect).to.be.a("function");
  });

  xit("has a active state", function() {
    expect(subject.active).to.be.false;
  });

  describe("#activate", function() {
    beforeEach(function() {
      subject.activate();
    });

    xit("sets active to true", function() {
      expect(subject.active).to.be.true;
    });

    xit("adds the active class to el", function() {
      expect(subject.$el).to.have.class("active");
    });
  });

  describe("#deactivate", function() {
    beforeEach(function() {
      subject.active = true;
      subject.$el.addClass("active");
      subject.deactivate();
    });

    xit("sets active to false", function() {
      expect(subject.active).to.be.false;
    });

    xit("removes the active class from el", function() {
      expect(subject.$el).to.not.have.class("active");
    });
  });

  describe("#select", function() {
    xit("calls the onSelect function, passing itself", function() {
      subject.select();
      expect(subject.onSelect).to.have.been.calledWith(subject);
    });
  });

  describe("#registerEvents", function() {
    xit("handles click", function() {
      subject.$el.trigger("click");
      expect(subject.onSelect).to.have.been.called;
    });
  });
});
