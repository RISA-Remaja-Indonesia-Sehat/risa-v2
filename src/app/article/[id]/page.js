import HIVQuiz from '../components/articles/HIV-Quiz';

export default function ArticlePage() {
  return (
    <div>
      {/* Konten artikel dengan HTML yang sudah ada */}
      <div dangerouslySetInnerHTML={{ __html: articleContent }} />
      
      {/* Komponen untuk menginisialisasi interaktivitas */}
      {article.id === 1 ? 
        <HIVQuiz /> 
        : null}
    </div>
  );
}
