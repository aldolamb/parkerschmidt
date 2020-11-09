import React from "react";

export const Post = ({ item }) => {
  return (
    <div key={item.Date + "-wrapper"}>
      <div key={item.Date} className="postContainer">
        {window.innerWidth > 520 && (
          <iframe
            key={"iframe-" + item.key}
            id={"iframe-" + item.key}
            src={item.Video + "?background=1"}
            frameBorder="0"
          />
        )}
        <img
          src={item.CoverImage}
          alt={item.Title}
          key={"img-" + item.Title}
          id={"img-" + item.Title}
        />
        <h4>{item.Title}</h4>
        <a key={item.Title} href={`/${item.key}`} />
      </div>
    </div>
  );
};
