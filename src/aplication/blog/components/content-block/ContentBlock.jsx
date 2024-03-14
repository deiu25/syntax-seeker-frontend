import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import nightOwlStyle from "react-syntax-highlighter/dist/esm/styles/prism/night-owl";

export const ContentBlock = ({
  block,
  index,
  editMode,
  handleContentChange,
  editedContent,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedBlockIndex, setCopiedBlockIndex] = useState(null);

  const copyToClipboard = (code, index) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setIsCopied(true);
        setCopiedBlockIndex(index);
        setTimeout(() => {
          setIsCopied(false);
          setCopiedBlockIndex(null);
        }, 3000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  switch (block.type) {
    case "image":
      return (
        <div key={index} className="content-block">
          {block.type === "image" &&
            (editMode ? (
              <div className="card-editable">
                <input
                  type="text"
                  value={block.subtitle || ""}
                  onChange={(e) =>
                    handleContentChange(e.target.value, index, "subtitle")
                  }
                  className="post-subtitle-editable"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    handleContentChange(e.target.files[0], index, "image")
                  }
                  className="post-img-editable"
                />
                {editedContent.contentBlocks[index].image &&
                  editedContent.contentBlocks[index].image.url && (
                    <img
                      src={
                        editedContent.contentBlocks[index].image.url.startsWith(
                          "blob:"
                        )
                          ? editedContent.contentBlocks[index].image.url
                          : `${process.env.REACT_APP_BACKEND_URL}${editedContent.contentBlocks[index].image.url}`
                      }
                      alt="Content"
                      className="post-img"
                    />
                  )}
              </div>
            ) : (
              <>
                {block.subtitle && (
                  <h5 className="subtitle-h4">{block.subtitle}</h5>
                )}
                {block.image && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${block.image.url}`}
                    alt="Content"
                    className="post-img"
                  />
                )}
              </>
            ))}
        </div>
      );
    case "text":
      return (
        <div key={index} className="content-block">
          {block.type === "text" &&
            (editMode ? (
              <div className="card-editable">
                <input
                  type="text"
                  value={block.subtitle || ""}
                  onChange={(e) =>
                    handleContentChange(e.target.value, index, "subtitle")
                  }
                  className="post-subtitle-editable"
                />
                <textarea
                  value={block.text}
                  onChange={(e) =>
                    handleContentChange(e.target.value, index, "text")
                  }
                  className="post-text-editable"
                />
              </div>
            ) : (
              <>
                {block.subtitle && (
                  <h5 className="subtitle-h4">{block.subtitle}</h5>
                )}
                <section className="post-section">
                  {block.text.split("\n").map((paragraph, idx) => (
                    <p key={idx} className="post-text">
                      {paragraph}
                    </p>
                  ))}
                </section>
              </>
            ))}
        </div>
      );
    case "code":
      return (
        <div key={index} className="content-block">
          {block.type === "code" &&
            (editMode ? (
              <div className="card-editable">
                <input
                  type="text"
                  value={block.preSubtitle || ""}
                  onChange={(e) =>
                    handleContentChange(e.target.value, index, "preSubtitle")
                  }
                  className="post-h1-editable"
                />
                <textarea
                  type="text"
                  value={block.preDescription || ""}
                  onChange={(e) =>
                    handleContentChange(e.target.value, index, "preDescription")
                  }
                  className="post-description-editable"
                />
                <textarea
                  value={block.code}
                  onChange={(e) =>
                    handleContentChange(e.target.value, index, "code")
                  }
                  className="post-code-editable"
                />
                <input
                  type="text"
                  value={block.postSubtitle || ""}
                  onChange={(e) =>
                    handleContentChange(e.target.value, index, "postSubtitle")
                  }
                  className="post-h1-editable"
                />
                <textarea
                  type="text"
                  value={block.postDescription || ""}
                  onChange={(e) =>
                    handleContentChange(
                      e.target.value,
                      index,
                      "postDescription"
                    )
                  }
                  className="post-description-editable"
                />
              </div>
            ) : (
              <>
                {block.preSubtitle && (
                  <h5 className="subtitle-h4">{block.preSubtitle}</h5>
                )}
                {block.preDescription && (
                  <section className="post-section">
                    {block.preDescription.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="post-text">
                        {paragraph}
                      </p>
                    ))}
                  </section>
                )}

                <br></br>
                <div className="code-card">
                  <div className="code-header">
                      <p className="code-language">{block.language}</p>
                      <button
                        onClick={() => copyToClipboard(block.code, index)}
                        className="copy-button"
                      >
                        {isCopied && copiedBlockIndex === index
                          ? "Copied!"
                          : "Copy Code"}
                      </button>
                    </div>
                  <SyntaxHighlighter
                    language={block.language}
                    className="post-code"
                    style={nightOwlStyle}
                  >
                    {block.code}
                  </SyntaxHighlighter>
                </div>
                <br></br>
                {block.postSubtitle && (
                  <h5 className="subtitle-h4">{block.postSubtitle}</h5>
                )}
                {block.postDescription && (
                  <section className="post-section">
                    {block.postDescription.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="post-text">
                        {paragraph}
                      </p>
                    ))}
                  </section>
                )}
              </>
            ))}
        </div>
      );
    default:
      return null;
  }
};
