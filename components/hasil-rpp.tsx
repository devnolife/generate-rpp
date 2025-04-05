"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Download,
  Printer,
  Share2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Clock,
  School,
  User,
  Calendar,
  Layers,
  LayoutGrid,
  CheckCircle,
  List,
  Book,
  Lightbulb,
  Users,
  Briefcase,
  GraduationCap,
  Award,
  CheckSquare,
  Check,
  Grid3X3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { toast } from "@/components/ui/use-toast"

// Definisikan tipe data untuk RPP
export interface RPPData {
  rpp: {
    rpp_bahasa_inggris: {
      identitas: {
        nama_penyusun: string
        institusi: string
        tahun_pembuatan: string
        mata_pelajaran: string
        jenjang: string
        kelas: string
        alokasi_waktu: string
        tahapan: string
      }
      komponen_pembelajaran: {
        capaian_pembelajaran: string
        domain_konten: string
        tujuan_pembelajaran: string[]
        konten_utama: {
          linguistik: string[]
          tematik: string
        }
        prasyarat_pengetahuan: string[]
        pemahaman_bermakna: string
        profil_pelajar_pancasila: {
          dimensi_1: string
          dimensi_2: string
          dimensi_3: string
        }
        sarana_prasarana: string[]
        target_peserta_didik: string
        jumlah_peserta_didik: string
        model_pembelajaran: {
          nama_model: string
          alasan_pemilihan: string
          tahapan: string[]
        }
        sumber_belajar: string[]
      }
      kegiatan_pembelajaran: {
        kegiatan_awal: {
          durasi: string
          langkah_kegiatan: Array<{
            aktivitas: string
            waktu: string
            peran_guru: string
            peran_siswa: string
          }>
        }
        kegiatan_inti: {
          durasi: string
          langkah_kegiatan: Array<{
            aktivitas: string
            waktu: string
            peran_guru: string
            peran_siswa: string
            pengelompokan: string
            pertanyaan_kunci: string[]
          }>
          strategi_diferensiasi: {
            kemampuan_tinggi: string
            kemampuan_sedang: string
            kemampuan_rendah: string
          }
        }
        kegiatan_penutup: {
          durasi: string
          langkah_kegiatan: Array<{
            aktivitas: string
            waktu: string
            peran_guru: string
            peran_siswa: string
          }>
          pertanyaan_refleksi: string[]
        }
      }
      materi_dan_assessment: {
        bahan_ajar: {
          teori: string
          materi_linguistik: {
            grammar: string
            vocabulary: Array<{
              kata: string
              arti: string
            }>
          }
          teks_lengkap: string
          materi_visual: string
        }
        remedial: {
          aktivitas: string
          strategi_intervensi: string[]
          instrumen_penilaian: string
        }
        pengayaan: {
          aktivitas: string[]
          produk_yang_diharapkan: string
        }
        assessment: {
          penilaian_pengetahuan: {
            teknik: string
            bentuk_instrumen: string
            kisi_kisi: string
            instrumen: string[]
            kunci_jawaban: string[]
            pedoman_penskoran: string
          }
          penilaian_keterampilan_mengucapkan: {
            teknik: string
            aspek_penilaian: Array<{
              nama_aspek: string
              deskripsi: Array<{
                level: string
                skor: number
              }>
            }>
            penentuan_nilai: string
            instrumen: string
          }
          penilaian_keterampilan_menulis: {
            teknik: string
            instrumen: string
            rubrik: {
              kriteria_1: {
                sangat_baik: string
                baik: string
                cukup: string
                perlu_bimbingan: string
              }
              kriteria_2: {
                sangat_baik: string
                baik: string
                cukup: string
                perlu_bimbingan: string
              }
            }
            pedoman_penskoran: string
          }
        }
      }
    }
  }
  created_at?: string
}

interface HasilRPPProps {
  data: RPPData | null
  onGenerateKisiKisi: () => void
}

