import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccountKey from './myconspector-firebase-adminsdk-ashvx-82f1ab0443.json' assert { type: 'json' };
import { getAuth } from 'firebase-admin/auth';
import { nanoid } from 'nanoid';

//Schemas
import User from './Schema/User.js';
import Blog from './Schema/Blog.js'


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
    const { fullname, email, password } = req.body;

    // Validation
    if (fullname.length < 3) {
      return res.status(403).json({ error: 'Fullname must be at least 3 characters long' });
    }

    if (!email || !emailRegex.test(email)) {
      return res.status(403).json({ error: 'Invalid email format' });
    }

    if (!password || !passwordRegex.test(password)) {
      return res.status(403).json({
        error: 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      });
    }

    const username = await generateUsername(email);
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

    return res.status(200).json({ user: formatData(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(500).json({ error: 'Email already exists' });
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

    if(!user.google_auth){
      const isMatch = await bcrypt.compare(password, user.personal_info.password);
    if (!isMatch) {
      return res.status(403).json({ error: 'Password is incorrect. Please try again' });
    }

    return res.status(200).json(formatData(user));
    } else {
      return res.status(403).json({"error":"Your account was created using Google. Try to continue with Google"})
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Google Auth
server.post('/google-auth', async (req, res) => {
  try {
    const { accessToken } = req.body;
    const decodedUser = await getAuth().verifyIdToken(accessToken);
    const { email, name } = decodedUser;

    let user = await User.findOne({ 'personal_info.email': email }).select(
      'personal_info.fullname personal_info.username google_auth'
    );

    if (user) {
      if (!user.google_auth) {
        return res.status(403).json({ error: 'Log in with email and password because this email was signed up without Google' });
      }
    } else {
      const username = await generateUsername(email);

      user = new User({
        personal_info: {
          fullname: name,
          email,
          username,
        },
        google_auth: true,
      });

      await user.save();
    }

    return res.status(200).json(formatData(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Authentication failed. Try another Google account or log in with email and password',
    });
  }
});

 //Newest posts
server.get('/latestblogs', (req, res) => {

  let maxLimit = 5;

  Blog.find({ draft:false })
  .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({"publishedAt" : -1 })
  .select("blog_id title des banner activity tags publishedAt -_id")
  .limit(maxLimit)
  .then(blogs => {
    return res.status(200).json({ blogs })
  })
  .catch(err => {
    return res.status(500).json({err: err.message})
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

//Blog post
server.post('/createblog', verifyJWT, (req, res) => {
  let authId = req.user;

  let { title, des, banner, tags, content, draft } = req.body;

  if (!title || !title.length) {
      return res.status(403).json({ "error": "there is no title" });
  }
  
  if (!banner || !banner.length) {
      return res.status(403).json({ "error": "there is no banner" });
  }

  if (!content) {
      return res.status(403).json({ "error": "there is no content" });
  }
  if (!draft) {
    if (!Array.isArray(tags) || tags.length === 0 || tags.length > 10) {
        return res.status(403).json({ "error": "there must be 1-10 tags" });
    }

    if (!des || des.length === 0 || des.length > 200) {
        return res.status(403).json({ "error": "blog description must be 1-200 characters" });
    }
  }

  tags = tags.map(tag => tag.toLowerCase());
  
  let blog_id = translit(title) + nanoid();

  let blog = new Blog({
    title,
    des,
    banner,
    content,
    tags,
    author: authId,
    blog_id,
    draft: Boolean(draft)
  })

    blog.save().then((blog) => {

      let incrimentVal = draft ? 0 : 1;
      User.findOneAndUpdate({ _id: authId }, { $inc : { "account_info.total_posts" : incrimentVal }, $push: { "blogs": blog._id } })
      .then(user => {
        return res.status(200).json({ "message": "Blog post created successfully", id: blog.blog_id });
      })
      .catch (err => {
      return res.status(500).json({ error: 'Failed to update total posts number' });
      })
      
    })
    .catch (err => {
      return res.status(500).json({ error: 'Internal Server Error' });
    });
});

server.listen(PORT, () => {
  console.log('Listening on port => ' + PORT);
  console.log('MongoDB database is connected');
});
