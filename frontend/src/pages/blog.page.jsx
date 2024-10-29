import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getFullDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

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

// ! FIXME: Переделать CORS
// Функция для загрузки изображений по ссылке
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Разрешение для кросс-доменных запросов
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => {
      console.log(`Ошибка загрузки изображения по URL: ${url}`, error);
      reject(error); // Возвращаем ошибку, если не удалось загрузить изображение
    };
  });
};

// Функция для загрузки всех изображений на странице перед рендерингом PDF
const loadImagesBeforeRender = async (contentImages, profileImage) => {
  try {
    // Пытаемся загрузить изображение профиля
    await loadImage(profileImage);
    
    // Пытаемся загрузить все изображения из контента
    for (let img of contentImages) {
      try {
        await loadImage(img);
      } catch (error) {
        console.log(`Пропускаем изображение: ${img} из-за ошибки загрузки`);
      }
    }

  } catch (error) {
    console.log("Ошибка загрузки изображения:", error);
  }
};

// Основная функция сохранения в PDF с предварительной загрузкой изображений
export const handleSaveAsPDF = async (title, savedAsPDF, setSavedAsPDF, post) => {
  const input = document.getElementById("blog-page-content");

  // Проверка на повторное сохранение
  if (savedAsPDF) {
    toast.error("Файл уже был сохранен как PDF");
    return;
  }

  // Извлекаем изображения из контента и профиль
  const profileImageURL = post.author.personal_info.profile_img;
  const contentImages = post.content[0].blocks
    .filter((block) => block.type === "image")
    .map((block) => block.data.file.url);

  // Загружаем изображения перед созданием PDF
  await loadImagesBeforeRender(contentImages, profileImageURL);

  // Масштабирование для лучшего качества и включение поддержки CORS для изображений
  html2canvas(input, { scale: 2, useCORS: true, allowTaint: false }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // Отступы для краев
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;

    // Если изображение превышает одну страницу, разбиваем его на несколько
    if (imgHeight > pageHeight) {
      const totalPages = Math.ceil(imgHeight / pageHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage(); // Добавляем новую страницу для контента
        const offset = -(i * pageHeight);

        pdf.addImage(
          imgData,
          "PNG",
          10, // Левый отступ
          10 + offset, // Верхний отступ с учетом смещения
          imgWidth,
          imgHeight
        );
      }
    } else {
      // Если картинка помещается на одну страницу
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    }

    const sanitizedTitle = title.replace(/[^\w\s]/gi, "").replace(/\s+/g, "_");
    pdf.save(`${sanitizedTitle}.pdf`);

    setSavedAsPDF(true); // Устанавливаем флаг, что PDF был сохранен
    toast.success("Файл успешно сохранен как PDF");
  });
};



const BlogPage = () => {
  let { blog_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [savedAsPDF, setSavedAsPDF] = useState(false);

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
      .then(({ data: { blog } }) => {
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
        setPost(blog);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetStates = () => {
    setPost(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
  };

  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blog_id]);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{ post, setPost, isLikedByUser, setIsLikedByUser }}
        >
          <PdfContext.Provider value={{ savedAsPDF, setSavedAsPDF }}>
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
              <BlogInteraction />

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
          </PdfContext.Provider>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