// Tambahkan prop onGenerateKisiKisi
export function HasilRPP({ data, onGenerateKisiKisi }: HasilRPPProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    identitas: true,
    komponenPembelajaran: true,
    kegiatanPembelajaran: false,
    materiAssessment: false,
  })
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Fungsi untuk mencetak dokumen
  const handlePrint = () => {
    // Buka semua bagian sebelum mencetak
    const allExpanded = Object.keys(expandedSections).reduce(
      (acc, key) => {
        acc[key] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    setExpandedSections(allExpanded)

    // Berikan waktu untuk render sebelum mencetak
    setTimeout(() => {
      window.print()
    }, 500)
  }

  // Fungsi untuk mengunduh sebagai PDF
  const handleDownloadPDF = async () => {
    if (!contentRef.current) return

    // Buka semua bagian sebelum mengunduh
    const allExpanded = Object.keys(expandedSections).reduce(
      (acc, key) => {
        acc[key] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    setExpandedSections(allExpanded)

    // Berikan waktu untuk render sebelum mengunduh
    setTimeout(async () => {
      try {
        toast({
          title: "Mempersiapkan PDF...",
          description: "Mohon tunggu sebentar",
        })

        const content = contentRef.current
        if (!content) return

        const canvas = await html2canvas(content, {
          scale: 1.5, // Meningkatkan kualitas
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        })

        const imgData = canvas.toDataURL("image/jpeg", 1.0)
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgX = (pdfWidth - imgWidth * ratio) / 2
        const imgY = 10

        pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)

        // Jika konten terlalu panjang, tambahkan halaman baru
        const contentHeight = imgHeight * ratio
        let heightLeft = contentHeight - pdfHeight + imgY
        let position = pdfHeight

        while (heightLeft > 0) {
          pdf.addPage()
          pdf.addImage(imgData, "JPEG", imgX, -(position - imgY), imgWidth * ratio, imgHeight * ratio)
          heightLeft -= pdfHeight
          position += pdfHeight
        }

        // Unduh PDF
        const rpp = data?.rpp.rpp_bahasa_inggris
        const fileName = `RPP_${rpp?.identitas.mata_pelajaran}_${rpp?.identitas.kelas}_${new Date().toISOString().split("T")[0]}.pdf`
        pdf.save(fileName)

        toast({
          title: "PDF berhasil diunduh!",
          description: `File telah disimpan dengan nama ${fileName}`,
          className: "bg-primary text-white border-none",
        })
      } catch (error) {
        console.error("Error generating PDF:", error)
        toast({
          title: "Gagal mengunduh PDF",
          description: "Terjadi kesalahan saat membuat file PDF",
          variant: "destructive",
        })
      }
    }, 500)
  }

  // Fungsi untuk berbagi
  const handleShare = async () => {
    setIsSharing(true)
    try {
      // Jika Web Share API tersedia
      if (navigator.share) {
        await navigator.share({
          title: `RPP ${data?.rpp.rpp_bahasa_inggris.identitas.mata_pelajaran}`,
          text: `RPP ${data?.rpp.rpp_bahasa_inggris.identitas.mata_pelajaran} untuk Kelas ${data?.rpp.rpp_bahasa_inggris.identitas.kelas}`,
          url: window.location.href,
        })
        setIsSharing(false)
      } else {
        // Fallback: salin URL ke clipboard
        await navigator.clipboard.writeText(window.location.href)
        setShareSuccess(true)
        setTimeout(() => {
          setShareSuccess(false)
          setIsSharing(false)
        }, 2000)

        toast({
          title: "URL berhasil disalin!",
          description: "URL halaman telah disalin ke clipboard",
          className: "bg-primary text-white border-none",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      setIsSharing(false)

      toast({
        title: "Gagal berbagi",
        description: "Terjadi kesalahan saat mencoba berbagi",
        variant: "destructive",
      })
    }
  }

  if (!data) {
    return (
      <div className="p-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary-lightest rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-primary-light" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Dokumen</h3>
        <p className="text-gray-500 max-w-md">
          Dokumen yang telah Anda generate akan muncul di sini. Buat RPP terlebih dahulu untuk melihat hasilnya.
        </p>
      </div>
    )
  }

  const rpp = data.rpp.rpp_bahasa_inggris

  const formatDate = () => {
    if (!data.created_at) return "Hari ini"
    const date = new Date(data.created_at)
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  // Tambahkan tombol di bagian bawah komponen
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#6EC207]" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">RPP {rpp.identitas.mata_pelajaran}</h2>
              <p className="text-sm text-gray-500">Dibuat pada {formatDate()}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-100 gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              <span>Cetak</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-100 gap-2"
              onClick={handleShare}
              disabled={isSharing}
            >
              {shareSuccess ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : isSharing ? (
                <div className="h-4 w-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              <span>{shareSuccess ? "Disalin!" : "Bagikan"}</span>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white gap-2"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4" />
              <span>Unduh PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content for printing/PDF */}
      <div ref={contentRef}>
        {/* Identitas */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Ubah warna header section */}
          <div
            className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("identitas")}
          >
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-500" />
              <h3 className="font-semibold text-gray-800">Identitas</h3>
            </div>
            {expandedSections.identitas ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          <AnimatePresence>
            {expandedSections.identitas && (
              <motion.div
                className="p-6"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <User className="h-5 w-5 text-[#4379F2]" />
                      <div>
                        <p className="text-sm text-gray-500">Nama Penyusun</p>
                        <p className="font-medium text-gray-800">{rpp.identitas.nama_penyusun}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <School className="h-5 w-5 text-[#FFEB00]" />
                      <div>
                        <p className="text-sm text-gray-500">Institusi</p>
                        <p className="font-medium text-gray-800">{rpp.identitas.institusi}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Calendar className="h-5 w-5 text-[#6EC207]" />
                      <div>
                        <p className="text-sm text-gray-500">Tahun Pembuatan</p>
                        <p className="font-medium text-gray-800">{rpp.identitas.tahun_pembuatan}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <BookOpen className="h-5 w-5 text-[#117554]" />
                      <div>
                        <p className="text-sm text-gray-500">Mata Pelajaran</p>
                        <p className="font-medium text-gray-800">{rpp.identitas.mata_pelajaran}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Layers className="h-5 w-5 text-[#4379F2]" />
                      <div>
                        <p className="text-sm text-gray-500">Jenjang & Kelas</p>
                        <p className="font-medium text-gray-800">
                          {rpp.identitas.jenjang} - Kelas {rpp.identitas.kelas}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-[#FFEB00]" />
                      <div>
                        <p className="text-sm text-gray-500">Alokasi Waktu</p>
                        <p className="font-medium text-gray-800">{rpp.identitas.alokasi_waktu}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Komponen Pembelajaran */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div
            className="p-4 bg-gradient-to-r from-primary-lightest to-white flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("komponenPembelajaran")}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-gray-800">Komponen Pembelajaran</h3>
            </div>
            {expandedSections.komponenPembelajaran ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          <AnimatePresence>
            {expandedSections.komponenPembelajaran && (
              <motion.div
                className="p-6"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Capaian Pembelajaran</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{rpp.komponen_pembelajaran.capaian_pembelajaran}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Domain Konten</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{rpp.komponen_pembelajaran.domain_konten}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Tujuan Pembelajaran</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <ul className="list-disc pl-5 space-y-2">
                        {rpp.komponen_pembelajaran.tujuan_pembelajaran.map((tujuan, index) => (
                          <li key={index} className="text-gray-700">
                            {tujuan}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <List className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Konten Utama</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Linguistik:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {rpp.komponen_pembelajaran.konten_utama.linguistik.map((item, index) => (
                            <li key={index} className="text-gray-700">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Tematik:</h5>
                        <p className="text-gray-700">{rpp.komponen_pembelajaran.konten_utama.tematik}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Prasyarat Pengetahuan</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <ul className="list-disc pl-5 space-y-2">
                        {rpp.komponen_pembelajaran.prasyarat_pengetahuan.map((prasyarat, index) => (
                          <li key={index} className="text-gray-700">
                            {prasyarat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Pemahaman Bermakna</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{rpp.komponen_pembelajaran.pemahaman_bermakna}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Profil Pelajar Pancasila</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      <div>
                        <p className="text-gray-700">
                          <span className="font-medium">Dimensi 1:</span>{" "}
                          {rpp.komponen_pembelajaran.profil_pelajar_pancasila.dimensi_1}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-medium">Dimensi 2:</span>{" "}
                          {rpp.komponen_pembelajaran.profil_pelajar_pancasila.dimensi_2}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <span className="font-medium">Dimensi 3:</span>{" "}
                          {rpp.komponen_pembelajaran.profil_pelajar_pancasila.dimensi_3}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <h4 className="font-medium text-gray-800">Sarana Prasarana</h4>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <ul className="list-disc pl-5 space-y-1">
                          {rpp.komponen_pembelajaran.sarana_prasarana.map((sarana, index) => (
                            <li key={index} className="text-gray-700">
                              {sarana}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <h4 className="font-medium text-gray-800">Target Peserta Didik</h4>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-700">{rpp.komponen_pembelajaran.target_peserta_didik}</p>
                        <p className="text-gray-700 mt-2">
                          Jumlah: {rpp.komponen_pembelajaran.jumlah_peserta_didik} siswa
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Model Pembelajaran</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      <p className="text-gray-700">
                        <span className="font-medium">Nama Model:</span>{" "}
                        {rpp.komponen_pembelajaran.model_pembelajaran.nama_model}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Alasan Pemilihan:</span>{" "}
                        {rpp.komponen_pembelajaran.model_pembelajaran.alasan_pemilihan}
                      </p>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Tahapan:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {rpp.komponen_pembelajaran.model_pembelajaran.tahapan.map((tahap, index) => (
                            <li key={index} className="text-gray-700">
                              {tahap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Sumber Belajar</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <ul className="list-disc pl-5 space-y-2">
                        {rpp.komponen_pembelajaran.sumber_belajar.map((sumber, index) => (
                          <li key={index} className="text-gray-700">
                            {sumber}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Kegiatan Pembelajaran */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div
            className="p-4 bg-gradient-to-r from-primary-lightest to-white flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("kegiatanPembelajaran")}
          >
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-gray-800">Kegiatan Pembelajaran</h3>
            </div>
            {expandedSections.kegiatanPembelajaran ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          <AnimatePresence>
            {expandedSections.kegiatanPembelajaran && (
              <motion.div
                className="p-6"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-8">
                  {/* Kegiatan Awal */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-lightest rounded-lg">
                          <CheckSquare className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-medium text-gray-800">Kegiatan Awal</h4>
                      </div>
                      <div className="px-3 py-1 bg-primary-lightest text-primary text-xs font-medium rounded-full">
                        {rpp.kegiatan_pembelajaran.kegiatan_awal.durasi}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-xl overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aktivitas
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Waktu
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Peran Guru
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Peran Siswa
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {rpp.kegiatan_pembelajaran.kegiatan_awal.langkah_kegiatan.map((langkah, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.aktivitas}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.waktu}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.peran_guru}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.peran_siswa}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Kegiatan Inti */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-lightest rounded-lg">
                          <CheckSquare className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-medium text-gray-800">Kegiatan Inti</h4>
                      </div>
                      <div className="px-3 py-1 bg-primary-lightest text-primary text-xs font-medium rounded-full">
                        {rpp.kegiatan_pembelajaran.kegiatan_inti.durasi}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-xl overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aktivitas
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Waktu
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Peran Guru
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Peran Siswa
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pengelompokan
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {rpp.kegiatan_pembelajaran.kegiatan_inti.langkah_kegiatan.map((langkah, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.aktivitas}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.waktu}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.peran_guru}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.peran_siswa}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.pengelompokan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-3 mt-4">
                      <h5 className="font-medium text-gray-700">Pertanyaan Kunci:</h5>
                      {rpp.kegiatan_pembelajaran.kegiatan_inti.langkah_kegiatan.map((langkah, langkahIndex) => (
                        <div key={langkahIndex} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-gray-700 mb-2">Aktivitas: {langkah.aktivitas}</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {langkah.pertanyaan_kunci.map((pertanyaan, index) => (
                              <li key={index} className="text-gray-700 text-sm">
                                {pertanyaan}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 mt-4">
                      <h5 className="font-medium text-gray-700">Strategi Diferensiasi:</h5>
                      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                        <p className="text-gray-700">
                          <span className="font-medium">Kemampuan Tinggi:</span>{" "}
                          {rpp.kegiatan_pembelajaran.kegiatan_inti.strategi_diferensiasi.kemampuan_tinggi}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Kemampuan Sedang:</span>{" "}
                          {rpp.kegiatan_pembelajaran.kegiatan_inti.strategi_diferensiasi.kemampuan_sedang}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Kemampuan Rendah:</span>{" "}
                          {rpp.kegiatan_pembelajaran.kegiatan_inti.strategi_diferensiasi.kemampuan_rendah}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kegiatan Penutup */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-lightest rounded-lg">
                          <CheckSquare className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-medium text-gray-800">Kegiatan Penutup</h4>
                      </div>
                      <div className="px-3 py-1 bg-primary-lightest text-primary text-xs font-medium rounded-full">
                        {rpp.kegiatan_pembelajaran.kegiatan_penutup.durasi}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-xl overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aktivitas
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Waktu
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Peran Guru
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Peran Siswa
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {rpp.kegiatan_pembelajaran.kegiatan_penutup.langkah_kegiatan.map((langkah, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.aktivitas}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.waktu}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.peran_guru}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{langkah.peran_siswa}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-3 mt-4">
                      <h5 className="font-medium text-gray-700">Pertanyaan Refleksi:</h5>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <ul className="list-disc pl-5 space-y-2">
                          {rpp.kegiatan_pembelajaran.kegiatan_penutup.pertanyaan_refleksi.map((pertanyaan, index) => (
                            <li key={index} className="text-gray-700">
                              {pertanyaan}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Materi dan Assessment */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div
            className="p-4 bg-gradient-to-r from-primary-lightest to-white flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("materiAssessment")}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-gray-800">Materi dan Assessment</h3>
            </div>
            {expandedSections.materiAssessment ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          <AnimatePresence>
            {expandedSections.materiAssessment && (
              <motion.div
                className="p-6"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-8">
                  {/* Bahan Ajar */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Bahan Ajar</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Teori:</h5>
                        <p className="text-gray-700 whitespace-pre-line">
                          {rpp.materi_dan_assessment.bahan_ajar.teori}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Materi Linguistik:</h5>
                        <p className="text-gray-700 mb-3">
                          <span className="font-medium">Grammar:</span>{" "}
                          {rpp.materi_dan_assessment.bahan_ajar.materi_linguistik.grammar}
                        </p>

                        <h6 className="font-medium text-gray-700 mb-2">Vocabulary:</h6>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white rounded-xl overflow-hidden">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Kata
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Arti
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {rpp.materi_dan_assessment.bahan_ajar.materi_linguistik.vocabulary.map((vocab, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                  <td className="px-4 py-2 text-sm text-gray-700">{vocab.kata}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{vocab.arti}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Teks Lengkap:</h5>
                        <p className="text-gray-700 whitespace-pre-line">
                          {rpp.materi_dan_assessment.bahan_ajar.teks_lengkap}
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Materi Visual:</h5>
                        <p className="text-gray-700">{rpp.materi_dan_assessment.bahan_ajar.materi_visual}</p>
                      </div>
                    </div>
                  </div>

                  {/* Remedial */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Remedial</h4>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      <p className="text-gray-700">
                        <span className="font-medium">Aktivitas:</span> {rpp.materi_dan_assessment.remedial.aktivitas}
                      </p>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Strategi Intervensi:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {rpp.materi_dan_assessment.remedial.strategi_intervensi.map((strategi, index) => (
                            <li key={index} className="text-gray-700">
                              {strategi}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-gray-700">
                        <span className="font-medium">Instrumen Penilaian:</span>{" "}
                        {rpp.materi_dan_assessment.remedial.instrumen_penilaian}
                      </p>
                    </div>
                  </div>

                  {/* Pengayaan */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Pengayaan</h4>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Aktivitas:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {rpp.materi_dan_assessment.pengayaan.aktivitas.map((aktivitas, index) => (
                            <li key={index} className="text-gray-700">
                              {aktivitas}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-gray-700">
                        <span className="font-medium">Produk yang Diharapkan:</span>{" "}
                        {rpp.materi_dan_assessment.pengayaan.produk_yang_diharapkan}
                      </p>
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Assessment</h4>
                    </div>

                    <div className="space-y-6">
                      {/* Penilaian Pengetahuan */}
                      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                        <h5 className="font-medium text-gray-700">Penilaian Pengetahuan</h5>

                        <p className="text-gray-700">
                          <span className="font-medium">Teknik:</span>{" "}
                          {rpp.materi_dan_assessment.assessment.penilaian_pengetahuan.teknik}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Bentuk Instrumen:</span>{" "}
                          {rpp.materi_dan_assessment.assessment.penilaian_pengetahuan.bentuk_instrumen}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Kisi-kisi:</span>{" "}
                          {rpp.materi_dan_assessment.assessment.penilaian_pengetahuan.kisi_kisi}
                        </p>

                        <div>
                          <h6 className="font-medium text-gray-700 mb-1">Instrumen:</h6>
                          <ol className="list-decimal pl-5 space-y-1">
                            {rpp.materi_dan_assessment.assessment.penilaian_pengetahuan.instrumen.map(
                              (instrumen, index) => (
                                <li key={index} className="text-gray-700">
                                  {instrumen}
                                </li>
                              ),
                            )}
                          </ol>
                        </div>

                        <div>
                          <h6 className="font-medium text-gray-700 mb-1">Kunci Jawaban:</h6>
                          <ol className="list-decimal pl-5 space-y-1">
                            {rpp.materi_dan_assessment.assessment.penilaian_pengetahuan.kunci_jawaban.map(
                              (jawaban, index) => (
                                <li key={index} className="text-gray-700">
                                  {jawaban}
                                </li>
                              ),
                            )}
                          </ol>
                        </div>

                        <p className="text-gray-700">
                          <span className="font-medium">Pedoman Penskoran:</span>{" "}
                          {rpp.materi_dan_assessment.assessment.penilaian_pengetahuan.pedoman_penskoran}
                        </p>
                      </div>

                      {/* Penilaian Keterampilan Mengucapkan */}
                      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                        <h5 className="font-medium text-gray-700">Penilaian Keterampilan Mengucapkan</h5>

                        <p className="text-gray-700">
                          <span className="font-medium">Teknik:</span>{" "}
                          {rpp.materi_dan_assessment.assessment.penilaian_keterampilan_mengucapkan.teknik}
                        </p>

                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">Aspek Penilaian:</h6>
                          {rpp.materi_dan_assessment.assessment.penilaian_keterampilan_mengucapkan.aspek_penilaian.map(
                            (aspek, aspekIndex) => (
                              <div key={aspekIndex} className="mb-4">
                                <p className="font-medium text-gray-700 mb-1">{aspek.nama_aspek}:</p>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full bg-white rounded-xl overflow-hidden">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Level
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Skor
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {aspek.deskripsi.map((desc, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                          <td className="px-4 py-2 text-sm text-gray-700">{desc.level}</td>
                                          <td className="px-4 py-2 text-sm text-gray-700">{desc.skor}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ),
                          )}
                        </div>

                        <p className="text-gray-700">
                          <span className="font-medium">Penentuan Nilai:</span>{" "}
                          {rpp.materi_dan_assessment.assessment.penilaian_keterampilan_mengucapkan.penentuan_nilai}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Instrumen:</span>{" "}
                          {rpp.materi_dan_assessment.assessment.penilaian_keterampilan_mengucapkan.instrumen}
                        </p>
                      </div>

                      {/* Penilaian Keterampilan Menulis */}
                      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                        <h5 className="font-medium text-gray-700">Penilaian Keterampilan Menulis</h5>

                        <p className="text-gray-700">
                          <span className="font-medium">Teknik:</span>{" "}
                          {rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.teknik}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Instrumen:</span>{" "}
                          {rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.instrumen}
                        </p>

                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">Rubrik:</h6>

                          <div className="mb-3">
                            <p className="font-medium text-gray-700 mb-1">Kriteria 1:</p>
                            <div className="pl-4 space-y-1">
                              <p className="text-gray-700">
                                <span className="font-medium">Sangat Baik:</span>{" "}
                                {
                                  rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.rubrik.kriteria_1
                                    .sangat_baik
                                }
                              </p>
                              <p className="text-gray-700">
                                <span className="font-medium">Baik:</span>{" "}
                                {
                                  rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.rubrik.kriteria_1
                                    .baik
                                }
                              </p>
                              <p className="text-gray-700">
                                <span className="font-medium">Cukup:</span>{" "}
                                {
                                  rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.rubrik.kriteria_1
                                    .cukup
                                }
                              </p>
                              <p className="text-gray-700">
                                <span className="font-medium">Perlu Bimbingan:</span>{" "}
                                {
                                  rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.rubrik.kriteria_1
                                    .perlu_bimbingan
                                }
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="font-medium text-gray-700 mb-1">Kriteria 2:</p>
                            <div className="pl-4 space-y-1">
                              <p className="text-gray-700">
                                <span className="font-medium">Sangat Baik:</span>{" "}
                                {
                                  rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.rubrik.kriteria_2
                                    .sangat_baik
                                }
                              </p>
                              <p className="text-gray-700">
                                <span className="font-medium">Baik:</span>{" "}
                                {
                                  rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.rubrik.kriteria_2
                                    .baik
                                }
                              </p>
                              <p className="text-gray-700">
                                <span className="font-medium">Cukup:</span>{" "}
                                {
                                  rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.rubrik.kriteria_2
                                    .cukup
                                }
                              </p>
                              <p className="text-gray-700">
                                <span className="font-medium">Perlu Bimbingan:</span>{" "}
                                {
                                  rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.rubrik.kriteria_2
                                    .perlu_bimbingan
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700">
                          <span className="font-medium">Pedoman Penskoran:</span>{" "}
                          {rpp.materi_dan_assessment.assessment.penilaian_keterampilan_menulis.pedoman_penskoran}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Tambahkan tombol di bagian bawah */}
      <div className="flex justify-center mt-8">
        <motion.button
          onClick={onGenerateKisiKisi}
          className="bg-gradient-to-r from-[#FFEB00] to-amber-400 text-gray-800 px-6 py-3 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Grid3X3 className="h-5 w-5" />
          <span className="font-medium">Lanjut ke Pembuatan Kisi-Kisi</span>
        </motion.button>
      </div>
    </div>
  )
}

