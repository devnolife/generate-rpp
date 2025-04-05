import { NextResponse } from "next/server"

export async function GET() {
  // Simulasi delay untuk menunjukkan loading state
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const soalData = {
    questions: {
      soal_bahasa_inggris: {
        judul: "Soal Evaluasi Bahasa Inggris - Various Professions",
        kelas: "SMP Kelas VII",
        identitas: {
          nama_sekolah: "Sekolah Menengah Pertama X",
          mata_pelajaran: "Bahasa Inggris",
          alokasi_waktu: "60 menit",
          petunjuk: "Jawablah semua pertanyaan dengan teliti dan jujur. Good luck!",
        },
        pilihan_ganda: [
          {
            nomor: 1,
            paragraf:
              "My uncle is a pilot. He flies airplanes all over the world. He needs to be very skilled and responsible because he carries many passengers. It's a challenging but exciting job. He often tells me stories about his travels. He loves his job very much.",
            pertanyaan: "What is my uncle's profession?",
            pilihan: {
              A: "Teacher",
              B: "Doctor",
              C: "Pilot",
              D: "Engineer",
            },
            kunci_jawaban: "C",
          },
          {
            nomor: 2,
            paragraf:
              "My sister wants to be a doctor when she grows up. She loves helping people and is very good at science. She spends hours studying biology and chemistry. She volunteers at the local hospital to gain experience. She is a very dedicated student.",
            pertanyaan: "What profession does my sister aspire to?",
            pilihan: {
              A: "Nurse",
              B: "Pilot",
              C: "Doctor",
              D: "Teacher",
            },
            kunci_jawaban: "C",
          },
          {
            nomor: 3,
            paragraf:
              "Ms. Sarah is a dedicated teacher. She teaches English to junior high school students. She is patient and kind, always willing to help her students understand the lessons. She makes learning fun and engaging. She loves seeing her students grow and succeed.",
            pertanyaan: "What is Ms. Sarah's job?",
            pilihan: {
              A: "Engineer",
              B: "Teacher",
              C: "Nurse",
              D: "Pilot",
            },
            kunci_jawaban: "B",
          },
          {
            nomor: 4,
            paragraf:
              "My father is an engineer. He designs and builds bridges. He uses his knowledge of mathematics and physics to create strong and safe structures. It is a very demanding job requiring great precision and attention to detail. He is very proud of his work.",
            pertanyaan: "What is my father's profession?",
            pilihan: {
              A: "Doctor",
              B: "Teacher",
              C: "Engineer",
              D: "Nurse",
            },
            kunci_jawaban: "C",
          },
          {
            nomor: 5,
            paragraf:
              "Mrs. Ani is a kind and compassionate nurse. She cares for patients in the hospital. She is always ready to assist doctors and provide comfort to those in need. Her job requires patience, empathy, and a strong work ethic. She finds her work very rewarding.",
            pertanyaan: "What profession does Mrs. Ani have?",
            pilihan: {
              A: "Pilot",
              B: "Teacher",
              C: "Engineer",
              D: "Nurse",
            },
            kunci_jawaban: "D",
          },
        ],
        menjodohkan: {
          petunjuk: "Pasangkan profesi di kolom A dengan deskripsi singkat di kolom B.",
          soal: [
            {
              nomor: 1,
              kolom_a: "Pilot",
              kolom_b: "Flies airplanes",
            },
            {
              nomor: 2,
              kolom_a: "Doctor",
              kolom_b: "Treats patients",
            },
            {
              nomor: 3,
              kolom_a: "Teacher",
              kolom_b: "Educates students",
            },
            {
              nomor: 4,
              kolom_a: "Engineer",
              kolom_b: "Designs and builds structures",
            },
            {
              nomor: 5,
              kolom_a: "Nurse",
              kolom_b: "Cares for patients in the hospital",
            },
          ],
        },
        benar_salah: [
          {
            nomor: 1,
            terkait_paragraf: 1,
            pernyataan: "My uncle is a doctor.",
            kunci_jawaban: false,
          },
          {
            nomor: 2,
            terkait_paragraf: 2,
            pernyataan: "My sister wants to be a teacher.",
            kunci_jawaban: false,
          },
          {
            nomor: 3,
            terkait_paragraf: 3,
            pernyataan: "Ms. Sarah teaches mathematics.",
            kunci_jawaban: false,
          },
          {
            nomor: 4,
            terkait_paragraf: 4,
            pernyataan: "My father is an engineer who builds bridges.",
            kunci_jawaban: true,
          },
          {
            nomor: 5,
            terkait_paragraf: 5,
            pernyataan: "Mrs. Ani works as a teacher.",
            kunci_jawaban: false,
          },
        ],
        essay: [
          {
            nomor: 1,
            terkait_paragraf: 1,
            pertanyaan: "Based on paragraph 1, describe the qualities a pilot needs to have. Explain your answer.",
            panduan_jawaban:
              "Students should mention qualities like skill, responsibility, and the ability to handle pressure. They should support their answer with evidence from the paragraph (e.g., carrying passengers, challenging job).",
          },
          {
            nomor: 2,
            terkait_paragraf: 2,
            pertanyaan:
              "According to paragraph 2, why does my sister want to become a doctor? Provide evidence from the text to support your answer.",
            panduan_jawaban:
              "Students should explain that my sister wants to be a doctor because she loves helping people and is good at science. They should mention her studying biology and chemistry, and volunteering at the hospital as evidence.",
          },
        ],
      },
    },
  }

  return NextResponse.json(soalData)
}

