import type { SupabaseClient } from "@supabase/supabase-js"

export const portfolioStorageBucket =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "portfolio-media"

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"])
const maximumImageSize = 5 * 1024 * 1024

export function validatePortfolioImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Gunakan gambar JPG, PNG, atau WebP.")
  }

  if (file.size > maximumImageSize) {
    throw new Error("Ukuran gambar maksimal 5 MB.")
  }
}

export async function uploadPortfolioImage(
  supabase: SupabaseClient,
  file: File,
  folder: "profiles" | "projects",
) {
  validatePortfolioImage(file)

  const extension = file.type.split("/")[1]
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from(portfolioStorageBucket)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw new Error(`Upload gambar gagal: ${error.message}`)
  }

  const { data } = supabase.storage.from(portfolioStorageBucket).getPublicUrl(path)

  return { path, url: data.publicUrl }
}

export async function removePortfolioImage(
  supabase: SupabaseClient,
  imageUrl: string,
) {
  const path = getPortfolioImagePath(imageUrl)
  if (!path) return

  const { error } = await supabase.storage
    .from(portfolioStorageBucket)
    .remove([path])

  if (error) {
    throw new Error(`Data tersimpan, tetapi gambar lama gagal dihapus: ${error.message}`)
  }
}

function getPortfolioImagePath(imageUrl: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return null

  try {
    const image = new URL(imageUrl)
    const project = new URL(supabaseUrl)
    const prefix = `/storage/v1/object/public/${portfolioStorageBucket}/`

    if (image.origin !== project.origin || !image.pathname.startsWith(prefix)) {
      return null
    }

    return decodeURIComponent(image.pathname.slice(prefix.length))
  } catch {
    return null
  }
}
