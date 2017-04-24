/*
 * @group Methods
 * @author saorbah
 * @date 23rd April, 2017, 02:24:12 PM
 * @methods
 * var methodname =  function() { })
 *
 *
 *
 */
var common = (function() {
  // Define a Local copy of dom and obj
  // Method
  var common = {
    domLocals: {
        //Cacheing the local DOM's/Object
        pDetails     : {}
        ,sysData     : {}

    },
    /**
     *    @method: init
     *    @description: this method used bind and update page on initial page load
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    init: function() {
        //Loading the correct data
        common.fetchCorrectData();
        //Featching data from LS
        common.getLSData();
        //Binding voting interaction
        common.voting();

        common.changeView();
    },
    /**
     *    @method: fetchCorrectData
     *    @description: this method responsable for get the correct data.
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    fetchCorrectData: function () {
      common.loadFile();
    }
    /**
     *    @method: searchTerm
     *    @description: this method used get the search terms
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,searchTerm:function () {
      var searchTerm = []
        ;

        for (var i = 0; i < common.pDetails.products.length; i++) {
            searchTerm.push(common.pDetails.products[i].name);
            if(Array.isArray(common.pDetails.products[i].tags)){
              for (var j = 0 ; j< common.pDetails.products[i].tags.length; j++){
                searchTerm.push(common.pDetails.products[i].tags[j]);
              }
            }
        }
        return searchTerm;
    }
    /**
     *    @method: searchTags
     *    @description: this method used for search and update the UI
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,searchTags : function (){
      var $input = $('.typeahead');
          var searchData = common.pDetails.products
          ;
      $input.typeahead({
        source: common.searchTerm(),
        autoSelect: true,
        showHintOnFocus : true
      });
      $input.change(function() {
          var current = $input.typeahead("getActive");
          if (current) {
              // Some item from your model is active!
              if (current.name == $input.val()) {
                  // This means the exact match is found. Use toLowerCase() if you want case insensitive match.
              } else {
                  console.log(current);
                  var results = []
                      ,searchField1 = ["name"]
                      ,searchField2 = ["tags"]
                      ,searchVal = current
                      ;
                  for (var i=0 ; i < searchData.length ; i++){
                      if (searchData[i][searchField1] == searchVal) {
                        results.push(searchData[i]);
                      } else if(searchData[i][searchField2] == searchVal){
                        results.push(searchData[i]);
                      }
                  }

                  common.updateProjectPg( results );
              }
          } else {
              // Nothing is active so it is a new value (or maybe empty value)

          }
      });
      //$('.typeahead').typeahead('destroy')
    },
    /**
     *    @method: loadFile
     *    @description: this method used to get the file from server on first page load
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    loadFile: function(){
        common.progressBar();

        var jqxhr = $.getJSON( "src/json/p_details.json", function( items ) {
            console.log( "success" );
        })
        .done(function(  items ) {
          //On success mering data for rating and updating the UI
          common.pDetails = items;
          common.mergeData( items );
          $("#progress").addClass("done");
          $(".right-loader i").addClass('hidden');
        })
        .fail(function() {
            alert('No data found from server');
        })
        .always(function() {
            console.log( "complete" );
        });
    }
    /**
     *    @method: updateLSData
     *    @description: Acommon method to set the Local storage data
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,setLSData: function ( data ){
      if(!data){
        data = {
          "count" : 0,
          "sysid": 0
        }
      }

      if (typeof (Storage) !== "undefined") {
        window.localStorage.setItem('localData', JSON.stringify(data));
      }
    }
    /**
     *    @method: getLSData
     *    @description: this method used to get the loacla storage value
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,getLSData : function (){
      if (localStorage.getItem("localData") != null) {
        common.domLocals.sysData = window.localStorage.getItem('localData');
        return JSON.parse(common.domLocals.sysData);
      }

    }
    /**
     *    @method: updateProjectPg
     *    @description: Thsi is reponsible fro update the UI
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,updateProjectPg: function ( data ) {
      var that  = this;
      $.get("src/templates/p_details.html?v=3", function(htmlFormFile) {
          $('.pTemplate').append(htmlFormFile);
          var templateId =  $('.pTemplate').find('#websites-data')
              ,lData = ( data.products ? data.products : data )
              ,template = Mustache.render($(templateId).html(), { data: lData })
              ;
          $('.pTemplate').html(template);
          var len = data.products ? data.products.length : data.length;
          $("#many-result").html("We have found "+ len +" results!").remove('i');

          that.passModalData ( lData );
          that.initModalBox();

          //Bind Star
          $('.stars').stars();
      });
      //Binding search interaction
      common.searchTags();
    }
    /**
     *    @method: voting
     *    @description: This is reponsible for voting UI interaction and and update the LS
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,voting: function(  ) {
      $(".mainContentWrap").delegate(".increment","click",function(){
        var countAt = $(this).parent().find('.count')
            ,count  = parseInt($(this).parent().find('.count').text())
            ,currId = $(this).parent().data('voting-id')
            ,getLS =  common.getLSData() || {}
            ;
        if($(this).hasClass("up")) {
          var count = isNaN (count) ? 1 : Number(count + 1)
              ;
            countAt.text(count);
            getLS["votingcount"+currId] = {"count" : count, "sysid": currId};
            common.setLSData( getLS );
        }
      });
    }
    /**
     *    @method: Sort
     *    @description: This is reponsible for sort the value and Update the UI
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,sortBy: function ( config, data ){
      var products   =   data.products.slice(0)
      ;
      products.sort(function(a, b){
        return parseInt(b[config.sortKey]) - parseInt(a[config.sortKey]);
      }.bind(config));

      common.updateProjectPg( products );
    }
    /**
     *    @method: priceFilter
     *    @description: This is reponsible for update the UI on price fliter
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,priceFilter: function ( data , min, max ){
      var products    =   data.products.slice(0)
          ,res = []
      ;

      $.each(products, function(index, value){
        if( value.price >= min &&  value.price <= max ){
          res.push(value);
        }
      });

      common.updateProjectPg( res );
    }

    /**
     *    @method: mergeData
     *    @description: This is reponsible for merging the data from actual data
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,mergeData: function ( items ){
      var getData = common.getLSData() || {};
          var idFLS
              ,dataDetails = items.products
              ,ln = items.products.length
          ;
      for (var i = 0; i< ln; i++) {
          var id  = dataDetails[i].product_id;

          var key = "votingcount" + id;
            if (localStorage.getItem("localData") != null) {
              if( !getData[key]){
                getData[key] = {"count" : 0, "sysid": i};
              }else{
                idFLS  = getData[key].sysid;
              }
            }
        if(id == idFLS ){
            dataDetails[i].votingcount = getData[key].count;
        }else {
            dataDetails[i].votingcount = 0;
        }
      }
      //After mering done please update the UI
      common.updateProjectPg( items );
      //Bind Sort event
      common.bindSort(items);

      //Bind Price Filert event
      common.bindPriceFilter(items);

    }
    /**
     *    @method: bindSort
     *    @description: This is reponsible for binding sort event
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,bindSort: function ( items ) {
      $(".label-radio").on("click", function (){
        var  sortKey = $(this).find('input').data('sort')
            ,extraSortKey = $(this).find('input').data('s-type')
            ,config = {}
            ;
            config = {
              "sortKey"       : sortKey,
              "extraSortKey"  : extraSortKey
            };
        common.sortBy(config , items );
      });
    }
    /**
     *    @method: bindPriceFilter
     *    @description: This is reponsible for binding price filter event
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,bindPriceFilter: function ( items ) {
      $("input[type=range]").on("input", function() {
        var min   = $(".min-value").val()
            ,max  = $(".max-value").val()
            ;
        common.priceFilter(items , min, max );
      });
    }
    /**
     *    @method: progressBar
     *    @description: progressBar on page load
     *    @author saorbah
     *    @date 23rd April, 2017
     */
    ,progressBar : function () {
      $(".right-loader i").removeClass('hidden');
      $({property: 0}).animate({property: 105}, {
          duration: 1000,
          step: function() {
            var _percent = Math.round(this.property);
            $('#progress').css('width',  _percent+"%");
            if(_percent == 105) {
                $("#progress").addClass("done");
            }
          },
          complete: function () {
            $("#progress").addClass("done");
            $(".right-loader i").addClass('hidden');
          }
      });
    },
    initModalBox: function ( ) {
      var me = this;
      var modalEl = document.getElementById('spmodal');
      var modalInst = new SPModal( modalEl, {
        openCallback: function( data ) {
          console.log('Callback for when Modal is open.');

        },
        closeCallback: function() {
          console.log('Callback for when Modal is closed.');
        }
      });
      modalInst.init();
    },
    /**
     *   @method: buildModalData
     *   @description: this method will responsibe to build modal data
     *   @author: Saorabh Kumar
     *   @date 23rd April 2017
     */
    buildModalData: function ( prodData ) {
      var me = this;
      $.get("src/templates/modalContent.html", function( htmlFormFile ) {
          $('.sp-modal-content').append( htmlFormFile );
          var templateId =  $('.sp-modal-content').find('#modal-data'),
              template = Mustache.render( $(templateId).html(), { data : prodData } )
              ;
          $('.sp-modal-content').html( template );
      });
    },
    /**
     *   @method: passModalData
     *   @description: on user click it will pass current prodcut id to filter the data
     *   @author: Saorabh Kumar
     *   @date 23rd April 2017
     */
    passModalData : function ( data ) {
      var me = this,
          jQEl = $('.prod-img'),
          key = 'product_id',
          currentProdId,
          filtredData
          ;
          jQEl.on("click", function () {
              currentProdId = $(this).data('product-id');
              filtredData = me.filterData( data, key, currentProdId );
              me.buildModalData( filtredData );
          });
    },
    /**
     *   @method: filterData
     *   @description: This will do filtration
     *   @author: Saorabh Kumar
     *   @date 23rd April 2017
     */
    filterData : function ( data, key, prodId ) {
        var me = this,
            prodData = [],
            cartItem = data;
        for (var i = 0; i < cartItem.length; i++) {
            if (cartItem[i].product_id == prodId) {
                prodData.push(cartItem[i]);
            }
        }
        return prodData;
    },
    /**
     *   @method: changeView
     *   @description: This will do change the view from grid to list
     *   @author: Saorabh Kumar
     *   @date 23rd April 2017
     */
    changeView:function () {
      $('#list').click(function(event){event.preventDefault();$('#products .item').addClass('list-group-item');});
      $('#grid').click(function(event){event.preventDefault();$('#products .item').removeClass('list-group-item');$('#products .item').addClass('grid-group-item');});
    }
  };
  common.init();
  return common;
})();
