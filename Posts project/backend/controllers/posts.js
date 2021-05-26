
const Post = require("../models/post");

exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/posts-project/images/" + req.file.filename
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Creating a post failed!'
        })
    });
}

exports.editPost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/posts-project/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });

    Post.updateOne({ _id: req.params.id }, post).then(result => {
        res.status(200).json({ message: "Update successful!" });
    }).catch(erroor => {
        res.status(501).json({
            message: 'Couldt update post!'
        })
    });;
}


exports.getPosts = (req, res, next) => {
    const pageSize = Number(req.query.pagesize);
    const currentPage = Number(req.query.page);
    const postQuery = Post.find();
    let fetchedPosts;

    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: fetchedPosts,
            maxPosts: count,
        });
    });

}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "Post not found!" });
        }
    });
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        res.status(200).json({ message: "Post deleted!" });
    });
}