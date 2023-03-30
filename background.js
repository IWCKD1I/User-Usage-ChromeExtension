var startTime;
var tabId;
var today = new Date();
var time;
var PreviousTab = "";
let DeadSocket = 1; // Initialize myVariable to 0


const socket = new WebSocket('ws://localhost:3000');


socket.addEventListener('open', () => {
    var time = getTime();
    chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
        domain = tab[0].url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
        socket.send(JSON.stringify({
            domain: domain,
            StartTime: time
        }));
        PreviousTab = domain;
        DeadSocket = 0;
    });
});



socket.addEventListener('message', event => {
    if (event.data === 'setVariable') {
        DeadSocket = 1; // Change the value of myVariable to 42
    }
});






chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        var domain = getDomain(tab);
        var time = getTime();
        if (tab.active && domain != "" && DeadSocket === 0) {
            PreviousTab = domain;
            socket.send(JSON.stringify({
                domain: domain,
                StartTime: time
            }));
        }
    });

});



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && DeadSocket === 0) {
        var domain = getDomain(tab);
        var time = getTime();
        if (tab.active && domain != "") {
            PreviousTab = domain;
            socket.send(JSON.stringify({
                domain: domain,
                StartTime: time
            }));
        }
    }
});


//Assure that client stopped using the domain after closing the window
chrome.windows.onRemoved.addListener((WId) => {
    var time = getTime();
    socket.send(JSON.stringify({
        domain: PreviousTab,
        StartTime: time
    }));
});




chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        //The user has switched to a different application
        //var time = getTime();
        //socket.send("Stopped using " + domain + " at : " + time + " And went to another APP");
    } else {
        // The user has switched to a different window
        var time = getTime();
        chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
            domain = tab[0].url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
            socket.send(JSON.stringify({
                domain: domain,
                StartTime: time
            }));
            PreviousTab = domain;
        });
    }
});


function getDomain(tab) {
    return (tab.url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0]);
};



function getTime() {
    var today = new Date();
    return (today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
};