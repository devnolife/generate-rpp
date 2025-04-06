/**
 * RPP (Rencana Pelaksanaan Pembelajaran) related types
 */

export interface RPPFormData {
  // Required fields
  nama_penyusun: string;
  institusi: string;
  tahun_pembuatan: string;
  mata_pelajaran: string;
  jenjang: string;
  kelas: string;
  fase?: string;
  alokasi_waktu: string;
  tahapan: string;
  capaian_pembelajaran: string;
  domain_konten: string;
  tujuan_pembelajaran: string;
  konten_utama: string;

  // Optional fields
  prasyarat?: string;
  pemahaman_bermakna?: string;
  profil_pelajar?: string;
  sarana?: string;
  target_peserta?: string;
  jumlah_peserta?: string;
  model_pembelajaran?: string;
  sumber_belajar?: string;
  catatan?: string;
}

export interface RPPResponse {
  identitas: {
    nama_penyusun: string;
    institusi: string;
    tahun_pembuatan: string;
    mata_pelajaran: string;
    jenjang: string;
    kelas: string;
    fase: string;
    alokasi_waktu: string;
  };
  konten: {
    tahapan: string;
    capaian_pembelajaran: string;
    domain_konten: string;
    tujuan_pembelajaran: string;
    konten_utama: string;
    prasyarat?: string;
    pemahaman_bermakna?: string;
    profil_pelajar?: string;
    sarana?: string;
    target_peserta?: string;
    jumlah_peserta?: string;
    model_pembelajaran?: string;
    sumber_belajar?: string;
    catatan?: string;
  };
  kegiatan_pembelajaran: Array<{
    nama: string;
    langkah: string[];
    estimasi_waktu: string;
  }>;
  penilaian: {
    teknik: string;
    instrumen: string;
  };
}

export interface KisiKisiResponse {
  identitas: {
    mata_pelajaran: string;
    jenjang: string;
    kelas: string;
    alokasi_waktu: string;
  };
  kompetensi_dasar: string[];
  materi_pokok: string;
  indikator: string[];
  level_kognitif: Array<{
    level: string;
    deskripsi: string;
  }>;
}

export interface SoalResponse {
  identitas: {
    mata_pelajaran: string;
    jenjang: string;
    kelas: string;
  };
  soal_pg: Array<{
    pertanyaan: string;
    pilihan: string[];
    kunci_jawaban: string;
    pembahasan: string;
  }>;
  soal_esai: Array<{
    pertanyaan: string;
    kunci_jawaban: string;
    pembahasan: string;
  }>;
}

// Re-export for convenience
export type { RPPData } from "@/components/hasil-rpp";
export type { KisiKisiData } from "@/components/kisi-kisi";
export type { SoalData } from "@/components/soal"; 
