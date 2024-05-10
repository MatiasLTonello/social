//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
interface IProfile {
    struct UserProfile {
        string displayName;
        string bio;
    }

    function getProfile (address _user) external view returns (UserProfile memory); 
}

contract YourContract {

    uint16 public MAX_TWEET_LENGTH = 280;

    struct Tweet {
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
        uint256 id;
    }

    mapping(address => Tweet[] ) public tweets;

    IProfile profileContract;

    modifier onlyRegistered(){
        IProfile.UserProfile memory userProfileTemp = profileContract.getProfile(msg.sender);
        require(bytes(userProfileTemp.displayName).length > 0, "USER NOT REGISTERED");
        _;
    }
    
    constructor (address _profileContract){
        profileContract = IProfile(_profileContract);
    }

    event TweetCreated(uint256 id, address author, string content, uint256 timestamp);
    event TweetLiked(address liker, address tweetAuthor, uint256 tweetId, uint256 newLikeCount);
    event TweetUnliked(address unliker, address tweetAuthor, uint256 tweetId, uint256 newLikeCount);
   
    function changeTweetLength(uint16 _newTweetLength) public {
        MAX_TWEET_LENGTH = _newTweetLength;
    }
    
    function getTotalLikes(address _author) external view returns(uint){
        uint totalLikes;

        for(uint i = 0; i < tweets[_author].length; i++){
            totalLikes += tweets[_author][i].likes;
        }
        return totalLikes;
    }

    function createTweet(string memory _tweet) public {

        require(bytes(_tweet).length <= MAX_TWEET_LENGTH, "Tweet is too long!" );

        Tweet memory newTweet = Tweet({
            id: tweets[msg.sender].length,
            author: msg.sender,
            content: _tweet,
            timestamp: block.timestamp,
            likes: 0
        });

        tweets[msg.sender].push(newTweet);
        emit TweetCreated(newTweet.id, newTweet.author, newTweet.content, newTweet.timestamp);
    }

    function likeTweet(address author, uint256 id) external {
        require(tweets[author][id].id == id, "Tweet Doesnt exists!");
        tweets[author][id].likes++;
        
        emit TweetLiked(msg.sender, author, id, tweets[author][id].likes);
    } 

      function unlikeTweet(address author, uint256 id) external onlyRegistered{
        require(tweets[author][id].id == id, "Tweet Doesnt exists!");
        require(tweets[author][id].likes > 0, "Tweet doesnt have likes");
        tweets[author][id].likes--;

        emit TweetUnliked(msg.sender, author, id, tweets[author][id].likes);

    } 

    function getTweet(uint _i) public view returns (Tweet memory){
        return tweets[msg.sender][_i];
    }

    function getAllTweets(address _owner) public view returns (Tweet[] memory ){
        return tweets[_owner];
    }
}