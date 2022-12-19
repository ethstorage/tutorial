# Tutorial

## Introduction
Tutorial is a decentralized blogging platform based on the Web3Q chain. On this platform, 
anyone can create their own blog spaces, publish blogs, and leave a comment on any blog.
   
dBlog can be visited here: https://web3q.io/dblog.w3q/.


## How does it work

### dblog.w3q
dblog.w3q is a w3ns domain name, which maps a contract address. The contract mapped by dblog.w3q is a FlatDirectory contract that stores dBlog's website files.

FlatDirectory is the implementation of the web3 storage data contract. Click [here](https://docs.web3q.io/tutorials/migrate-your-website-to-web3q-in-5-mins) for details.

### Blog CRUD

#### Create Blog
Creating a blog will create a new blog contract for the creator, and the blog contract inherits from FlatDirectory, 
so articles can be submitted to the blog contract and stored on the blockchain.
```
const provider = new ethers.providers.Web3Provider(window.ethereum);
const receipt = await this._doTx(() =>
   provider.getSigner().sendTransaction({
       // blod bytes code
       data: "0x60c060...",
   })
);
```

#### Write blog
After the users create their blog contract, they can compose articles using a markdown editor, and when clicking to publish, 
the content will be submitted to the blog contract.
```
const content = this.markdownEditor.value();
const contract = blogContract(this.SimpleBlogAddress);
await this._doTx(() => contract.writeBlog(
    stringToHex(this.editingTitle),
    stringToHex(content),
));
```

#### Delete blog
Blog owners can delete their articles at any time.
```
const contract = blogContract(this.SimpleBlogAddress);
await this._doTx(() => contract.deleteBlog(blodId));
```

#### Write comment
People can comment on articles to communicate with the author.
```
const content = this.commentText.toString();
const contract = blogContract(this.SimpleBlogAddress);
await this._doTx(() => contract.writeComment(blogId, stringToHex(content)));
```
<br>


### Blog Contract 
SimpleBlog is the blog contract to manage articles and comments.

#### Storage structure
```
contract SimpleBlog is FlatDirectory {
    struct CommentInfo {
        address contractAddress;
        uint256 commentSize;
    }

    Blog[] public blogs;
    mapping(uint256 => CommentInfo) public commentList; // Each article will have a SimpleComment contract
}
```

#### Write Blog
When a new article is published, a SimpleComment contract is created to manage the article's comments.
```
function writeBlog(bytes memory title, bytes memory content) public payable {
        uint256 idx = blogs.length;
        blogs.push(Blog(title, block.timestamp));
        write(abi.encodePacked(idx), content);

        CommentsInfo storage info = commentsList[idx];
        SimpleComment comment = new SimpleComment();
        info.contractAddress = address(comment);
}
```

#### Write Comment
```
function writeComment(uint256 blodId, bytes memory content) public payable {
    CommentInfo storage info = commentList[blodId];
    address contractAddress = info.contractAddress;
    SimpleComment com = SimpleComment(contractAddress);
    com.writeComment(info.commentSize, content);
    ...
}
```


