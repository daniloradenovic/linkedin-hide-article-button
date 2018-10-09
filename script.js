function listenForEvents() {
    console.debug("Starting script");

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
        var btn = document.createElement("BUTTON");
        btn.classList.add("hide-article-link");
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
        var t = document.createTextNode("hide");
        btn.appendChild(t);
        element.appendChild(btn);
    }

    // there is only one coreRail element on the page
    var coreRail = document.getElementsByClassName("core-rail")[0];

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
            // we need to check whether button already exists and add it, if it doesn't exist
            var containsButton = false;

            var children = element.childNodes;
            for (var i = 0; i < children.length; i++) {
                if (children[i].tagName !== undefined && children[i].tagName.toLowerCase() === "button") {
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

window.onload = function () {

    var intervalId = undefined;
    function checkStatus() {
        var coreRail = document.getElementsByClassName("core-rail")[0];
        if (coreRail.children.length <= 2) {
            console.debug("Core rail still not ready, waiting...");
        } else {
            console.debug("Corerail is ready, it has " + coreRail.children.length + " elements");
            clearInterval(intervalId);
            listenForEvents();
        }
    }
    intervalId = setInterval(checkStatus, 200);

    var homeButton = document.getElementById("feed-nav-item");
    homeButton.addEventListener("click",function () {

        var intervalId = undefined;
        function checkStatus() {
            var coreRail = document.getElementsByClassName("core-rail")[0];
            // we should wait until coreRail has more than 2 children, which signals 
            // that the feed articles have loaded 
            if (coreRail.children.length <= 2) {
                console.debug("Core rail still not ready, waiting...");
            } else {
                console.debug("Corerail is ready, it has " + coreRail.children.length + " elements");
                clearInterval(intervalId);
                listenForEvents();
            }
        }
        intervalId = setInterval(checkStatus, 200);
    });

};