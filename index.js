import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// localStorage.clear()

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.dataset.comment) {
    handleCommentBtnClick(e.target.dataset.comment);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  }

  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
});

document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("accept")) {
      console.log("accepted");
    } else if (btn.classList.contains("reject")) {
      console.log("rejected");
    }
  });
});

function handleCommentBtnClick(tweetId) {
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === tweetId
  )[0];
  const replyInput = document.getElementById(`reply-${tweetId}`);

  if (replyInput.value) {
    targetTweetObj.replies.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      tweetText: replyInput.value,
    });
  }
  render();
  document.getElementById(`replies-${tweetId}`).classList.remove("hidden");
}

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    const likeIconClass = tweet.isLiked ? "liked" : "";

    const retweetIconClass = tweet.isRetweeted ? "retweeted" : "";

    let repliesHtml = "";

    if (tweet.replies.length >= 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`;
      });
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">
                ${tweet.handle}
                <span class="tweet-menu">
                    <i class="fa-solid fa-ellipsis-vertical"
                    data-menu="${tweet.uuid}"
                    ></i>
                </span>
            </p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        
        <div class="reply">
            <label for="reply-${tweet.uuid}" class="reply-label">
                Replying to <span>${tweet.handle}</span>
            </label>
        
            <input type="text" name="reply-${tweet.uuid}" id="reply-${tweet.uuid}"
            placeholder="Tweet your reply" class="new-reply">
        
            <button id="reply-btn" class="reply-btn" data-comment="${tweet.uuid}">Reply</button>
        </div>
    </div>   
</div>
`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();