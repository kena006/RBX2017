// home.js
// Wait for element
async function waitForElm(q) {
	while (document.querySelector(q) == null) {
		await new Promise(r => requestAnimationFrame(r));
	};
	return document.querySelector(q);
};

// Declare variables
var homePageStyle;
var username;
var userId;
var under13;

// Get user data
waitForElm("head > meta:nth-child(12)").then(async (userData) => {
	username = userData.getAttribute("data-name");
	userId = userData.getAttribute("data-userid");
	under13 = userData.getAttribute("data-isunder13");
});

const getUserImage = (type, id, size, format, circular) => {
	return fetch("https://thumbnails.roblox.com/v1/users/" + type + "?userIds=" + id + "&size=" + size + "x" + size + "&format=" + format + "&isCircular=" + circular, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
    .then(res => {
		return res.json();
    })
    .then(data => {
		return data.data[0]["imageUrl"];
    });
};
const getGameData = (id, type) => {
	return fetch("https://games.roproxy.com/v1/games?universeIds=" + id, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
    .then(res => {
		return res.json();
    })
    .then(data => {
		return data.data[0][type];
    });
};

// Old style home page

// Bring back home page greeting
function header(link, image, name) {
	return `
	<div id="home-header" class="col-xs-12 home-header-container">
		<div class="home-header">
			<a href="${ link ?? "/users/1/profile" }" class="user-avatar-container avatar avatar-headshot-lg">
				<span class="thumbnail-2d-container avatar-card-image">
					<img src="${ image ?? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" }" alt="" class="avatar-card-image">
				</span>
			</a>
			<div class="user-info-container">
				<h1 class="user-name-container">
					<a href="${ link ?? "/users/1/profile" }">${ name ?? "Roblox" }</a>
				</h1>
			</div>
		</div>
	</div>
	`;
};

waitForElm("#HomeContainer .section:first-child").then(async (hdrSec) => {
	getUserImage("avatar-headshot", userId, "150", "Png", "false").then (async (image) => {
		let link = "https://www.roblox.com/users/" + userId + "/profile";
		let greetingText = "Hello, " + username + "!";
		let htmlToInsert = header(link, image, greetingText);

		hdrSec.outerHTML = htmlToInsert;
	});
});

// Wait for the friends list to be loaded in first to ensure the homepage is completely loaded
waitForElm("#place-list > div > div > div.friend-carousel-container").then(async (friends) => {
	var container = friends.parentNode
	
	// Remove home page bloat
	setTimeout(function(){
		if (container.childNodes[1].hasAttribute(["data-testid"])) {
			homePageStyle = 1;
		} else{
			homePageStyle = 0;
		}

		if (homePageStyle == 0) {
			console.log(homePageStyle);
			waitForElm("#place-list > div > div > div:nth-child(2)").then(async (elm) => {elm.remove()});
			waitForElm("#place-list > div > div > div.game-carousel.wide-game-tile-carousel.expand-home-content").then(async (elm) => {elm.remove()});
			waitForElm("#place-list > div > div > div:nth-child(4)").then(async (elm) => {elm.remove()});
			waitForElm("#place-list > div > div > div:nth-child(9)").then(async (elm) => {elm.remove()});
			waitForElm("#place-list > div > div > div:nth-child(12)").then(async (elm) => {elm.remove()});
		} else{
			waitForElm("#place-list > div > div > div:nth-child(2)").then(async (elm) => {elm.remove()});
			waitForElm("#place-list > div > div > div:nth-child(4)").then(async (elm) => {elm.remove()});
			waitForElm("#place-list > div > div > div:nth-child(7)").then(async (elm) => {elm.remove()});
		}
	}, 100);
	
	// Game card player count
	var gameCards = document.querySelectorAll(".grid-item-container.game-card-container")
	for (let i = 0; i < gameCards.length; i++) {
		var gamecard = gameCards[i];
		var id = gamecard.firstChild.id;
	
		gamecard.firstChild.childNodes[2].remove();
		var name = gamecard.firstChild.childNodes[1];
		
		var playerCount = name.cloneNode();
		var playing = await getGameData(id, "playing");
		
		if (playing) {
			playerCount.innerText = playing + " Playing"
		} else {
			playerCount.innerText = "0 Playing"
		}
		
		playerCount.className = "game-card-name-secondary";
		playerCount.removeAttribute("title");
		
		gamecard.firstChild.appendChild(playerCount);
	}
});
