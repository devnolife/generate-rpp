import { NextRequest, NextResponse } from 'next/server';
import { RPPFormData, RPPResponse } from '@/types/rpp';

/**
 * Handler for POST requests to generate RPP
 * @param req The incoming request
 * @returns The response with the generated RPP
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const formData: RPPFormData = await req.json();

    // Validate required fields
    const requiredFields = [
      'nama_penyusun', 'institusi', 'tahun_pembuatan', 'mata_pelajaran',
      'jenjang', 'kelas', 'alokasi_waktu', 'tahapan', 'domain_konten',
      'tujuan_pembelajaran', 'konten_utama', 'capaian_pembelajaran'
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
    const rppResponse: RPPResponse = {
      identitas: {
        nama_penyusun: formData.nama_penyusun,
        institusi: formData.institusi,
        tahun_pembuatan: formData.tahun_pembuatan,
        mata_pelajaran: formData.mata_pelajaran,
        jenjang: formData.jenjang,
        kelas: formData.kelas,
        fase: formData.fase,
        alokasi_waktu: formData.alokasi_waktu,
      },
      konten: {
        tahapan: formData.tahapan,
        capaian_pembelajaran: formData.capaian_pembelajaran,
        domain_konten: formData.domain_konten,
        tujuan_pembelajaran: formData.tujuan_pembelajaran,
        konten_utama: formData.konten_utama,
        prasyarat: formData.prasyarat,
        pemahaman_bermakna: formData.pemahaman_bermakna,
        profil_pelajar: formData.profil_pelajar,
        sarana: formData.sarana,
        target_peserta: formData.target_peserta,
        jumlah_peserta: formData.jumlah_peserta,
        model_pembelajaran: formData.model_pembelajaran,
        sumber_belajar: formData.sumber_belajar,
        catatan: formData.catatan,
      },
      kegiatan_pembelajaran: [
        {
          nama: 'Pendahuluan',
          langkah: [
            'Guru membuka pelajaran dengan salam dan doa',
            'Guru memeriksa kehadiran siswa',
            'Guru menyampaikan tujuan pembelajaran',
            'Guru memberikan apersepsi terkait materi yang akan dipelajari'
          ],
          estimasi_waktu: '15 menit',
        },
        {
          nama: 'Kegiatan Inti',
          langkah: [
            'Guru menjelaskan konsep dasar materi',
            'Siswa berdiskusi dalam kelompok tentang topik yang diberikan',
            'Siswa mempresentasikan hasil diskusi kelompok',
            'Guru memberikan klarifikasi terhadap hasil diskusi siswa'
          ],
          estimasi_waktu: '60 menit',
        },
        {
          nama: 'Penutup',
          langkah: [
            'Guru dan siswa menyimpulkan materi pembelajaran',
            'Guru memberikan tugas atau pekerjaan rumah',
            'Guru menyampaikan materi yang akan dipelajari pada pertemuan berikutnya',
            'Guru menutup pembelajaran dengan doa dan salam'
          ],
          estimasi_waktu: '15 menit',
        }
      ],
      penilaian: {
        teknik: 'Observasi, Tes Tertulis, Penugasan',
        instrumen: 'Lembar observasi, soal pilihan ganda, soal uraian, rubrik penilaian',
      },
    };

    // Return the response
    return NextResponse.json(rppResponse);
  } catch (error) {
    console.error('Error generating RPP:', error);
    return NextResponse.json(
      { error: 'Failed to generate RPP' },
      { status: 500 }
    );
  }
} 
