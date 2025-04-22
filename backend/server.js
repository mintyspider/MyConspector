import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from 'firebase-admin';
import { nanoid } from 'nanoid';

import fs from 'fs';
const serviceAccountKey = JSON.parse(fs.readFileSync('./myconspector-firebase-adminsdk-ashvx-82f1ab0443.json', 'utf-8'));

//Schemas
import User from './Schema/User.js';
import Blog from './Schema/Blog.js';
import Notification from './Schema/Notification.js';
import Comment from './Schema/Comment.js';


const server = express();
server.use(express.json());
server.use(cors());
const PORT = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

async function syncAllData() {
  try {
    console.log('Starting full data synchronization...');

    // Получаем всех пользователей
    const users = await User.find().select(
      '_id personal_info.username account_info.total_posts account_info.total_reads blogs'
    );

    for (const user of users) {
      const userId = user._id;
      const username = user.personal_info.username;

      // 1. Синхронизация total_posts
      const publishedBlogsCount = await Blog.countDocuments({
        author: userId,
        draft: false,
      });
      if (user.account_info.total_posts !== publishedBlogsCount) {
        console.log(
          `Updating total_posts for user ${username}: ${user.account_info.total_posts} -> ${publishedBlogsCount}`
        );
        await User.updateOne(
          { _id: userId },
          { 'account_info.total_posts': publishedBlogsCount }
        );
      } else {
        console.log(`total_posts for user ${username} is up-to-date: ${publishedBlogsCount}`);
      }

      // 2. Синхронизация массива blogs
      const userBlogs = await Blog.find({ author: userId }).select('_id draft');
      const userBlogIds = userBlogs.map(blog => blog._id.toString());
      const storedBlogIds = user.blogs.map(id => id.toString());

      // Проверяем, есть ли "осиротевшие" ссылки в blogs
      const orphanedBlogs = storedBlogIds.filter(id => !userBlogIds.includes(id));
      if (orphanedBlogs.length > 0) {
        console.log(`Removing orphaned blog IDs for user ${username}: ${orphanedBlogs}`);
        await User.updateOne(
          { _id: userId },
          { $pull: { blogs: { $in: orphanedBlogs } } }
        );
      }

      // Проверяем, все ли существующие блоги добавлены в blogs
      const missingBlogs = userBlogIds.filter(id => !storedBlogIds.includes(id));
      if (missingBlogs.length > 0) {
        console.log(`Adding missing blog IDs for user ${username}: ${missingBlogs}`);
        await User.updateOne(
          { _id: userId },
          { $addToSet: { blogs: { $each: missingBlogs } } }
        );
      }

      if (orphanedBlogs.length === 0 && missingBlogs.length === 0) {
        console.log(`blogs array for user ${username} is up-to-date`);
      }

      // 3. Синхронизация total_reads
      const totalReads = await Blog.aggregate([
        { $match: { author: userId } },
        { $group: { _id: null, totalReads: { $sum: '$activity.total_reads' } } },
      ]);
      const calculatedTotalReads = totalReads.length > 0 ? totalReads[0].totalReads : 0;
      if (user.account_info.total_reads !== calculatedTotalReads) {
        console.log(
          `Updating total_reads for user ${username}: ${user.account_info.total_reads} -> ${calculatedTotalReads}`
        );
        await User.updateOne(
          { _id: userId },
          { 'account_info.total_reads': calculatedTotalReads }
        );
      } else {
        console.log(`total_reads for user ${username} is up-to-date: ${calculatedTotalReads}`);
      }

      // 4. Проверка уведомлений (опционально)
      const notifications = await Notification.find({ notification_for: userId });
      const invalidNotifications = await Promise.all(
        notifications.map(async (notif) => {
          if (notif.blog) {
            const blogExists = await Blog.exists({ _id: notif.blog });
            if (!blogExists) return notif._id;
          }
          if (notif.comment) {
            const commentExists = await Comment.exists({ _id: notif.comment });
            if (!commentExists) return notif._id;
          }
          return null;
        })
      );
      const invalidNotifIds = invalidNotifications.filter(id => id != null);
      if (invalidNotifIds.length > 0) {
        console.log(`Removing invalid notifications for user ${username}: ${invalidNotifIds}`);
        await Notification.deleteMany({ _id: { $in: invalidNotifIds } });
      }
    }

    // 5. Проверка "осиротевших" блогов (без автора)
    const orphanedBlogs = await Blog.find({ author: { $exists: false } });
    if (orphanedBlogs.length > 0) {
      console.log(`Found orphaned blogs: ${orphanedBlogs.map(b => b.blog_id)}`);
      await Blog.deleteMany({ _id: { $in: orphanedBlogs.map(b => b._id) } });
      console.log(`Deleted ${orphanedBlogs.length} orphaned blogs`);
    }

    console.log('Full data synchronization completed successfully!');
  } catch (err) {
    console.error('Synchronization error:', err);
    throw err;
  }
}

