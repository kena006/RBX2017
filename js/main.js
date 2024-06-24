document.addEventListener("DOMContentLoaded", function(event) {

// Wait for Element

async function waitForElm(q) {
	while (document.querySelector(q) == null) {
		await new Promise(r => requestAnimationFrame(r));
	};
	return document.querySelector(q);
};

// Get user data

const userData = document.getElementsByTagName("meta")[8];
const username = userData.getAttribute("data-name");
const userId = userData.getAttribute("data-userid");
const under13 = userData.getAttribute("data-isunder13");

// 2017 Icon
setTimeout(function(){
	var icon = document.querySelector('link[rel="icon"]');
	icon.href = "https://images.rbxcdn.com/1413ddb319288e8fccb8ab694ed0796c.ico.gzip";
}, 0.0000000000001);

// Old navbar text

waitForElm(".rbx-navbar").then( async(elm) => {
	elm.childNodes[1].childNodes[1].innerText = "Games";
	elm.childNodes[3].childNodes[1].innerText = "Catalog";
	elm.childNodes[5].childNodes[1].innerText = "Develop";
	elm.childNodes[7].childNodes[1].innerText = "ROBUX";
});

// Old account age display
waitForElm("ul.nav.navbar-right.rbx-navbar-icon-group").then( async(elm) => {
	elm.childNodes[1].className = "xsmall age-bracket-label";
	elm.childNodes[1].firstChild.remove();
	
	if (under13) {
		elm.childNodes[1].firstChild.innerText = "Account: Over";
	} else {
		elm.childNodes[1].firstChild.innerText = "Account: Under";
	}
	elm.childNodes[1].firstChild.className = "age-bracket-text";
	
	var ageText = document.createTextNode(" 13 yrs");
	elm.childNodes[1].appendChild(ageText);
	
	var shortText = document.createElement("span");
	shortText.className = "age-bracket-short-text";
	elm.childNodes[1].appendChild(shortText);
	elm.childNodes[1].firstChild.parentNode.insertBefore(shortText, elm.childNodes[1].firstChild);
	shortText.innerHTML = "&gt;";
});

// Old sidebar text and forum button
waitForElm(".left-col-list").then( async(elm) => {
	elm.childNodes[10].remove();
	var forum = elm.childNodes[7].cloneNode(true);
	forum.firstChild.id = "nav-forum";
	forum.firstChild.href = "https://archive.froast.io/forums";
	forum.firstChild.childNodes[1].innerText = "Forum";
	forum.firstChild.firstChild.firstChild.className = "icon-nav-forum";
	elm.appendChild(forum);
	
	elm.childNodes[8].parentNode.insertBefore(forum, elm.childNodes[8]);

	elm.childNodes[10].firstChild.childNodes[1].innerText = "Shop";

	elm.childNodes[11].firstChild.innerText = "Upgrade Now";
});

waitForElm(".rbx-left-col").then( async(elm) => {
	var usernameText = elm.firstChild.firstChild.firstChild.childNodes[1];
	usernameText.style.fontSize = '18px';
	usernameText.style.margin = '0px';
});

// Make sidebar username text not display name
waitForElm("#navigation > ul > li:nth-child(1) > a > div").then( async(elm) => {
	elm.innerText = username
});

// Fix robux icon class
waitForElm("button.btn-navigation-nav-robux-md").then( async(elm) => {
	elm.firstChild.firstChild.className = "icon-nav-robux roblox-popover-close";
	var balance = elm.firstChild.childNodes[1].innerText
	
	// Old robux menu
	var robuxMenuOpen = false;
	elm.addEventListener("click", function() { 
		setTimeout(function(){
			var robuxMenu = elm.parentNode.childNodes[1].childNodes[1].firstChild.firstChild;
			if (robuxMenu.firstChild.firstChild.innerText != (balance + " ROBUX")) {
				robuxMenu.firstChild.remove();
				robuxMenu.childNodes[1].remove();
				robuxMenu.childNodes[1].remove();
				
				var buyRobux = robuxMenu.firstChild.cloneNode(true);
				buyRobux.firstChild.innerText = "Buy ROBUX";
				robuxMenu.appendChild(buyRobux);
			
				var money = robuxMenu.firstChild;
				money.firstChild.href = "https://www.roblox.com/My/Money.aspx#/#Summary_tab"
				money.firstChild.setAttribute("id", "nav-robux-balance");
				money.firstChild.innerText = (balance + " ROBUX");
			}
		}, 0.0000000000000000000000000000000000000000000000000000000000001);
	}); 
});
});
