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

export interface RPPData {
  status?: string;
  message?: string;
  rpp: {
    "IDENTITAS RPP": {
      "Nama Penyusun": string;
      "Institusi": string;
      "Tahun Pembuatan": string;
      "Mata Pelajaran": string;
      "Jenjang": string;
      "Kelas": string;
      "Alokasi Waktu": string;
    };
    "KOMPONEN PEMBELAJARAN": {
      "Capaian Pembelajaran (CP)": string;
      "Domain Konten/Elemen": string;
      "Tujuan Pembelajaran": string[];
      "Konten Utama": string;
      "Prasyarat Pengetahuan": string;
      "Pemahaman Bermakna": string;
      "Profil Pelajar Pancasila": Array<{
        "Dimensi": string;
        "Penjelasan": string;
      }>;
      "Sarana Prasarana": string[];
      "Target Peserta Didik": string;
      "Jumlah Peserta Didik": string;
      "Model Pembelajaran": string;
      "Alasan Pemilihan Model": string;
      "Sumber Belajar": Array<{
        "Penulis": string;
        "Tahun": number;
        "Judul": string;
        "Penerbit": string;
      }>;
    };
    "KEGIATAN PEMBELAJARAN": {
      "Kegiatan Awal (15 Menit)": Array<{
        "Aktivitas": string;
        "Waktu": string;
        "Deskripsi": string;
        "Pertanyaan"?: string;
        "Contoh Kontekstual"?: string;
        "Pertanyaan Refleksi"?: string;
      }>;
      "Kegiatan Inti (90 Menit)": Array<{
        "Aktivitas": string;
        "Waktu": string;
        "Deskripsi Guru": string;
        "Deskripsi Siswa": string;
        "Pengelompokan"?: string;
        "Pertanyaan"?: string;
        "Pertanyaan HOTS"?: string;
        "Strategi Diferensiasi"?: string;
      }>;
      "Kegiatan Penutup (15 Menit)": Array<{
        "Aktivitas": string;
        "Waktu": string;
        "Deskripsi": string;
        "Pertanyaan Refleksi"?: string;
      }>;
    };
    "MATERI DAN ASSESSMENT": {
      "Bahan Ajar": {
        "Teori": string;
        "Contoh Kontekstual": string;
      };
      "Remedial": {
        "Aktivitas": string;
        "Strategi Intervensi": string;
        "Instrumen Penilaian": string;
      };
      "Pengayaan": {
        "Aktivitas": string[];
        "Produk/Output": string;
      };
      "Assessment": {
        "Instrumen": Array<{
          "Jenis": string;
          "Soal": string[];
        }>;
        "Rubrik Penilaian": {
          "Aspek": string[];
          "Kriteria": string[];
          "Bobot": Record<string, number>;
        };
        "Pedoman Penskoran": string;
        "Interpretasi Hasil": string;
        "Strategi Umpan Balik": string;
      };
    };
  };
  created_at?: string;
}

interface HasilRPPProps {
  data: RPPData | null
  onGenerateKisiKisi: () => void
}

