import { NextResponse } from "next/server"

export async function GET() {
  // Simulasi delay untuk menunjukkan loading state
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const rppData = {
    rpp: {
      rpp_bahasa_inggris: {
        identitas: {
          nama_penyusun: "Andi Sabda, S.Pd",
          institusi: "UPT SMP Negeri 2 Rumbia",
          tahun_pembuatan: "2025",
          mata_pelajaran: "Bahasa Inggris",
          jenjang: "SMP",
          kelas: "VII",
          alokasi_waktu: "40 menit",
          tahapan: "Fase D",
        },
        komponen_pembelajaran: {
          capaian_pembelajaran:
            "Peserta didik mampu menyebutkan berbagai macam pekerjaan (profesi) dalam Bahasa Inggris.",
          domain_konten: "Menulis dan Mempresentasikan",
          tujuan_pembelajaran: [
            "Setelah mengikuti pembelajaran ini, peserta didik mampu menyebutkan minimal 5 profesi dalam Bahasa Inggris dengan benar.",
            "Setelah mengikuti pembelajaran ini, peserta didik mampu menuliskan minimal 3 kalimat tentang profesi yang telah dipelajari.",
            "Setelah mengikuti pembelajaran ini, peserta didik mampu mempresentasikan profesi yang telah dipelajari di depan kelas dengan percaya diri.",
          ],
          konten_utama: {
            linguistik: [
              "Kosakata profesi dalam Bahasa Inggris (misalnya: doctor, teacher, engineer, pilot, nurse, etc.)",
              "Kalimat sederhana untuk mendeskripsikan profesi (misalnya: He is a doctor. She is a teacher.)",
            ],
            tematik: "Berbagai macam profesi",
          },
          prasyarat_pengetahuan: [
            "Peserta didik mengetahui macam-macam profesi dalam Bahasa Indonesia.",
            "Peserta didik mampu membaca dan menulis huruf alfabet Bahasa Inggris.",
          ],
          pemahaman_bermakna:
            "Melalui pertanyaan pemantik dan aktivitas yang bermakna, peserta didik dapat memahami pentingnya berbagai profesi dalam masyarakat dan mampu mengkomunikasikannya dalam Bahasa Inggris.",
          profil_pelajar_pancasila: {
            dimensi_1: "Bernalar kritis: Peserta didik dilatih untuk menganalisis dan membandingkan berbagai profesi.",
            dimensi_2: "Mandiri: Peserta didik dilatih untuk mencari informasi dan menyelesaikan tugas secara mandiri.",
            dimensi_3: "Kreatif: Peserta didik didorong untuk mengekspresikan pemahaman mereka melalui presentasi.",
          },
          sarana_prasarana: [
            "Papan tulis",
            "Buku siswa \"English in Mind- student's & teacher's book second edition class VII\"",
            "HP (untuk presentasi jika memungkinkan)",
            "Jaringan internet (jika diperlukan)",
          ],
          target_peserta_didik: "Peserta didik regular",
          jumlah_peserta_didik: "30",
          model_pembelajaran: {
            nama_model: "Tatap Muka",
            alasan_pemilihan:
              "Model tatap muka dipilih karena memungkinkan interaksi langsung antara guru dan siswa, serta memudahkan pengawasan proses belajar mengajar.",
            tahapan: ["Pendahuluan", "Kegiatan Inti", "Penutup"],
          },
          sumber_belajar: [
            "Puchta, Herbert, et al. 2021. *English in Mind- student's & teacher's book second edition class VII*. Jakarta: Pusat Kurikulum dan Perbukuan Badan Penelitian dan Pengembangan dan Perbukuan Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi.",
          ],
        },
        kegiatan_pembelajaran: {
          kegiatan_awal: {
            durasi: "15 Menit",
            langkah_kegiatan: [
              {
                aktivitas: "Salam pembuka dan doa",
                waktu: "2 menit",
                peran_guru: "Memberikan salam dan memimpin doa",
                peran_siswa: "Menjawab salam dan mengikuti doa",
              },
              {
                aktivitas: "Presensi siswa",
                waktu: "3 menit",
                peran_guru: "Memeriksa kehadiran siswa",
                peran_siswa: "Memberikan respon kehadiran",
              },
              {
                aktivitas: "Apersepsi (mengaitkan dengan pengalaman siswa)",
                waktu: "5 menit",
                peran_guru: 'Mengajukan pertanyaan: "Apa saja pekerjaan orang tua kalian?"',
                peran_siswa: "Menjawab pertanyaan guru",
              },
              {
                aktivitas: "Motivasi",
                waktu: "3 menit",
                peran_guru: "Menjelaskan pentingnya mempelajari profesi dalam Bahasa Inggris",
                peran_siswa: "Mendengarkan penjelasan guru",
              },
              {
                aktivitas: "Penyampaian tujuan pembelajaran",
                waktu: "2 menit",
                peran_guru: "Menjelaskan tujuan pembelajaran yang akan dicapai",
                peran_siswa: "Mendengarkan dan memahami tujuan pembelajaran",
              },
            ],
          },
          kegiatan_inti: {
            durasi: "90 Menit",
            langkah_kegiatan: [
              {
                aktivitas: "Penjelasan materi tentang profesi (dengan gambar)",
                waktu: "20 menit",
                peran_guru: "Menjelaskan berbagai macam profesi dan cara pengucapannya yang benar",
                peran_siswa: "Mendengarkan dan mencatat",
                pengelompokan: "Kelas",
                pertanyaan_kunci: [
                  "Apa perbedaan antara profesi dokter dan guru?",
                  "Sebutkan 5 profesi yang membutuhkan pendidikan tinggi!",
                ],
              },
              {
                aktivitas: "Praktik mengucapkan profesi",
                waktu: "15 menit",
                peran_guru: "Meminta siswa untuk mengulang pengucapan profesi",
                peran_siswa: "Mengulang pengucapan profesi secara bergantian",
                pengelompokan: "Individu",
                pertanyaan_kunci: ["Bagaimana cara mengucapkan profesi 'engineer' dengan benar?"],
              },
              {
                aktivitas: "Menulis kalimat tentang profesi",
                waktu: "20 menit",
                peran_guru: "Membimbing siswa untuk menulis 3 kalimat tentang profesi yang disukai",
                peran_siswa: "Menulis kalimat tentang profesi",
                pengelompokan: "Individu",
                pertanyaan_kunci: ["Buatlah 3 kalimat tentang profesi yang kamu sukai!"],
              },
              {
                aktivitas: "Presentasi hasil tulisan",
                waktu: "20 menit",
                peran_guru: "Memilih beberapa siswa untuk mempresentasikan hasil tulisannya",
                peran_siswa: "Mempersiapkan dan mempresentasikan hasil tulisannya",
                pengelompokan: "Kelompok kecil",
                pertanyaan_kunci: ["Bagaimana cara mempresentasikan hasil kerja dengan percaya diri?"],
              },
              {
                aktivitas: "Diskusi dan tanya jawab",
                waktu: "15 menit",
                peran_guru: "Memfasilitasi diskusi dan menjawab pertanyaan siswa",
                peran_siswa: "Bertanya dan menjawab pertanyaan",
                pengelompokan: "Kelas",
                pertanyaan_kunci: ["Apa profesi yang paling kamu sukai dan mengapa?"],
              },
            ],
            strategi_diferensiasi: {
              kemampuan_tinggi: "Memberikan tugas tambahan untuk membuat dialog sederhana tentang profesi.",
              kemampuan_sedang: "Membimbing siswa untuk membuat kalimat yang lebih kompleks tentang profesi.",
              kemampuan_rendah: "Membantu siswa dalam menulis kalimat sederhana dengan memberikan contoh dan panduan.",
            },
          },
          kegiatan_penutup: {
            durasi: "15 Menit",
            langkah_kegiatan: [
              {
                aktivitas: "Refleksi",
                waktu: "5 menit",
                peran_guru:
                  'Mengajukan pertanyaan refleksi: "Apa yang telah kamu pelajari hari ini? Apa yang paling kamu sukai? Apa yang masih membingungkan?"',
                peran_siswa: "Menjawab pertanyaan refleksi",
              },
              {
                aktivitas: "Kesimpulan",
                waktu: "3 menit",
                peran_guru: "Meringkas materi yang telah dipelajari",
                peran_siswa: "Mendengarkan kesimpulan",
              },
              {
                aktivitas: "Penilaian",
                waktu: "5 menit",
                peran_guru: "Memberikan kuis singkat",
                peran_siswa: "Mengerjakan kuis singkat",
              },
              {
                aktivitas: "Tugas rumah",
                waktu: "2 menit",
                peran_guru: "Memberikan tugas rumah untuk mencari informasi tentang 5 profesi lain",
                peran_siswa: "Mendengarkan dan mencatat tugas rumah",
              },
            ],
            pertanyaan_refleksi: [
              "Apa yang sudah kamu pelajari hari ini?",
              "Apa yang paling kamu sukai dari pembelajaran hari ini?",
              "Apa kesulitan yang kamu hadapi selama pembelajaran?",
              "Apa yang akan kamu lakukan untuk meningkatkan pemahamanmu?",
            ],
          },
        },
        materi_dan_assessment: {
          bahan_ajar: {
            teori:
              "Profesi adalah pekerjaan atau kegiatan yang dilakukan seseorang untuk menghasilkan sesuatu yang berguna bagi dirinya sendiri dan masyarakat.  Ada berbagai macam profesi, mulai dari dokter, guru, polisi, hingga pilot dan programmer. Setiap profesi memiliki peran dan tanggung jawab yang berbeda-beda.  Mempelajari berbagai macam profesi dalam bahasa Inggris membantu kita untuk berkomunikasi dengan orang-orang dari berbagai latar belakang dan negara.  Dengan mengetahui kosakata profesi, kita dapat memperluas wawasan dan kemampuan berkomunikasi kita dalam bahasa internasional.",
            materi_linguistik: {
              grammar: "Kalimat sederhana dalam bentuk afirmatif (misalnya: He is a doctor. She is a teacher.)",
              vocabulary: [
                {
                  kata: "doctor",
                  arti: "dokter",
                },
                {
                  kata: "teacher",
                  arti: "guru",
                },
                {
                  kata: "engineer",
                  arti: "insinyur",
                },
                {
                  kata: "pilot",
                  arti: "pilot",
                },
                {
                  kata: "nurse",
                  arti: "perawat",
                },
                {
                  kata: "police officer",
                  arti: "petugas polisi",
                },
                {
                  kata: "firefighter",
                  arti: "petugas pemadam kebakaran",
                },
                {
                  kata: "chef",
                  arti: "koki",
                },
                {
                  kata: "programmer",
                  arti: "programmer",
                },
                {
                  kata: "musician",
                  arti: "musisi",
                },
              ],
            },
            teks_lengkap:
              "My father is a doctor. He works at the hospital. He helps sick people. My mother is a teacher. She teaches at a school. She teaches children. I want to be a pilot when I grow up. I love to travel and see the world.",
            materi_visual: "Gambar-gambar yang menunjukkan berbagai macam profesi (dokter, guru, polisi, pilot, dll.)",
          },
          remedial: {
            aktivitas:
              "Siswa yang belum mencapai KKM akan diberikan bimbingan tambahan berupa latihan pengucapan dan penulisan kalimat sederhana tentang profesi. Guru akan memberikan contoh kalimat dan membantu siswa dalam memperbaiki kesalahan.",
            strategi_intervensi: ["Bimbingan individual", "Latihan tambahan"],
            instrumen_penilaian: "Tes lisan dan tertulis yang lebih sederhana",
          },
          pengayaan: {
            aktivitas: [
              "Menulis paragraf pendek tentang profesi yang dipilih",
              "Membuat presentasi singkat tentang profesi pilihan di depan kelas",
              "Mencari informasi tentang profesi di internet dan mempresentasikannya",
            ],
            produk_yang_diharapkan: "Paragraf atau presentasi singkat tentang profesi yang dipilih",
          },
          assessment: {
            penilaian_pengetahuan: {
              teknik: "Tes tertulis",
              bentuk_instrumen: "Essay",
              kisi_kisi: "Menyebutkan dan menjelaskan 5 macam profesi dalam Bahasa Inggris.",
              instrumen: [
                "Sebutkan 5 profesi dalam Bahasa Inggris!",
                "Jelaskan pekerjaan seorang dokter dalam Bahasa Inggris!",
                "Tuliskan 3 kalimat tentang pekerjaan seorang guru!",
                "Apa perbedaan antara seorang pilot dan seorang insinyur?",
                "Apa yang kamu ketahui tentang profesi programmer?",
              ],
              kunci_jawaban: [
                "Jawaban bervariasi, minimal 5 profesi yang benar",
                "Jawaban bervariasi, menjelaskan pekerjaan dokter",
                "Jawaban bervariasi, minimal 3 kalimat yang benar",
                "Jawaban bervariasi, membandingkan pilot dan insinyur",
                "Jawaban bervariasi, menjelaskan profesi programmer",
              ],
              pedoman_penskoran: "Setiap soal benar bernilai 20, skor maksimal 100.",
            },
            penilaian_keterampilan_mengucapkan: {
              teknik: "Tes lisan",
              aspek_penilaian: [
                {
                  nama_aspek: "Pengucapan",
                  deskripsi: [
                    {
                      level: "Sempurna",
                      skor: 5,
                    },
                    {
                      level: "Ada kesalahan tapi tidak mengganggu makna",
                      skor: 4,
                    },
                    {
                      level: "Ada beberapa kesalahan dan mengganggu makna",
                      skor: 3,
                    },
                    {
                      level: "Banyak kesalahan dan mengganggu makna",
                      skor: 2,
                    },
                    {
                      level: "Terlalu banyak kesalahan sehingga sulit untuk dipahami",
                      skor: 1,
                    },
                  ],
                },
                {
                  nama_aspek: "Kelancaran",
                  deskripsi: [
                    {
                      level: "Sangat lancar",
                      skor: 5,
                    },
                    {
                      level: "Lancar",
                      skor: 4,
                    },
                    {
                      level: "Cukup lancar",
                      skor: 3,
                    },
                    {
                      level: "Kurang lancar",
                      skor: 2,
                    },
                    {
                      level: "Tidak lancar",
                      skor: 1,
                    },
                  ],
                },
              ],
              penentuan_nilai: "nilaiSiswa = skorDiperoleh/skorMaksimal * 100",
              instrumen:
                "Siswa diminta menyebutkan 5 profesi dalam Bahasa Inggris dengan pengucapan yang benar dan lancar.",
            },
            penilaian_keterampilan_menulis: {
              teknik: "Tes tertulis",
              instrumen:
                "Siswa diminta menulis 3 kalimat yang benar secara gramatikal tentang profesi yang telah dipelajari.",
              rubrik: {
                kriteria_1: {
                  sangat_baik: "Kalimat benar secara gramatikal, tata bahasa baik, ejaan benar, kosakata tepat.",
                  baik: "Kalimat hampir benar secara gramatikal, sedikit kesalahan tata bahasa, ejaan sebagian besar benar, kosakata tepat.",
                  cukup:
                    "Kalimat sebagian besar benar secara gramatikal, beberapa kesalahan tata bahasa, ejaan beberapa salah, kosakata kurang tepat.",
                  perlu_bimbingan:
                    "Kalimat banyak kesalahan gramatikal, tata bahasa buruk, ejaan banyak salah, kosakata tidak tepat.",
                },
                kriteria_2: {
                  sangat_baik: "Kalimat menunjukkan pemahaman mendalam terhadap materi.",
                  baik: "Kalimat menunjukkan pemahaman cukup terhadap materi.",
                  cukup: "Kalimat menunjukkan sedikit pemahaman terhadap materi.",
                  perlu_bimbingan: "Kalimat tidak menunjukkan pemahaman terhadap materi.",
                },
              },
              pedoman_penskoran: "Skor diberikan berdasarkan rubrik di atas. Skor maksimal 100.",
            },
          },
        },
      },
    },
    created_at: new Date().toISOString(),
  }

  return NextResponse.json(rppData)
}

