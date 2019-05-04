'use strict';

angular.module('chrome.plugin.trynew', ['ngMaterial', 'ngMdIcons', 'ngMessages'])
.controller('TryNewRootController', ['StorageService', function(StorageService) {
    var vm = this;
    vm.view = {
      showSettings : false
    };
  
    var defaultTabs = {
      selectedIndex : 0,
      allowedTabs : {
        'books' : true,
        'movies' : true,
        'music' : true
      }
    }; 
  
    function loadTabs() {
      StorageService.getLastTab(function(tabs) {
        vm.tabs = tabs || defaultTabs;
      });  
    }
  
    loadTabs();
    
    vm.tabChanged = function() {
      StorageService.setLastTab(vm.tabs);
    };
  
    vm.toggleShowSettings = function() {
      loadTabs();
      vm.view.showSettings = !vm.view.showSettings;
    }
    
    vm.saveSettings = function() {
      StorageService.setLastTab(vm.tabs);
    };
    
}])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue');
})
.service('BookAPIService', ['$http', function($http) {
    function mapGoodReadsJsonToSimpleJson(book) {
        var matchingBook = book.best_book;
        return {
          id: matchingBook.id.__text,
          title : matchingBook.title,
          author : matchingBook.author.name,
          imageUrl : matchingBook.small_image_url
        };
    }
    
    function hasResult(jsonResp) {
      return jsonResp.GoodreadsResponse.search && 
              jsonResp.GoodreadsResponse.search.results &&
              jsonResp.GoodreadsResponse.search.results.work &&
              jsonResp.GoodreadsResponse.search.results.work.length;
    }
    
    function xmlToJson(xmlResp) {
      var jsonResp = new X2JS().xml_str2json(xmlResp);
      if(hasResult(jsonResp)) {
        var result = jsonResp.GoodreadsResponse.search.results.work.map(mapGoodReadsJsonToSimpleJson);
        return result;
      }
      return [];
    }
  
    this.searchBooks = function(querySearch) {
      var url = 'https://www.goodreads.com/search/index.xml?key=mvIa4J4YnsVxPvwQN45UzA&q=' + querySearch;

      return $http.get(url, {
        transformResponse : xmlToJson
      });    
    };
}])
.service('MovieAPIService', ['$http', '$sce', '$q', function($http, $sce, $q){
  
  var defaultImageURL = '/images/imdb_default.png'
  
  function getImageUrl(imdbMovie) {
    if(imdbMovie.i && imdbMovie.i.length && imdbMovie.i[0]) {
      return imdbMovie.i[0];
    }
    return defaultImageURL;
  }
  
  function mapIMDBMovieToSimplJson(imdbMovie) {
    var json = {};
    json.title = imdbMovie.l;
    json.cast = imdbMovie.s;
    json.year = imdbMovie.y;
    json.id = imdbMovie.id;
    json.imageUrl = getImageUrl(imdbMovie)
    return json;
  }
  
  this.searchMovies = function(querySearch) {
      var indexLetter = querySearch.charAt(0).toLocaleLowerCase();
      var url = 'https://sg.media-imdb.com/suggests/' + indexLetter + '/' + querySearch +'.json'; 
      var callBackParam = 'imdb$' + querySearch.replace(/ /g, '_');
      var safeUrl = $sce.trustAsResourceUrl(url);
      var deferred = $q.defer();
    
      jQuery.ajax({
          url: url,
          dataType: 'jsonp',
          cache: true,
          jsonp: false,
          jsonpCallback: callBackParam
      }).done(function (result) {
          var data = result.d || [];
          var movies = data.map(mapIMDBMovieToSimplJson);
          console.log('MOVIES', movies);
          deferred.resolve(movies);
      }).fail(function(err) {
        deferred.reject([]);
        console.error('Error talking to IMDB', err);
      });
    
      return deferred.promise;
  }
  
}])
.service('StorageService', [ function() {
  var book_key = 'TryNewBooks';
  var movie_key = 'TryNewMovies';
  var music_key = 'TryNewMusic';
  var tab_key = 'TryNewTab';
  var misc_item_key = 'MiscItemKey';
  
  function getStorage(key, callback) {
    chrome.storage.sync.get(key, function(data) {
      if(callback) {
        callback(data[key]);
      }
    });
  }
  
  function setStorage(key, objects, callback) {
    var objectList = {};
    objectList[key] = objects;
    chrome.storage.sync.set(objectList, function() {
      if(callback) {
        callback();
      }
    })
  }
  
  this.getBooks = function(callBack) {
    getStorage(book_key, callBack);
  };
  
  this.setBooks = function(books, callBack) {
    setStorage(book_key, books, callBack);
  }
  
  this.getMovies = function(callBack) {
    getStorage(movie_key, callBack);
  };
  
  this.setMovies = function(movies, callBack) {
    setStorage(movie_key, movies, callBack);
  }
  
  this.setMusic = function(music, callBack) {
    setStorage(music_key, music, callBack);
  }
  
  this.getMusic = function(callBack) {
    getStorage(music_key, callBack);
  }
  
  this.setMiscItems = function(items, callBack) {
    setStorage(misc_item_key, items, callBack);
  }
  
  this.getMiscItems = function(callBack) {
    getStorage(misc_item_key, callBack);
  }
  
  this.setLastTab = function(tabDetails) {
    setStorage(tab_key, tabDetails);
  }
  
  this.getLastTab = function(callback) {
    getStorage(tab_key, callback);
  }
  
}])
.controller('TryNewBookController', ['$q', '$timeout', 'BookAPIService', 'StorageService', '$mdToast', 'ToastService',
                                     function($q, $timeout, BookAPIService, StorageService, $mdToast, ToastService) {
    var vm = this;
    vm.selectedBook;                                   
    vm.newSelectedBook;
    vm.searchText = '';
    vm.myBooks = [];
    vm.lastDeletedBook;
            
    StorageService.getBooks(function(books) {
      vm.myBooks = (books && books.length) ? books : [];
    });

    vm.querySearch = function (query) {
      var deferred = $q.defer();
      BookAPIService.searchBooks(query).then(function(resp) { 
        deferred.resolve(resp.data);  
      }, function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    
    vm.bookSelected = function(book) {
      vm.selectedBook = book;
    };
                                       
    vm.addNewBook = function() {
      addBook(vm.newSelectedBook)
    };                                     
           
    vm.deleteBook = function(bookToDelete) {
      vm.lastDeletedBook = bookToDelete;
      vm.myBooks = vm.myBooks.filter(function(book) { return book.id !== bookToDelete.id; });
      StorageService.setBooks(vm.myBooks, function() {
        showDeletedMessage();
      });
    };
    
    function undoDelete() {
      addBook(vm.lastDeletedBook);
    }
                                       
    function showDeletedMessage() {
      ToastService.showMessageWithAction('Removed', 'UNDO', undoDelete);
    };

    function addBook(bookToAdd) {
      var existing = vm.myBooks.filter(function(book) { return bookToAdd.id === book.id;} )
      if(existing.length) {
        ToastService.showMessage('Already Added');
      } else {
        vm.myBooks.unshift(bookToAdd);
        StorageService.setBooks(vm.myBooks, function() {
          console.log('ADDED');
        });
      }
    }
                                       
}])
.service('ToastService', ['$mdToast', function($mdToast) {
  
  this.showMessage = function(message) {
    $mdToast.show($mdToast.simple()
        .textContent(message)
        .position('bottom right')
        .hideDelay(2500)
      );
  }
  
  this.showMessageWithAction = function(message, action, callback) {
      var toast = $mdToast.simple()
        .textContent(message)
        .action(action)
        .highlightAction(true)
        .position('bottom right');

      $mdToast.show(toast).then(function(response) {
        if ( response == 'ok' ) {
          callback();
        }
      });
  }
  
}])
.controller('TryNewMovieController', ['MovieAPIService', 'StorageService', 'ToastService', function(MovieAPIService, StorageService, ToastService) {
    var vm = this;
    
    vm.selectedMovie;                                   
    vm.newSelectedMovie;
    vm.searchText = '';
    vm.myMovies = [];
    vm.lastDeletedMovie;
            
    StorageService.getMovies(function(movies) {
      vm.myMovies = (movies && movies.length) ? movies : [];
    });
    
    vm.movieSelected = function(movie) {
      vm.selectedMovie = movie;
    };
  
    vm.querySearch = function (query) {
      return MovieAPIService.searchMovies(query);
    };
                                       
    vm.addNewMovie = function() {
      addMovie(vm.newSelectedMovie);
    };                                     
           
    vm.deleteMovie = function(movieToDelete) {
      vm.lastDeletedMovie = movieToDelete;
      vm.myMovies = vm.myMovies.filter(function(movie) { return movie.id !== movieToDelete.id; });
      StorageService.setMovies(vm.myMovies, function() {
        showDeletedMessage();
      });
    };
    
    function undoDelete() {
      addMovie(vm.lastDeletedMovie);
    }
                                       
    function showDeletedMessage() {
      ToastService.showMessageWithAction('Removed', 'UNDO', undoDelete);
    };

    function addMovie(movieToAdd) {
      var existing = vm.myMovies.filter(function(movie) { return movieToAdd.id === movie.id;} )
      if(existing.length) {
        ToastService.showMessage('Already Added');
      } else {
        vm.myMovies.unshift(movieToAdd);
        StorageService.setMovies(vm.myMovies, function() {
          console.log('ADDED');
        });
      }
    }
  
  
}])
.service('MusicAPIService', ['$http', '$q', function($http, $q) {
  var url = 'https://www.googleapis.com/youtube/v3/search?type=video&videoCategoryId =10&part=snippet&&key=AIzaSyDI91qonfjVeIxydlsxjU3sxhoMCHgy4-g&q='
  
  function getImageUrl(thumbnail) {
    return thumbnail.url || '/images/youtube-default.png';
  }
  
  function getRequiredFields(resp) {
    var items = resp && resp.data && resp.data.items;
    
    if(items) {
      return items.map(function(youtubeItem) {
        return {
          id : youtubeItem.id.videoId,
          title : youtubeItem.snippet.title,
          imageUrl : getImageUrl(youtubeItem.snippet.thumbnails['default'])
        }
      });
    } else {
      return [];
    }
  }
    
  this.searchMusic = function(query) {
    var defered = $q.defer();
    
    function success(resp) {
      defered.resolve(getRequiredFields(resp));
    }
    
    function error(resp) {
      defered.reject([]);
    }
    
    $http.get(url + query).then(success, error);
    
    return defered.promise;
  };
  
}])
.controller('TryNewMusicController', ['MusicAPIService', 'StorageService', 'ToastService', function(MusicAPIService, StorageService, ToastService) {
    var vm = this;
  
    vm.call = function() {
      MusicAPIService.searchMusic('jesus of').then(function(resp) {
        console.log(resp);
      });    
    };
  
    vm.selectedMusic;                                   
    vm.newSelectedMusic;
    vm.searchText = '';
    vm.myMusic = [];
    vm.lastDeletedMusic;
            
    vm.musicSelected = function(music) {
      vm.selectedMusic = music;
    };
  
    vm.querySearch = function (query) {
      return MusicAPIService.searchMusic(query);
    };
  
    StorageService.getMusic(function(music) {
      vm.myMusic = (music && music.length) ? music : [];
    });
    
    vm.addNewMusic = function() {
      addMusic(vm.newSelectedMusic);
    };                                     
           
    vm.deleteMusic = function(musicToDelete) {
      vm.lastDeletedMusic = musicToDelete;
      vm.myMusic = vm.myMusic.filter(function(music) { return music.id !== musicToDelete.id; });
      StorageService.setMusic(vm.myMusic, function() {
        showDeletedMessage();
      });
    };
    
    function undoDelete() {
      addMusic(vm.lastDeletedMusic);
    }
                                       
    function showDeletedMessage() {
      ToastService.showMessageWithAction('Removed', 'UNDO', undoDelete);
    };

    function addMusic(musicToAdd) {
      var existing = vm.myMusic.filter(function(music) { return musicToAdd.id === music.id;} )
      if(existing.length) {
        ToastService.showMessage('Already Added');
      } else {
        vm.myMusic.unshift(musicToAdd);
        StorageService.setMusic(vm.myMusic, function() {
          console.log('ADDED');
        });
      }
    }
          
}])
.controller('TryNewMiscItemController', ['StorageService', 'ToastService', '$scope', 
                                         function(StorageService, ToastService, $scope) {
    var vm = this;
    var itemExamples = [ { type : 'Shampoo', name : 'Head and Shoulders'},
         { type : 'Hotel', name : 'The Edgewater'}, { type : 'TV', name : 'Sony Bravia KDL'},
         { type : 'Place', name : 'BakerStreet 221B'}, { type : 'Course', name : 'Machine Learning'},
         { type : 'Headphone', name : 'Skullcandy 2XL'}, { type : 'WebSite', name : 'HighExistene'}];
    
    vm.itemExample = itemExamples[Math.floor(Math.random() * itemExamples.length)];
    var lastDeletedItems;
  
    vm.newItem = { };
    vm.flags = {
      showNewItemForm : false
    };
  
    StorageService.getMiscItems(function(miscItems) {
      vm.myMiscItems = (miscItems && miscItems.length) ? miscItems : [];
    });
    
  
    vm.cancelAdd = function() {
      vm.newItem = { };
      vm.flags.showNewItemForm = false;
    }
  
    vm.showAdForm = function() {
      vm.flags.showNewItemForm = true;
    }
    
    vm.addNewItem = function() {
      addNewMiscItem(vm.newItem);
    }
    
    vm.deleteItem = function(index) {
      lastDeletedItems = vm.myMiscItems.splice(index, 1);
      StorageService.setMiscItems(vm.myMiscItems, function() {
        showDeletedMessage();
      });
    }
    
    function undoDelete() {
      if(lastDeletedItems && lastDeletedItems.length) {
        addNewMiscItem(lastDeletedItems[0]);  
      }
    }
                                       
    function showDeletedMessage() {
      ToastService.showMessageWithAction('Removed', 'UNDO', undoDelete);
    };
    
    function addNewMiscItem(newMisItem) {
      vm.myMiscItems.unshift(newMisItem);
      StorageService.setMiscItems(vm.myMiscItems, function() {
        vm.cancelAdd();
        $scope.$digest();
      });
    }
    
}])
.config(function($mdIconProvider) {
  $mdIconProvider
    .icon('magnify', 'images/icons/magnify.svg', 24)
    .icon('dots-vertical', 'images/icons/dots-vertical.svg', 24)
    .icon('dots-horizontal', 'images/icons/dots-horizontal.svg', 24)
    .icon('book', 'images/icons/book-open-page-variant.svg', 24)
    .icon('movie-tv', 'images/icons/message-video.svg', 24)
    .icon('music', 'images/icons/music.svg', 24)
    .icon('star', 'images/icons/star.svg', 24)
    .icon('close', 'images/icons/close.svg', 24)
    .icon('goodreads', 'images/icons/goodreads.svg', 12)
    .icon('delete', 'images/icons/delete.svg', 12)
    .icon('open', 'images/icons/open-in-new.svg', 12)
    .icon('add', 'images/icons/plus.svg', 24)
    .icon('clear', 'images/icons/clear.svg', 24)
    .icon('save', 'images/icons/save.svg', 24)
    .icon('settings_black', 'images/icons/settings_black.svg', 24)
    .icon('settings', 'images/icons/settings.svg', 24);
});