// Tambahkan prop onGenerateKisiKisi
export function HasilRPP({ data, onGenerateKisiKisi }: HasilRPPProps) {
  console.log("Data hasil RPP", data);

  const [expandedSections, setExpandedSections] = useState({
    identitas: true,
    komponenPembelajaran: true,
    kegiatanPembelajaran: true,
    penilaian: true,
    materiAssessment: true
  })
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section as keyof typeof expandedSections],
    })
  }

  const handlePrint = () => {
    // Buka semua bagian sebelum mencetak
    const allExpanded = Object.keys(expandedSections).reduce(
      (acc, key) => {
        acc[key] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    setExpandedSections({
      identitas: true,
      komponenPembelajaran: true,
      kegiatanPembelajaran: true,
      penilaian: true,
      materiAssessment: true
    })

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

    setExpandedSections({
      identitas: true,
      komponenPembelajaran: true,
      kegiatanPembelajaran: true,
      penilaian: true,
      materiAssessment: true
    })

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
        const fileName = `RPP_${data?.rpp["IDENTITAS RPP"]["Mata Pelajaran"]?.split(" ")[0] || 'Dokumen'}_${data?.rpp["IDENTITAS RPP"]["Kelas"] || 'Kelas'}_${new Date().toISOString().split("T")[0]}.pdf`
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
          title: `RPP ${data?.rpp["IDENTITAS RPP"]["Mata Pelajaran"]?.split(" ")[0] || 'Dokumen'}`,
          text: `RPP ${data?.rpp["IDENTITAS RPP"]["Mata Pelajaran"] || 'Dokumen'} untuk Kelas ${data?.rpp["IDENTITAS RPP"]["Kelas"] || 'Kelas'}`,
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

  // Make sure data and data.rpp are not null before proceeding
  if (!data.rpp) {
    return (
      <div className="p-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary-lightest rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-primary-light" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Data RPP Tidak Lengkap</h3>
        <p className="text-gray-500 max-w-md">
          Format data RPP tidak valid atau tidak lengkap. Silakan coba generate ulang.
        </p>
      </div>
    )
  }

  const rpp = data.rpp["IDENTITAS RPP"]

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
              <h2 className="text-xl font-bold text-gray-800">RPP {rpp["Mata Pelajaran"]?.split(" ")[0] || 'Dokumen'}</h2>
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
                        <p className="font-medium text-gray-800">{rpp["Nama Penyusun"]}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <School className="h-5 w-5 text-[#FFEB00]" />
                      <div>
                        <p className="text-sm text-gray-500">Institusi</p>
                        <p className="font-medium text-gray-800">{rpp["Institusi"]}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Calendar className="h-5 w-5 text-[#6EC207]" />
                      <div>
                        <p className="text-sm text-gray-500">Tahun Pembuatan</p>
                        <p className="font-medium text-gray-800">{rpp["Tahun Pembuatan"]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <BookOpen className="h-5 w-5 text-[#117554]" />
                      <div>
                        <p className="text-sm text-gray-500">Mata Pelajaran</p>
                        <p className="font-medium text-gray-800">{rpp["Mata Pelajaran"]}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Layers className="h-5 w-5 text-[#4379F2]" />
                      <div>
                        <p className="text-sm text-gray-500">Jenjang & Kelas</p>
                        <p className="font-medium text-gray-800">
                          {rpp["Jenjang"]} - Kelas {rpp["Kelas"]}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-[#FFEB00]" />
                      <div>
                        <p className="text-sm text-gray-500">Alokasi Waktu</p>
                        <p className="font-medium text-gray-800">{rpp["Alokasi Waktu"]}</p>
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
                      <p className="text-gray-700">{data.rpp["KOMPONEN PEMBELAJARAN"]?.["Capaian Pembelajaran (CP)"]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Domain Konten</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{data.rpp["KOMPONEN PEMBELAJARAN"]?.["Domain Konten/Elemen"]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Tujuan Pembelajaran</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <ul className="list-disc pl-5 space-y-2">
                        {data.rpp["KOMPONEN PEMBELAJARAN"]["Tujuan Pembelajaran"]?.map((tujuan, index) => (
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
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{data.rpp["KOMPONEN PEMBELAJARAN"]?.["Konten Utama"]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Prasyarat Pengetahuan</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{data.rpp["KOMPONEN PEMBELAJARAN"]?.["Prasyarat Pengetahuan"]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Pemahaman Bermakna</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{data.rpp["KOMPONEN PEMBELAJARAN"]?.["Pemahaman Bermakna"]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Profil Pelajar Pancasila</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      {data.rpp["KOMPONEN PEMBELAJARAN"]["Profil Pelajar Pancasila"]?.map((profil, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-gray-100">
                          <h5 className="font-medium text-gray-800 mb-1">Dimensi: {profil.Dimensi}</h5>
                          <p className="text-gray-700">{profil.Penjelasan}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Sarana Prasarana</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <ul className="list-disc pl-5 space-y-1">
                        {data.rpp["KOMPONEN PEMBELAJARAN"]["Sarana Prasarana"]?.map((sarana, index) => (
                          <li key={index} className="text-gray-700">{sarana}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <h4 className="font-medium text-gray-800">Target Peserta Didik</h4>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-700">{data.rpp["KOMPONEN PEMBELAJARAN"]?.["Target Peserta Didik"]}</p>
                        <p className="text-gray-700 mt-2">
                          Jumlah: {data.rpp["KOMPONEN PEMBELAJARAN"]?.["Jumlah Peserta Didik"]} siswa
                        </p>
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
                          {data.rpp["KOMPONEN PEMBELAJARAN"]?.["Model Pembelajaran"]}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Alasan Pemilihan:</span>{" "}
                          {data.rpp["KOMPONEN PEMBELAJARAN"]?.["Alasan Pemilihan Model"]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Sumber Belajar</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <ul className="space-y-2">
                        {data.rpp["KOMPONEN PEMBELAJARAN"]["Sumber Belajar"]?.map((sumber, index) => (
                          <li key={index} className="text-gray-700">
                            {sumber.Penulis}. ({sumber.Tahun}). <em>{sumber.Judul}</em>. {sumber.Penerbit}.
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
                        15 Menit
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
                              Deskripsi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {data.rpp["KEGIATAN PEMBELAJARAN"]["Kegiatan Awal (15 Menit)"]?.map((kegiatan, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Aktivitas}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Waktu}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Deskripsi}</td>
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
                        90 Menit
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
                              Deskripsi Guru
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Deskripsi Siswa
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {data.rpp["KEGIATAN PEMBELAJARAN"]["Kegiatan Inti (90 Menit)"]?.map((kegiatan, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Aktivitas}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Waktu}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{kegiatan["Deskripsi Guru"]}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{kegiatan["Deskripsi Siswa"]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                        15 Menit
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
                              Deskripsi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {data.rpp["KEGIATAN PEMBELAJARAN"]["Kegiatan Penutup (15 Menit)"]?.map((kegiatan, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Aktivitas}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Waktu}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Deskripsi}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Materi dan Assessment */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6"
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
                        <p className="text-gray-700">{data.rpp["MATERI DAN ASSESSMENT"]?.["Bahan Ajar"]?.["Teori"]}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Contoh Kontekstual:</h5>
                        <p className="text-gray-700">{data.rpp["MATERI DAN ASSESSMENT"]?.["Bahan Ajar"]?.["Contoh Kontekstual"]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Remedial */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Remedial</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Aktivitas:</h5>
                        <p className="text-gray-700">{data.rpp["MATERI DAN ASSESSMENT"]?.["Remedial"]?.["Aktivitas"]}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Strategi Intervensi:</h5>
                        <p className="text-gray-700">{data.rpp["MATERI DAN ASSESSMENT"]?.["Remedial"]?.["Strategi Intervensi"]}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Instrumen Penilaian:</h5>
                        <p className="text-gray-700">{data.rpp["MATERI DAN ASSESSMENT"]?.["Remedial"]?.["Instrumen Penilaian"]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pengayaan */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Pengayaan</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Aktivitas:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {data.rpp["MATERI DAN ASSESSMENT"]["Pengayaan"]["Aktivitas"]?.map((aktivitas, index) => (
                            <li key={index} className="text-gray-700">{aktivitas}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Produk/Output:</h5>
                        <p className="text-gray-700">{data.rpp["MATERI DAN ASSESSMENT"]["Pengayaan"]["Produk/Output"]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Assessment</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Instrumen:</h5>
                        {data.rpp["MATERI DAN ASSESSMENT"]["Assessment"]["Instrumen"]?.map((instrumen, index) => (
                          <div key={index} className="mb-4">
                            <p className="font-medium text-gray-700">{instrumen.Jenis}:</p>
                            <ul className="list-decimal pl-5 space-y-1 mt-2">
                              {instrumen.Soal?.map((soal, soalIndex) => (
                                <li key={soalIndex} className="text-gray-700">{soal}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Rubrik Penilaian:</h5>
                        <div className="space-y-2">
                          <p className="font-medium text-gray-700">Aspek:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {data.rpp["MATERI DAN ASSESSMENT"]["Assessment"]["Rubrik Penilaian"]?.["Aspek"]?.map((aspek, index) => (
                              <li key={index} className="text-gray-700">{aspek}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Pedoman Penskoran:</h5>
                        <p className="text-gray-700">{data.rpp["MATERI DAN ASSESSMENT"]?.["Assessment"]?.["Pedoman Penskoran"]}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Interpretasi Hasil:</h5>
                        <p className="text-gray-700">{data.rpp["MATERI DAN ASSESSMENT"]?.["Assessment"]?.["Interpretasi Hasil"]}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Strategi Umpan Balik:</h5>
                        <p className="text-gray-700">{data.rpp["MATERI DAN ASSESSMENT"]?.["Assessment"]?.["Strategi Umpan Balik"]}</p>
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

