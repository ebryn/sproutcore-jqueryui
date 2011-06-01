JQueryUI = SC.Object.create();
JQueryUI.AutocompleteTextField = SC.TextField.extend({
  source: null,
  selectTarget: "Demo.tagsController",
  selectAction: "addTag",
  placeholder: "Type a programming language",
  insertNewline: function(event) { event.preventDefault(); },
  didCreateElement: function() {
    var self = this;
    this.$('input').autocomplete({
      source: this.get('source'),
      select: function( event, ui ) {
        if ( ui.item ) {
          var target = SC.getPath(self.get('selectTarget'));
          target[self.get('selectAction')].call(target, ui.item.value)
          event.target.value = '';
          event.preventDefault();
        }
      },
      focus: function( event, ui ) {
        event.preventDefault();
      }
    });
  }
});
JQueryUI.Datepicker = SC.TextField.extend({
  placeholder: "",
  didCreateElement: function() {
    this.$('input').datepicker();
  }
});
JQueryUI.Progressbar = SC.View.extend({
  value: null,
  defaultTemplate: SC.Handlebars.compile('<div style="width: 300px"></div>'),
  didCreateElement: function() {
    this.$("div:first").progressbar();
  },
  update: function() {
    this.$("div:first").progressbar("value", parseInt(this.get('value')));
  }.observes('value')
});
JQueryUI.Slider = SC.View.extend({
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  defaultTemplate: SC.Handlebars.compile('<div style="width: 300px"></div>'),
  didCreateElement: function() {
    var self = this;
    this.$("div:first").slider({
      min: this.get('min'),
      max: this.get('max'),
      step: this.get('step'),
      slide: function(event, ui) {
        self.set('value', ui.value);
      }
    });
  },
  update: function() {
    var old_value = this.$("div:first").slider("value"),
        new_value = parseInt(this.get('value'));
    if (old_value != new_value) {
      this.$("div:first").slider("value", new_value);
    }
  }.observes('value')
});
JQueryUI.SortableCollectionView = SC.CollectionView.extend({
  tagName: "ul",
  draggedStartPos: null,
  didCreateElement: function() {
    var self = this;
    this.$().sortable({
      start: function(event, ui) {
        self.set('draggedStartPos', ui.item.index());
      },
      stop: function(event, ui) {
        var oldIdx = self.get('draggedStartPos');
        var newIdx = ui.item.index();
        if (oldIdx != newIdx) {
          var content = self.get('content');
          self.propertyWillChange('content')
          content.beginPropertyChanges();
          var el = content.objectAt(oldIdx);
          content = content.removeAt(oldIdx);
          content = content.insertAt(newIdx, el);
          content.endPropertyChanges();
          self.propertyDidChange('content');
        }
      }
    }).disableSelection();

JQueryUI.ResizableView = SC.View.extend({
  defaultTemplate: SC.Handlebars.compile('<div style="width: 100px; height: 100px; background-color: red;"></div>'),
  didCreateElement: function() {
    this.$("div:first").resizable();
  }
});
