function ArticleInfo({
  boxClass,
  titleClass,
  title,
  dateClass,
  date,
  authorClass,
  authors,
}) {
  return (
    <div className={boxClass}>
      <h1 className={titleClass}>{title}</h1>
      <p>
        <span className={dateClass}>发布日期: </span>
        {date}
      </p>

      <p>
        <span className={authorClass}>作者: </span>
        {authors.map((author) => (
          <span key={author}>{`${author} `}</span>
        ))}
      </p>
    </div>
  );
}

export default ArticleInfo;
