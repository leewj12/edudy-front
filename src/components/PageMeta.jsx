// 페이지 헤더 부분 바꿔주는 컴포넌트
import { useEffect } from 'react';

const PageMeta = ({ title, description }) => {
  useEffect(() => {
    document.title = title;

    // description 메타태그 중복 방지
    let metaTag = document.querySelector("meta[name='description']");
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'description';
      document.head.appendChild(metaTag);
    }
    metaTag.content = description;
  }, [title, description]);

  return null; // 렌더링할 UI는 없음
};

export default PageMeta;
