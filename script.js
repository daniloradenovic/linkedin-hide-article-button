console.debug("Starting script");

function listenForEvents() {

    var observeDOM = (function () {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function (obj, callback) {
            if (!obj || !obj.nodeType === 1) return; // validation

            if (MutationObserver) {
                // define a new observer
                var obs = new MutationObserver(function (mutations, observer) {
                    if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                        callback(mutations[0]);
                });
                // have the observer observe foo for changes in children
                obs.observe(obj, {childList: true, subtree: true});
            }

            else if (window.addEventListener) {
                obj.addEventListener('DOMNodeInserted', callback, false);
            }
        }
    })();

    function getDivsWithDataIdAttribute() {
        var arrElements = document.getElementsByTagName("div");
        var arrReturnElements = [];
        var oAttributeValue = (typeof strAttributeValue !== "undefined") ?
            new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)", "i") :
            null;
        var oCurrent;
        var oAttribute;
        for (var i = 0; i < arrElements.length; i++) {
            oCurrent = arrElements[i];
            oAttribute = oCurrent.getAttribute && oCurrent.getAttribute("data-id");
            if (typeof oAttribute === "string" && oAttribute.length > 0) {
                if (typeof strAttributeValue === "undefined" || (oAttributeValue && oAttributeValue.test(oAttribute))) {
                    arrReturnElements.push(oCurrent);
                }
            }
        }
        return arrReturnElements;
    }

    function addHideButton(element) {
        var btn = document.createElement("INPUT");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "hide");
        btn.classList.add("hide-article-button");
        btn.classList.add("button-reset");
        btn.addEventListener("click", function () {
            console.debug("Button is clicked!");
            if (element !== undefined) {
                // find the original button for hiding and click on it
                var liOption = element.querySelector("li.option-hide-update");
                var artdecoButtonItem = liOption.querySelector("artdeco-dropdown-item");
                artdecoButtonItem.click();
                // hide the custom button
                btn.style.display = "none";
            }
        });
        element.appendChild(btn);
    }

    // there is only one coreRail element on the page
    var coreRail = document.getElementsByClassName("core-rail")[0];

    // add hide button to elements that already exist in core-rail
    var elementsWithDataIdAttribute = getDivsWithDataIdAttribute("div", "data-id");
    console.debug("There are " + elementsWithDataIdAttribute.length + " elements with data-id attribute");
    elementsWithDataIdAttribute.forEach(function (element) {
        addHideButton(element);
    });

    // start listening for events
    observeDOM(coreRail, function () {
        console.debug("Adding elements...");
        var elementsWithDataIdAttribute = getDivsWithDataIdAttribute("div", "data-id");
        console.debug("There are " + elementsWithDataIdAttribute.length + " elements with data-id attribute");

        elementsWithDataIdAttribute.forEach(function (element) {
            // we add button only if it doesn't already exist
            var containsButton = false;

            var children = element.childNodes;
            for (var i = 0; i < children.length; i++) {
                if (children[i].classList !== undefined &&
                    children[i].classList.contains("hide-article-button")) {
                    containsButton = true;
                    break;
                }
            }

            if (!containsButton) {
                addHideButton(element);
            }
        });
    });
}

function addListenerForHomeButton() {
    console.debug("Adding listener for home button");
    var homeButton = document.getElementById("feed-nav-item");
    homeButton.addEventListener("click", function () {

        var intervalId = undefined;

        function checkStatus() {
            var coreRail = document.getElementsByClassName("core-rail")[0];
            if (coreRail !== undefined &&
                coreRail.children !== undefined &&
                coreRail.children.length <= 2) {
                console.debug("Core rail still not ready, waiting...");
            } else {
                console.debug("Corerail is ready, it has " + coreRail.children.length + " elements");
                clearInterval(intervalId);
                listenForEvents();
            }
        }

        intervalId = setInterval(checkStatus, 200);
    });
}

/**
 *  ##################
 *  Script starts here
 *  ##################
 */
var intervalId = undefined;

function checkStatus() {

    /*
     Although the document.readyState should be 'complete' at this point,
     or in other words, page should be ready, we check for readiness in case
     a document takes a lot of time to load
     (see https://developer.chrome.com/extensions/content_scripts#run_time)
     */
    if (document.readyState !== "complete") {
        console.debug("Document not yet ready, waiting...");
        return;
    }
    var coreRail = document.getElementsByClassName("core-rail")[0];

    if (coreRail !== undefined &&
        coreRail.children !== undefined
        && coreRail.children.length <= 2) {
        console.debug("Core rail still not ready, waiting...");
    } else {
        console.debug("Corerail is ready, it has " + coreRail.children.length + " elements");
        clearInterval(intervalId);
        addListenerForHomeButton();
        listenForEvents();
    }
}

intervalId = setInterval(checkStatus, 200);