"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"

interface MediaDropZoneProps {
  type: "image" | "video" | "mixed" 
  title: string
  description: string
  url?: string
  imageUrl?: string
}

export function MediaDropZone({ type, title, description, url, imageUrl }: MediaDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const validFiles = files.filter((file) => {
        if (type === "image") {
          return file.type.startsWith("image/")
        } else if (type === "video") {
          return file.type.startsWith("video/")
        } else {
          return file.type.startsWith("image/") || file.type.startsWith("video/")
        }
      })

      setUploadedFiles((prev) => [...prev, ...validFiles])
    },
    [type],
  )

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }, [])

  const createPreviewUrl = useCallback((file: File) => {
    return URL.createObjectURL(file)
  }, [])

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <Card
      className={`relative transition-all duration-300 group ${
        imageUrl
          ? "h-auto min-h-0 cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm gap-0 hover:shadow-md"
          : uploadedFiles.length > 0
            ? "h-auto min-h-80 cursor-pointer border-2 border-dashed"
            : "h-80 cursor-pointer border-2 border-dashed"
      } ${
        isDragOver
          ? "border-primary bg-primary/10 scale-105"
          : "border-border bg-card/50 hover:border-primary/50 hover:bg-card/70"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {uploadedFiles.length > 0 ? (
        <div className="p-0 h-full">
          <div className="grid grid-cols-1 gap-0 h-full">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group/item h-full">

                {file.type.startsWith("image/") ? (
                  <div className="relative h-full">

                    <a
                      href={url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!url) e.preventDefault()
                      }}
                      className="block h-full cursor-pointer"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </a>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-3 right-3 z-20 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm"
                    >
                      Remove
                    </button>

                  </div>

                ) : file.type.startsWith("video/") ? (
                  <div className="relative h-full">

                    <a
                      href={url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!url) e.preventDefault()
                      }}
                      className="block h-full cursor-pointer"
                    >
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover rounded-lg"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    </a>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-3 right-3 z-20 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm"
                    >
                      Remove
                    </button>

                  </div>
                ) : null}

              </div>
            ))}

          </div>
        </div>
        ) : imageUrl ? (
          <div className="min-w-0">
            <a
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!url) e.preventDefault()
              }}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={title + " website screenshot"}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                />
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{description}</p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">{title}</h3>
                </div>
                <span aria-hidden="true" className="text-lg text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </div>
            </a>
          </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className="mb-3 transition-transform duration-300">
            {type === "image" ? (
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            ) : type === "video" ? (
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v14h12V6H6zm3-2V2h6v2H9z"
                />
              </svg>
            )}
          </div>

          <input
            type="file"
            multiple
            accept={type === "image" ? "image/*" : type === "video" ? "video/*" : "image/*,video/*"}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-xs text-gray-500">Click to browse or drag files here</div>
        </div>
      )}
    </Card>
  )
}
  
