/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/

'use strict';

/**
 * ARIA Listbox Examples
 * @function onload
 * @desc Initialize the listbox examples once the page has loaded
 */

window.addEventListener('load', function () {
  var ex2 = document.getElementById('list_box_selection');
  var ex2ImportantListbox = new aria.Listbox(document.getElementById('ms_table_list'));
  var ex2UnimportantListbox = new aria.Listbox(document.getElementById('ms_selected_table_list'));

  ex2ImportantListbox.setupMove(document.getElementById('list_box_selection-add'), ex2UnimportantListbox);
  ex2UnimportantListbox.setupMove(document.getElementById('list_box_selection-delete'), ex2ImportantListbox);

  var ex1 = document.getElementById('ex1');
  var ex1ImportantListbox = new aria.Listbox(document.getElementById('ss_tbl_list'));
  var ex1UnimportantListbox = new aria.Listbox(document.getElementById('ms_fields_list'));
});
