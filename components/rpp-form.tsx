"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  GraduationCap,
  Home,
  Layers,
  LayoutGrid,
  Save,
  School,
  type Sparkles,
  Target,
  User,
  Rocket,
  Lightbulb,
  Bookmark,
  Users,
  Briefcase,
  Library,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
} from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
})

export function RPPForm({ onSubmit }: { onSubmit: (data: z.infer<typeof formSchema>) => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [classOptions, setClassOptions] = useState<{ value: string; label: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 3

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_penyusun: "",
      institusi: "",
      tahun_pembuatan: new Date().getFullYear().toString(),
      mata_pelajaran: "",
      jenjang: "",
      kelas: "",
      fase: "",
      alokasi_waktu: "",
      domain_konten: "",
      tujuan_pembelajaran: "",
      konten_utama: "",
      capaian_pembelajaran: "",
      prasyarat: "",
      pemahaman_bermakna: "",
      profil_pelajar: "",
      sarana: "",
      target_peserta: "",
      jumlah_peserta: "",
      model_pembelajaran: "",
      sumber_belajar: "",
      catatan: "",
    },
  })

  // Watch for changes in jenjang and kelas to update fase
  const jenjang = form.watch("jenjang")
  const kelas = form.watch("kelas")

  useEffect(() => {
    if (jenjang === "Sekolah Dasar") {
      setClassOptions([
        { value: "1", label: "Kelas 1" },
        { value: "2", label: "Kelas 2" },
        { value: "3", label: "Kelas 3" },
        { value: "4", label: "Kelas 4" },
        { value: "5", label: "Kelas 5" },
        { value: "6", label: "Kelas 6" },
      ])
      // Reset kelas if it's not valid for elementary school
      const currentKelas = Number.parseInt(form.getValues("kelas") || "0")
      if (currentKelas > 6 || currentKelas < 1) {
        form.setValue("kelas", "")
        form.setValue("fase", "")
      }
    } else if (jenjang === "Sekolah Menengah Pertama") {
      setClassOptions([
        { value: "7", label: "Kelas 7" },
        { value: "8", label: "Kelas 8" },
        { value: "9", label: "Kelas 9" },
      ])
      // Reset kelas if it's not valid for middle school
      const currentKelas = Number.parseInt(form.getValues("kelas") || "0")
      if (currentKelas < 7 || currentKelas > 9) {
        form.setValue("kelas", "")
        form.setValue("fase", "")
      }
    } else if (jenjang === "Sekolah Menengah Atas/Kejuruan") {
      setClassOptions([
        { value: "10", label: "Kelas 10" },
        { value: "11", label: "Kelas 11" },
        { value: "12", label: "Kelas 12" },
      ])
      // Reset kelas if it's not valid for high school
      const currentKelas = Number.parseInt(form.getValues("kelas") || "0")
      if (currentKelas < 10 || currentKelas > 12) {
        form.setValue("kelas", "")
        form.setValue("fase", "")
      }
    } else {
      setClassOptions([])
    }
  }, [jenjang, form])

  useEffect(() => {
    if (jenjang && kelas) {
      const kelasNum = Number.parseInt(kelas)
      let fase = ""

      if (jenjang === "Sekolah Dasar") {
        if (kelasNum >= 1 && kelasNum <= 2) {
          fase = "Fase A (SD Kelas 1-2)"
        } else if (kelasNum >= 3 && kelasNum <= 4) {
          fase = "Fase B (SD Kelas 3-4)"
        } else if (kelasNum >= 5 && kelasNum <= 6) {
          fase = "Fase C (SD Kelas 5-6)"
        }
      } else if (jenjang === "Sekolah Menengah Pertama") {
        fase = "Fase D (SMP Kelas 7-9)"
      } else if (jenjang === "Sekolah Menengah Atas/Kejuruan") {
        if (kelasNum === 10) {
          fase = "Fase E (SMA Kelas 10)"
        } else if (kelasNum >= 11 && kelasNum <= 12) {
          fase = "Fase F (SMA/SMK Kelas 11-12)"
        }
      }

      form.setValue("fase", fase)
    }
  }, [jenjang, kelas, form])

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      console.log(values)
      onSubmit(values)
      toast({
        title: "Mengirim Data RPP",
        description: "RPP Anda sedang diproses...",
        className: "bg-primary-lightest text-primary border-none",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Gagal mengirim data",
        description: "Terjadi kesalahan saat mengirim data. Silakan coba lagi.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields)
  }

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="relative bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl overflow-hidden border border-white/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-lighter/30 to-primary-light/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-lightest/20 to-primary-lighter/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

        {/* Progress indicator */}
        <div className="relative z-10 mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-800">Buat RPP</h2>
            </div>
            <div className="text-sm font-medium px-3 py-1 bg-primary-lightest text-primary rounded-full">
              Langkah {currentStep} dari {totalSteps}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div
              className="bg-gradient-to-r from-primary to-primary-light h-3 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <div className={`flex items-center gap-1 ${currentStep >= 1 ? "text-primary font-medium" : ""}`}>
              <User className="h-3 w-3" />
              <span>Informasi Dasar</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 2 ? "text-primary font-medium" : ""}`}>
              <GraduationCap className="h-3 w-3" />
              <span>Jenjang & Kelas</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 3 ? "text-primary font-medium" : ""}`}>
              <BookOpen className="h-3 w-3" />
              <span>Konten Pembelajaran</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 relative z-10">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Ubah warna background info box */}
                  <div className="bg-indigo-50/50 p-4 rounded-xl mb-6 backdrop-blur-sm border border-indigo-100/80">
                    <h3 className="font-medium text-indigo-600 mb-2 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Informasi Dasar
                    </h3>
                    <p className="text-sm text-gray-600">
                      Silakan isi informasi dasar untuk RPP Anda. Semua kolom dengan tanda * wajib diisi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nama_penyusun"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FormLabel className="text-gray-700 font-medium">Nama Penyusun *</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-80 text-sm">Masukkan nama lengkap Anda sebagai penyusun RPP ini.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                placeholder="Masukkan nama lengkap Anda"
                                {...field}
                                className="pl-10 py-6 rounded-xl border-gray-300 focus-visible:ring-primary bg-white/70 backdrop-blur-sm"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="institusi"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FormLabel className="text-gray-700 font-medium">Institusi *</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-80 text-sm">
                                    Masukkan nama sekolah atau institusi tempat Anda mengajar.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <School className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                placeholder="Masukkan nama sekolah/institusi"
                                {...field}
                                className="pl-10 py-6 rounded-xl border-gray-300 focus-visible:ring-primary bg-white/70 backdrop-blur-sm"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tahun_pembuatan"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FormLabel className="text-gray-700 font-medium">Tahun Pembuatan *</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-80 text-sm">Masukkan tahun pembuatan RPP ini (contoh: 2023).</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                placeholder="Masukkan tahun pembuatan"
                                {...field}
                                className="pl-10 py-6 rounded-xl border-gray-300 focus-visible:ring-primary bg-white/70 backdrop-blur-sm"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mata_pelajaran"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FormLabel className="text-gray-700 font-medium">Mata Pelajaran *</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-80 text-sm">
                                    Masukkan nama mata pelajaran (contoh: Matematika, Bahasa Indonesia, IPA).
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                placeholder="Masukkan mata pelajaran"
                                {...field}
                                className="pl-10 py-6 rounded-xl border-gray-300 focus-visible:ring-primary bg-white/70 backdrop-blur-sm"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    {/* Ubah warna tombol */}
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-400 hover:to-indigo-500 text-white px-6 py-6 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                    >
                      <span className="font-medium">Lanjut ke Jenjang & Kelas</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="bg-primary-lightest/50 p-4 rounded-xl mb-6 backdrop-blur-sm border border-primary-lightest/80">
                    <h3 className="font-medium text-primary mb-2 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Jenjang & Kelas
                    </h3>
                    <p className="text-sm text-gray-600">
                      Pilih jenjang pendidikan dan kelas. Fase akan otomatis terisi berdasarkan pilihan Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="jenjang"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FormLabel className="text-gray-700 font-medium">Jenjang Pendidikan *</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-80 text-sm">Pilih jenjang pendidikan yang sesuai dengan RPP Anda.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full py-6 rounded-xl border-gray-300 focus:ring-primary pl-10 bg-white/70 backdrop-blur-sm">
                                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <SelectValue placeholder="Pilih jenjang pendidikan" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl">
                                  <SelectItem value="Sekolah Dasar">Sekolah Dasar (SD)</SelectItem>
                                  <SelectItem value="Sekolah Menengah Pertama">Sekolah Menengah Pertama (SMP)</SelectItem>
                                  <SelectItem value="Sekolah Menengah Atas/Kejuruan">
                                    Sekolah Menengah Atas/Kejuruan (SMA/SMK)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    {jenjang && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <FormField
                          control={form.control}
                          name="kelas"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center mb-2">
                                <FormLabel className="text-gray-700 font-medium">Kelas *</FormLabel>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                        <HelpCircle className="h-4 w-4" />
                                        <span className="sr-only">Info</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="w-80 text-sm">
                                        Pilih kelas yang sesuai dengan jenjang pendidikan yang telah dipilih.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full py-6 rounded-xl border-gray-300 focus:ring-primary pl-10 bg-white/70 backdrop-blur-sm">
                                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                      <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl">
                                      {classOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-500 text-xs mt-1" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {jenjang && kelas && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <FormField
                          control={form.control}
                          name="fase"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center mb-2">
                                <FormLabel className="text-gray-700 font-medium">Fase</FormLabel>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                        <HelpCircle className="h-4 w-4" />
                                        <span className="sr-only">Info</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="w-80 text-sm">
                                        Fase otomatis terisi berdasarkan jenjang dan kelas yang dipilih.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    placeholder="Fase (otomatis terisi)"
                                    {...field}
                                    disabled
                                    className="pl-10 py-6 rounded-xl border-gray-300 bg-gray-50/80 text-gray-700 backdrop-blur-sm"
                                  />
                                </div>
                              </FormControl>
                              <p className="text-xs text-primary mt-1">
                                Fase otomatis terisi berdasarkan Jenjang dan Kelas
                              </p>
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    <FormField
                      control={form.control}
                      name="alokasi_waktu"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FormLabel className="text-gray-700 font-medium">Alokasi Waktu *</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-80 text-sm">
                                    Masukkan alokasi waktu untuk pembelajaran (contoh: 2x45 menit, 3 pertemuan).
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                placeholder="Masukkan alokasi waktu"
                                {...field}
                                className="pl-10 py-6 rounded-xl border-gray-300 focus-visible:ring-primary bg-white/70 backdrop-blur-sm"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="bg-white hover:bg-gray-100 text-gray-700 px-6 py-6 rounded-xl flex items-center gap-2 transition-all shadow-md border border-gray-200"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      <span className="font-medium">Kembali</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white px-6 py-6 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                    >
                      <span className="font-medium">Lanjut ke Konten Pembelajaran</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="bg-primary-lightest/50 p-4 rounded-xl mb-6 backdrop-blur-sm border border-primary-lightest/80">
                    <h3 className="font-medium text-primary mb-2 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Konten Pembelajaran
                    </h3>
                    <p className="text-sm text-gray-600">
                      Isi detail konten pembelajaran. Anda juga dapat menambahkan detail tambahan jika diperlukan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="domain_konten"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FormLabel className="text-gray-700 font-medium">Domain Konten *</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-80 text-sm">
                                    Masukkan domain konten pembelajaran (contoh: Aljabar, Geometri, Sastra).
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <LayoutGrid className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input
                                placeholder="Masukkan domain konten"
                                {...field}
                                className="pl-10 py-6 rounded-xl border-gray-300 focus-visible:ring-primary bg-white/70 backdrop-blur-sm"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tujuan_pembelajaran"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FormLabel className="text-gray-700 font-medium">Tujuan Pembelajaran *</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-80 text-sm">Deskripsikan tujuan pembelajaran yang ingin dicapai.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Target className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Textarea
                                placeholder="Deskripsikan tujuan pembelajaran..."
                                className="min-h-[120px] pl-10 pt-2 rounded-xl border-gray-300 focus-visible:ring-primary resize-none bg-white/70 backdrop-blur-sm"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="konten_utama"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FormLabel className="text-gray-700 font-medium">Konten Utama *</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">Info</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-80 text-sm">Deskripsikan konten utama yang akan diajarkan.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Textarea
                                placeholder="Deskripsikan konten utama pembelajaran..."
                                className="min-h-[120px] pl-10 pt-2 rounded-xl border-gray-300 focus-visible:ring-primary resize-none bg-white/70 backdrop-blur-sm"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Modern Toggle for Additional Fields */}
                  <div className="flex flex-col items-center pt-4 pb-2">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-500">Detail Tambahan</span>
                      <button
                        type="button"
                        onClick={toggleAdditionalFields}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        style={{
                          backgroundColor: showAdditionalFields ? "#3674B5" : "#e5e7eb",
                        }}
                        aria-label={showAdditionalFields ? "Nonaktifkan detail tambahan" : "Aktifkan detail tambahan"}
                      >
                        <span
                          className={`${showAdditionalFields ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </button>
                      <span className="text-sm font-medium text-gray-500">
                        {showAdditionalFields ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 text-center max-w-md">
                      {showAdditionalFields
                        ? "Detail tambahan ditampilkan. Anda dapat mengisi informasi opsional untuk RPP yang lebih lengkap."
                        : "Aktifkan untuk menambahkan detail opsional seperti prasyarat, model pembelajaran, dan lainnya."}
                    </p>
                  </div>

                  {/* Additional Fields */}
                  <AnimatePresence>
                    {showAdditionalFields && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-lg">
                          <div className="flex items-center mb-6">
                            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary-light rounded-full mr-3"></div>
                            <h3 className="text-lg font-medium text-gray-800">Detail Tambahan</h3>
                            <div className="ml-auto px-3 py-1 bg-primary-lightest text-primary text-xs font-medium rounded-full">
                              Opsional
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="capaian_pembelajaran"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center mb-2">
                                    <FormLabel className="text-gray-700 font-medium">Capaian Pembelajaran</FormLabel>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                            <HelpCircle className="h-4 w-4" />
                                            <span className="sr-only">Info</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-80 text-sm">
                                            Masukkan capaian pembelajaran yang diharapkan dari siswa.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <FormControl>
                                    <div className="group relative transition-all duration-300">
                                      <div className="absolute left-0 top-0 h-full w-1 bg-primary-lightest rounded-l-xl group-focus-within:bg-primary-light transition-colors"></div>
                                      <div className="relative">
                                        <Target className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                        <Textarea
                                          placeholder="Masukkan capaian pembelajaran..."
                                          className="min-h-[120px] pl-10 pt-2 rounded-xl border-gray-200 focus-visible:ring-primary-light focus-visible:border-transparent shadow-sm resize-none bg-white/70 backdrop-blur-sm"
                                          {...field}
                                        />
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="prasyarat"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center mb-2">
                                    <FormLabel className="text-gray-700 font-medium">Prasyarat</FormLabel>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                            <HelpCircle className="h-4 w-4" />
                                            <span className="sr-only">Info</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-80 text-sm">
                                            Deskripsikan prasyarat yang diperlukan sebelum mempelajari materi ini.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <FormControl>
                                    <div className="group relative transition-all duration-300">
                                      <div className="absolute left-0 top-0 h-full w-1 bg-primary-lightest rounded-l-xl group-focus-within:bg-primary-light transition-colors"></div>
                                      <div className="relative">
                                        <Bookmark className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                        <Textarea
                                          placeholder="Deskripsikan prasyarat..."
                                          className="min-h-[100px] pl-10 pt-2 rounded-xl border-gray-200 focus-visible:ring-primary-light focus-visible:border-transparent shadow-sm resize-none bg-white/70 backdrop-blur-sm"
                                          {...field}
                                        />
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="pemahaman_bermakna"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center mb-2">
                                    <FormLabel className="text-gray-700 font-medium">Pemahaman Bermakna</FormLabel>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                            <HelpCircle className="h-4 w-4" />
                                            <span className="sr-only">Info</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-80 text-sm">
                                            Deskripsikan pemahaman bermakna yang diharapkan dari pembelajaran ini.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <FormControl>
                                    <div className="group relative transition-all duration-300">
                                      <div className="absolute left-0 top-0 h-full w-1 bg-primary-lightest rounded-l-xl group-focus-within:bg-primary-light transition-colors"></div>
                                      <div className="relative">
                                        <Lightbulb className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                        <Textarea
                                          placeholder="Deskripsikan pemahaman bermakna..."
                                          className="min-h-[100px] pl-10 pt-2 rounded-xl border-gray-200 focus-visible:ring-primary-light focus-visible:border-transparent shadow-sm resize-none bg-white/70 backdrop-blur-sm"
                                          {...field}
                                        />
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="profil_pelajar"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center mb-2">
                                    <FormLabel className="text-gray-700 font-medium">Profil Pelajar</FormLabel>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                            <HelpCircle className="h-4 w-4" />
                                            <span className="sr-only">Info</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-80 text-sm">
                                            Deskripsikan profil pelajar yang menjadi target pembelajaran.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <FormControl>
                                    <div className="group relative transition-all duration-300">
                                      <div className="absolute left-0 top-0 h-full w-1 bg-primary-lightest rounded-l-xl group-focus-within:bg-primary-light transition-colors"></div>
                                      <div className="relative">
                                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                        <Textarea
                                          placeholder="Deskripsikan profil pelajar..."
                                          className="min-h-[100px] pl-10 pt-2 rounded-xl border-gray-200 focus-visible:ring-primary-light focus-visible:border-transparent shadow-sm resize-none bg-white/70 backdrop-blur-sm"
                                          {...field}
                                        />
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="sarana"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center mb-2">
                                    <FormLabel className="text-gray-700 font-medium">Sarana</FormLabel>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                            <HelpCircle className="h-4 w-4" />
                                            <span className="sr-only">Info</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-80 text-sm">
                                            Deskripsikan sarana yang diperlukan untuk pembelajaran.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <FormControl>
                                    <div className="group relative transition-all duration-300">
                                      <div className="absolute left-0 top-0 h-full w-1 bg-primary-lightest rounded-l-xl group-focus-within:bg-primary-light transition-colors"></div>
                                      <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                        <Textarea
                                          placeholder="Deskripsikan sarana..."
                                          className="min-h-[100px] pl-10 pt-2 rounded-xl border-gray-200 focus-visible:ring-primary-light focus-visible:border-transparent shadow-sm resize-none bg-white/70 backdrop-blur-sm"
                                          {...field}
                                        />
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="target_peserta"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center mb-2">
                                    <FormLabel className="text-gray-700 font-medium">Target Peserta</FormLabel>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                            <HelpCircle className="h-4 w-4" />
                                            <span className="sr-only">Info</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-80 text-sm">
                                            Deskripsikan target peserta didik yang akan mengikuti pembelajaran.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <FormControl>
                                    <div className="group relative transition-all duration-300">
                                      <div className="absolute left-0 top-0 h-full w-1 bg-primary-lightest rounded-l-xl group-focus-within:bg-primary-light transition-colors"></div>
                                      <div className="relative">
                                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                        <Textarea
                                          placeholder="Deskripsikan target peserta didik..."
                                          className="min-h-[100px] pl-10 pt-2 rounded-xl border-gray-200 focus-visible:ring-primary-light focus-visible:border-transparent shadow-sm resize-none bg-white/70 backdrop-blur-sm"
                                          {...field}
                                        />
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="jumlah_peserta"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center mb-2">
                                    <FormLabel className="text-gray-700 font-medium">Jumlah Peserta</FormLabel>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                            <HelpCircle className="h-4 w-4" />
                                            <span className="sr-only">Info</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-80 text-sm">
                                            Masukkan jumlah peserta didik yang akan mengikuti pembelajaran.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <FormControl>
                                    <div className="group relative transition-all duration-300">
                                      <div className="absolute left-0 top-0 h-full w-1 bg-primary-lightest rounded-l-xl group-focus-within:bg-primary-light transition-colors"></div>
                                      <div className="relative">
                                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                        <Input
                                          type="number"
                                          placeholder="Masukkan jumlah peserta didik..."
                                          className="pl-10 py-6 rounded-xl border-gray-200 focus-visible:ring-primary-light focus-visible:border-transparent shadow-sm bg-white/70 backdrop-blur-sm"
                                          {...field}
                                        />
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="model_pembelajaran"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center mb-2">
                                    <FormLabel className="text-gray-700 font-medium">Model Pembelajaran</FormLabel>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                            <HelpCircle className="h-4 w-4" />
                                            <span className="sr-only">Info</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-80 text-sm">
                                            Deskripsikan model pembelajaran yang digunakan.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <FormControl>
                                    <div className="group relative transition-all duration-300">
                                      <div className="absolute left-0 top-0 h-full w-1 bg-primary-lightest rounded-l-xl group-focus-within:bg-primary-light transition-colors"></div>
                                      <div className="relative">
                                        <Rocket className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                        <Textarea
                                          placeholder="Deskripsikan model pembelajaran..."
                                          className="min-h-[100px] pl-10 pt-2 rounded-xl border-gray-200 focus-visible:ring-primary-light focus-visible:border-transparent shadow-sm resize-none bg-white/70 backdrop-blur-sm"
                                          {...field}
                                        />
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="sumber_belajar"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center mb-2">
                                    <FormLabel className="text-gray-700 font-medium">Sumber Belajar</FormLabel>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-gray-400">
                                            <HelpCircle className="h-4 w-4" />
                                            <span className="sr-only">Info</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="w-80 text-sm">Deskripsikan sumber belajar yang digunakan.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <FormControl>
                                    <div className="group relative transition-all duration-300">
                                      <div className="absolute left-0 top-0 h-full w-1 bg-primary-lightest rounded-l-xl group-focus-within:bg-primary-light transition-colors"></div>
                                      <div className="relative">
                                        <Library className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                        <Textarea
                                          placeholder="Deskripsikan sumber belajar..."
                                          className="min-h-[100px] pl-10 pt-2 rounded-xl border-gray-200 focus-visible:ring-primary-light focus-visible:border-transparent shadow-sm resize-none bg-white/70 backdrop-blur-sm"
                                          {...field}
                                        />
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between pt-8">
                    <Button
                      type="button"
                      onClick={prevStep}
                      className="bg-white hover:bg-gray-100 text-gray-700 px-6 py-6 rounded-xl flex items-center gap-2 transition-all shadow-md border border-gray-200"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      <span className="font-medium">Kembali</span>
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white px-10 py-6 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-all group"
                    >
                      <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-full bg-primary-light group-hover:translate-x-0"></span>
                      {isSubmitting ? (
                        <>
                          <div className="h-5 w-5 relative z-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-medium relative z-10">Membuat RPP...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 relative z-10" />
                          <span className="font-medium relative z-10">Buat RPP</span>
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      </motion.div>
      <Toaster />
    </div>
  )
}

function Info(props: React.ComponentProps<typeof Sparkles>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

