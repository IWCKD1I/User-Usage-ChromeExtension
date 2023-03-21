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
        socket.send("First Started using " + domain + " at : " + time);
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
            socket.send("Started using " + domain + " at : " + time);
        }
    });

});



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && DeadSocket === 0) {
        var domain = getDomain(tab);
        var time = getTime();
        if (tab.active && domain != "") {
            PreviousTab = domain;
            socket.send("Started using " + domain + " at : " + time);
        }
    }
});


//Assure that client stopped using the domain after closing the window
chrome.windows.onRemoved.addListener((WId) => {
    var time = getTime();
    socket.send("Stopped using " + PreviousTab + " at : " + time);
    socket.send(WId + "Closed");
});


chrome.windows.onCreated.addListener(function(window) {
    const socket = new WebSocket('ws://localhost:3000');
    if (window.type === "normal") {
        const socket = new WebSocket('ws://localhost:3000');
        socket.send("New window created with ID: " + window.id);
    }
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
            socket.send("Started using " + domain + " at : " + time);
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