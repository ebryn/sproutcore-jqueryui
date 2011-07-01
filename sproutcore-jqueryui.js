JQueryUI = SC.Object.create();

JQueryUI.Widget = SC.Mixin.create({
  uiChildElement: function() {
    if (this.get('uiChildTag')) {
      return this.$( this.get('uiChildTag') );
    } else {
      return this.$();
    }
  },
  
  didInsertElement: function() {
    this._super();

    SC.run.schedule('render', this, function() {
      var options = this._gatherOptions();
      this._gatherEvents(options);

      var ui = new jQuery.ui[this.get('uiType')](options, this.uiChildElement());

      this.set('ui', ui);
    });
  },

  _gatherEvents: function(options) {
    var uiEvents = this.get('uiEvents') || [], self = this;

    uiEvents.forEach(function(event) {
      var callback = self[event];

      if (callback) {
        options[event] = function(event, ui) { callback.call(self, event, ui); };
      }
    });
  },

  willDestroyElement: function() {
    var ui = this.get('ui');
    if (ui) {
      var observers = this._observers;
      for (var prop in observers) {
        if (observers.hasOwnProperty(prop)) {
          this.removeObserver(prop, observers[prop]);
        }
      }
      ui._destroy();
    }
  },

  _gatherOptions: function() {
    var uiOptions = this.get('uiOptions'), options = {};

    options.sc_view = this; // FIXME: This there a better way to access the SC View from inside jQuery UI callbacks?
    uiOptions.forEach(function(key) {
      options[key] = this.get(key);

      var observer = function() {
        var value = this.get(key);
        this.get('ui')._setOption(key, value);
      };

      this.addObserver(key, observer);
      this._observers = this._observers || {};
      this._observers[key] = observer;
    }, this);

    return options;
  }
});

JQueryUI.TextField = SC.TextField.extend(JQueryUI.Widget, {uiChildTag: 'input'});

JQueryUI.AutocompleteTextField = JQueryUI.TextField.extend({
  uiType: 'autocomplete',
  uiOptions: ['source'],
  uiEvents: ['select', 'focus'],
  
  source: null,
  selectTarget: null,
  selectAction: null,
  placeholder: "Type a programming language",
  insertNewline: function(event) { event.preventDefault(); },
  select: function( event, ui ) {
    if ( ui.item ) {
      var target = SC.getPath(this.get('selectTarget'));
      target[this.get('selectAction')].call(target, ui.item.value)
      event.target.value = '';
      event.preventDefault();
    }
  },
  focus: function( event, ui ) {
    event.preventDefault();
  }
});

// Datepicker doesn't use the widget factory, so we can't use the JQueryUI.Widget mixin
JQueryUI.Datepicker = SC.TextField.extend({
  placeholder: "",
  willInsertElement: function() {
    this.$('input').datepicker();
  }
});

JQueryUI.Progressbar = SC.View.extend(JQueryUI.Widget, {
  uiType: 'progressbar',
  uiOptions: ['value'],
  
  value: null,
  // Default templates aren't working with the JQueryUI.Widget mixin
  // defaultTemplate: SC.Handlebars.compile('<div style="width: 300px"></div>'),
  update: function() {
    this.$("div:first").progressbar("value", parseInt(this.get('value')));
  }.observes('value')
});
JQueryUI.Slider = SC.View.extend(JQueryUI.Widget, {
  uiType: 'slider',
  // uiChildTag: "div:first",
  uiOptions: ['value', 'min', 'max', 'step'],
  uiEvents: ['slide'],
  
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  // Default templates aren't working with the JQueryUI.Widget mixin
  // defaultTemplate: SC.Handlebars.compile('<div style="width: 300px"></div>'),
  slide: function(event, ui) {
    this.set('value', ui.value);
  },
  update: function() {
    var old_value = this.$("div:first").slider("value"),
        new_value = parseInt(this.get('value'));
    if (old_value != new_value) {
      this.$("div:first").slider("value", new_value);
    }
  }.observes('value')
});

JQueryUI.SortableCollectionView = SC.CollectionView.extend(JQueryUI.Widget, {
  uiType: 'sortable',
  uiOptions: [],
  uiEvents: ['start', 'stop'],
  
  tagName: "ul",
  draggedStartPos: null,
  start: function(event, ui) {
    this.set('dragging', true);
    this.set('draggedStartPos', ui.item.index());
  },
  stop: function(event, ui) {
    var oldIdx = this.get('draggedStartPos');
    var newIdx = ui.item.index();
    if (oldIdx != newIdx) {
      var content = this.get('content');
      content.beginPropertyChanges();
      var el = content.objectAt(oldIdx);
      content.removeAt(oldIdx);
      content.insertAt(newIdx, el);
      content.endPropertyChanges();
    }
    this.set('dragging', false);
  },

  // Overriding these to prevent CollectionView from reapplying content array modifications
  arrayWillChange: function(content, start, removedCount, addedCount) {
    if (this.get('dragging')) {
      //this._super(content, 0, 0, 0);
    } else {
      this._super(content, start, removedCount, addedCount);
    }
  },
  arrayDidChange: function(content, start, removedCount, addedCount) {
    if (this.get('dragging')) {
      //this._super(content, 0, 0, 0);
    } else {
      this._super(content, start, removedCount, addedCount);
    }
  }
});

JQueryUI.ResizableView = SC.View.extend(JQueryUI.Widget, {
  uiType: 'resizable',
  uiOptions: [],
  
  defaultTemplate: SC.Handlebars.compile('<div style="width: 100px; height: 100px; background-color: red;"></div>'),
});
