"use client";

import { useRef, useState, useEffect } from "react";
import { submissionsService } from "@/services/client/submissions";
import type { UploadToken } from "@/interfaces";

export function useRecording(submissionId: string | null) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const requestingCameraRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);

  // ── Webcam recording ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!submissionId) return;
    requestingCameraRef.current = true;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        const mimeType = MediaRecorder.isTypeSupported(
          "video/webm;codecs=vp8,opus",
        )
          ? "video/webm;codecs=vp8,opus"
          : "video/webm";
        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: 400_000,
        });
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordingChunksRef.current.push(e.data);
        };
        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      })
      .catch(() => {
        // Camera access denied — exam continues unrecorded
      })
      .finally(() => {
        requestingCameraRef.current = false;
      });
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [submissionId]);

  // Wire the live stream to the preview element once it mounts (isRecording true = element in DOM)
  useEffect(() => {
    if (isRecording && streamRef.current && previewVideoRef.current) {
      previewVideoRef.current.srcObject = streamRef.current;
    }
  }, [isRecording]);

  // Stops the recorder and returns the collected blob (best-effort, never throws).
  function stopRecorder(): Promise<Blob | null> {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive")
      return Promise.resolve(null);
    return new Promise((resolve) => {
      recorder.onstop = () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        const blob = new Blob(recordingChunksRef.current, {
          type: "video/webm",
        });
        resolve(blob.size > 0 ? blob : null);
      };
      recorder.stop();
    });
  }

  // Uploads a blob using an already-fetched upload token. Returns the public URL.
  async function uploadBlob(
    blob: Blob,
    token: UploadToken,
    subId: string,
  ): Promise<string | undefined> {
    try {
      if (token.provider === "cloudinary" && token.cloudinary) {
        const sig = token.cloudinary;
        const form = new FormData();
        form.append("file", blob, `recording-${subId}.webm`);
        form.append("api_key", sig.apiKey);
        form.append("timestamp", String(sig.timestamp));
        form.append("signature", sig.signature);
        form.append("folder", sig.folder);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`,
          { method: "POST", body: form },
        );
        const data = (await res.json()) as { secure_url?: string };
        return data.secure_url ?? undefined;
      }
      if (token.provider === "minio" && token.minio) {
        await fetch(token.minio.uploadUrl, {
          method: "PUT",
          body: blob,
          headers: { "Content-Type": "video/webm" },
        });
        return token.minio.publicUrl;
      }
    } catch {
      return undefined;
    }
  }

  // Fetches an upload token, uploads a pre-collected blob, then PATCHes the
  // submission. Call this AFTER stopRecorder() returns the blob — never inline
  // stopRecorder here, because by the time this runs the component may have
  // unmounted and the MediaRecorder already been torn down by cleanup.
  async function uploadAndAttach(subId: string, blob: Blob): Promise<void> {
    try {
      const tokenRes = await submissionsService.getUploadToken(
        subId,
        blob.size,
      );
      const token = tokenRes.data?.data;
      if (!token) return;
      const url = await uploadBlob(blob, token, subId);
      if (url) {
        await submissionsService.updateRecordingUrl(subId, url);
      }
    } catch {
      // best-effort — recording attachment is non-critical
    }
  }

  return {
    previewVideoRef,
    isRecording,
    requestingCameraRef,
    stopRecorder,
    uploadAndAttach,
  };
}
