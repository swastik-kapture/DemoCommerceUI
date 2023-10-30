
const API_BASE_URL = 'http://localhost:5000';

function showAccountDetails(uid) {
    // get localstorage data
    let allUsers = JSON.parse(localStorage.getItem("allUsers"));
    // get data from localstorage
    window.location.href = `/details.html?uid=${uid}`
}

function createUserProfile(userDetails) {
    innerHtmlText = `<div class="col-md-6 col-xxl-4">
    <!--begin::Card-->
    <div class="card">
        <!--begin::Card body-->
        <div class="card-body d-flex flex-center flex-column p-9">
            <!--begin::Avatar-->
            <div class="symbol symbol-65px symbol-circle mb-5">
                <span class="symbol-label fs-2x fw-bold text-warning bg-light-warning">${userDetails.name[0]}</span>
                <div class="bg-success position-absolute rounded-circle translate-middle start-100 top-100 border border-4 border-white h-15px w-15px ms-n3 mt-n3"></div>
            </div>
            <!--end::Avatar-->
            <!--begin::Name-->
            <a href="#" class="fs-4 text-gray-800 text-hover-primary fw-bolder mb-0">${userDetails.name}</a>
            <!--end::Name-->
            <!--begin::Position-->
            <div class="fw-bold text-gray-400 mb-6">${userDetails.email}</div>
            <!--end::Position-->
            <!--begin::Info-->
            <div class="d-flex flex-center flex-wrap mb-5">
                <!--begin::Stats-->
                <div class="border border-dashed rounded min-w-125px py-3 px-4 mx-3 mb-3">
                    <div class="fs-6 fw-bolder text-gray-700">${userDetails.id}</div>
                    <div class="fw-bold text-gray-400">User ID</div>
                </div>
                <!--end::Stats-->
                <!--begin::Stats-->
                <div class="border border-dashed rounded min-w-125px py-3 px-4 mx-3 mb-3">
                    <div class="fs-6 fw-bolder text-gray-700">${userDetails.clientId}</div>
                    <div class="fw-bold text-gray-400">Client ID</div>
                </div>
                <!--end::Stats-->
            </div>
            <!--end::Info-->
            <!--begin::Follow-->
            <a onclick="showAccountDetails(${userDetails.id})" class="btn btn-sm btn-light-primary">
            <!--begin::Svg Icon | path: icons/duotune/arrows/arr012.svg-->
            <!--end::Svg Icon-->Show Details</a>
            <!--end::Follow-->
        </div>
        <!--begin::Card body-->
    </div>
    <!--begin::Card-->
</div>`
return innerHtmlText;
}

document.addEventListener("DOMContentLoaded", () => {
    // Function to call the API and generate the list
    const apiUrl = `${API_BASE_URL}/cc/getall`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // get users list
            let dataList = data.dataList[0];
            // store all user accounts in 
            let userAccounts = {};
            // loop over data list
            // add counts to page
            document.getElementById("user-list-count").innerHTML = `(${dataList.length})`
            // placeholder
            let innerHtmlText = ""
            // loop over data list to create user profiles
            dataList.forEach(dataItem => {
                userAccounts[String(dataItem.id)] = dataItem;
                innerHtmlText += createUserProfile(dataItem);
            });
            // add to localstorage
            localStorage.setItem("allUsers", JSON.stringify(userAccounts));
            // add to html
            document.getElementById("all-users").innerHTML = innerHtmlText;

        })
        .catch(error => {
            console.error('GET request error:', error);
        });

})