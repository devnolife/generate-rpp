/**
 * RPP (Rencana Pelaksanaan Pembelajaran) related types
 */

import * as z from "zod";

// Define the form schema to match what's in rpp-form.tsx
const formSchema = z.object({
  // Required fields
  nama_penyusun: z.string().min(2, { message: "Nama penyusun harus diisi" }),
  institusi: z.string().min(2, { message: "Institusi harus diisi" }),
  tahun_pembuatan: z.string().min(4, { message: "Tahun pembuatan harus diisi" }),
  mata_pelajaran: z.string().min(2, { message: "Mata pelajaran harus diisi" }),
  jenjang: z.string().min(2, { message: "Jenjang harus diisi" }),
  kelas: z.string().min(1, { message: "Kelas harus diisi" }),
  fase: z.string().optional(),
  alokasi_waktu: z.string().min(1, { message: "Alokasi waktu harus diisi" }),
  domain_konten: z.string().min(2, { message: "Domain konten harus diisi" }),
  tujuan_pembelajaran: z.string().min(2, { message: "Tujuan pembelajaran harus diisi" }),
  konten_utama: z.string().min(2, { message: "Konten utama harus diisi" }),

  // Optional fields
  capaian_pembelajaran: z.string().optional(),
  prasyarat: z.string().optional(),
  pemahaman_bermakna: z.string().optional(),
  profil_pelajar: z.string().optional(),
  sarana: z.string().optional(),
  target_peserta: z.string().optional(),
  jumlah_peserta: z.string().optional(),
  model_pembelajaran: z.string().optional(),
  sumber_belajar: z.string().optional(),
  catatan: z.string().optional(),
});

// Export the FormData type inferred from the schema
export type FormData = z.infer<typeof formSchema>;

// Export the schema if needed elsewhere
export { formSchema };

export interface RPPResponse {
  status: string;
  message: string;
  rpp: {
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
      capaian_pembelajaran: string;
      domain_konten: string;
      tujuan_pembelajaran: string;
      konten_utama: string;
      prasyarat: string;
      pemahaman_bermakna: string;
      profil_pelajar: string;
      sarana: string;
      target_peserta: string;
      jumlah_peserta: string;
      model_pembelajaran: string;
      sumber_belajar: string;
      catatan: string;
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
  };
}

export interface KisiKisiResponse {
  status: string;
  message: string;
  kisi_kisi: {
    mata_pelajaran: string;
    kelas: string;
    materi: string;
    kisi_kisi: Array<{
      nomor: number;
      tujuan_pembelajaran: string;
      materi: string;
      indikator_soal: string;
      level_kognitif: string;
      bentuk_soal: string;
      nomor_soal: number;
    }>;
  };
}

export interface SoalResponse {
  status: string;
  message: string;
  questions: {
    soal_bahasa_inggris: {
      judul: string;
      kelas: string;
      identitas: {
        nama_sekolah: string;
        mata_pelajaran: string;
        alokasi_waktu: string;
        petunjuk: string;
      };
      pilihan_ganda: Array<{
        nomor: number;
        paragraf: string;
        pertanyaan: string;
        pilihan: {
          A: string;
          B: string;
          C: string;
          D: string;
        };
        kunci_jawaban: string;
      }>;
      menjodohkan: {
        petunjuk: string;
        soal: Array<{
          nomor: number;
          kolom_a: string;
          kolom_b: string;
        }>;
      };
      benar_salah: Array<{
        nomor: number;
        terkait_paragraf: number;
        pernyataan: string;
        kunci_jawaban: boolean;
      }>;
      essay: Array<{
        nomor: number;
        terkait_paragraf: number;
        pertanyaan: string;
        panduan_jawaban: string;
      }>;
    };
  };
}

// Re-export for convenience
export type { RPPData } from "@/components/hasil-rpp";
export type { KisiKisiData } from "@/components/kisi-kisi";
export type { SoalData } from "@/components/soal"; 
