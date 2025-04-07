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
  ClipboardCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { toast } from "@/components/ui/use-toast"

export interface RPPData {
  status?: string;
  message?: string;
  rpp: {
    "IDENTITAS RPP"?: {
      "Nama Penyusun": string;
      "Institusi": string;
      "Tahun Pembuatan": string;
      "Mata Pelajaran": string;
      "Jenjang": string;
      "Kelas": string;
      "Alokasi Waktu": string;
    };
    "IDENTITAS_RPP"?: {
      nama_penyusun: string;
      institusi: string;
      tahun_pembuatan: string;
      mata_pelajaran: string;
      jenjang: string;
      kelas: string;
      alokasi_waktu: string;
      tahapan?: string;
    };
    "KOMPONEN PEMBELAJARAN"?: {
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
    "KOMPONEN_PEMBELAJARAN"?: {
      capaian_pembelajaran: string;
      domain_konten_elemen: string[] | string;
      tujuan_pembelajaran: Array<{
        tujuan: string;
        abcd: string;
      }>;
      konten_utama: string;
      prasyarat_pengetahuan: string;
      pemahaman_bermakna: string;
      profil_pelajar_pancasila: Array<{
        dimensi: string;
        penjelasan: string;
      }>;
      sarana_prasarana: string[];
      target_peserta_didik: string;
      jumlah_peserta_didik: string;
      model_pembelajaran: string;
      sumber_belajar: string[] | Array<{
        penulis?: string;
        tahun?: number;
        judul?: string;
        penerbit?: string;
      }>;
    };
    "KEGIATAN PEMBELAJARAN"?: {
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
    "KEGIATAN_PEMBELAJARAN"?: {
      kegiatan_awal: {
        durasi: string;
        aktivitas: Array<{
          deskripsi: string;
          waktu: string;
          pertanyaan?: string[] | string;
        }>;
      };
      kegiatan_inti: {
        durasi: string;
        aktivitas: Array<{
          tahap: string;
          deskripsi_guru: string;
          deskripsi_siswa: string;
          waktu: string;
          pertanyaan?: string[] | string;
          pengelompokan?: string;
        }>;
      };
      kegiatan_penutup: {
        durasi: string;
        aktivitas: Array<{
          deskripsi: string;
          waktu: string;
          pertanyaan?: string[] | string;
        }>;
      };
    };
    "MATERI DAN ASSESSMENT"?: {
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
    "MATERI_DAN_ASSESSMENT"?: {
      bahan_ajar: {
        teori: string;
        materi_linguistik: {
          grammar: string;
          vocabulary: string[];
          contoh_kontekstual: string;
        };
        teks_dialog: string;
        materi_visual: string;
      };
      remedial: {
        aktivitas: string;
        strategi_intervensi: string;
        instrumen_penilaian: string;
      };
      pengayaan: {
        aktivitas: string[];
        produk_output: string;
      };
      assessment: {
        penilaian_pengetahuan: {
          teknik_penilaian: string;
          bentuk_instrumen: string;
          kisi_kisi: string;
          instrumen_penilaian: string[];
          rubrik_penilaian: {
            kriteria: string;
            skor: Record<string, string>;
            pedoman_penskoran: string;
          };
        };
        penilaian_keterampilan_mengucapkan?: any;
        penilaian_keterampilan_menulis?: any;
        strategi_umpan_balik: string;
      };
    };
  };
  created_at?: string;
}

interface HasilRPPProps {
  data: RPPData | null
  onGenerateKisiKisi: () => void
}


export function HasilRPP({ data, onGenerateKisiKisi }: HasilRPPProps) {


  const safeRender = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <span key={index}>
          {typeof item === 'object' ? JSON.stringify(item) : item}
          {index < value.length - 1 ? ', ' : ''}
        </span>
      ));
    }


