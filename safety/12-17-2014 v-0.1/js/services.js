var services = angular.module('wReader.services', []);



// function getLink(links) {
//   for (var i = 0, link; link = links[i]; ++i) {
//     if (link.rel === rel) {
//       return link.href;
//     }
//   }
//   return null;
// };


function Item(entry, pub_name, feed_link) {
  this.read = false;
  this.starred = false;
  this.selected = false;

  // parse the entry from JSON
  if (entry) {
    this.title = entry.title;
    this.item_id = entry.sfdc_id;
    this.key = this.item_id; // For LawnChair.
    this.pub_name = entry.lead_owner; // Set the pub name to the feed's title.
    this.pub_author = entry.name;
    // this.pub_date = new Date(entry.date_created);
    this.pub_date = new Date(entry.date_created);
    this.search_date = new Date(entry.search_date);
    this.item_link = entry.usble_uri; //getLink(entry.link, 'alternate');
    this.feed_link = feed_link;
    this.search_target = entry.search_target;
    this.company = entry.target_company;
    this.sfdc_id = entry.sfdc_id;
    this.lead_source = entry.lead_source;
    this.address = entry.address;
    this.email = entry.email;
    this.status = entry.lead_status;
    this.num = entry.num;
    this.parsed_num = parseInt(this.num);

    this.short_desc = this.name + ' ' + this.title + '...';
    this.li_profile_pages = entry.linkSearchResults;
    //
    // this.li_profile_page_fname = entry.linkSearchResults[0].firstName;
    // this.li_profile_page_lname = entry.linkSearchResults[0].lastName;
    // this.li_profile_page_link = entry.linkSearchResults[0].link;
    // this.li_profile_page_location = entry.linkSearchResults[0].location;
    // this.li_profile_page_index = parseInt(entry.linkSearchResults[0].searchIndex) + 1;
    // this.li_profile_page_title = entry.linkSearchResults[0].title;
    // this.industry = entry.linkSearchResults[0].industry;
    // this.content = this.li_profile_page_index + '<h2>' + this.li_profile_page_fname + ' ' + this.li_profile_page_lname + '</h2><h3>' + this.li_profile_page_title + '</h3>' + this.li_profile_page_location;
  }
}


// Create or open the data store where objects are stored for offline use
services.factory('store', function() {
  return new Lawnchair({
    name: 'entries',
    record: 'entry'
  }, function() {
    //TODO: this should probably go in the item store
    this.toggleRead = function(key, value) {
      this.get(key, function(entry) {
        entry.read = value;
        this.save(entry);
      });
    };

    //TODO: this should probably go in the item store
    this.toggleStar = function(key, value) {
      this.get(key, function(entry) {
        entry.starred = value;
        this.save(entry);
      });
    };
  });
});


