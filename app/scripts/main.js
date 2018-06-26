/*
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  "use strict";

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === "[::1]" ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );

  if (
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" || isLocalhost)
  ) {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(function(registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function() {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set:
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            const installingWorker = registration.installing;

            installingWorker.onstatechange = function() {
              switch (installingWorker.state) {
                case "installed":
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  break;

                case "redundant":
                  throw new Error(
                    "The installing " + "service worker became redundant."
                  );

                default:
                // Ignore
              }
            };
          }
        };
      })
      .catch(function(e) {
        console.error("Error during service worker registration:", e);
      });
  }

  // Your custom JavaScript goes here

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  // credit card validation code source
  // https://stackoverflow.com/questions/6176802/how-to-validate-credit-card-number
  function validateCardNumber(number) {
    var regex = new RegExp("^[0-9]{16}$");
    if (!regex.test(number)) return false;

    return luhnCheck(number);
  }

  function luhnCheck(val) {
    var sum = 0;
    for (var i = 0; i < val.length; i++) {
      var intVal = parseInt(val.substr(i, 1));
      if (i % 2 == 0) {
        intVal *= 2;
        if (intVal > 9) {
          intVal = 1 + (intVal % 10);
        }
      }
      sum += intVal;
    }
    return sum % 10 == 0;
  }

  // display error message in case of validation fail
  function displayError() {
    let parent = document.getElementById("checkout");
    let firstElement = document.getElementById("form-start");
    let newElement = document.createElement("div");
    newElement.setAttribute(
      "class",
      "mdl-card mdl-cell mdl-cell--12-col mdl-shadow--2dp mdl-color--red-200"
    );
    newElement.setAttribute("id", "display-error");
    newElement.innerHTML =
      "<h5>Something went wrong, please check your email or credit card number</h5>";
    parent.insertBefore(newElement, firstElement);
  }

  // display success message in case of valid info and purchase success
  function displaySuccess() {
    let parent = document.getElementById("checkout");
    let firstElement = document.getElementById("form-start");
    let newElement = document.createElement("div");
    newElement.setAttribute(
      "class",
      "mdl-card mdl-cell mdl-cell--12-col mdl-shadow--2dp mdl-color--green-200"
    );
    newElement.setAttribute("id", "display-success");
    newElement.innerHTML = "<h5>Thank you for your order</h5>";
    parent.insertBefore(newElement, firstElement);
  }

  // delete error or success message
  // function deleteMessage(elementId) {
  //   let element = document.getElementById(elementId);
  //   element.parentNode.removeChild(element);
  // }

  const completePurchase = document.getElementById("purchase");

  completePurchase.addEventListener("click", function() {
    let email = document.getElementById("email").value;
    let cardNumber = document.getElementById("creditcard").value;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

    if (!validateEmail(email) || !validateCardNumber(cardNumber)) {
      console.log("Wrong email address or credit card number");
      displayError();
    } else {
      displaySuccess();
    }
  });
})();
