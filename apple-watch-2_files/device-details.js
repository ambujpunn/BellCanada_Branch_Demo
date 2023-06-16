var BELL = (function (bell, $) {

    bell.shop = bell.shop || {};
    bell.shop.deviceDetails = {

        showPane: function (paneId) {

            var $moreInfoModal = $("#modal-more-info"),
                $infoPanes = $moreInfoModal.find(".dd-more-info-pane"),
                $selectedPane = $("#" + paneId);

            $infoPanes.addClass("hide");
            $selectedPane.removeClass("hide");
        },

        init: function () {
            $('.sb-device-carousel').slick({
                autoplay: false,
                dots: true,
                arrows: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                mobileFirst: true,
                customPaging: function (slick, index) {
                    var targetImage = slick.$slides.eq(index).find('img').attr('src');
                    return '<button type="button"><img src=" ' + targetImage + ' " alt=""/></button>';
                }
            });

            $('.js-accordion-header').click(function () {
                if (typeof $(this).data("url") === "undefined") {
                    return;
                }
                if ($(this).closest(".js-accordion-header").find("#dynamic_content").length == 0) {

                    $("body").loadingIndicator();

                    var xhr = $.ajax({
                        url: $(this).data("url"),
                        type: 'GET',
                        dataType: 'html'
                    });

                    xhr.always($.proxy(function () {
                        $("body").loadingIndicator("hide");
                    }, this));

                    xhr.fail(function () {
                        alert('error');
                    });

                    xhr.done($.proxy(function (res) {
                        $(this).closest(".accordion-wrap").find("#dynamic_content").html(res);
                    }, this));
                }
            });

        }
    }

    bell.shop.productDetails = {
        productstockAvailabilitySelector: "#js-product-details-stockavailability",
        connectedThingsStockAvailabilitySelector: "#js-connected-things-stock-availability",

        init: function () {

            var $document = $(document);

            var $modalProductImages = $('#modal-accessory-image'),
                $slideshowPrev,
                $slideshowNext;

            if ($modalProductImages.length > 0) {
                $slideshowPrev = $modalProductImages.find('.rsx-slideshow-previous');
                $slideshowNext = $modalProductImages.find('.rsx-slideshow-next');

                $document.keyup(function (e) {
                    if ($modalProductImages.is('.rsx-active')) {
                        //Left keyboard button pressed
                        if (e.which === 37) {
                            if ($slideshowPrev instanceof jQuery) {
                                $slideshowPrev.click();
                            }
                        }
                        //Right keyboard button pressed
                        else if (e.which === 39) {
                            if ($slideshowNext instanceof jQuery) {
                                $slideshowNext.click();
                            }
                        }
                    }
                });
            }

            //$document.on("click", "a[href=#modal-accessory-image]", function (event) {
            //    event.preventDefault();
            //    $($(this).attr("href")).modal("open");
            //});

            if (typeof detailsOptions != "undefined" && detailsOptions != null) {

                var productId = detailsOptions.productId;
                var updateUrl = detailsOptions.updateUrl;

                $nsDetail.initProductDetails(productId, updateUrl)

                //$('.shp-prod-overview .rsx-slideshow').click(function () {
                //    $(this).toggleClass('rsx-active');
                //});
            }
        },

        initProductDetails: function (productId, updateUrl) {
            var self = this;
            $('#modalWindow').modal();
            $('[id^="selectOption_"]').on("click", function () {
                var selectionID = $(this).data("prdid");
                $("input[id^='hdProductId']").val(selectionID);
                var termElementValue = $("input[id^='hdSelectedTermId']").val() + "," + productId;
                $("input[id^='term_element']").val(termElementValue);
                //$("a[href=\"#modal-accessory-image\"]").unbind();
                if ($("meta[name=language]").attr("content") == 'en' && window.location.href.toLowerCase().indexOf('business') == -1 || $("meta[name=language]").attr("content") == 'fr' && window.location.href.toLowerCase().indexOf('entreprise') == -1) {
                    var isOmniEnabled = $('#hdOmniEnabled').val(),
                        cbFun = isOmniEnabled && isOmniEnabled.toLowerCase() != "false" ? function () {
                            if ($(BELL.shop.productDetails.connectedThingsStockAvailabilitySelector).length > 0) {
                                BELL.shop.accessories.inventory.loadStockAvailability(selectionID, "CONNECTEDTHINGS").done(function () {
                                    BELL.shop.buynow.init();
                                });
                            }
                            else {
                                BELL.shop.productDetails.loadProductStockAvailability(selectionID).done(function () {
                                    BELL.shop.buynow.init();
                                });
                            }
                        } : function () { };
                }
                $nsDetail.selectionChanged(productId, updateUrl, cbFun);
                //Construct a selector to return focus to the clicked element (memory or colour radio) after the HTML is replaced by AJAX
                self.partialIdSelector = ($(this).attr("id").indexOf("color") > -1) ? "selectOption_color" : "selectOption_memory";
            });

            $('[id^="selectOption_"]').on("keydown", function (e) {
                if (e.which == 13) {

                    var selectionID = $(this).data("prdid");
                    $("input[id^='hdProductId']").val(selectionID);
                    var termElementValue = $("input[id^='hdSelectedTermId']").val() + "," + productId;
                    $("input[id^='term_element']").val(termElementValue);
                    //$("a[href=\"#modal-accessory-image\"]").unbind();
                    if ($("meta[name=language]").attr("content") == 'en' && window.location.href.toLowerCase().indexOf('business') == -1 || $("meta[name=language]").attr("content") == 'fr' && window.location.href.toLowerCase().indexOf('entreprise') == -1) {
                        var isOmniEnabled = $('#hdOmniEnabled').val(),
                            cbFun = isOmniEnabled && isOmniEnabled.toLowerCase() != "false" ? function () {
                                if ($(BELL.shop.productDetails.connectedThingsStockAvailabilitySelector).length > 0) {
                                    BELL.shop.accessories.inventory.loadStockAvailability(selectionID, "CONNECTEDTHINGS").done(function () {
                                        BELL.shop.buynow.init();
                                    });
                                }
                                else {
                                    BELL.shop.productDetails.loadProductStockAvailability(selectionID).done(function () {
                                        BELL.shop.buynow.init();
                                    });
                                }
                            } : function () { };
                    }
                    $nsDetail.selectionChanged(productId, updateUrl, cbFun);
                    //Construct a selector to return focus to the clicked element (memory or colour radio) after the HTML is replaced by AJAX
                    self.partialIdSelector = ($(this).attr("id").indexOf("color") > -1) ? "selectOption_color" : "selectOption_memory";

                    // store selected product trim to retain focus after page loads
                    localStorage.setItem("colourClass", $(this).attr("class"));
                }

                if (e.keyCode === 37 || e.keyCode === 38) { //prev
                    var index = $(this).index(),
                        selectedEl = $('ul.dd-color-options li')[index - 1];
                    e.preventDefault();
                    $(this).prev().click();
                    $nsDetail.retainFocusElement(selectedEl);
                }
                if (e.keyCode === 39 || e.keyCode === 40) { //next
                    var index = $(this).index(),
                        selectedEl = $('ul.dd-color-options li')[index + 1];
                    e.preventDefault();
                    $(this).next().click();
                    $nsDetail.retainFocusElement(selectedEl);
                }
            });

            $('[id^="selectOption-term"]').on("click", function () {
                var selectionID = $(this).data("prdid");
                $("input[id^='hdProductId']").val(productId);
                $("input[id^='hdSelectedTermId']").val(selectionID);
                var termElementValue = $("input[id^='hdSelectedTermId']").val() + "," + productId;
                $("input[id^='term_element']").val(termElementValue);
                $("input[name='TermId']").val(selectionID);
                $nsDetail.selectionChanged(productId, updateUrl);
                self.partialIdSelector = $(this).data("prdid");
            });

            $('[id^="selectOptionSize_"]').on("change", function () {
                var isOmniEnabled = $('#hdOmniEnabled').val(),
                    cbFun = isOmniEnabled && isOmniEnabled.toLowerCase() != "false" ? function () {
                        if ($(BELL.shop.productDetails.connectedThingsStockAvailabilitySelector).length > 0) {
                            BELL.shop.accessories.inventory.loadStockAvailability(selectionID, "CONNECTEDTHINGS").done(function () {
                                BELL.shop.buynow.init();
                            });
                        }
                        else {
                            BELL.shop.productDetails.loadProductStockAvailability(selectionID).done(function () {
                                BELL.shop.buynow.init();
                            });
                        }
                    } : function () { };
                var productId = detailsOptions.productId;
                var updateUrl = detailsOptions.updateUrl;
                var selectionID = $(this).selected().val();
                $("input[id^='hdProductId']").val(selectionID);
                var termElementValue = $("input[id^='hdSelectedTermId']").val() + "," + productId;
                $("input[id^='term_element']").val(termElementValue);
                $("a[href=\"#modal-accessory-image\"]").unbind();
                $nsDetail.selectionChanged(productId, updateUrl, cbFun);
                self.partialIdSelector = $(this).selected().val();
            });
        },
        retainFocusElement: function (focusEl) {
            if (focusEl) {
                //Construct a selector to return focus to the clicked element (memory or colour radio) after the HTML is replaced by AJAX
                self.partialIdSelector = ($(focusEl).attr("id").indexOf("color") > -1) ? "selectOption_color" : "selectOption_memory";
                // store selected product trim to retain focus after page loads
                localStorage.setItem("colourClass", $(focusEl).attr("class"));
            }
        },
        selectionChanged: function (productId, updateUrl, cb) {          
            var self = this;
            var $prdPriceSectionDiv = self.productDetailsIDGrab(productId);
            if ($("meta[name=language]").attr("content") == 'en' && window.location.href.toLowerCase().indexOf('business') !== -1 || $("meta[name=language]").attr("content") == 'fr' && window.location.href.toLowerCase().indexOf('entreprise') !== -1) {
                var getloadertext1 = $("#divloadertext").text();
                $('body').loadingIndicator({
                    message: getloadertext1
                });
            }
            else
            {
                $("body").loadingIndicator();
            }
            var url = updateUrl;
            var termid = $("input[id^='hdSelectedTermId']").val();
            $.ajax({
                url: url,
                context: document.body,
                data: $("#selectionForm" + "_" + termid).serialize(),
            }).done(function (data, status) {

                if (status == "success") {

                    var reloadableData = data.substring(data.indexOf("<!--reloadable:start-->") + "<!--reloadable:start-->".length, data.indexOf("<!--reloadable:end-->"));

                    var $panel = $(reloadableData);

                    $prdPriceSectionDiv.replaceWith($panel);
                    $(".sb-device-carousel").addClass("dd-main-carousel--loading");

                    $prdPriceSectionDiv = self.productDetailsIDGrab(productId);
                    $(".dd-main .tooltip-interactive").tooltip();
                    //bell.rsx.utils.initWidgets($prdPriceSectionDiv);
                    //bell.rsx.utils.initWidgets($(".rsx-modal-group-wrap"));
                    $nsDetail.initProductDetails(productId, updateUrl);
                    if ($("#rsx-product-details-modal").length > 0) {
                        $("#rsx-product-details-modal .rsx-modal-body a:not([href='javascript:void(0)']):not(.rsx-modal-close):not([data-trigger='video'])").attr("data-share-plan-redirect", true);
                        $("#modalWindow .rsx-modal-body a:not([href='javascript:void(0)']):not(.rsx-modal-close):not([data-trigger='video'])").attr("data-share-plan-redirect", true);
                    }


                    // give focus to previous target before page refresh
                    let classTarget = '.' + localStorage.getItem("colourClass");
                    $(classTarget).focus();

                    // clear out localStorage
                    localStorage.clear();
                }
                //Retrieve the element (memory or colour radio) that was clicked before being replaced by AJAX and set focus to it
                //bell.rsx.utils.accessibility.lastFocusedElement = $('[id^="' + self.partialIdSelector + '"].rsx-active, ' + //for colours
                //    '.rsx-active [id^="' + self.partialIdSelector + '"],' +//for memory
                //    '#selectOption-term[data-prdid="' + self.partialIdSelector + '"]'//for terms
                //);               

                $(".sb-device-carousel").slick({
                    autoplay: false,
                    dots: true,
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    mobileFirst: true,                  
                    customPaging: function (slick, index) {
                        var targetImage = slick.$slides.eq(index).find('img').attr('src');
                        return '<button type="button"><img src=" ' + targetImage + ' " alt=""/></button>';
                    }
                    
                }).slick("refresh");

                $(".device-product").slick($(".device-product").data("slick"))
                $(".device-thumb-nav").slick($(".device-thumb-nav").data("slick"))
                $('.tooltip-static').tooltip();

                setTimeout(function () {
                    $(".sb-device-carousel").removeClass("dd-main-carousel--loading");
                }, 500);
                //bell.rsx.utils.accessibility.returnFocus();
                $("body").loadingIndicator("hide");
                if (typeof cb === "function") {
                    cb();
                }
            });
        },
        productDetailsIDGrab: function (productId) {
            var objNamespcaed = $("#" + productId + " #productPriceDiv");
            var obj = $("#productPriceDiv");
            return objNamespcaed.length > 0 ? objNamespcaed : obj;
        },

        loadProductStockAvailability: function (productID) {
            var $this = this;

            return new $.Deferred(function (defer) {
                $.ajax({
                    url: "/ajax/rsxproduct/GetStockAvailabilityView",
                    data: { productID: productID },
                    async: true,
                    dataType: "html",
                    success: function (data) {
                        $(bell.shop.productDetails.productstockAvailabilitySelector).html(data);
                        //bell.rsx.utils.initWidgets($($this.modalSelector));

                        defer.resolve();
                    },
                    error: function (data) {
                        console.error("Error loading view: ", data);
                        defer.reject();
                    },
                    complete: function () {
                        // omniture values 
                        var omnitureShopValues = $('#hdomnitureShopValues').val();
                        var omnitureShpOnLoad = $('#hdOmnitureOnLoadFlag').val();
                        var isBBM = $('#hdisBBM').val();
                        var isAALEnabled = $('#hdisAALEnabled').val();
                        //                        
                        if (typeof isBBM != 'undefined' && isBBM.toLowerCase() == "false"
                            && ((typeof omnitureShpOnLoad === 'undefined') || (typeof omnitureShpOnLoad !== 'undefined' && omnitureShpOnLoad.toLowerCase() == "false"))) {
                            if (typeof isAALEnabled != 'undefined' && isAALEnabled.toLowerCase() == "false") {
                                if (typeof s_oTrackPage !== "undefined") {
                                    s_oTrackPage({
                                        s_oAPT: "798-2-1",
                                        s_oPRD: [{ category: "ProductDetails", name: $('#hdOmnitureProductName').val(), sku: $('#hdOmnitureProductID').val() }],
                                        s_oHSA: omnitureShopValues
                                    })
                                    }
                            }
                            if (typeof omnitureShpOnLoad !== 'undefined' && omnitureShpOnLoad.toLowerCase() == "false") {
                                $("#hdOmnitureOnLoadFlag").attr("value", "True");
                            }
                        }
                        else {
                            if (typeof isAALEnabled != 'undefined' && isAALEnabled.toLowerCase() == "false") {
                                if (typeof s_track !== "undefined") {
                                    s_track({
                                        s_oAPT: "798-2-1",
                                        s_oPRD: [{ category: "ProductDetails", name: $('#hdOmnitureProductName').val(), sku: $('#hdOmnitureProductID').val() }],
                                        s_oHSA: omnitureShopValues
                                    })
                                }
                            }
                        }
                        //
                    }
                });
            });
        }
    };
    var $nsDetail = bell.shop.productDetails;

    return bell;

})(BELL || {}, jQuery);




jQuery(function () {
    BELL.shop.deviceDetails.init();
    BELL.shop.productDetails.init();
});

