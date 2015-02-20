describe("AutocompleteAjaxAdapter", function() {
  var subject;
  var onAutocompleteSpy;
  var xhr;
  var requests;
  beforeEach(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function(xhr) {
      requests.push(xhr);
    };
    onAutocompleteSpy = sinon.spy();
    subject = new AutocompleteAjaxAdapter({
      url: "test",
      onAutocomplete: onAutocompleteSpy
    });
  });

  it("requires a url", function() {
    expect(function() {
      new AutocompleteAjaxAdapter;
    }).to.throw("AutocompleteAjaxAdapter: url is undefined");
  });

  it("has a url", function() {
    expect(subject.url).to.equal("test");
  });

  it("has an onAutocomplete handler", function() {
    expect(subject.onAutocomplete).to.equal(onAutocompleteSpy);
  });

  it("has a throttle delay", function() {
    expect(subject.throttleDelay).to.be.a("number");
  });

  describe("defaults", function() {
    beforeEach(function() {
      subject = new AutocompleteAjaxAdapter({
        url: "test"
      });
    });

    it("has a default onAutocomplete handler", function() {
      expect(subject.onAutocomplete).to.be.a("function");
    });
  });

  describe("#handleTextEntry", function() {
    var text;
    beforeEach(function() {
      text = "test query";
      sinon.spy(window, "clearTimeout");
      sinon.spy(subject, "queueRequest");
    });

    afterEach(function() {
      clearTimeout.restore();
    });

    it("sets the query", function() {
      subject.handleTextEntry(text);
      expect(subject.query).to.equal(text);
    });

    it("queues a request", function() {
      subject.handleTextEntry(text);
      expect(subject.queueRequest).to.have.been.called;
    });

    describe("when there's a queued request", function() {
      it("clears the timeout", function() {
        subject.queuedRequest = 5;
        subject.handleTextEntry(text);
        expect(clearTimeout).to.have.been.calledWith(5);
      });
    });

    describe("when there is not a queued request", function() {
      it("does nothing", function() {
        subject.handleTextEntry(text);
        expect(clearTimeout).not.to.have.been.called;
      });
    });

    describe("when the text is empty", function() {
      it("does not queue a request", function() {
        subject.handleTextEntry("");
        expect(subject.queuedRequest).to.be.undefined;
      });

      it("clears a request out", function() {
        subject.queuedRequest = 15;
        subject.handleTextEntry("");
        expect(clearTimeout).to.have.been.calledWith(subject.queuedRequest);
      });

      it("sends an empty array to the on autocomplete callback", function() {
        subject.handleTextEntry("");
        expect(subject.onAutocomplete).to.have.been.calledWith([]);
      });
    });
  });

  describe("#fetchItems", function() {
    it("gets the items via ajax", function() {
      subject.fetchItems();
      var request = _.last(requests);
      expect(request.url).to.equal(subject.url);
      expect(request.method).to.equal("GET");
      expect(request.requestHeaders.Accept).to.match(/application\/json/);
    });
  });

  describe("#queueRequest", function() {
    beforeEach(function() {
      subject.throttleDelay = 0;
      sinon.spy(window, "setTimeout");
      sinon.spy(subject, "fetchItems");
      subject.queueRequest();
    });

    afterEach(function() {
      setTimeout.restore();
    });

    it("queues a fetch items request", function() {
      expect(subject.queuedRequest).to.be.a("number");
    });

    it("fetches the items after the throttle delay", function() {
      expect(setTimeout).to.have.been.called;

      var args = _.first(setTimeout.args);
      var callback = _.first(args);
      var throttleDelay = _.last(args);
      callback();
      expect(subject.fetchItems).to.have.been.called;
      expect(throttleDelay).to.equal(subject.throttleDelay);
    });
  });
});