syncAllData();

//verifying user to publish posts 
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({"error" : "No access token"})
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if(err){
            res.status(403).json({'error' : 'Invalid access token'})
        }

        req.user = user.id;
        next()

    })
}

const translit = ((word) => {
	var converter = {
		'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
		'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
		'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
		'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
		'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
		'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
		'э': 'e',    'ю': 'yu',   'я': 'ya'
	};
 
	word = word.toLowerCase();
  
	var answer = '';
	for (var i = 0; i < word.length; ++i ) {
		if (converter[word[i]] == undefined){
			answer += word[i];
		} else {
			answer += converter[word[i]];
		}
	}
 
	answer = answer.replace(/[^-0-9a-z]/g, '-');
	answer = answer.replace(/[-]+/g, '-');
	answer = answer.replace(/^\-|-$/g, ''); 
	return answer;
});


// Formatting the data to be sent to the database
const formatData = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY,
    { audience: 'your-app', issuer: 'your-app' }
  );
  return {
    accessToken,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// Generating username
const generateUsername = async (email) => {
  let baseUsername = email.split('@')[0];
  let username = baseUsername;
  let count = 0;

  while (await User.exists({ 'personal_info.username': username })) {
    count++;
    username = baseUsername + count;
  }

  return username;
};

// Signing up
server.post('/signup', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing' });
    }

    const { fullname, email, password } = req.body;

    // Validation
    if (!fullname || fullname.length < 3) {
      return res.status(422).json({ error: 'Fullname must be at least 3 characters long' });
    }

    if (!email || !emailRegex.test(email)) {
      return res.status(422).json({ error: 'Invalid email format' });
    }

    if (!password || !passwordRegex.test(password)) {
      return res.status(422).json({
        error: 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      });
    }

    const username = await generateUsername(email);
    if (!username) {
      return res.status(500).json({ error: 'Failed to generate username' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username,
      },
    });

    await user.save();

    return res.status(201).json({ user: formatData(user) });
  } catch (err) {
    if (err.code === 11000 && err.keyValue?.email) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Signing in
server.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ 'personal_info.email': email });
    if (!user) {
      return res.status(403).json({ error: 'Email not found' });
    }
    return res.status(200).json(formatData(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Changing password
server.post('/changepassword', verifyJWT, async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;

    // Проверка наличия полей
    if (!oldpassword || !newpassword) {
      return res.status(400).json({ error: 'Старый и новый пароли обязательны (⊙_☉)' });
    }

    // Проверка соответствия формату паролей
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!passwordRegex.test(oldpassword) || !passwordRegex.test(newpassword)) {
      return res.status(400).json({
        error: 'Пароль должен содержать 6-20 символов, включая хотя бы одну цифру, одну заглавную и одну строчную букву (╯°□°）╯︵ ┻━┻',
      });
    }

    // Проверка на совпадение старого и нового паролей
    if (oldpassword === newpassword) {
      return res.status(400).json({ error: 'Новый пароль не должен совпадать со старым (¬_¬)' });
    }

    // Поиск пользователя в базе
    const user = await User.findOne({ _id: req.user });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден (ಥ﹏ಥ)' });
    }

    // Проверка старого пароля
    const isMatch = await bcrypt.compare(oldpassword, user.personal_info.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Старый пароль неверен ¯\\_(ツ)_/¯' });
    }

    // Хэширование нового пароля
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.personal_info.password = hashedPassword;

    // Сохранение нового пароля
    await user.save();
    return res.status(200).json({ message: 'Пароль успешно изменен (ノ・∀・)ノ' });
  } catch (err) {
    // Обработка непредвиденных ошибок
    return res.status(500).json({ error: `Ошибка сервера: ${err.message} o.O` });
  }
});