services.factory('items', ['$http', 'store', 'filterFilter', function($http, store, filter) {
  var items = {
    all: [],
    filtered: [],
    selected: null,
    selectedIdx: null,


    addItem: function(item) {
      // It's already in the data controller, so we won't re-add it.
      if (items.all.some(function(val) {
        return val.item_id == item.item_id;
      })) return false;

      // If no results are returned, we insert the new item into the data
      // controller in order of publication date
      items.all.push(item);
      return true;
    },


    getItemsFromDataStore: function() {
      // Get all items from the local data store.
      // We're using store.all because store.each returns async, and the
      // method will return before we've pulled all the items out.  Then
      // there is a strong likelihood of getItemsFromServer stomping on
      // local items.
      store.all(function(arr) {
        arr.forEach(function(entry) {
          var item = new Item();
          angular.extend(item, entry);
          items.addItem(item);
        });

        console.log("Entries loaded from local data store:", arr.length);

        // Load items from the server after we've loaded everything from the local
        // data store.
        items.getItemsFromServer();
      });
    },


    getItemsFromServer: function() {
      // var feedURL = 'http://localhost:8000/casper/results/json/json_results.json';
      var feedURL = 'http://192.168.220.231:3000/db'; // work setup
      // var feedURL = 'http://10.0.1.116:3000/db'; // home setup

      var successCallback = function(data, status, headers, config) {
        items.all = [];

        // Iterate through the items and create a new JSON object for each item
        data.feed.entry.forEach(function(entry) {
          var item = new Item(entry, data.feed.title.$t); //, getLink(data.feed.link, 'alternate'));

          // Try to add the item to the data controller, if it's successfully
          //  added, we get TRUE and add the item to the local data store,
          //  otherwise it's likely already in the local data store.
          if (items.addItem(item)) {
            store.save(angular.copy(item));
          }
        });

        items.filtered = items.all;

        console.log('Entries loaded from server:', items.all.length);
      };


      // $http.jsonp(feedURL + '&callback=successCallback').success(successCallback);
      $http.get(feedURL).success(successCallback).error(errorCallback);
    },


    prev: function() {
      if (items.hasPrev()) {
        items.selectItem(items.selected ? items.selectedIdx - 1 : 0);
      }
    },


    next: function() {
      if (items.hasNext()) {
        items.selectItem(items.selected ? items.selectedIdx + 1 : 0);
      }
    },


    hasPrev: function() {
      if (!items.selected) {
        return true;
      }
      return items.selectedIdx > 0;
    },


    hasNext: function() {
      if (!items.selected) {
        return true;
      }
      return items.selectedIdx < items.filtered.length - 1;
    },


    selectItem: function(idx) {
      // Unselect previous selection.
      if (items.selected) {
        items.selected.selected = false;
      }

      items.selected = items.filtered[idx];
      items.selectedIdx = idx;
      items.selected.selected = true;

      items.toggleRead(true);
    },


    toggleRead: function(opt_read) {
      var item = items.selected;
      var read = opt_read || !item.read;

      item.read = read;
      store.toggleRead(item.item_id, read);
    },


    toggleStar: function(opt_star) {
      var item = items.selected;
      var star = opt_star || !item.starred;

      item.starred = star;
      store.toggleStar(item.item_id, star);
    },


    markAllRead: function() {
      items.filtered.forEach(function(item) {
        item.read = true;
        store.toggleRead(item.item_id, true);
      });
    },


    filterBy: function(key, value) {
      items.filtered = filter(items.all, function(item) {
        return item[key] === value;
      });
      items.reindexSelectedItem();
    },


    clearFilter: function() {
      items.filtered = items.all;
      items.reindexSelectedItem();
    },


    reindexSelectedItem: function() {
      if (items.selected) {
        var idx = items.filtered.indexOf(items.selected);

        if (idx === -1) {
          if (items.selected) items.selected.selected = false;

          items.selected = null;
          items.selectedIdx = null;
        } else {
          items.selectedIdx = idx;
        }
      }
    },


    allCount: function() {
      return items.all.length;
    },


    readCount: function() {
      return items.all.filter(function(val, i) { return val.read }).length;
    },


    unreadCount: function() {
      return items.all.length - items.readCount();
    },


    starredCount: function() {
      return items.all.filter(function(val, i) { return val.starred }).length;
    }
  };

  items.getItemsFromDataStore();
  return items;
}]);


services.value('scroll', {
  pageDown: function() {
    var itemHeight = $('.entry.active').height() + 60;
    var winHeight = $(window).height();
    var curScroll = $('.entries').scrollTop();
    var scroll = curScroll + winHeight;

    if (scroll < itemHeight) {
      $('.entries').scrollTop(scroll);
      return true;
    }

    // already at the bottom
    return false;
  },

  toCurrent: function() {
    // Need the setTimeout to prevent race condition with item being selected.
    window.setTimeout(function() {
      var curScrollPos = $('.summaries').scrollTop();
      var itemTop = $('.summary.active').offset().top - 60;
      $('.summaries').animate({'scrollTop': curScrollPos + itemTop}, 200);
    }, 0);
  }
});
