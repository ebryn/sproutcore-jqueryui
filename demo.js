var availableTags = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];

Demo = SC.Application.create();
Demo.AutocompleteTextField = JQueryUI.AutocompleteTextField.extend({
  source: availableTags
});
Demo.Tag = SC.Object.extend({
  name: null
});
Demo.tagsController = SC.ArrayProxy.create({
  content: [],
  addTag: function(name) {
    var tag = Demo.Tag.create({name: name});
    this.pushObject(tag);
  },
  removeTag: function(e) {
    this.removeObject(e.getPath('parentView.content'));
  }
});
Demo.progressbarController = SC.Object.create({
  progress: 20
});
Demo.sliderController = SC.Object.create({
  value: 0
});
Demo.Slider = JQueryUI.Slider.extend({
  valueBinding: "Demo.sliderController.value",
  step: 10,
  max: 50
});
Demo.sortableController = SC.ArrayProxy.create({
  content: availableTags
});