//new avatar
server.post('/newavatar', verifyJWT, async (req, res) => {
  const { profileImg } = req.body;
  const userId = req.user;

  // Проверяем наличие данных
  if (!profileImg || typeof profileImg !== 'string') {
      return res.status(400).json({ message: 'Некорректный URL аватара' });
  }

  try {
      // Сохраняем ссылку на изображение в базе данных
      const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $set: { 'personal_info.profile_img': profileImg } },
          { new: true } // Возвращает обновленного пользователя
      );

      if (!updatedUser) {
          return res.status(404).json({ message: 'Пользователь не найден' });
      }
      console.log('Аватар обновлен:', updatedUser);
      return res.status(200).json({ message: 'Аватар обновлен', profileImg });
  } catch (error) {
      console.error('Ошибка при сохранении аватара:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

server.post("/updateprofile", verifyJWT, async (req, res) => {
  const { profile } = req.body;

  if (!profile) {
    return res.status(400).json({ error: "Invalid profile data" });
  }
  console.log("profile=>" ,profile);
  // Destructure profile details
  const { personal_info: { fullname, bio } = {}, social_links } = profile;
  const userId = req.user; // Obtained from verifyJWT middleware

  try {
    // Update only the provided fields in the database
    const updatedFields = {};
    if (fullname) updatedFields["personal_info.fullname"] = fullname;
    if (bio) updatedFields["personal_info.bio"] = bio;
    if (social_links) updatedFields["social_links"] = social_links;

    // Ensure the user exists and update the document
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updatedFields }, // Use `$set` to avoid overwriting undefined fields
      { new: true, runValidators: true } // Return the updated document and validate the fields
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Success response
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error); // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
});



//Newest posts
server.post('/latestblogs', (req, res) => {

  let { page } = req.body;

  let maxLimit = 5;

  Blog.find({ draft:false })
  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({"publishedAt" : -1 })
  .select("blog_id title des activity tags publishedAt -_id")
  .skip((page - 1) * maxLimit)
  .limit(maxLimit)
  .then(blogs => {
    return res.status(200).json({ blogs })
  })
  .catch(err => {
    return res.status(500).json({err: err.message})
  })
})

server.post("/countlatestblogs", (req, res) => {
  Blog.countDocuments({ draft: false })
  .then(count => {
    return res.status(200).json({ totalDocs: count })
  })
  .catch(err => {
    return res.status(500).json({error: err.message})
  })
})

//Trending posts
server.get('/trendindblogs', (req, res) => {

  let maxLimit = 5;

  Blog.find({ draft:false })
  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({"activity.total_read" : -1, "activity.total_likes": -1, "publishedAt" : -1 })
  .select("blog_id title publishedAt -_id")
  .limit(maxLimit)
  .then(blogs => {
    return res.status(200).json({ blogs })
  })
  .catch(err => {
    return res.status(500).json({err: err.message})
  })
})

// Search posts
server.post("/searchblogs", (req, res) => {

  let { tag, author, query, page, limit, eliminate_blog } = req.body;
  let maxLimit = limit || 5;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } }
  } else if (author) {
    findQuery = { author, draft: false }
  } else if (query) {
    findQuery = { title: new RegExp(query, 'i'), draft: false }
  }

  Blog.find(findQuery)
  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({"publishedAt" : -1 })
  .select("blog_id title des activity tags publishedAt -_id")
  .skip((page - 1) * maxLimit)
  .limit(maxLimit)
  .then(blogs => {
    return res.status(200).json({ blogs })
  })
  .catch(err => {
    return res.status(500).json({err: err.message})
  })
})

