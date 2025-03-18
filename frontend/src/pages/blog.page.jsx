import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getFullDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, { fetchComments } from "../components/comments.component";

export const blogStructure = {
  title: "",
  des: "",
  tags: [],
  content: [],
  author: {
    personal_info: {
      fullname: "",
      username: "",
      profile_img: "",
    },
  },
  publishedAt: "",
};

export const BlogContext = createContext({});
export const PdfContext = createContext({});

const BlogPage = () => {
  let { blog_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(0);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  let {
    title,
    content,
    author: {
      personal_info: { fullname, profile_img, username: author_username },
    },
    tags,
    publishedAt,
  } = post;

  const fetchBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/getblog", { blog_id })
      .then(async ({ data: { blog } }) => {
        console.log("post before => ", blog);
        
        // Подгружаем комментарии
        blog.comments = await fetchComments({
          blog_id: blog._id,
          setParentCommentCountFun: setTotalParentCommentsLoaded
        });
        
        // Устанавливаем обновленный blog в состояние post
        setPost(blog);

        // Подгружаем похожие блоги
        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/searchblogs", {
            tag: blog.tags[0],
            limit: 3,
            eliminate_blog: blog_id,
          })
          .then(({ data }) => {
            console.log("similar blogs:", data);
            setSimilarBlogs(data.blogs);
          })
          .catch((err) => {
            console.log(err);
          });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
};

// Используем useEffect для отслеживания изменений post
useEffect(() => {
  if (post) {
    console.log("Updated post => ", post);
    console.log("Updated post comments => ", post.comments);
  }
}, [post]);


  const resetStates = () => {
    setPost(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    setIsLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  };

  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blog_id]);

  return (
    <AnimationWrapper>
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-0 left-0 w-[5%] h-screen hover:bg-grey text-dark-grey text-sm"
        title="Scroll to top"
      >
        <span className='fixed top-[90px] left-1 items-center justify-center'><i className='gap-1 fi fi-rr-angle-small-up'></i>Наверх</span>
      </button>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{ post, setPost, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded }}
        >
            <div className="max-w-[900px] center py-10 max-lg:px-[5vw]"
            >

              <div id="blog-page-content">
              {/* header */}
              <h2 className="text-center">{title}</h2>
              <div className="flex max-sm:flex-col justify-between my-8 ">
                <div className="flex gap-5 items-start">
                  <img src={profile_img} className="w-12 h-12 rounded-full" />
                  <p>
                    {fullname} <br />{" "}
                    <Link
                      to={`/user/${author_username}`}
                      className="text-dark-grey underline"
                    >
                      {author_username}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Опубликовано {getFullDay(publishedAt)}
                </p>
              </div>

              {/* content */}
              <div className="my-12 font-gelasio blog-page-content">
                {content[0].blocks.map((block, i) => {
                  return (
                    <div key={i} className="my-4 md:my-8">
                      <BlogContent block={block} />
                    </div>
                  );
                })}
              </div>
              </div>

              <CommentsContainer /> 
              
              <BlogInteraction />

              {/* similar posts */}
              {similarBlogs != null && similarBlogs.length > 0 ? (
                <>
                  <h1 className="mt-14 mb-10 font-medium text-2xl">
                    Похожие конспекты
                  </h1>
                  {similarBlogs.map((blog, i) => {
                    let {
                      author: { personal_info },
                    } = blog;
                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.08 }}
                      >
                        <BlogPostCard content={blog} author={personal_info} />
                      </AnimationWrapper>
                    );
                  })}
                </>
              ) : (
                ""
              )}
            </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
