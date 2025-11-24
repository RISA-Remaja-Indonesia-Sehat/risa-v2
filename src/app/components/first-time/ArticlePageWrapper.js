'use client';
import ArticleFTUE from './ArticleFTUE';

export default function ArticlePageWrapper({ children }) {
  return (
    <>
      <ArticleFTUE />
      {children}
    </>
  );
}
