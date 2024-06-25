// home.js
// Global functions
async function waitForElm(q) {
	while (document.querySelector(q) == null) {
		await new Promise(r => requestAnimationFrame(r));
	};
	return document.querySelector(q);
};
function createElement(elmType, elmClass, elmParent) {
	elm = document.createElement(elmType);
	elm.className = elmClass;
	elmParent.appendChild(elm);
	
	return elm;
}
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
		if (data) {
			return data.data[0]["imageUrl"];
		} else {
			console.log("There was an error while fetching data");
		}
    });
};
const getGameData = (id, type, api) => {
	return fetch(api + id, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
    .then(res => {
		return res.json();
    })
    .then(data => {
		if (data) {
			return data.data[0][type];
		} else {
			console.log("There was an error while fetching data");
		}
    });
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
	
	// Set up gamecards
	var gameCards = document.querySelectorAll(".grid-item-container.game-card-container")
	for (let i = 0; i < gameCards.length; i++) {
		var gamecard = gameCards[i];

		gamecard.firstChild.childNodes[2].remove();
		var name = gamecard.firstChild.childNodes[1];
		
		playerCount = createElement("div", "game-card-name-secondary", gamecard.firstChild);
		playerCount.innerText = "0 Playing"
		
		voting = createElement("div", "game-card-vote", gamecard.firstChild);
		
		voteBar = createElement("div", "vote-bar", voting);
		voteBar.setAttribute("data-voting-processed", false);
		
		voteCounts = createElement("div", "vote-counts", voting);
		
		dislikeCount = createElement("div", "vote-down-count", voteCounts);
		dislikeCount.innerText = "0";
		
		likeCount = createElement("div", "vote-up-count", voteCounts);
		likeCount.innerText = "0";
		
		thumbsUp = createElement("div", "vote-thumbs-up", voteBar);
		
		thumbsUpIcon = createElement("span", "icon-thumbs-up", thumbsUp);
		
		voteContainer = createElement("div", "vote-container", voteBar);
		voteContainer.setAttribute("data-upvotes", 0);
		voteContainer.setAttribute("data-downvotes", 0);
		
		voteBackground = createElement("div", "vote-background no-votes", voteContainer);
		
		votePercentage = createElement("div", "vote-percentage", voteContainer);
		votePercentage.style = "width: 0%;";
		
		voteMask = createElement("div", "vote-mask", voteContainer);
		
		for (let i = 0; i < 4; i++) {
			createElement("div", "segment seg-" + [i + 1], voteMask);
		}
		
		thumbsDown = createElement("div", "vote-thumbs-down", voteBar);
		
		thumbsDownIcon = createElement("span", "icon-thumbs-down", thumbsDown);
		
		footer = createElement("span", "game-card-footer", gamecard.firstChild);
		
		by = createElement("span", "text-label xsmall", footer);
		by.innerText = "By ";
		
		creator = createElement("a", "text-link xsmall text-overflow", footer);
		creator.innerText = "";
		creator.setAttribute("href", "");
		creator.setAttribute("ng-non-bindable", "");
	};
	
	// Gamecard playing
	for (let i = 0; i < gameCards.length; i++) {
		var gamecard = gameCards[i];
		var id = gamecard.firstChild.id;
		
		var playerCount = gamecard.firstChild.childNodes[2]
		var playing = await getGameData(id, "playing", "https://games.roproxy.com/v1/games?universeIds=");
		
		if (playing) {
			playerCount.innerText = playing + " Playing"
		} else {
			playerCount.innerText = "0 Playing"
		}
	}
	
	// Gamecard creator data
	for (let i = 0; i < gameCards.length; i++) {
		var gamecard = gameCards[i];
		var id = gamecard.firstChild.id;
		
		var creatorData = await getGameData(id, "creator", "https://games.roproxy.com/v1/games?universeIds=");
		
		footer = gamecard.firstChild.childNodes[4];
		creatorLink = footer.childNodes[1]
		creatorLink.innerText = creatorData.name;
		
		if (creatorData.type == "User") {
			creatorLink.href = "https://www.roblox.com/users/" + creatorData.id + "/profile";
		} else{
			creatorLink.href = "https://www.roblox.com/groups/" + creatorData.id;
		}
	}
	
	// Gamecard voting
	for (let i = 0; i < gameCards.length; i++) {
		var gamecard = gameCards[i];
		var id = gamecard.firstChild.id;
		
		var likes = await getGameData(id, "upVotes", "https://games.roblox.com/v1/games/votes?universeIds=");
		//var dislikes = await getGameData(id, "downVotes", "https://games.roblox.com/v1/games/votes?universeIds=");
	}
});
