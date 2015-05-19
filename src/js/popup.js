var tabName;
var emailID = "test";

$.getJSON("http://www.rlingineni.me/WebList.json", function(data) {

chrome.tabs.getSelected(null, function(tab) {
    tabName = tab.url.toString();
 emailID = search(tabName,data); 
 console.log(emailID);
  
});
    console.log(emailID);
$("#dispatch").click(function() {
    console.log(emailID);
    var letter = $("#message").val();
    console.log(letter);
$.ajax({
    type: "POST",
  url: "https://mandrillapp.com/api/1.0/messages/send.json",
  data: {
    "key": "IAClCgxPhHiriL4aMrCN1w",
    "message": {
      "from_email": "rlingineni97@gmail.com",
      "to": [
          
          {
            "email": emailID,
            "name": "RECIPIENT NAME (OPTIONAL)",
            "type": "to"
          }
          ],
      "autotext": "true",
      "subject": "Mango Says Hi",
      "html": letter
    }
      
}
 }).done(function(response) {
   console.log(response); // if you're into that sorta thing
 });
});



})


function search(nameKey, myArray){
    for (var i=0; i < myArray.websites.length; i++) {
       var final = myArray.websites[i].url;
        if (nameKey.indexOf(final) > -1 ) {
            //console.log("hello");
            return myArray.websites[i].email;
        }
        else 
        {
            console.log(final);
            console.log("nope, try again");
        }
    }
}


function openSearchUrl(url, searchTerm, openInNewTab, sendPostRequest, postData) {

    var newUrl;
    if (sendPostRequest) {
        newUrl = "post.html?url=" + encodeURIComponent(url) + "&postData=" + encodeURIComponent(postData.replace('${searchTerm}', searchTerm));
    } else {
        newUrl = url + searchTerm;
    }

    openUrl(newUrl, openInNewTab);
}
			

			
			




function loadXMLDoc(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(xhr.responseXML);
        }
    };
    xhr.send(null);
}

function renderNewsFeed(feedId, feedUrl, callback) {
    var xslUrl = chrome.extension.getURL("/xsl/NewsFeedControl_" + feedId + ".xsl");
    loadXMLDoc(xslUrl, function(xsl) {

        if (feedUrl == "") {
            feedUrl = chrome.extension.getURL("/xsl/rss_feed.xml");
        }
        loadXMLDoc(feedUrl, function(xml) {
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsl);
            var resultDocument = xsltProcessor.transformToFragment(xml, document);

            document.getElementById("NewsFeedControl_" + feedId).appendChild(resultDocument);

            callback();
        });
    });
}

function openGetPostUrl(url, openInNewTab, sendPostRequest, postData) {

    var newUrl;
    if (sendPostRequest) {
        newUrl = "post.html?url=" + encodeURIComponent(url) + "&postData=" + encodeURIComponent(postData);
    } else {
        newUrl = url;
    }

    openUrl(newUrl, openInNewTab);
}

function openUrl(url, openInNewTab) {
    if (openInNewTab) {
        chrome.tabs.create({
            "url" : url,
            "selected" : true
        });
        window.close();
    } else {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.update(tab.id, {url : url, selected : true}, null);
            window.close();
        });
    }
}

function isBlank(string) {
    return string == null || string.replace(/(^\s+)|(\s+$)/g, "").length == 0;
}

function logoClick(inputTextId) {
    document.getElementById(inputTextId).focus();
}

function keyHandler(event, inputTextId, searchUrl, openInNewTab, sendPostRequest, postData, placeholderText, searchTermHandler) {
    if (event.keyCode == 13) {
        doSearch(inputTextId, searchUrl, openInNewTab, sendPostRequest, postData, placeholderText, searchTermHandler);
    }
}

function focusGained(e, textColor, placeholderText) {
    if (e.target.value == placeholderText) {
        e.target.value = "";
    }

    e.target.style.color = textColor;
}

function focusLost(e, textColor, placeholderText) {
    if (e.target.value == "") {
        e.target.value = placeholderText;
        e.target.style.color = textColor;
    }
}

function doSearch(inputTextId, searchUrl, openInNewTab, sendPostRequest, postData, placeholderText, searchTermHandler) {
    var searchTerm = document.getElementById(inputTextId).value;

    if (isBlank(searchTerm) || searchTerm == placeholderText) {
        return;
    }

    if (searchTermHandler) {
        searchTerm = searchTermHandler(searchTerm);
        document.getElementById(inputTextId).value = searchTerm;
    }

    openSearchUrl(searchUrl, searchTerm, openInNewTab, sendPostRequest, postData);
}

document.addEventListener('DOMContentLoaded', function () {


});