server.post("/countsearchblogs", (req, res) => {

  let { tag, author, query } = req.body;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false }
  } else if (author) {
    findQuery = { author, draft: false }
  } else if (query) {
    findQuery = { title: new RegExp(query, 'i'), draft: false }
  }

  Blog.countDocuments(findQuery)
  .then(count => {
    return res.status(200).json({ totalDocs: count })
  })
  .catch(err => {
    return res.status(500).json({err: err.message})
  })
})

// Unified search for users by username or fullname
server.post("/searchusers", (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  User.find({
    $or: [
      { "personal_info.username": new RegExp(query, "i") },
      { "personal_info.fullname": new RegExp(query, "i") }
    ]
  })
    .limit(50)
    .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
    .then(users => {
      return res.status(200).json({ users });
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
});


server.post("/getprofile", (req, res) => {
  let {username} = req.body;

  User.findOne({"personal_info.username" : username})
  .select("-personal_info.password -updatedAt -blogs")
  .then(user => {
    return res.json(user)
  })
  .catch(err => {
    return res.status(500).json(err.message)
  })
})

//Blog post
server.post('/createblog', verifyJWT, async (req, res) => {
  let authId = req.user;
  let { title, des, tags, content, draft, id } = req.body;

  if (!title || !title.length) {
    return res.status(403).json({ error: "There is no title" });
  }

  if (!content) {
    return res.status(403).json({ error: "There is no content" });
  }

  if (!draft) {
    if (!Array.isArray(tags) || tags.length === 0 || tags.length > 10) {
      return res.status(403).json({ error: "There must be 1-10 tags" });
    }

    if (!des || des.length === 0 || des.length > 200) {
      return res.status(403).json({ error: "Blog description must be 1-200 characters" });
    }
  }

  tags = tags.map(tag => tag.toLowerCase());

  let blog_id = id || translit(title).replace(/[^a-zA-Z0-9_]/g, ' ').replace(/\s/g, '-') + nanoid();

  try {
    let blog;
    if (id) {
      // Обновление существующего блога
      const existingBlog = await Blog.findOne({ blog_id });
      if (!existingBlog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Проверяем, изменился ли статус блога (опубликован/черновик)
      if (existingBlog.draft !== draft) {
        // Если блог переходит из опубликованного в черновик, уменьшаем счетчик
        if (!existingBlog.draft && draft) {
          await User.findOneAndUpdate(
            { _id: authId },
            { $inc: { "account_info.total_posts": -1 } }
          );
        }

        // Если блог переходит из черновика в опубликованный, увеличиваем счетчик
        if (existingBlog.draft && !draft) {
          await User.findOneAndUpdate(
            { _id: authId },
            { $inc: { "account_info.total_posts": 1 } }
          );
        }
      }

      // Обновляем блог
      blog = await Blog.findOneAndUpdate(
        { blog_id },
        { title, des, content, tags, author: authId, draft: Boolean(draft) },
        { new: true }
      );
    } else {
      // Создание нового блога
      blog = new Blog({
        title,
        des,
        content,
        tags,
        author: authId,
        blog_id,
        draft: Boolean(draft)
      });

      await blog.save();

      // Увеличиваем счетчик только для опубликованных блогов
      if (!draft) {
        await User.findOneAndUpdate(
          { _id: authId },
          { $inc: { "account_info.total_posts": 1 }, $push: { blogs: blog._id } }
        );
      }
    }

    return res.status(200).json({ message: "Blog post created/updated successfully", id: blog.blog_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

server.post("/getblog", (req, res) => {
  let { blog_id, draft, mode } = req.body;
  let incrementValue = mode !== "edit" ? 1 : 0; // Увеличиваем счетчик только в режиме чтения

  Blog.findOneAndUpdate({ blog_id }, { $inc: { "activity.total_reads": incrementValue } })
    .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
    .select("title des content activity tags publishedAt blog_id draft")
    .then(blog => {
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      if (blog.draft && !draft) {
        return res.status(403).json({ error: "No access to edit this blog" });
      }

      // Обновляем счетчик прочтений у автора блога
      User.findOneAndUpdate(
        { "personal_info.username": blog.author.personal_info.username },
        { $inc: { "account_info.total_reads": incrementValue } }
      )
        .then(() => {
          return res.status(200).json({ blog });
        })
        .catch(err => {
          return res.status(500).json({ error: err.message });
        });
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
});

//liking blogs
server.post("/likeblog", verifyJWT, async (req, res) => {
  let user_id = req.user;
  let { _id, isLikedByUser } = req.body;
  let incrementValue = isLikedByUser ? -1 : 1;

  try {
    const blog = await Blog.findOneAndUpdate(
      { _id },
      { $inc: { "activity.total_likes": incrementValue } },
      { new: true }
    );

    if (!isLikedByUser) {
      let like = new Notification({
        type: "like",
        blog: _id,
        notification_for: blog.author,
        user: user_id
      });

      await like.save();
      return res.status(200).json({ liked_by_user: true });
    } else {
      await Notification.findOneAndDelete({ blog: _id, user: user_id, type: "like" });
      return res.status(200).json({ liked_by_user: false });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//checking liking blog
server.post("/checklike", verifyJWT, (req, res) => {
  let user_id = req.user;
  let { _id } = req.body;
  Notification.exists({ blog: _id, user: user_id, type: "like" })
  .then(result => {
    return res.status(200).json({result})
  })
  .catch(err => {
    return res.status(500).json({error: err.message})
  })
})

//commenting on blog
server.post("/addcomment", verifyJWT, async (req, res) => {
  const user_id = req.user;
  const { _id, message, blog_author, replying_to, notification_id = undefined } = req.body;

  if (!_id || !message) {
    return res.status(400).json({ error: "Blog ID and message are required" });
  }

  const commentedAt = new Date();
  let commentFile = {
    blog_id: _id,
    blog_author,
    comment: message,
    commented_by: user_id,
    commentedAt,
    isReply: replying_to ? true : false,
    children: []
  };

  if (replying_to) {
    commentFile.parent = replying_to;
  }

  try {
    const newComment = await new Comment(commentFile).save();

    // Обновляем счетчик комментариев в блоге
    await Blog.findOneAndUpdate(
      { _id },
      {
        $push: { comments: newComment._id },
        $inc: { "activity.total_comments": 1, "activity.total_parent_comments": replying_to ? 0 : 1 }
      }
    );

    // Создаем уведомление
    let notificationObj = {
      type: replying_to ? "reply" : "comment",
      blog: _id,
      notification_for: blog_author,
      user: user_id,
      comment: newComment._id
    };

    if (replying_to) {
      const replyingToCommentDoc = await Comment.findOneAndUpdate(
        { _id: replying_to },
        { $push: { children: newComment._id } }
      );

      if (replyingToCommentDoc) {
        notificationObj.notification_for = replyingToCommentDoc.commented_by;
        notificationObj.replied_on_comment = replyingToCommentDoc._id;
      }

      if (notification_id) {
        await Notification.findOneAndUpdate(
          { _id: notification_id },
          { reply: commentFile._id }
        );
      }
    }

    await new Notification(notificationObj).save();

    res.status(200).json({
      comment: newComment.comment,
      commentedAt: newComment.commentedAt,
      _id: newComment._id,
      user_id,
      children: newComment.children
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

server.post("/getcomments", (req, res) => {
  let { blog_id, skip } = req.body;
  console.log("server blog_id:", blog_id);
  console.log("server skip:", skip);
  let maxLimit = 5;
  Comment.find({ blog_id, isReply: false })
  .populate("commented_by", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .skip(skip)
  .limit(maxLimit)
  .sort({"commentedAt" : -1 })
  .then(comments => {
    if (comments.length === 0) {
      console.log("No comments found.");
    } else {
      console.log("server comments:", comments);
    }
    return res.status(200).json(comments);
  })
  .catch(err => {
    console.log("Error fetching comments:", err.message);
    return res.status(500).json({ error: err.message });
  });
});

server.post("/getreplies", (req, res) => {
  let {_id, skip} = req.body;
  let maxLimit = 5;
  Comment.findOne({_id})
  .populate({
    path:"children",
    options:{
      limit: maxLimit,
      skip: skip,
      sort: {'commentedAt': -1}
    },
    populate:{
      path: 'commented_by',
      select: "personal_info.profile_img personal_info.fullname personal_info.username"
    },
    select: "-blog_id -updatedAt"
  })
  .select("children")
  .then(doc => {
    return res.status(200).json({replies: doc.children})
  })
  .catch(err => {
    return res.status(500).json({error: err.message})
  })
})
const deleteComment = (_id) => {
  Comment.findOneAndDelete({ _id })
  .then(comment => {
    if (comment.parent) {
      Comment.findOneAndUpdate(
        { _id: comment.parent },
        { $pull: { children: comment._id } }
      )
      .then(() => {
        console.log("Comment deleted successfully");
      })
      .catch(err => {
        console.error("Error updating parent comment:", err);
      });
    }

    // Удаляем уведомление, связанное с комментарием
    Notification.findOneAndDelete({ comment: _id })
      .then(() => {
        console.log("Comment notification deleted successfully");
      })
      .catch(err => {
        console.error("Error deleting notification:", err);
      });

    // Удаляем уведомление на ответ, если оно существует
    Notification.findOneAndDelete({ reply: _id })
      .then(() => {
        console.log("Comment reply notification deleted successfully");
      })
      .catch(err => {
        console.error("Error deleting reply notification:", err);
      });

    // Обновляем блог, удаляя комментарий из списка и корректируя активность
    Blog.findOneAndUpdate({ _id: comment.blog_id }, 
      { 
        $pull: { comments: comment._id },
        $inc: { "activity.total_comments": -1, "activity.total_parent_comments": comment.parent ? 0 : -1 }
      })
      .then(() => {
        // Если у комментария есть дочерние комментарии, удаляем их рекурсивно
        if (comment.children.length) {
          comment.children.forEach(child => {
            deleteComment(child);
          });
        }
      })
      .catch(err => {
        console.error("Error updating blog:", err);
      });
  })
  .catch(err => {
    console.error("Error deleting comment:", err);
  });
};

server.post("/deletecomment", verifyJWT, (req, res) => {
  let user_id = req.user;
  let { _id, blog_id, isReply = false } = req.body;

  Comment.findOne({ _id })
  .then(doc => {
    // Проверяем, что комментарий был написан этим пользователем или владельцем блога
    if (doc.commented_by.toString() === user_id || doc.blog_author.toString() === user_id) {
      // Если это ответ на комментарий (isReply true), то удаляем ответ
      if (isReply) {
        deleteComment(_id);
        return res.status(200).json({ message: "Reply deleted successfully" });
      }

      // Если это основной комментарий, просто удаляем
      deleteComment(_id);
      return res.status(200).json({ message: "Comment deleted successfully" });
    } else {
      return res.status(403).json({ error: "You are not allowed to delete this comment" });
    }
  })
  .catch(err => {
    console.error("Error finding comment:", err);
    return res.status(500).json({ error: "Failed to find comment" });
  });
});

server.get("/newnotification", verifyJWT, (req, res) => {
  let user_id = req.user;
  Notification.exists({ notification_for: user_id, seen: false, user: {$ne : user_id} })
  .then(notifications => {
    if(notifications) {
      return res.status(200).json({new_notification_available : true});
    } else {
      return res.status(200).json({new_notification_available : false});
    }
  })
  .catch(err => {
    return res.status(500).json({ error: err.message });
  })
})

server.post("/notification", verifyJWT, (req, res) => {
  let user_id = req.user;
  let { page, filterOption, deletedDocCount } = req.body;
  let maxLimit = 10;
  let findQuery = { notification_for: user_id, user: {$ne : user_id} };
  let skipDocs = (page - 1) * maxLimit;
  if(filterOption !== "all") {
    findQuery.type = filterOption;
  }
  if(deletedDocCount) {
    skipDocs -= deletedDocCount;
  }
  Notification.find(findQuery)
  .skip(skipDocs)
  .limit(maxLimit)
  .populate("blog", "title blog_id")
  .populate("comment", "comment")
  .populate("replied_on_comment", "comment")
  .populate("reply", "comment")
  .populate("user", "personal_info.profile_img personal_info.fullname personal_info.username")
  .sort({"createdAt" : -1 })
  .select("createdAt type seen reply")
  .then(notifications => {
    Notification.updateMany(findQuery, {seen: true})
    .skip(skipDocs)
    .limit(maxLimit)
    .then(() => console.log("notification seen"))
    return res.status(200).json({ notifications });
  })
  .catch(err => {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  })
})

server.post("/allnotificationscount", verifyJWT, (req, res) => {
  let user_id = req.user;
  let {filterOption} = req.body;
  let findQuery = { notification_for: user_id, user: {$ne : user_id} };
  if(filterOption !== "all") {
    findQuery.type = filterOption;
  }
  Notification.countDocuments(findQuery)
  .then(count => {
    return res.status(200).json({ totalDocs: count });
  })
  .catch(err => {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  })
})

server.post("/deletenotification", verifyJWT, (req, res) => {
  let user_id = req.user;
  let { _id } = req.body;

  Notification.findOneAndDelete({ _id })
  .then(doc => {
        return res.status(200).json({ message: "Notification deleted successfully" });
      })
  .catch(err => {
    console.error("Error finding notification:", err);
    return res.status(500).json({ error: "Failed to find" });
  });
});

//for dashboard/blogs
server.post("/userwrittenblogs", verifyJWT, (req, res) => {
  let user_id = req.user;
  let { page, draft, query, deletedDocCount } = req.body;
  let maxLimit = 3;
  let skipDocs = (page - 1) * maxLimit;
  if(deletedDocCount){
    skipDocs -= deletedDocCount;
  }
  Blog.find({author: user_id, draft, title: new RegExp(query, 'i')})
  .skip(skipDocs)
  .sort({publishedAt : -1})
  .select("title publishedAt blog_id activity des draft _id")
  .then(blogs => {
    return res.status(200).json({blogs})
  })
  .catch(err => {
    return res.status(500).json({error : err.message})
  })
})

server.post("/userwrittenblogscount", verifyJWT, (req, res) => {
  let user_id = req.user;
  let {draft, query} = req.body;
  Blog.countDocuments({author: user_id, draft, title: new RegExp(query, 'i')})
  .then(count => {
    return res.status(200).json({totalDocs : count})
  })
  .catch(err => {
    return res.status(500).json({error: err.message})
  })
})

server.post("/deleteblog", verifyJWT, async (req, res) => {
  try {
    let user_id = req.user; // ID пользователя из токена
    let { blog_id } = req.body;
    // Найти и удалить блог
    const blog = await Blog.findOneAndDelete({ blog_id: blog_id });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Удалить уведомления, связанные с этим блогом
    await Notification.deleteMany({ blog: blog._id });

    // Удалить комментарии, связанные с этим блогом
    await Comment.deleteMany({ blog: blog._id });

    // Обновить пользователя
    const updatedUser = await User.findOneAndUpdate(
      { _id: user_id },
      {
        $pull: { blogs: blog._id }, // Удалить блог из массива blogs
        $inc: { "account_info.total_posts": -1 }, // Уменьшить счетчик постов
      },
      { new: true } // Возвратить обновленный документ
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ status: "done" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});


server.listen(PORT, () => {
  console.log('Listening on port => ' + PORT);
  console.log('MongoDB database is connected');
})
