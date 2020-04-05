console.debug("Starting script");

function listenForEvents() {

    var observeDOM = (function () {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function (obj, callback) {
            if (!obj || !obj.nodeType === 1) {
                return;
            } // validation

            if (MutationObserver) {
                // define a new observer
                var obs = new MutationObserver(function (mutations, observer) {
                    if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
                        callback(mutations[0]);
                    }
                });
                // have the observer observe foo for changes in children
                obs.observe(obj, {childList: true, subtree: true});
            } else if (window.addEventListener) {
                obj.addEventListener('DOMNodeInserted', callback, false);
            }
        }
    })();

    function getDivsWithDataIdAttribute() {

        var coreRail = document.getElementsByClassName("core-rail")[0];
        var result = $(coreRail).find("div[data-id]").toArray();

        return result === undefined ? Array() : result;
    }

    function addHideButton(element) {
        var btn = document.createElement("INPUT");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "hide");
        btn.classList.add("hide-post-button");
        btn.classList.add("button-reset");
        btn.addEventListener("click", function () {
            if (element !== undefined) {
                // find the original button for hiding and click on it
                var artdecoDropdown = element.querySelector("artdeco-dropdown-trigger");
                if (artdecoDropdown != null) {
                    console.debug("artdeco is not null, clicking on it");
                    artdecoDropdown.click();
                } else {
                    console.debug("ardeco is null...");
                }

                var retryAttempts = 0;
                var waitForHideMenuItemToAppearAndClickOnIt = setInterval(function () {

                    if (retryAttempts === 20) {
                        console.debug("Timed out waiting for hide dropdown menu item to appear. "
                                      + "Canceling hiding operation.")
                        clearInterval(waitForHideMenuItemToAppearAndClickOnIt);
                    }

                    artdecoDropdown = element.querySelector("artdeco-dropdown");
                    var liOption = artdecoDropdown.querySelector("li.option-hide-update");
                    if (liOption != null) {
                        var artdecoDropdownItem = liOption.querySelector("artdeco-dropdown-item");
                        artdecoDropdownItem.click();
                        // hide the custom button
                        btn.style.display = "none";
                    } else {

                        var reportButton = artdecoDropdown.querySelector("li.option-report");
                        if (reportButton != null) {
                            console.debug("Report button is present and Hide button is not - "
                                          + "this is most likely an ad and can't be hidden this way. "
                                          + "Clicking on the report ad button");

                            var artdecoDropdownItem = reportButton.querySelector(
                                "artdeco-dropdown-item");
                            artdecoDropdownItem.click();
                            // hide the custom button
                            btn.style.display = "none";
                            clearInterval(waitForHideMenuItemToAppearAndClickOnIt);
                            return;
                        } else {
                            console.debug("Menu item didn't yet appear, waiting further");
                            retryAttempts++;
                            return;
                        }
                    }
                }, 200);

                waitForHideMenuItemToAppearAndClickOnIt();
            }
        });
        element.appendChild(btn);
    }

    // there is only one coreRail element on the page
    var coreRail = document.getElementsByClassName("core-rail")[0];

    // add hide button to elements that already exist in core-rail
    var elementsWithDataIdAttribute = getDivsWithDataIdAttribute("div", "data-id");
    console.debug(
        "There are " + elementsWithDataIdAttribute.length + " elements with data-id attribute");
    elementsWithDataIdAttribute.forEach(function (element) {
        addHideButton(element);
    });

    // start listening for events
    console.debug("Observing DOM...");
    observeDOM(coreRail, function () {
        console.debug("Adding elements...");
        var elementsWithDataIdAttribute = getDivsWithDataIdAttribute("div", "data-id");
        console.debug(
            "There are " + elementsWithDataIdAttribute.length + " elements with data-id attribute");

        elementsWithDataIdAttribute.forEach(function (element) {
            // we add button only if it doesn't already exist
            var containsButton = false;

            var children = element.childNodes;
            for (var i = 0; i < children.length; i++) {
                if (children[i].classList !== undefined &&
                    children[i].classList.contains("hide-post-button")) {
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
                console.debug(
                    "Core rail is ready, it has " + coreRail.children.length + " elements");
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
        intervalId = undefined;
        addListenerForHomeButton();
        listenForEvents();
    }
}

var listener = function () {
    var newUrl = window.location.href;
    if (newUrl !== undefined && newUrl.startsWith("https://www.linkedin.com/feed")) {
        console.debug("Starting to listen for events");
        if (intervalId === undefined) {
            console.debug("Interval id is undefined, checking status");
            intervalId = setInterval(checkStatus, 200);
        } else {
            console.debug("Interval id is defined");
        }
    }
};

window.addEventListener('popstate', listener);
if (intervalId === undefined) {
    console.debug("Interval id is undefined, checking status");
    intervalId = setInterval(checkStatus, 200);
} else {
    console.debug("Interval id is not undefined");
}
