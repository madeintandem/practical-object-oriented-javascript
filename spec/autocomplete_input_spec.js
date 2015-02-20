describe("AutocompleteInput", function() {
  var subject;
  var name;
  var value;
  var onTextEntrySpy;
  var onCommandEntrySpy;
  beforeEach(function() {
    name = "test";
    value = "test value";
    onTextEntrySpy = sinon.spy();
    onCommandEntrySpy = sinon.spy();
    subject = new AutocompleteInput({
      name: name,
      value: value,
      onTextEntry: onTextEntrySpy,
      onCommandEntry: onCommandEntrySpy
    });
  });

  xit("requires a name", function() {
    expect(function() {
      new AutocompleteInput({ value: value });
    }).to.throw("AutocompleteInput: name is undefined");
  });

  xit("requires a value", function() {
    expect(function() {
      new AutocompleteInput({ name: name });
    }).to.throw("AutocompleteInput: value is undefined");
  });

  xit("has a name with `_autocomplete_input` appended", function() {
    expect(subject.name).to.equal(name + "_autocomplete_input");
  });

  xit("has a value", function() {
    expect(subject.value).to.equal(value);
  });

  xit("has an element", function() {
    expect(subject.$el).to.exist;
    expect(subject.$el).to.have.class("autocomplete-input");
    expect(subject.$el).to.have.attr("name", name + "_autocomplete_input");
    expect(subject.$el).to.have.attr("value", value);
  });

  xit("has an onTextEntry handler", function() {
    expect(subject.onTextEntry).to.equal(onTextEntrySpy);
  });

  xit("has an onCommandEntry handler", function() {
    expect(subject.onCommandEntry).to.equal(onCommandEntrySpy);
  });

  describe("defaults", function() {
    beforeEach(function() {
      subject = new AutocompleteInput({
        name: name,
        value: value
      });
    });

    xit("has a default onTextEntry handler", function() {
      expect(subject.onTextEntry).to.be.a("function");
    });

    xit("has a default onCommandEntry handler", function() {
      expect(subject.onCommandEntry).to.be.a("function");
    });
  });

  xit("has a command keycodes constant", function() {
    expect(AutocompleteInput.CMD_KEYCODES.up).to.equal(38);
    expect(AutocompleteInput.CMD_KEYCODES.down).to.equal(40);
    expect(AutocompleteInput.CMD_KEYCODES.escape).to.equal(27);
    expect(AutocompleteInput.CMD_KEYCODES.enter).to.equal(13);

    expect(AutocompleteInput.CMD_KEYCODES[38]).to.equal("up");
    expect(AutocompleteInput.CMD_KEYCODES[40]).to.equal("down");
    expect(AutocompleteInput.CMD_KEYCODES[27]).to.equal("escape");
    expect(AutocompleteInput.CMD_KEYCODES[13]).to.equal("enter");
  });

  describe("#template", function() {
    var templateValues;
    var renderedTemplate;
    beforeEach(function() {
      templateValues = {
        name: "test_name",
        value: "test_value"
      };
      renderedTemplate = subject.template(templateValues);
    });

    xit("is an input", function() {
      expect(renderedTemplate).to.match(/^\<input/);
    });

    xit("has a name parameter", function() {
      expect(renderedTemplate).to.match(/name=\'test_name\'/);
    });

    xit("has a value parameter", function() {
      expect(renderedTemplate).to.match(/value=\'test_value\'/);
    });

    xit("has an autocomplete-input class", function() {
      expect(renderedTemplate).to.match(/class=\'autocomplete-input\'/);
    });
  });

  describe("#isCommandKey", function() {
    xit("returns true when a command keyCode is given", function() {
      expect(subject.isCommandKey(38)).to.be.true;
      expect(subject.isCommandKey(40)).to.be.true;
      expect(subject.isCommandKey(27)).to.be.true;
      expect(subject.isCommandKey(13)).to.be.true;
    });

    xit("returns false when a non command keyCode is given", function() {
      expect(subject.isCommandKey(84)).to.be.false;
    });
  });

  describe("#onKeyup", function() {
    describe("command", function() {
      beforeEach(function() {
        subject.handleKeyup({ keyCode: AutocompleteInput.CMD_KEYCODES.enter });
      });

      xit("does not call the onTextEntry callback", function() {
        expect(subject.onTextEntry).to.not.have.been.called;
      });

      xit("calls the onCommandEntry callback with the given command", function() {
        expect(subject.onCommandEntry).to.have.been.calledWith("enter");
      });
    });

    describe("text", function() {
      beforeEach(function() {
        subject.$el.val("test");
        subject.handleKeyup({ keyCode: 84 });
      });

      xit("calls the onTextEntry callback", function() {
        expect(subject.onTextEntry).to.have.been.calledWith("test");
      });

      xit("does not call the onCommandEntry callback with the given command", function() {
        expect(subject.onCommandEntry).not.to.have.been.called;
      });
    });
  });
});
