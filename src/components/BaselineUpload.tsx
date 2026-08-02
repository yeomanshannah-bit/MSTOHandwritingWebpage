"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/*
  Uploads the baseline handwriting photo.

  Two ways in, because they behave differently on a tablet:
    - "Take a photo" uses capture="environment", which on an iPad opens the
      camera straight away so the sample can be snapped there and then.
    - "Choose a file" has no capture attribute, so it opens the photo library
      or file picker — needed when the photo was taken earlier.

  The file goes directly from the browser to Supabase Storage, then a Server
  Action records the path. Uploading direct means a multi-megabyte photo never
  has to travel through our own server.
*/
export default function BaselineUpload({
  studentId,
  onUploaded,
}: {
  studentId: string;
  onUploaded: (storagePath: string) => Promise<void>;
}) {
  const router = useRouter();
  const supabase = createClient();
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image.");
      return;
    }
    // Phone cameras produce big files; 15MB is a generous ceiling.
    if (file.size > 15 * 1024 * 1024) {
      setError("That photo is over 15MB — try a smaller one.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setBusy(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session has expired — please log in again.");

      // Path must start with the staff member's id: that's what the storage
      // policy checks.
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${studentId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("baselines")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;

      await onUploaded(path);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* The clickable drop zone */}
      <button
        type="button"
        onClick={() => cameraRef.current?.click()}
        disabled={busy}
        className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-msot-blue/35 bg-msot-blue/[.04] px-6 py-10 text-center transition-colors hover:border-msot-blue/60 hover:bg-msot-blue/[.08] disabled:opacity-60"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="The photo you just chose"
            className="max-h-56 w-auto rounded-xl shadow-sm"
          />
        ) : (
          <>
            <span aria-hidden className="text-4xl">
              📷
            </span>
            <span className="mt-3 font-semibold text-msot-navy">
              {busy ? "Uploading…" : "Take a photo of the writing sample"}
            </span>
            <span className="mt-1 text-sm text-foreground/60">
              On an iPad this opens the camera
            </span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="mt-3 w-full rounded-full border border-black/10 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-msot-blue/40 hover:text-msot-blue disabled:opacity-60"
      >
        Or choose a photo already saved
      </button>

      {/* Hidden inputs — capture="environment" is what opens the camera. */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && (
        <p className="mt-3 rounded-lg bg-msot-red/10 px-4 py-2.5 text-sm text-msot-red">
          {error}
        </p>
      )}
    </div>
  );
}
