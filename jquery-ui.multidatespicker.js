/*
 * MultiDatesPicker v1.6.8
 * https://dubrox.github.io/Multiple-Dates-Picker-for-jQuery-UI
 *
 * Copyright 2017, Luca Lauretta
 * Dual licensed under the MIT or GPL version 2 licenses.
 */

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "jquery-ui-dist"], factory);
  } else {
    factory(jQuery);
  }
}(function( $ ){
	$.extend($.ui, { multiDatesPicker: { version: "1.6.8" } });

	$.fn.multiDatesPicker = function(method) {
		var mdp_arguments = arguments;
		var ret = this;
		var selectedDates = [];
		var mdp_events = {};

		function addDate(date) {
			const dateStr = $.datepicker.formatDate('yy-mm-dd', date);
			if (!selectedDates.includes(dateStr)) {
			selectedDates.push(dateStr);
			}
		}

		function removeDate(date) {
			const dateStr = $.datepicker.formatDate('yy-mm-dd', date);
			const index = selectedDates.indexOf(dateStr);
			if (index !== -1) {
			selectedDates.splice(index, 1);
			}
		}

		function toggleDate(date) {
			const dateStr = $.datepicker.formatDate('yy-mm-dd', date);
			if (selectedDates.includes(dateStr)) {
			removeDate(date);
			} else {
			addDate(date);
			}
		}

		function resetDates() {
			selectedDates = [];
		}

		var methods = {
			init: function(options) {
			var $this = $(this);
			if (options.mode === "enableSelectedDates") {
				this.multiDatesPicker.mode = "enableSelectedDates";

				if (options.showEnableResetBtns) {
				const buttonsHtml = 
					<div id="enable-reset-btns">
					<button id="enable-selected-btn">Enable Selected</button>
					<button id="reset-selected-btn">Reset</button>
					</div>;
				$this.after(buttonsHtml);

				$("#enable-selected-btn").on("click", function() {
					alert("Enabled Dates: " + selectedDates.join(", "));
				});

				$("#reset-selected-btn").on("click", function() {
					resetDates();
					$this.multiDatesPicker("resetDates");
					$this.datepicker("refresh");
				});
				}
			}

			var mdp_events = {
				onSelect: function(dateText) {
				const date = $.datepicker.parseDate('mm/dd/yy', dateText);
				toggleDate(date);
				},
				beforeShowDay: function(date) {
				const dateStr = $.datepicker.formatDate('yy-mm-dd', date);
				return [selectedDates.includes(dateStr), "ui-state-highlight"];
				}
			};

			$this.datepicker(options);
			$this.datepicker("option", mdp_events);
			},
			resetDates: function() {
			selectedDates = [];
			}
		};

		this.each(function() {
			var $this = $(this);
			if (!this.multiDatesPicker) {
			this.multiDatesPicker = { mode: "normal" };
			}

			if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(mdp_arguments, 1));
			} else if (typeof method === "object" || !method) {
			return methods.init.apply(this, mdp_arguments);
			}

			return $.error("Method " + method + " does not exist on jQuery.multiDatesPicker");
		});

		return ret;
	};

	var PROP_NAME = 'multiDatesPicker';
	var dpuuid = new Date().getTime();
	var instActive;

	$.multiDatesPicker = {version: false};
	//$.multiDatesPicker = new MultiDatesPicker(); // singleton instance
	$.multiDatesPicker.initialized = false;
	$.multiDatesPicker.uuid = new Date().getTime();
	$.multiDatesPicker.version = $.ui.multiDatesPicker.version;

	// allows MDP not to hide everytime a date is picked
	$.multiDatesPicker._hideDatepicker = $.datepicker._hideDatepicker;
	$.datepicker._hideDatepicker = function( input ) {
		const inst = this._curInst;
		if ( !inst || ( input && inst !== $.data( input, "datepicker" ) ) ) {
			return;
		}

		var target = this._curInst.input[0];
		var mdp = target.multiDatesPicker;
		if(!mdp || (this._curInst.inline === false && !mdp.changed)) {
			return $.multiDatesPicker._hideDatepicker.apply(this, arguments);
		} else {
			mdp.changed = false;
			$.datepicker._refreshDatepicker(target);
			return;
		}
	};

	// Workaround for #4055
	// Add another global to avoid noConflict issues with inline event handlers
	window['DP_jQuery_' + dpuuid] = $;
}));