    return JSON.stringify(value);
  };

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


    setTimeout(() => {
      window.print()
    }, 500)
  }


  const handleDownloadPDF = async () => {
    if (!contentRef.current) return

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


    setTimeout(async () => {
      try {
        toast({
          title: "Mempersiapkan PDF...",
          description: "Mohon tunggu sebentar",
        })

        const content = contentRef.current
        if (!content) return

        const canvas = await html2canvas(content, {
          scale: 1.5,
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


        const contentHeight = imgHeight * ratio
        let heightLeft = contentHeight - pdfHeight + imgY
        let position = pdfHeight

        while (heightLeft > 0) {
          pdf.addPage()
          pdf.addImage(imgData, "JPEG", imgX, -(position - imgY), imgWidth * ratio, imgHeight * ratio)
          heightLeft -= pdfHeight
          position += pdfHeight
        }


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


  const handleShare = async () => {
    setIsSharing(true)
    try {

      if (navigator.share) {
        await navigator.share({
          title: `RPP ${data?.rpp["IDENTITAS RPP"]["Mata Pelajaran"]?.split(" ")[0] || 'Dokumen'}`,
          text: `RPP ${data?.rpp["IDENTITAS RPP"]["Mata Pelajaran"] || 'Dokumen'} untuk Kelas ${data?.rpp["IDENTITAS RPP"]["Kelas"] || 'Kelas'}`,
          url: window.location.href,
        })
        setIsSharing(false)
      } else {

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


  const identitas = data.rpp["IDENTITAS RPP"] || data.rpp["IDENTITAS_RPP"] || {}
  const komponenPembelajaran = data.rpp["KOMPONEN PEMBELAJARAN"] || data.rpp["KOMPONEN_PEMBELAJARAN"] || {}
  const kegiatanPembelajaran = data.rpp["KEGIATAN PEMBELAJARAN"] || data.rpp["KEGIATAN_PEMBELAJARAN"] || {}
  const materiAssessment = data.rpp["MATERI DAN ASSESSMENT"] || data.rpp["MATERI_DAN_ASSESSMENT"] || {}

  const formatDate = () => {
    if (!data.created_at) return "Hari ini"
    const date = new Date(data.created_at)
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#6EC207]" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">RPP {identitas["Mata Pelajaran"] || identitas["mata_pelajaran"]?.split(" ")[0] || 'Dokumen'}</h2>
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
                        <p className="font-medium text-gray-800">{identitas["Nama Penyusun"] || identitas["nama_penyusun"]}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <School className="h-5 w-5 text-[#FFEB00]" />
                      <div>
                        <p className="text-sm text-gray-500">Institusi</p>
                        <p className="font-medium text-gray-800">{identitas["Institusi"] || identitas["institusi"]}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Calendar className="h-5 w-5 text-[#6EC207]" />
                      <div>
                        <p className="text-sm text-gray-500">Tahun Pembuatan</p>
                        <p className="font-medium text-gray-800">{identitas["Tahun Pembuatan"] || identitas["tahun_pembuatan"]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <BookOpen className="h-5 w-5 text-[#117554]" />
                      <div>
                        <p className="text-sm text-gray-500">Mata Pelajaran</p>
                        <p className="font-medium text-gray-800">{identitas["Mata Pelajaran"] || identitas["mata_pelajaran"]}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Layers className="h-5 w-5 text-[#4379F2]" />
                      <div>
                        <p className="text-sm text-gray-500">Jenjang & Kelas</p>
                        <p className="font-medium text-gray-800">
                          {identitas["Jenjang"] || identitas["jenjang"]} - Kelas {identitas["Kelas"] || identitas["kelas"]}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-[#FFEB00]" />
                      <div>
                        <p className="text-sm text-gray-500">Alokasi Waktu</p>
                        <p className="font-medium text-gray-800">{identitas["Alokasi Waktu"] || identitas["alokasi_waktu"]}</p>
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
                      <p className="text-gray-700">{komponenPembelajaran["Capaian Pembelajaran (CP)"] || komponenPembelajaran["capaian_pembelajaran"]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Domain Konten</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{komponenPembelajaran["Domain Konten/Elemen"] || Array.isArray(komponenPembelajaran["domain_konten_elemen"]) ? komponenPembelajaran["domain_konten_elemen"].join(", ") : komponenPembelajaran["domain_konten_elemen"]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Tujuan Pembelajaran</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <ul className="list-disc pl-5 space-y-2">
                        {(() => {
                          let tujuanArray = [];
                          if (Array.isArray(komponenPembelajaran?.["Tujuan Pembelajaran"])) {
                            tujuanArray = komponenPembelajaran?.["Tujuan Pembelajaran"];
                          }
                          else if (Array.isArray(komponenPembelajaran?.tujuan_pembelajaran)) {
                            tujuanArray = komponenPembelajaran.tujuan_pembelajaran;
                          }


                          if (tujuanArray.length > 0) {
                            return tujuanArray.map((tujuan, index) => (
                              <li key={index} className="text-gray-700">
                                {typeof tujuan === "string"
                                  ? tujuan
                                  : tujuan.tujuan || tujuan.deskripsi || (tujuan.nomor && tujuan.deskripsi ? tujuan.deskripsi : tujuan.abcd)}
                              </li>
                            ));
                          } else {
                            return <li className="text-gray-700">Tidak ada data tujuan pembelajaran.</li>;
                          }
                        })()}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <List className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Konten Utama</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{komponenPembelajaran["Konten Utama"] || komponenPembelajaran["konten_utama"]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Prasyarat Pengetahuan</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{komponenPembelajaran["Prasyarat Pengetahuan"] || komponenPembelajaran["prasyarat_pengetahuan"]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Pemahaman Bermakna</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700">{komponenPembelajaran["Pemahaman Bermakna"] || komponenPembelajaran["pemahaman_bermakna"]}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Profil Pelajar Pancasila</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      {(() => {
                        const profil = komponenPembelajaran["Profil Pelajar Pancasila"] || komponenPembelajaran["profil_pelajar_pancasila"] || [];

                        if (Array.isArray(profil)) {
                          return profil.map((item, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg border border-gray-100">
                              <h5 className="font-medium text-gray-800 mb-1">Dimensi: {item.Dimensi || item.dimensi}</h5>
                              <p className="text-gray-700">{item.Penjelasan || item.penjelasan}</p>
                            </div>
                          ));
                        }
                        return null;
                      })()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Sarana Prasarana</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <ul className="list-disc pl-5 space-y-1">
                        {(() => {
                          let sarana = [];


                          if (Array.isArray(komponenPembelajaran?.["Sarana Prasarana"])) {
                            sarana = komponenPembelajaran?.["Sarana Prasarana"];
                          }

                          else if (Array.isArray(komponenPembelajaran?.sarana_prasarana)) {
                            sarana = komponenPembelajaran.sarana_prasarana;
                          }

                          else if (typeof komponenPembelajaran?.["Sarana Prasarana"] === 'string') {
                            sarana = komponenPembelajaran?.["Sarana Prasarana"].split(',').map(item => item.trim());
                          }
                          else if (typeof komponenPembelajaran?.sarana_prasarana === 'string') {
                            sarana = komponenPembelajaran.sarana_prasarana.split(',').map(item => item.trim());
                          }


                          if (sarana.length > 0) {
                            return sarana.map((item, index) => (
                              <li key={index} className="text-gray-700">{item}</li>
                            ));
                          } else {
                            return <li className="text-gray-700">Tidak ada data sarana prasarana.</li>;
                          }
                        })()}
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
                        <p className="text-gray-700">{komponenPembelajaran["Target Peserta Didik"] || komponenPembelajaran["target_peserta_didik"]}</p>
                        <p className="text-gray-700 mt-2">
                          Jumlah: {komponenPembelajaran["Jumlah Peserta Didik"] || komponenPembelajaran["jumlah_peserta_didik"]} siswa
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
                          {komponenPembelajaran["Model Pembelajaran"] || komponenPembelajaran["model_pembelajaran"]}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Alasan Pemilihan:</span>{" "}
                          {komponenPembelajaran["Alasan Pemilihan Model"] || (komponenPembelajaran["model_pembelajaran"] || "").split("Alasan pemilihan model ini adalah")[1]}
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
                        {(() => {
                          const sumberBelajar = komponenPembelajaran["Sumber Belajar"] || komponenPembelajaran["sumber_belajar"] || [];

                          if (Array.isArray(sumberBelajar)) {
                            return sumberBelajar.map((sumber, index) => {
                              if (typeof sumber === 'string') {
                                return <li key={index} className="text-gray-700">{sumber}</li>;
                              } else {
                                return (
                                  <li key={index} className="text-gray-700">
                                    {sumber.Penulis || sumber.penulis}. ({sumber.Tahun || sumber.tahun}). <em>{sumber.Judul || sumber.judul}</em>. {sumber.Penerbit || sumber.penerbit}.
                                  </li>
                                );
                              }
                            });
                          }
                          return null;
                        })()}
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
                        {kegiatanPembelajaran["kegiatan_awal"]?.durasi || "15 Menit"}
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
                          {(() => {

                            let kegiatanAwalItems = [];


                            if (Array.isArray(kegiatanPembelajaran["Kegiatan Awal (15 Menit)"])) {
                              kegiatanAwalItems = kegiatanPembelajaran["Kegiatan Awal (15 Menit)"];
                            }

                            else if (kegiatanPembelajaran?.kegiatan_awal?.aktivitas &&
                              Array.isArray(kegiatanPembelajaran.kegiatan_awal.aktivitas)) {
                              kegiatanAwalItems = kegiatanPembelajaran.kegiatan_awal.aktivitas;
                            }

                            else if (Array.isArray(kegiatanPembelajaran?.kegiatan_awal)) {
                              kegiatanAwalItems = kegiatanPembelajaran.kegiatan_awal;
                            }

                            return kegiatanAwalItems.map((kegiatan, index) => (
                              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Aktivitas || kegiatan.aktivitas || kegiatan.deskripsi}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Waktu || kegiatan.waktu}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Deskripsi || kegiatan.deskripsi}</td>
                              </tr>
                            ));
                          })()}
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
                        {kegiatanPembelajaran["kegiatan_inti"]?.durasi || "90 Menit"}
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
                          {(() => {

                            let kegiatanIntiItems = [];

                            if (Array.isArray(kegiatanPembelajaran["Kegiatan Inti (90 Menit)"])) {
                              kegiatanIntiItems = kegiatanPembelajaran["Kegiatan Inti (90 Menit)"];
                            }

                            else if (kegiatanPembelajaran?.kegiatan_inti?.aktivitas &&
                              Array.isArray(kegiatanPembelajaran.kegiatan_inti.aktivitas)) {
                              kegiatanIntiItems = kegiatanPembelajaran.kegiatan_inti.aktivitas;
                            }

                            else if (Array.isArray(kegiatanPembelajaran?.kegiatan_inti)) {
                              kegiatanIntiItems = kegiatanPembelajaran.kegiatan_inti;
                            }

                            return kegiatanIntiItems.map((kegiatan, index) => (
                              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Aktivitas || kegiatan.aktivitas || kegiatan.tahap}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Waktu || kegiatan.waktu}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{kegiatan["Deskripsi Guru"] || kegiatan.deskripsi_guru}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{kegiatan["Deskripsi Siswa"] || kegiatan.deskripsi_siswa}</td>
                              </tr>
                            ));
                          })()}
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
                        {kegiatanPembelajaran["kegiatan_penutup"]?.durasi || "15 Menit"}
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
                          {(() => {

                            let kegiatanPenutupItems = [];


                            if (Array.isArray(kegiatanPembelajaran["Kegiatan Penutup (15 Menit)"])) {
                              kegiatanPenutupItems = kegiatanPembelajaran["Kegiatan Penutup (15 Menit)"];
                            }

                            else if (kegiatanPembelajaran?.kegiatan_penutup?.aktivitas &&
                              Array.isArray(kegiatanPembelajaran.kegiatan_penutup.aktivitas)) {
                              kegiatanPenutupItems = kegiatanPembelajaran.kegiatan_penutup.aktivitas;
                            }

                            else if (Array.isArray(kegiatanPembelajaran?.kegiatan_penutup)) {
                              kegiatanPenutupItems = kegiatanPembelajaran.kegiatan_penutup;
                            }

                            return kegiatanPenutupItems.map((kegiatan, index) => (
                              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Aktivitas || kegiatan.aktivitas || kegiatan.deskripsi}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Waktu || kegiatan.waktu}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{kegiatan.Deskripsi || kegiatan.deskripsi}</td>
                              </tr>
                            ));
                          })()}
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
                        <p className="text-gray-700">{materiAssessment?.["Bahan Ajar"]?.["Teori"] || materiAssessment?.["bahan_ajar"]?.["teori"]}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Contoh Kontekstual:</h5>
                        <p className="text-gray-700">{materiAssessment?.["Bahan Ajar"]?.["Contoh Kontekstual"] || materiAssessment?.["bahan_ajar"]?.["materi_linguistik"]?.["contoh_kontekstual"]}</p>
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
                        <p className="text-gray-700">{materiAssessment?.["Remedial"]?.["Aktivitas"] || materiAssessment?.["remedial"]?.["aktivitas"]}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Strategi Intervensi:</h5>
                        <p className="text-gray-700">{materiAssessment?.["Remedial"]?.["Strategi Intervensi"] || materiAssessment?.["remedial"]?.["strategi_intervensi"]}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Instrumen Penilaian:</h5>
                        <p className="text-gray-700">{materiAssessment?.["Remedial"]?.["Instrumen Penilaian"] || materiAssessment?.["remedial"]?.["instrumen_penilaian"]}</p>
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
                        {(() => {
                          const aktivitas = materiAssessment?.["pengayaan"]?.["aktivitas"] || [];

                          if (Array.isArray(aktivitas)) {
                            return (
                              <div className="space-y-3">
                                {aktivitas.map((item, index) => (
                                  <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                                        <p className="font-medium text-gray-800 ml-2">Aktivitas {index + 1}</p>
                                      </div>
                                      <p className="text-gray-700 ml-4">{safeRender(item)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h5 className="font-medium text-gray-700 mb-2">Output:</h5>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                          <p className="text-gray-700">{safeRender(materiAssessment?.["pengayaan"]?.["output"])}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-gray-800">Assessment</h4>
                    </div>

                    <div className="space-y-4">
                      {/* Penilaian Pengetahuan */}
                      {materiAssessment?.["assessment"]?.["pengetahuan"] && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h5 className="font-medium text-gray-700 mb-2">Penilaian Pengetahuan:</h5>
                          <div className="space-y-3">
                            {materiAssessment["assessment"]["pengetahuan"]["instrumen_penilaian"] && (
                              <div>
                                <p className="font-medium text-gray-700">Instrumen Penilaian:</p>
                                <div className="mt-2 space-y-2">
                                  {Array.isArray(materiAssessment["assessment"]["pengetahuan"]["instrumen_penilaian"]) &&
                                    materiAssessment["assessment"]["pengetahuan"]["instrumen_penilaian"].map((soal, index) => (
                                      <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-lightest flex items-center justify-center mr-3">
                                          <span className="text-primary font-medium">{index + 1}</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex-1">
                                          <p className="text-gray-700">{safeRender(soal)}</p>
                                        </div>
                                      </div>
                                    ))
                                  }
                                </div>
                              </div>
                            )}

                            {materiAssessment["assessment"]["pengetahuan"]["rubrik_penilaian"] && (
                              <div>
                                <p className="font-medium text-gray-700">Rubrik Penilaian:</p>
                                <div className="mt-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                  <div className="mb-3 border-b border-gray-100 pb-2">
                                    <p className="text-gray-700">
                                      <span className="font-medium">Kriteria:</span> {materiAssessment["assessment"]["pengetahuan"]["rubrik_penilaian"]["kriteria"]}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Skor:</p>
                                    <div className="space-y-2 ml-2">
                                      {Object.entries(materiAssessment["assessment"]["pengetahuan"]["rubrik_penilaian"]["skor"]).map(([key, value]) => (
                                        <div key={key} className="flex items-center bg-gray-50 p-2 rounded">
                                          <div className={`w-3 h-3 rounded-full ${key.includes('benar') ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                                          <p className="text-gray-700">
                                            <span className="font-medium">
                                              {key.includes('benar') ? 'Jawaban Benar' : 'Jawaban Salah'}:
                                            </span> {String(value)}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Penilaian Keterampilan Mengucapkan */}
                      {materiAssessment?.["assessment"]?.["keterampilan_mengucapkan"] && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h5 className="font-medium text-gray-700 mb-2">Penilaian Keterampilan Mengucapkan:</h5>
                          <div className="space-y-3">
                            {/* Teknik Penilaian */}
                            {materiAssessment["assessment"]["keterampilan_mengucapkan"]["teknik_penilaian"] && (
                              <div>
                                <p className="font-medium text-gray-700">Teknik Penilaian:</p>
                                <p className="text-gray-700">{materiAssessment["assessment"]["keterampilan_mengucapkan"]["teknik_penilaian"]}</p>
                              </div>
                            )}

                            {/* Bentuk Instrumen */}
                            {materiAssessment["assessment"]["keterampilan_mengucapkan"]["bentuk_instrumen"] && (
                              <div>
                                <p className="font-medium text-gray-700">Bentuk Instrumen:</p>
                                <p className="text-gray-700">{materiAssessment["assessment"]["keterampilan_mengucapkan"]["bentuk_instrumen"]}</p>
                              </div>
                            )}

                            {/* Kisi-kisi */}
                            {materiAssessment["assessment"]["keterampilan_mengucapkan"]["kisi_kisi"] && (
                              <div>
                                <p className="font-medium text-gray-700">Kisi-kisi:</p>
                                <p className="text-gray-700">{materiAssessment["assessment"]["keterampilan_mengucapkan"]["kisi_kisi"]}</p>
                              </div>
                            )}

                            {/* Instrumen Penilaian */}
                            {materiAssessment["assessment"]["keterampilan_mengucapkan"]["instrumen_penilaian"] && (
                              <div>
                                <p className="font-medium text-gray-700">Instrumen Penilaian:</p>
                                <ul className="list-decimal pl-5 space-y-1 mt-2">
                                  {Array.isArray(materiAssessment["assessment"]["keterampilan_mengucapkan"]["instrumen_penilaian"]) &&
                                    materiAssessment["assessment"]["keterampilan_mengucapkan"]["instrumen_penilaian"].map((soal, index) => (
                                      <li key={index} className="text-gray-700">{safeRender(soal)}</li>
                                    ))
                                  }
                                </ul>
                              </div>
                            )}

                            {/* Rubrik Penilaian */}
                            {materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik_penilaian"] && (
                              <div>
                                <p className="font-medium text-gray-700">Rubrik Penilaian:</p>
                                <div className="mt-2">
                                  <p className="text-gray-700">
                                    <span className="font-medium">Kriteria:</span> {materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik_penilaian"]["kriteria"]}
                                  </p>
                                  <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-700">Skor:</p>
                                    {Object.entries(materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik_penilaian"]["skor"]).map(([key, value]) => (
                                      <p key={key} className="text-gray-700">
                                        <span className="font-medium">{key}:</span> {String(value)}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Rubrik (old format) */}
                            {materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik"] && (
                              <div>
                                <p className="font-medium text-gray-700">Rubrik:</p>
                                <div className="mt-2 space-y-3">
                                  {/* Handle tabel property */}
                                  {materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik"]["tabel"] && (
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-100">
                                          <tr>
                                            {Array.isArray(materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik"]["tabel"]) &&
                                              materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik"]["tabel"].length > 0 &&
                                              Object.keys(materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik"]["tabel"][0] || {}).map((header, idx) => (
                                                <th key={idx} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  {header}
                                                </th>
                                              ))}
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                          {Array.isArray(materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik"]["tabel"]) &&
                                            materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik"]["tabel"].map((row, rowIdx) => (
                                              <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                {Object.values(row).map((cell, cellIdx) => (
                                                  <td key={cellIdx} className="px-4 py-2 text-sm text-gray-700">
                                                    {typeof cell === "object" ? JSON.stringify(cell) : String(cell)}
                                                  </td>
                                                ))}
                                              </tr>
                                            ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}

                                  {/* Handle penentuan_nilai property */}
                                  {materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik"]["penentuan_nilai"] && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                      <p className="font-medium text-gray-700">Penentuan Nilai:</p>
                                      <div className="mt-1 text-sm text-gray-700 italic">
                                        {materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik"]["penentuan_nilai"]}
                                      </div>
                                    </div>
                                  )}

                                  {/* Display other properties */}
                                  {Object.entries(materiAssessment["assessment"]["keterampilan_mengucapkan"]["rubrik"]).map(([key, value]) => {
                                    if (key !== "tabel" && key !== "penentuan_nilai") {
                                      return (
                                        <p key={key} className="text-gray-700">
                                          <span className="font-medium">{key}:</span> {String(value)}
                                        </p>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Penilaian Keterampilan Menulis */}
                      {materiAssessment?.["assessment"]?.["keterampilan_menulis"] && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h5 className="font-medium text-gray-700 mb-2">Penilaian Keterampilan Menulis:</h5>
                          <div className="space-y-3">
                            {/* Teknik Penilaian */}
                            {materiAssessment["assessment"]["keterampilan_menulis"]["teknik_penilaian"] && (
                              <div>
                                <p className="font-medium text-gray-700">Teknik Penilaian:</p>
                                <p className="text-gray-700">{materiAssessment["assessment"]["keterampilan_menulis"]["teknik_penilaian"]}</p>
                              </div>
                            )}

                            {/* Bentuk Instrumen */}
                            {materiAssessment["assessment"]["keterampilan_menulis"]["bentuk_instrumen"] && (
                              <div>
                                <p className="font-medium text-gray-700">Bentuk Instrumen:</p>
                                <p className="text-gray-700">{materiAssessment["assessment"]["keterampilan_menulis"]["bentuk_instrumen"]}</p>
                              </div>
                            )}

                            {/* Kisi-kisi */}
                            {materiAssessment["assessment"]["keterampilan_menulis"]["kisi_kisi"] && (
                              <div>
                                <p className="font-medium text-gray-700">Kisi-kisi:</p>
                                <p className="text-gray-700">{materiAssessment["assessment"]["keterampilan_menulis"]["kisi_kisi"]}</p>
                              </div>
                            )}

                            {/* Instrumen Penilaian */}
                            {materiAssessment["assessment"]["keterampilan_menulis"]["instrumen_penilaian"] && (
                              <div>
                                <p className="font-medium text-gray-700">Instrumen Penilaian:</p>
                                <ul className="list-decimal pl-5 space-y-1 mt-2">
                                  {Array.isArray(materiAssessment["assessment"]["keterampilan_menulis"]["instrumen_penilaian"]) &&
                                    materiAssessment["assessment"]["keterampilan_menulis"]["instrumen_penilaian"].map((soal, index) => (
                                      <li key={index} className="text-gray-700">{safeRender(soal)}</li>
                                    ))
                                  }
                                </ul>
                              </div>
                            )}

                            {/* Rubrik Penilaian */}
                            {materiAssessment["assessment"]["keterampilan_menulis"]["rubrik_penilaian"] && (
                              <div>
                                <p className="font-medium text-gray-700">Rubrik Penilaian:</p>
                                <div className="mt-2">
                                  <p className="text-gray-700">
                                    <span className="font-medium">Kriteria:</span> {materiAssessment["assessment"]["keterampilan_menulis"]["rubrik_penilaian"]["kriteria"]}
                                  </p>
                                  <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-700">Skor:</p>
                                    {Object.entries(materiAssessment["assessment"]["keterampilan_menulis"]["rubrik_penilaian"]["skor"]).map(([key, value]) => (
                                      <p key={key} className="text-gray-700">
                                        <span className="font-medium">{key}:</span> {String(value)}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Rubrik (old format) */}
                            {materiAssessment["assessment"]["keterampilan_menulis"]["rubrik"] && (
                              <div>
                                <p className="font-medium text-gray-700">Rubrik:</p>
                                <div className="mt-2 space-y-3">
                                  {/* Handle tabel property */}
                                  {materiAssessment["assessment"]["keterampilan_menulis"]["rubrik"]["tabel"] && (
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-100">
                                          <tr>
                                            {Array.isArray(materiAssessment["assessment"]["keterampilan_menulis"]["rubrik"]["tabel"]) &&
                                              materiAssessment["assessment"]["keterampilan_menulis"]["rubrik"]["tabel"].length > 0 &&
                                              Object.keys(materiAssessment["assessment"]["keterampilan_menulis"]["rubrik"]["tabel"][0] || {}).map((header, idx) => (
                                                <th key={idx} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                  {header}
                                                </th>
                                              ))}
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                          {Array.isArray(materiAssessment["assessment"]["keterampilan_menulis"]["rubrik"]["tabel"]) &&
                                            materiAssessment["assessment"]["keterampilan_menulis"]["rubrik"]["tabel"].map((row, rowIdx) => (
                                              <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                {Object.values(row).map((cell, cellIdx) => (
                                                  <td key={cellIdx} className="px-4 py-2 text-sm text-gray-700">
                                                    {typeof cell === "object" ? JSON.stringify(cell) : String(cell)}
                                                  </td>
                                                ))}
                                              </tr>
                                            ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}

                                  {/* Handle penentuan_nilai property */}
                                  {materiAssessment["assessment"]["keterampilan_menulis"]["rubrik"]["penentuan_nilai"] && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                      <p className="font-medium text-gray-700">Penentuan Nilai:</p>
                                      <div className="mt-1 text-sm text-gray-700 italic">
                                        {materiAssessment["assessment"]["keterampilan_menulis"]["rubrik"]["penentuan_nilai"]}
                                      </div>
                                    </div>
                                  )}

                                  {/* Display other properties */}
                                  {Object.entries(materiAssessment["assessment"]["keterampilan_menulis"]["rubrik"]).map(([key, value]) => {
                                    if (key !== "tabel" && key !== "penentuan_nilai") {
                                      return (
                                        <p key={key} className="text-gray-700">
                                          <span className="font-medium">{key}:</span> {String(value)}
                                        </p>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Strategi Umpan Balik */}
                      {materiAssessment?.["assessment"]?.["umpan_balik"] && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h5 className="font-medium text-gray-700 mb-2">Strategi Umpan Balik:</h5>
                          <p className="text-gray-700">{safeRender(materiAssessment["assessment"]["umpan_balik"])}</p>
                        </div>
                      )}
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

