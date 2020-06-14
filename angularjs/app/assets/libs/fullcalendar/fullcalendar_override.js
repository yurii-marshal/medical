//Drowz web override Calendar implementation
//Extend plugin and add specific view

(function($) {

  var FC = $.fullCalendar;
  var fcViews = FC.views;
  var CustomAgendaView;

  CustomAgendaView = FC.AgendaView.extend({ // make a subclass of View

    initialize: function() {
      this.timeGrid = this.instantiateTimeGrid();

      if(this.opt('titleDate')) {
        this.dayGrid = this.titleDayGrid();
      }
    },

    titleDayGrid: function() {
      var subclass = this.dayGridClass.extend(titleDayGridMethods);

      return new subclass(this);
    }

  });

  //Custom class that add date title
  var titleDayGridMethods = {

    renderBgCellHtml: function(date, otherAttrs) {
      var view = this.view;
      var classes = this.getDayClasses(date);

      classes.unshift('fc-day', view.widgetContentClass);

      return '<td class="' + classes.join(' ') + '"' +
        ' data-date="' + date.format('YYYY-MM-DD') + '"' + // if date has a time, won't format it
        (otherAttrs ?
        ' ' + otherAttrs :
          '') +
        '><div class="fc-dn-label gotodate_link" data-date="' + date + '">' + date.format('D') +
        '</div>' + (view.opt('weekTitleAdditionalHtml') ? view.opt('weekTitleAdditionalHtml').format(date.format("YYYY-MM-DD")) : '') +
      '</td>';
    },

    renderDates: function(isRigid) {
      var view = this.view;
      var rowCnt = this.rowCnt;
      var colCnt = this.colCnt;
      var html = '';
      var row;
      var col;

      for (row = 0; row < rowCnt; row++) {
        html += this.renderDayRowHtml(row, isRigid);
      }
      this.el.html(html);
    },

    renderIntroHtml: function() {
      var view = this.view;

      return '<td class="fc-axis" ' + view.axisStyleAttr() + '></td>';
    },

    renderFill: function () {},

    releaseHits: function () {},

    prepareHits: function () {},

    queryHit: function () {},

    renderFgSegs: function () {}
  };

  fcViews.agenda = {
    'class': CustomAgendaView,
    defaults: {
      allDaySlot: true,
      allDayText: 'all-day',
      titleDate:true,
      slotDuration: '00:30:00',
      minTime: '00:00:00',
      maxTime: '24:00:00',
      slotEventOverlap: true // a bad name. confused with overlap/constraint system
    }
  };



})(jQuery);


