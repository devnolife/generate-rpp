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
  Calendar,
  Clock,
  User,
  FileSpreadsheet,
  Check,
  Filter,
  BookCopy,
  FileQuestion,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Definisikan tipe data untuk Kisi-Kisi
export interface KisiKisiData {
  kisi_kisi: {
    kisi_kisi: {
      informasi: {
        nama_sekolah: string
        mata_pelajaran: string
        kelas_semester: string
        kurikulum: string
        alokasi_waktu: string
        jumlah_bentuk_soal: string
        penulis: string
        tahun_pelajaran: string
        tempat_tanggal: string
      }
      tabel_kisi_kisi: Array<{
        nomor: number
        tujuan_pembelajaran: string
        materi: string
        indikator_soal: string
        level_kognitif: string
        bentuk_soal: string
        nomor_soal: string
      }>
    }
  }
}

interface KisiKisiProps {
  data: KisiKisiData | null
  onGenerateSoal: () => void
}

// Tambahkan prop onGenerateSoal
export function KisiKisi({ data, onGenerateSoal }: KisiKisiProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    informasi: true,
    tabelKisiKisi: true,
  })
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string>("semua")
  const [filterLevelKognitif, setFilterLevelKognitif] = useState<string>("semua")

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
    setFilterLevelKognitif("semua")

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
        const kisiKisi = data?.kisi_kisi.kisi_kisi
        const fileName = `Kisi_Kisi_${kisiKisi?.informasi.mata_pelajaran}_${kisiKisi?.informasi.kelas_semester}_${new Date().toISOString().split("T")[0]}.pdf`
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
          title: `Kisi-Kisi ${data?.kisi_kisi.kisi_kisi.informasi.mata_pelajaran}`,
          text: `Kisi-Kisi ${data?.kisi_kisi.kisi_kisi.informasi.mata_pelajaran} untuk Kelas ${data?.kisi_kisi.kisi_kisi.informasi.kelas_semester}`,
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
          <FileSpreadsheet className="h-8 w-8 text-primary-light" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Kisi-Kisi</h3>
        <p className="text-gray-500 max-w-md">
          Kisi-kisi yang telah Anda generate akan muncul di sini. Buat RPP terlebih dahulu untuk melihat hasilnya.
        </p>
      </div>
    )
  }

  const kisiKisi = data.kisi_kisi.kisi_kisi

  // Mendapatkan daftar unik bentuk soal dan level kognitif untuk filter
  const uniqueBentukSoal = Array.from(new Set(kisiKisi.tabel_kisi_kisi.map((item) => item.bentuk_soal)))
  const uniqueLevelKognitif = Array.from(new Set(kisiKisi.tabel_kisi_kisi.map((item) => item.level_kognitif)))

  // Filter data tabel berdasarkan bentuk soal dan level kognitif
  const filteredData = kisiKisi.tabel_kisi_kisi.filter((item) => {
    const bentukSoalMatch = activeTab === "semua" || item.bentuk_soal === activeTab
    const levelKognitifMatch = filterLevelKognitif === "semua" || item.level_kognitif === filterLevelKognitif
    return bentukSoalMatch && levelKognitifMatch
  })

  // Mendapatkan statistik bentuk soal
  const bentukSoalStats = kisiKisi.tabel_kisi_kisi.reduce(
    (acc, item) => {
      acc[item.bentuk_soal] = (acc[item.bentuk_soal] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Tambahkan tombol di bagian bawah komponen
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-6 w-6 text-[#FFEB00]" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Kisi-Kisi {kisiKisi.informasi.mata_pelajaran}</h2>
              <p className="text-sm text-gray-500">
                Kelas {kisiKisi.informasi.kelas_semester} - {kisiKisi.informasi.kurikulum}
              </p>
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
        {/* Informasi */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Informasi */}
          <div
            className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("informasi")}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <h3 className="font-semibold text-gray-800">Informasi Kisi-Kisi</h3>
            </div>
            {expandedSections.informasi ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          <AnimatePresence>
            {expandedSections.informasi && (
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
                        <p className="font-medium text-gray-800">{kisiKisi.informasi.nama_sekolah}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <BookOpen className="h-5 w-5 text-[#FFEB00]" />
                      <div>
                        <p className="text-sm text-gray-500">Mata Pelajaran</p>
                        <p className="font-medium text-gray-800">{kisiKisi.informasi.mata_pelajaran}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <BookCopy className="h-5 w-5 text-[#6EC207]" />
                      <div>
                        <p className="text-sm text-gray-500">Kurikulum</p>
                        <p className="font-medium text-gray-800">{kisiKisi.informasi.kurikulum}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <User className="h-5 w-5 text-[#117554]" />
                      <div>
                        <p className="text-sm text-gray-500">Penulis</p>
                        <p className="font-medium text-gray-800">{kisiKisi.informasi.penulis}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Calendar className="h-5 w-5 text-[#4379F2]" />
                      <div>
                        <p className="text-sm text-gray-500">Kelas/Semester</p>
                        <p className="font-medium text-gray-800">Kelas {kisiKisi.informasi.kelas_semester}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-[#FFEB00]" />
                      <div>
                        <p className="text-sm text-gray-500">Alokasi Waktu</p>
                        <p className="font-medium text-gray-800">{kisiKisi.informasi.alokasi_waktu}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <FileText className="h-5 w-5 text-[#6EC207]" />
                      <div>
                        <p className="text-sm text-gray-500">Jumlah & Bentuk Soal</p>
                        <p className="font-medium text-gray-800">{kisiKisi.informasi.jumlah_bentuk_soal}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Calendar className="h-5 w-5 text-[#117554]" />
                      <div>
                        <p className="text-sm text-gray-500">Tahun Pelajaran</p>
                        <p className="font-medium text-gray-800">{kisiKisi.informasi.tahun_pelajaran}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <Calendar className="h-5 w-5 text-[#117554]" />
                    <div>
                      <p className="text-sm text-gray-500">Tempat dan Tanggal</p>
                      <p className="font-medium text-gray-800">{kisiKisi.informasi.tempat_tanggal}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Statistik Bentuk Soal */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-gray-800">Statistik Bentuk Soal</h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {Object.entries(bentukSoalStats).map(([bentukSoal, count]) => (
                <div key={bentukSoal} className="bg-indigo-50/50 px-4 py-2 rounded-xl flex flex-col items-center">
                  <span className="text-2xl font-bold text-indigo-500">{count}</span>
                  <span className="text-sm text-gray-600">{bentukSoal}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabel Kisi-Kisi */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div
            className="p-4 bg-gradient-to-r from-primary-lightest to-white flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("tabelKisiKisi")}
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-gray-800">Tabel Kisi-Kisi</h3>
            </div>
            {expandedSections.tabelKisiKisi ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          <AnimatePresence>
            {expandedSections.tabelKisiKisi && (
              <motion.div
                className="p-6"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Filter */}
                <div className="mb-6">
                  <Tabs defaultValue="semua" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <TabsList className="bg-indigo-50/50 p-1 h-auto flex-wrap">
                        <TabsTrigger
                          value="semua"
                          className="px-4 py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                        >
                          Semua Soal
                        </TabsTrigger>
                        {uniqueBentukSoal.map((bentuk) => (
                          <TabsTrigger
                            key={bentuk}
                            value={bentuk}
                            className="px-4 py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                          >
                            {bentuk}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <div className="flex-1 sm:max-w-xs space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                          <Filter className="h-4 w-4" />
                          Filter Level Kognitif
                        </label>
                        <Select value={filterLevelKognitif} onValueChange={setFilterLevelKognitif}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Level Kognitif" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="semua">Semua Level Kognitif</SelectItem>
                            {uniqueLevelKognitif.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Tabs>
                </div>

                {/* Tabel */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tujuan Pembelajaran
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Materi
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Indikator Soal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level Kognitif
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bentuk Soal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No. Soal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                          <tr key={item.nomor} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-3 text-sm text-gray-700">{item.nomor}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{item.tujuan_pembelajaran}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{item.materi}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{item.indikator_soal}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline" className="bg-indigo-50/50 text-indigo-500 border-indigo-200">
                                {item.level_kognitif}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge variant="outline" className="bg-fuchsia-50/50 text-fuchsia-500 border-fuchsia-200">
                                {item.bentuk_soal}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-center font-medium text-gray-700">
                              {item.nomor_soal}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                            Tidak ada data yang sesuai dengan filter yang dipilih
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Ringkasan */}
                <div className="mt-6 bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600">
                    Menampilkan {filteredData.length} dari {kisiKisi.tabel_kisi_kisi.length} kisi-kisi soal
                    {activeTab !== "semua" && ` dengan bentuk soal "${activeTab}"`}
                    {filterLevelKognitif !== "semua" && ` dan level kognitif "${filterLevelKognitif}"`}.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Tambahkan tombol di bagian bawah */}
      <div className="flex justify-center mt-8">
        <motion.button
          onClick={onGenerateSoal}
          className="bg-gradient-to-r from-[#4379F2] to-blue-400 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <FileQuestion className="h-5 w-5" />
          <span className="font-medium">Lanjut ke Pembuatan Soal</span>
        </motion.button>
      </div>
    </div>
  )
}

