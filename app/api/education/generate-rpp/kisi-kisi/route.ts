import { NextRequest, NextResponse } from 'next/server';
import { RPPFormData, KisiKisiResponse } from '@/types/rpp';

/**
 * Handler for POST requests to generate kisi-kisi
 * @param req The incoming request
 * @returns The response with the generated kisi-kisi
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const formData: RPPFormData = await req.json();

    // Validate the required fields
    const requiredFields = [
      'mata_pelajaran', 'jenjang', 'kelas', 'alokasi_waktu',
      'domain_konten', 'tujuan_pembelajaran', 'konten_utama', 'capaian_pembelajaran'
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
    const kisiKisiResponse: KisiKisiResponse = {
      identitas: {
        mata_pelajaran: formData.mata_pelajaran,
        jenjang: formData.jenjang,
        kelas: formData.kelas,
        alokasi_waktu: formData.alokasi_waktu,
      },
      kompetensi_dasar: [
        'Menganalisis konsep dasar ' + formData.domain_konten,
        'Menerapkan konsep ' + formData.domain_konten + ' dalam pemecahan masalah',
        'Menyajikan hasil analisis terkait ' + formData.domain_konten
      ],
      materi_pokok: formData.konten_utama || formData.domain_konten,
      indikator: [
        'Siswa dapat menjelaskan konsep dasar ' + formData.domain_konten,
        'Siswa dapat mengidentifikasi karakteristik ' + formData.domain_konten,
        'Siswa dapat menerapkan konsep ' + formData.domain_konten + ' dalam konteks nyata',
        'Siswa dapat menganalisis permasalahan terkait ' + formData.domain_konten,
        'Siswa dapat menyajikan hasil analisis terkait ' + formData.domain_konten
      ],
      level_kognitif: [
        {
          level: 'C1 (Mengingat)',
          deskripsi: 'Siswa mampu mengingat dan menyebutkan konsep dasar ' + formData.domain_konten
        },
        {
          level: 'C2 (Memahami)',
          deskripsi: 'Siswa mampu memahami dan menjelaskan konsep ' + formData.domain_konten
        },
        {
          level: 'C3 (Menerapkan)',
          deskripsi: 'Siswa mampu menerapkan konsep ' + formData.domain_konten + ' dalam berbagai konteks'
        },
        {
          level: 'C4 (Menganalisis)',
          deskripsi: 'Siswa mampu menganalisis permasalahan terkait ' + formData.domain_konten
        }
      ]
    };

    // Return the response
    return NextResponse.json(kisiKisiResponse);
  } catch (error) {
    console.error('Error generating Kisi-Kisi:', error);
    return NextResponse.json(
      { error: 'Failed to generate Kisi-Kisi' },
      { status: 500 }
    );
  }
} 
