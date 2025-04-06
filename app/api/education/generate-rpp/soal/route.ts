import { NextRequest, NextResponse } from 'next/server';
import { RPPFormData, SoalResponse } from '@/types/rpp';

/**
 * Handler for POST requests to generate soal
 * @param req The incoming request
 * @returns The response with the generated soal
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const formData: RPPFormData = await req.json();

    // Validate the required fields
    const requiredFields = [
      'mata_pelajaran', 'jenjang', 'kelas',
      'domain_konten', 'konten_utama', 'capaian_pembelajaran'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof RPPFormData]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Mock response data - In production, this would call an AI service or external API
    const soalResponse: SoalResponse = {
      identitas: {
        mata_pelajaran: formData.mata_pelajaran,
        jenjang: formData.jenjang,
        kelas: formData.kelas,
      },
      soal_pg: [
        {
          pertanyaan: `Apa yang dimaksud dengan ${formData.domain_konten}?`,
          pilihan: [
            `${formData.domain_konten} adalah konsep yang berkaitan dengan sistem pembelajaran terpadu.`,
            `${formData.domain_konten} merupakan metode pengajaran yang berfokus pada siswa.`,
            `${formData.domain_konten} adalah pendekatan pembelajaran yang melibatkan praktik langsung.`,
            `${formData.domain_konten} adalah teori pembelajaran yang dikembangkan oleh ahli pendidikan modern.`
          ],
          kunci_jawaban: `${formData.domain_konten} adalah konsep yang berkaitan dengan sistem pembelajaran terpadu.`,
          pembahasan: `${formData.domain_konten} memang merupakan konsep pembelajaran terpadu yang menggabungkan berbagai aspek untuk mencapai tujuan pembelajaran yang komprehensif.`
        },
        {
          pertanyaan: `Berikut ini yang merupakan karakteristik dari ${formData.domain_konten} adalah...`,
          pilihan: [
            `Berfokus pada guru sebagai satu-satunya sumber belajar`,
            `Mengutamakan pembelajaran teoritis tanpa praktik`,
            `Melibatkan siswa secara aktif dalam proses pembelajaran`,
            `Tidak memerlukan alat peraga atau media pembelajaran`
          ],
          kunci_jawaban: `Melibatkan siswa secara aktif dalam proses pembelajaran`,
          pembahasan: `Salah satu karakteristik utama dari ${formData.domain_konten} adalah keterlibatan aktif siswa dalam proses pembelajaran, yang memungkinkan mereka mengonstruksi pengetahuan secara mandiri.`
        },
        {
          pertanyaan: `Dalam penerapan ${formData.domain_konten}, apa peran utama seorang guru?`,
          pilihan: [
            `Sebagai satu-satunya sumber pengetahuan`,
            `Sebagai fasilitator dan pembimbing`,
            `Sebagai pengawas ketat aktivitas siswa`,
            `Sebagai penilai hasil akhir pembelajaran saja`
          ],
          kunci_jawaban: `Sebagai fasilitator dan pembimbing`,
          pembahasan: `Dalam ${formData.domain_konten}, guru berperan sebagai fasilitator dan pembimbing yang membantu siswa mengembangkan pemahaman mereka, bukan sekadar mentransfer pengetahuan.`
        },
        {
          pertanyaan: `Manfaat utama dari penerapan ${formData.domain_konten} dalam pembelajaran adalah...`,
          pilihan: [
            `Mempermudah penilaian siswa`,
            `Mengurangi waktu persiapan guru`,
            `Meningkatkan pemahaman dan keterampilan berpikir kritis siswa`,
            `Meminimalkan penggunaan sumber daya pembelajaran`
          ],
          kunci_jawaban: `Meningkatkan pemahaman dan keterampilan berpikir kritis siswa`,
          pembahasan: `Penerapan ${formData.domain_konten} terbukti dapat meningkatkan pemahaman konseptual siswa serta mengembangkan keterampilan berpikir kritis mereka melalui proses pembelajaran yang bermakna.`
        },
        {
          pertanyaan: `Tantangan dalam penerapan ${formData.domain_konten} di kelas adalah...`,
          pilihan: [
            `Memerlukan persiapan dan perencanaan yang matang`,
            `Terlalu mudah sehingga siswa cepat bosan`,
            `Tidak memerlukan variasi metode pembelajaran`,
            `Hanya cocok untuk mata pelajaran tertentu saja`
          ],
          kunci_jawaban: `Memerlukan persiapan dan perencanaan yang matang`,
          pembahasan: `Salah satu tantangan utama dalam implementasi ${formData.domain_konten} adalah kebutuhan akan persiapan dan perencanaan yang matang dari guru, termasuk menyiapkan materi, aktivitas, dan evaluasi yang sesuai.`
        }
      ],
      soal_esai: [
        {
          pertanyaan: `Jelaskan konsep dasar ${formData.domain_konten} dan bagaimana penerapannya dalam pembelajaran ${formData.mata_pelajaran}!`,
          kunci_jawaban: `Konsep dasar ${formData.domain_konten} meliputi pembelajaran yang berpusat pada siswa, mengembangkan pemahaman konseptual, dan menerapkan pengetahuan dalam konteks nyata. Dalam pembelajaran ${formData.mata_pelajaran}, ${formData.domain_konten} dapat diterapkan melalui aktivitas yang melibatkan siswa secara aktif, seperti diskusi kelompok, proyek penelitian, atau pemecahan masalah yang kontekstual.`,
          pembahasan: `Jawaban yang baik harus mencakup penjelasan komprehensif tentang konsep dasar ${formData.domain_konten} dan memberikan contoh konkret bagaimana konsep tersebut diterapkan dalam pembelajaran ${formData.mata_pelajaran}.`
        },
        {
          pertanyaan: `Bandingkan kelebihan dan kelemahan ${formData.domain_konten} dibandingkan dengan pendekatan pembelajaran konvensional!`,
          kunci_jawaban: `Kelebihan ${formData.domain_konten}: meningkatkan motivasi belajar siswa, mengembangkan keterampilan berpikir tingkat tinggi, memfasilitasi pembelajaran bermakna, dan mengembangkan kemandirian belajar. Kelemahan: memerlukan waktu persiapan yang lebih panjang, tantangan dalam manajemen kelas, membutuhkan lebih banyak sumber daya, dan kesulitan dalam penilaian proses. Sementara itu, pendekatan konvensional lebih efisien dalam penyampaian materi, manajemen kelas lebih mudah, tetapi cenderung kurang efektif dalam mengembangkan keterampilan berpikir kritis dan motivasi belajar.`,
          pembahasan: `Jawaban yang baik harus membandingkan secara seimbang dan mendalam kelebihan dan kelemahan kedua pendekatan pembelajaran, serta memberikan contoh-contoh konkret.`
        },
        {
          pertanyaan: `Bagaimana cara mengatasi tantangan dalam implementasi ${formData.domain_konten} di kelas ${formData.kelas}?`,
          kunci_jawaban: `Tantangan dalam implementasi ${formData.domain_konten} di kelas ${formData.kelas} dapat diatasi dengan: perencanaan pembelajaran yang matang, pengembangan materi dan aktivitas yang sesuai dengan karakteristik siswa, melibatkan siswa dalam pengambilan keputusan, memberikan scaffolding yang tepat, menggunakan penilaian otentik dan formatif, serta refleksi dan evaluasi berkelanjutan untuk perbaikan pembelajaran.`,
          pembahasan: `Jawaban yang baik harus mengidentifikasi tantangan spesifik dalam implementasi ${formData.domain_konten} di kelas ${formData.kelas} dan menawarkan solusi praktis yang dapat diterapkan.`
        }
      ]
    };

    // Return the response
    return NextResponse.json(soalResponse);
  } catch (error) {
    console.error('Error generating Soal:', error);
    return NextResponse.json(
      { error: 'Failed to generate Soal' },
      { status: 500 }
    );
  }
} 
