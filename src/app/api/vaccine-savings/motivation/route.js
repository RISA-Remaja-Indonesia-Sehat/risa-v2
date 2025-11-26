const fallbackFacts = [
  "Tahukah kamu? Vaksin HPV dapat mencegah hingga 90% kasus kanker serviks jika diberikan sebelum terinfeksi HPV.",
  "Tahukah kamu? Vaksin HPV paling efektif diberikan pada usia 9-14 tahun, tapi tetap bisa diberikan hingga usia 45 tahun.",
  "Tahukah kamu? Vaksin HPV memerlukan 2-3 dosis tergantung usia pemberian dan jenis vaksinnya.",
  "Tahukah kamu? Vaksin HPV aman dan telah digunakan oleh jutaan orang di seluruh dunia.",
  "Tahukah kamu? Vaksin HPV bekerja dengan melatih sistem imun untuk melawan virus HPV sebelum infeksi terjadi.",
];

export async function POST(req) {
  try {
    const { daysRemaining } = await req.json();

    const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];

    return Response.json({
      success: true,
      daysRemaining,
      fact: randomFact,
    });
  } catch (error) {
    console.error("Error generating fact:", error);
    
    const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
    
    return Response.json({
      success: true,
      fact: randomFact,
    });
  }
}
