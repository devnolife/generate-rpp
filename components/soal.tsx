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
  School,
  Clock,
  Check,
  X,
  FileQuestion,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Definisikan tipe data untuk Soal
export interface SoalData {
  questions: {
    soal_bahasa_inggris: {
      judul: string
      kelas: string
      identitas: {
        nama_sekolah: string
        mata_pelajaran: string
        alokasi_waktu: string
        petunjuk: string
      }
      pilihan_ganda: Array<{
        nomor: number
        paragraf: string
        pertanyaan: string
        pilihan: {
          A: string
          B: string
          C: string
          D: string
        }
        kunci_jawaban: string
      }>
      menjodohkan: {
        petunjuk: string
        soal: Array<{
          nomor: number
          kolom_a: string
          kolom_b: string
        }>
      }
      benar_salah: Array<{
        nomor: number
        terkait_paragraf: number
        pernyataan: string
        kunci_jawaban: boolean
      }>
      essay: Array<{
        nomor: number
        terkait_paragraf: number
        pertanyaan: string
        panduan_jawaban: string
      }>
    }
  }
}

interface SoalProps {
  data: SoalData | null
}

export function Soal({ data }: SoalProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    identitas: true,
    pilihan_ganda: true,
    menjodohkan: true,
    benar_salah: true,
    essay: true,
  })
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string>("semua")
  const [showAnswers, setShowAnswers] = useState(false)

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
    setActiveTab("semua")

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
        const soal = data?.questions.soal_bahasa_inggris
        const fileName = `Soal_${soal?.identitas.mata_pelajaran}_${soal?.kelas.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
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
          title: `Soal ${data?.questions.soal_bahasa_inggris.identitas.mata_pelajaran}`,
          text: `Soal ${data?.questions.soal_bahasa_inggris.identitas.mata_pelajaran} untuk ${data?.questions.soal_bahasa_inggris.kelas}`,
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
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <FileQuestion className="h-8 w-8 text-indigo-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Soal</h3>
        <p className="text-gray-500 max-w-md">
          Soal yang telah Anda generate akan muncul di sini. Buat RPP terlebih dahulu untuk melihat hasilnya.
        </p>
      </div>
    )
  }

  const soal = data.questions.soal_bahasa_inggris

  // Filter soal berdasarkan jenis
  const filterSoal = (jenis: string) => {
    if (jenis === "semua") {
      return {
        pilihan_ganda: soal.pilihan_ganda,
        menjodohkan: soal.menjodohkan,
        benar_salah: soal.benar_salah,
        essay: soal.essay,
      }
    } else if (jenis === "pilihan_ganda") {
      return {
        pilihan_ganda: soal.pilihan_ganda,
        menjodohkan: { petunjuk: "", soal: [] },
        benar_salah: [],
        essay: [],
      }
    } else if (jenis === "menjodohkan") {
      return {
        pilihan_ganda: [],
        menjodohkan: soal.menjodohkan,
        benar_salah: [],
        essay: [],
      }
    } else if (jenis === "benar_salah") {
      return {
        pilihan_ganda: [],
        menjodohkan: { petunjuk: "", soal: [] },
        benar_salah: soal.benar_salah,
        essay: [],
      }
    } else if (jenis === "essay") {
      return {
        pilihan_ganda: [],
        menjodohkan: { petunjuk: "", soal: [] },
        benar_salah: [],
        essay: soal.essay,
      }
    }

    return {
      pilihan_ganda: soal.pilihan_ganda,
      menjodohkan: soal.menjodohkan,
      benar_salah: soal.benar_salah,
      essay: soal.essay,
    }
  }

  const filteredSoal = filterSoal(activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileQuestion className="h-6 w-6 text-[#4379F2]" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{soal.judul}</h2>
              <p className="text-sm text-gray-500">
                {soal.kelas} - {soal.identitas.mata_pelajaran}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-100 gap-2"
              onClick={() => setShowAnswers(!showAnswers)}
            >
              {showAnswers ? (
                <>
                  <HelpCircle className="h-4 w-4" />
                  <span>Sembunyikan Jawaban</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Tampilkan Jawaban</span>
                </>
              )}
            </Button>
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
              className="bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-400 hover:to-indigo-500 text-white gap-2"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4" />
              <span>Unduh PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Jenis Soal */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50">
        <Tabs defaultValue="semua" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-indigo-50/50 p-1 h-auto flex-wrap w-full justify-start">
            <TabsTrigger
              value="semua"
              className="px-4 py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
            >
              Semua Soal
            </TabsTrigger>
            <TabsTrigger
              value="pilihan_ganda"
              className="px-4 py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
            >
              Pilihan Ganda
            </TabsTrigger>
            <TabsTrigger
              value="menjodohkan"
              className="px-4 py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
            >
              Menjodohkan
            </TabsTrigger>
            <TabsTrigger
              value="benar_salah"
              className="px-4 py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
            >
              Benar/Salah
            </TabsTrigger>
            <TabsTrigger
              value="essay"
              className="px-4 py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
            >
              Essay
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
          <div
            className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("identitas")}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <h3 className="font-semibold text-gray-800">Informasi Soal</h3>
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
                      <School className="h-5 w-5 text-[#4379F2]" />
                      <div>
                        <p className="text-sm text-gray-500">Nama Sekolah</p>
                        <p className="font-medium text-gray-800">{soal.identitas.nama_sekolah}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <BookOpen className="h-5 w-5 text-[#FFEB00]" />
                      <div>
                        <p className="text-sm text-gray-500">Mata Pelajaran</p>
                        <p className="font-medium text-gray-800">{soal.identitas.mata_pelajaran}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-[#6EC207]" />
                      <div>
                        <p className="text-sm text-gray-500">Alokasi Waktu</p>
                        <p className="font-medium text-gray-800">{soal.identitas.alokasi_waktu}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                  <h4 className="font-medium text-indigo-700 mb-2">Petunjuk:</h4>
                  <p className="text-gray-700">{soal.identitas.petunjuk}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pilihan Ganda */}
        {filteredSoal.pilihan_ganda.length > 0 && (
          <motion.div
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div
              className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("pilihan_ganda")}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-[#4379F2] font-semibold text-sm">
                  A
                </div>
                <h3 className="font-semibold text-gray-800">Pilihan Ganda</h3>
                <Badge variant="outline" className="ml-2 bg-indigo-50 text-indigo-600 border-indigo-200">
                  {filteredSoal.pilihan_ganda.length} Soal
                </Badge>
              </div>
              {expandedSections.pilihan_ganda ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            <AnimatePresence>
              {expandedSections.pilihan_ganda && (
                <motion.div
                  className="p-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-8">
                    {filteredSoal.pilihan_ganda.map((item) => (
                      <div key={item.nomor} className="border border-gray-100 rounded-xl p-5 shadow-sm">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full text-[#4379F2] font-semibold text-sm flex-shrink-0 mt-0.5">
                            {item.nomor}
                          </div>
                          <div className="space-y-4 w-full">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-gray-700">{item.paragraf}</p>
                            </div>
                            <p className="font-medium text-gray-800">{item.pertanyaan}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.entries(item.pilihan).map(([key, value]) => (
                                <div
                                  key={key}
                                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                                    showAnswers && key === item.kunci_jawaban
                                      ? "border-green-200 bg-green-50"
                                      : "border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  <div
                                    className={`flex items-center justify-center w-6 h-6 rounded-full ${
                                      showAnswers && key === item.kunci_jawaban
                                        ? "bg-green-100 text-green-600"
                                        : "bg-gray-100 text-gray-600"
                                    } font-semibold text-sm`}
                                  >
                                    {key}
                                  </div>
                                  <p className="text-gray-700">{value}</p>
                                  {showAnswers && key === item.kunci_jawaban && (
                                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {showAnswers && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <p className="text-green-700 font-medium">Jawaban: {item.kunci_jawaban}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Menjodohkan */}
        {filteredSoal.menjodohkan.soal.length > 0 && (
          <motion.div
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div
              className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("menjodohkan")}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-[#FFEB00] font-semibold text-sm">
                  B
                </div>
                <h3 className="font-semibold text-gray-800">Menjodohkan</h3>
                <Badge variant="outline" className="ml-2 bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200">
                  {filteredSoal.menjodohkan.soal.length} Soal
                </Badge>
              </div>
              {expandedSections.menjodohkan ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            <AnimatePresence>
              {expandedSections.menjodohkan && (
                <motion.div
                  className="p-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <div className="p-4 bg-fuchsia-50 rounded-lg">
                      <p className="text-gray-700">{filteredSoal.menjodohkan.petunjuk}</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-xl overflow-hidden border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                              No
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kolom A
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kolom B
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredSoal.menjodohkan.soal.map((item) => (
                            <tr key={item.nomor} className={item.nomor % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 text-center">{item.nomor}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{item.kolom_a}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{item.kolom_b}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Benar/Salah */}
        {filteredSoal.benar_salah.length > 0 && (
          <motion.div
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div
              className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("benar_salah")}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-[#6EC207] font-semibold text-sm">
                  C
                </div>
                <h3 className="font-semibold text-gray-800">Benar/Salah</h3>
                <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-600 border-amber-200">
                  {filteredSoal.benar_salah.length} Soal
                </Badge>
              </div>
              {expandedSections.benar_salah ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            <AnimatePresence>
              {expandedSections.benar_salah && (
                <motion.div
                  className="p-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      {filteredSoal.benar_salah.map((item) => (
                        <div key={item.nomor} className="border border-gray-100 rounded-xl p-5 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full text-[#6EC207] font-semibold text-sm flex-shrink-0 mt-0.5">
                              {item.nomor}
                            </div>
                            <div className="space-y-3 w-full">
                              <p className="text-gray-800 font-medium">
                                Berdasarkan paragraf {item.terkait_paragraf}, apakah pernyataan berikut benar atau
                                salah?
                              </p>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">{item.pernyataan}</p>
                              </div>

                              <div className="flex flex-wrap gap-3 mt-3">
                                <div
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                    showAnswers && item.kunci_jawaban === true
                                      ? "border-green-200 bg-green-50"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <div
                                    className={`flex items-center justify-center w-5 h-5 rounded-full ${
                                      showAnswers && item.kunci_jawaban === true ? "bg-green-100" : "bg-gray-100"
                                    }`}
                                  >
                                    <Check
                                      className={`h-3 w-3 ${
                                        showAnswers && item.kunci_jawaban === true ? "text-green-600" : "text-gray-500"
                                      }`}
                                    />
                                  </div>
                                  <span className="text-gray-700">Benar</span>
                                </div>

                                <div
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                                    showAnswers && item.kunci_jawaban === false
                                      ? "border-green-200 bg-green-50"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <div
                                    className={`flex items-center justify-center w-5 h-5 rounded-full ${
                                      showAnswers && item.kunci_jawaban === false ? "bg-green-100" : "bg-gray-100"
                                    }`}
                                  >
                                    <X
                                      className={`h-3 w-3 ${
                                        showAnswers && item.kunci_jawaban === false ? "text-green-600" : "text-gray-500"
                                      }`}
                                    />
                                  </div>
                                  <span className="text-gray-700">Salah</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {showAnswers && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2">
                              {item.kunci_jawaban ? (
                                <>
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  <p className="text-green-700 font-medium">Jawaban: Benar</p>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-5 w-5 text-green-500" />
                                  <p className="text-green-700 font-medium">Jawaban: Salah</p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Essay */}
        {filteredSoal.essay.length > 0 && (
          <motion.div
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div
              className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("essay")}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-[#117554] font-semibold text-sm">
                  D
                </div>
                <h3 className="font-semibold text-gray-800">Essay</h3>
                <Badge variant="outline" className="ml-2 bg-indigo-50 text-indigo-600 border-indigo-200">
                  {filteredSoal.essay.length} Soal
                </Badge>
              </div>
              {expandedSections.essay ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>

            <AnimatePresence>
              {expandedSections.essay && (
                <motion.div
                  className="p-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    {filteredSoal.essay.map((item) => (
                      <div key={item.nomor} className="border border-gray-100 rounded-xl p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full text-[#117554] font-semibold text-sm flex-shrink-0 mt-0.5">
                            {item.nomor}
                          </div>
                          <div className="space-y-3 w-full">
                            <p className="text-gray-800 font-medium">Berdasarkan paragraf {item.terkait_paragraf}:</p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-gray-700">{item.pertanyaan}</p>
                            </div>

                            {!showAnswers && (
                              <div className="mt-3 border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center min-h-[100px]">
                                <div className="text-gray-400 flex items-center gap-2">
                                  <Pencil className="h-4 w-4" />
                                  <span>Ruang untuk jawaban</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {showAnswers && (
                          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                            <h4 className="font-medium text-indigo-700 mb-2 flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5" />
                              Panduan Jawaban:
                            </h4>
                            <p className="text-gray-700">{item.panduan_jawaban}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

