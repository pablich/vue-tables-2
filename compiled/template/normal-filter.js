'use strict';

var debounce = require('debounce');

module.exports = function (h, that) {

  if (!that.opts.filterable) return '';

  var beforeFilter = that.$slots.beforeFilter ? that.$slots.beforeFilter : '';
  var afterFilter = that.$slots.afterFilter ? that.$slots.afterFilter : '';

  var search = that.source == 'client' ? that.search.bind(that, that.data) : that.serverSearch.bind(that);
  var loadTag = function loadTag(e) {
    var input = document.getElementById('VueTables__search_' + that.id);
    that.search(that.data, e);
    var words = input.value.split(' ');
    var container = document.getElementsByClassName('tagcontainer')[0];
    function checkIfExist(element) {
      var nodes = document.getElementsByClassName('tagcontainer')[0].childNodes;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].firstElementChild.innerText == element) {
          return true;
        }
      }
      return false;
    }
    words.forEach(function (element) {
      if (element !== ' ' && element !== '' && !checkIfExist(element)) container.insertAdjacentHTML('beforeend', '<span class="tag" style="margin-top: 5px;margin-left: 10px;">' + '<span class="has-ellipsis" style="padding-right: 4px">' + element + '</span>' + '<a class="delete is-small"></a>' + '</span>');
    });

    function remove(e) {
      var element = e.target;
      var words = document.getElementsByClassName('filter-search')[0].value.split(' ');
      var deleted = element.parentNode.firstChild.innerText;
      var index = words.indexOf(deleted);
      if (index > -1) {
        var words = document.getElementsByClassName('filter-search')[0].value.split(' ');
        words.splice(index, 1);
      }
      var newQuery = words.join(' ');
      document.getElementsByClassName('filter-search')[0].value = newQuery;
      element.parentNode.parentNode.removeChild(element.parentNode);
      document.getElementsByClassName('filter-search')[0].dispatchEvent(new Event("blur"));
    }
    for (var i = 0; i < document.getElementsByClassName("delete").length; i++) {
      document.getElementsByClassName("delete")[i].addEventListener("click", remove);
    }
  };
  if (that.opts.filterable && !that.opts.filterByColumn) {
    var id = 'VueTables__search_' + that.id;
    return h(
      'div',
      { 'class': 'field is-horizontal is-pulled-left VueTables__search' },
      [beforeFilter, h('input', { 'class': 'input filter-search',
        attrs: { type: 'text',

          placeholder: that.display('filterPlaceholder'),

          id: id
        },
        domProps: {
          'value': that.query
        },
        on: {
          'blur': debounce(loadTag, that.opts.debounce)
        },
        style: 'width:180px'
      }), h('div', { 'class': 'tagcontainer' }), afterFilter]
    );
  }

  return '';
};