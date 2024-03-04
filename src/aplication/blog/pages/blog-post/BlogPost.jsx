import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./BlogPost.css";
import { BlogPostNavbar } from "../../components/blog-post-navbar/BlogPostNavbar";
import { getBlogPost, updateBlogPost } from "../../../../redux/features/blog/blogService";
import { useAuthAdminStatus } from "../../../customHooks/useAuthAdminStatus";
import useFileHandler from "../../customHooks/useFileHandler";
import { ContentBlock } from "../../components/content-block/ContentBlock";
import { EditButton } from "../../components/edit-button/EditButton";

export const BlogPost = ({ user: postUser }) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { isAdmin, isUserLoggedIn } = useAuthAdminStatus(postUser);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { files, previewSources, handleFileChange } = useFileHandler();

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await getBlogPost(id);
      if (fetchedPost) {
        setItem(fetchedPost);
        setEditedContent({
          title: fetchedPost.title,
          headerImage: fetchedPost.headerImage ? fetchedPost.headerImage : [],
          subtitle: fetchedPost.subtitle,
          description: fetchedPost.description,
          contentBlocks: fetchedPost.contentBlocks,
        });
      }
    };
    fetchPost();
  }, [id, saveSuccess]);

  useEffect(() => {
    if (previewSources.length > 0) {
      setEditedContent((prevState) => ({
        ...prevState,
        headerImage: previewSources[0],
      }));
    }
  }, [previewSources]);

  const handleContentChange = (content, index, type) => {
    const updatedContentBlocks = [...editedContent.contentBlocks];
    switch (type) {
      case "text":
        updatedContentBlocks[index].text = content;
        break;
      case "code":
        updatedContentBlocks[index].code = content;
        break;
      case "image":
        const newPreviewUrl = URL.createObjectURL(content);
        updatedContentBlocks[index].image = {
          ...updatedContentBlocks[index].image,
          url: newPreviewUrl,
          file: content,
        };
        break;
      case "subtitle":
        updatedContentBlocks[index].subtitle = content;
        break;
      case "preDescription":
        updatedContentBlocks[index].preDescription = content;
        break;
      case "postDescription":
        updatedContentBlocks[index].postDescription = content;
        break;
      case "preSubtitle":
        updatedContentBlocks[index].preSubtitle = content;
        break;
      case "postSubtitle":
        updatedContentBlocks[index].postSubtitle = content;
        break;
      default:
        console.error("Unknown content type:", type);
    }
    setEditedContent({ ...editedContent, contentBlocks: updatedContentBlocks });
  };

  const savePost = async () => {
    if (!editMode) return;

    const formData = new FormData();

    formData.append("title", editedContent.title);
    formData.append("description", editedContent.description);
    formData.append("subtitle", editedContent.subtitle);

    if (files.length > 0) {
      formData.append("headerImage", files[0]);
    }

    editedContent.contentBlocks.forEach((block, index) => {
      formData.append(`contentBlocks[${index}][type]`, block.type);

      switch (block.type) {
        case "text":
          formData.append(`contentBlocks[${index}][text]`, block.text);
          formData.append(`contentBlocks[${index}][subtitle]`, block.subtitle);
          break;
        case "code":
          formData.append(`contentBlocks[${index}][code]`, block.code);
          formData.append(`contentBlocks[${index}][language]`, block.language);
          formData.append(
            `contentBlocks[${index}][preDescription]`,
            block.preDescription
          );
          formData.append(
            `contentBlocks[${index}][postDescription]`,
            block.postDescription
          );
          formData.append(
            `contentBlocks[${index}][preSubtitle]`,
            block.preSubtitle
          );
          formData.append(
            `contentBlocks[${index}][postSubtitle]`,
            block.postSubtitle
          );
          break;
        case "image":
          if (block.image && block.image.file) {
            formData.append(`contentBlocksImages`, block.image.file);
            formData.append(
              `contentBlocks[${index}][subtitle]`,
              block.subtitle
            );
          } else if (block.image) {
            formData.append(
              `contentBlocks[${index}][image][public_id]`,
              block.image.public_id
            );
            formData.append(
              `contentBlocks[${index}][image][url]`,
              block.image.url
            );
            formData.append(
              `contentBlocks[${index}][subtitle]`,
              block.subtitle
            );
          }
          break;
        default:
          console.error("Unknown content type:", block.type);
      }
    });

    try {
      const result = await updateBlogPost(id, formData);
      if (result && result.success) {
        setSaveSuccess(true);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <>
      <BlogPostNavbar />
      <div className="post-body">
        {isUserLoggedIn && isAdmin && (
          <div className="edit-post-div">
           <EditButton
            isEditMode={editMode}
            onToggleEdit={toggleEditMode}
            onSave={() => {
              savePost();
            }}
            onCancel={() => setEditMode(false)}
          />
          </div>
        )}
        <div className="post-profile"></div>
        <article className="post-article">
          <section className="content-block">
            <header className="post-header">
              <h1 className="post-h1">
                {editMode ? (
                  <input
                    type="text"
                    value={editedContent.title}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        title: e.target.value,
                      })
                    }
                    className="post-h1-editable"
                  />
                ) : (
                  <div className="post-headline-1">{item.title}</div>
                )}
              </h1>

              {editMode ? (
                previewSources.length > 0 ? (
                  <img
                    src={
                      previewSources.length > 0
                        ? previewSources[0]
                        : `${process.env.REACT_APP_BACKEND_URL}${item.headerImage[0].url}`
                    }
                    alt="Header Preview"
                    className="post-img"
                  />
                ) : (
                  item.headerImage &&
                  item.headerImage.map((image, index) => (
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_BACKEND_URL}${image.url}`}
                      alt="Header"
                      className="post-img"
                    />
                  ))
                )
              ) : (
                item.headerImage &&
                item.headerImage.map((image, index) => (
                  <img
                    key={index}
                    src={`${process.env.REACT_APP_BACKEND_URL}${image.url}`}
                    alt="Header"
                    className="post-img"
                  />
                ))
              )}

              {editMode && (
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="post-img-editable"
                />
              )}
            </header>

            <hr className="post-hr" />

            <h6 className="subtitle-h4">
              {editMode ? (
                <div className="card-editable">
                  <input
                    type="text"
                    value={editedContent.subtitle}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        subtitle: e.target.value,
                      })
                    }
                    className="post-h1-editable"
                  />
                </div>
              ) : (
                <div className="post-headline-2">{item.subtitle}</div>
              )}
            </h6>

            <section className="post-section">
              <section className="post-section">
                {editMode ? (
                  <div className="card-editable">
                    <textarea
                      value={editedContent.description}
                      className="post-description-editable"
                      onChange={(e) =>
                        setEditedContent({
                          ...editedContent,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  item.description.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      <p>{line}</p>
                    </React.Fragment>
                  ))
                )}
              </section>
            </section>
            <br></br>
            <hr className="post-hr" />
          </section>
        </article>

        <article className="post-article">
          {editedContent.contentBlocks.map((block, index) => (
            <ContentBlock
              key={index}
              block={block}
              index={index}
              editMode={editMode}
              handleContentChange={handleContentChange}
              editedContent={editedContent}
            />
          ))}
        </article>

        <div className="edit-post-div">
        {isUserLoggedIn && isAdmin && (
          <div className="edit-post-div">
           <EditButton
            isEditMode={editMode}
            onToggleEdit={toggleEditMode}
            onSave={() => {
              savePost();
            }}
            onCancel={() => setEditMode(false)}
          />
          </div>
        )}
        </div>
      </div>
    </>
  );
};
