const API_BASE_URL = "http://localhost:5000";

function getAccountDetails(uid) {
  // get localstorage data
  let allUsers = JSON.parse(localStorage.getItem("allUsers"));
  // return account details
  return allUsers[String(uid)];
}

function parseURLParams(url) {
  var queryStart = url.indexOf("?") + 1,
    queryEnd = url.indexOf("#") + 1 || url.length + 1,
    query = url.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    parms = {},
    i,
    n,
    v,
    nv;

  if (query === url || query === "") return;

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=", 2);
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);

    if (!parms.hasOwnProperty(n)) parms[n] = [];
    parms[n].push(nv.length === 2 ? v : null);
  }
  return parms;
}

function computeCartValue(metaData) {
    let cart_value = 0;
    try {
        metaData = JSON.parse(metaData);
        Object.keys(metaData).forEach((item_name) => {
            item_price = parseFloat(metaData[item_name]['price'].replace('$', ''))
            cart_value += item_price
        })
    } catch {
        console.log("Failed to calculate cart value!")
    }
    return `$ ${cart_value.toFixed(2)}`
}

function createEventTableItem(dataItem) {
    let event_name = "Event";
    let event_name_mode = "primary";
    if (dataItem.eventName === "SIGN_UP") {
        event_name = "User Signup"
        event_name_mode = "info"
    } else if (dataItem.eventName === "SIGN_IN") {
        event_name = "User Signin"
        event_name_mode = "primary"
    } else if (dataItem.eventName === "add") {
        event_name = "Add to Cart"
        event_name_mode = "success"
    } else if (dataItem.eventName === "remove") {
        event_name = "Remove from Cart"
        event_name_mode = "warning"
    } else if (dataItem.eventName === "checkout") {
        event_name = "Checkout Initiated"
        event_name_mode = "success"
    } else if (dataItem.eventName === "cancel") {
        event_name = "Checkout Cancelled"
        event_name_mode = "danger"
    } else if (dataItem.eventName === "purchase") {
        event_name = "Checkout Cancelled"
        event_name_mode = "success"
    }
    return `<tr>
    <td class="ps-9">
        <span class="badge badge-light-${event_name_mode} fs-7 fw-bolder">${event_name}</span>
    </td>
    <td class="ps-0">
        <a href="" class="text-hover-primary text-gray-600">${computeCartValue(dataItem.metaData)}</a>
    </td>
    <td>127.0.0.1</td>
    <td>0 secs ago</td>
    <td data-bs-target="license">View Details</td>
    <td class="ps-5">
        <button type="button" data-action="copy" class="btn btn-active-color-primary btn-icon btn-sm btn-outline-light d-">
            <!--begin::Svg Icon | path: icons/duotune/general/gen054.svg-->
            <span class="svg-icon svg-icon-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path opacity="0.5" d="M18 2H9C7.34315 2 6 3.34315 6 5H8C8 4.44772 8.44772 4 9 4H18C18.5523 4 19 4.44772 19 5V16C19 16.5523 18.5523 17 18 17V19C19.6569 19 21 17.6569 21 16V5C21 3.34315 19.6569 2 18 2Z" fill="black" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7857 7.125H6.21429C5.62255 7.125 5.14286 7.6007 5.14286 8.1875V18.8125C5.14286 19.3993 5.62255 19.875 6.21429 19.875H14.7857C15.3774 19.875 15.8571 19.3993 15.8571 18.8125V8.1875C15.8571 7.6007 15.3774 7.125 14.7857 7.125ZM6.21429 5C4.43908 5 3 6.42709 3 8.1875V18.8125C3 20.5729 4.43909 22 6.21429 22H14.7857C16.5609 22 18 20.5729 18 18.8125V8.1875C18 6.42709 16.5609 5 14.7857 5H6.21429Z" fill="black" />
                </svg>
            </span>
            <!--end::Svg Icon-->
        </button>
    </td>
</tr>`
}

document.addEventListener("DOMContentLoaded", () => {
  // Function to call the API and generate the list
  const currentUrl = window.location.href;
  // get parsed url contents
  let parsedContents = parseURLParams(currentUrl);
  // if not UID take it to accounts page
  if (parsedContents['uid'] === undefined) {
    window.location.href = "/accounts.html"
  } else {
    userAccount = getAccountDetails(parsedContents['uid']);
    document.getElementById("user-name").innerHTML = userAccount.name;
    document.getElementById("user-address").innerHTML = userAccount.address;
    document.getElementById("user-email").innerHTML = userAccount.email;
  }
  // create current API URL
  let apiUrl = `${API_BASE_URL}/e/getbycustomerid?id=${parsedContents['uid'][0]}`;
  // create html content
  htmlContent = ""
  // fetch data for API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // get users list
      let dataList = data.dataList[0];
      // placeholder
      let innerHtmlText = "";
      // count cart type events
      cartEventCount = 0;
      // count checkout events
      checkoutEventCount = 0;
      // checkout cancel count
      cancelEventCount = 0;
      // purchase event count
      purchaseEventCount = 0;
      // success rate
      successRate = 0;
      // loop over data list to create event details
      dataList.forEach((dataItem) => {
        if (dataItem.eventName === 'add' || dataItem.eventName === 'remove') {
            cartEventCount += 1;
        }
        else if (dataItem.eventName === 'checkout') {
            checkoutEventCount += 1;
        }
        else if (dataItem.eventName === 'cancel') {
            cancelEventCount += 1;
        }
        else if (dataItem.eventName === 'purchase') {
            purchaseEventCount += 1;
        }
        // compute success rate
        successRate = parseInt(purchaseEventCount / (purchaseEventCount + cancelEventCount) * 100);
        // create table item
        tableItem = createEventTableItem(dataItem);
        // add to html content
        htmlContent += tableItem;
      });
      // add data to page
      document.getElementById("cart-event-count").innerHTML = `${cartEventCount}`
      document.getElementById("checkout-event-count").innerHTML = `${checkoutEventCount}`
      document.getElementById("success-rate").innerHTML = `${successRate}%`
      document.getElementById("event-table").innerHTML = htmlContent;
    })
    .catch((error) => {
      console.error("GET request error:", error);
    });
});
