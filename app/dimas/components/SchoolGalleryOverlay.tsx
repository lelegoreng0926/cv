"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent, RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import BackFaceButton from "./BackFaceButton";
import { schoolGalleries } from "../foto";
import { useLanguage } from "../i18n/LanguageProvider";
import { useSmoothScroll } from "./SmoothScroll";

/* eslint-disable react-hooks/set-state-in-effect -- Gallery lifecycle effects reset animation state and synchronize scroll locking with user actions. */

export type GalleryImage = { src: StaticImageData; alt: string };

const schools = [
  { key: "smk-telkom", name: "SMK Telkom Makassar" },
  { key: "prottab", name: "PROTTAB AMT Makassar" },
  { key: "sd-btn-pemda", name: "UPT SPF SD Inpres Unggulan BTN Pemda" },
] as const;
const MAX_BACKGROUND_BLUR_PX = 24;

type PhotoPosition = { x: number; y: number; rotation: number; stackRotation: number; width: number; height: number };
type Props = {
  schoolIndex: number | null;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  images?: GalleryImage[];
  title?: string;
  managedByParent?: boolean;
  requestCloseRef?: { current: (() => void) | null };
};

export default function SchoolGalleryOverlay({ schoolIndex, onClose, returnFocusRef, images, title, managedByParent = false, requestCloseRef }: Props) {
  const { t } = useLanguage();
  const lenis = useSmoothScroll();
  const [mounted, setMounted] = useState(false);
  const [positions, setPositions] = useState<PhotoPosition[]>([]);
  const [zOrder, setZOrder] = useState<number[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [landedPhotos, setLandedPhotos] = useState<boolean[]>([]);
  const [enlargedPhotoIndex, setEnlargedPhotoIndex] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const dragOrigin = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const enlargedPhotoRef = useRef<HTMLDivElement | null>(null);
  const school = schoolIndex === null ? null : schools[schoolIndex];
  const galleryImages = useMemo<GalleryImage[]>(() => images ?? (school
        ? schoolGalleries[school.key].map((src) => ({ src, alt: "" }))
    : []), [images, school]);
  const galleryImagesRef = useRef(galleryImages);
  galleryImagesRef.current = galleryImages;
  const galleryTitle = title ?? school?.name ?? "foto";
  const isOpen = schoolIndex !== null || Boolean(images);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (enlargedPhotoIndex === null) return;
    const closeOnOutsidePointer = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && enlargedPhotoRef.current?.contains(event.target)) return;
      setEnlargedPhotoIndex(null);
    };
    window.addEventListener("pointerdown", closeOnOutsidePointer, true);
    return () => window.removeEventListener("pointerdown", closeOnOutsidePointer, true);
  }, [enlargedPhotoIndex]);

  useEffect(() => {
    if (landedPhotos.length === galleryImages.length && landedPhotos.length > 0 && landedPhotos.every(Boolean)) {
      setZOrder(galleryImages.map((_, index) => galleryImages.length - 1 - index));
    }
  }, [landedPhotos, galleryImages]);

  useEffect(() => {
    if (!isOpen) return;

    const root = document.documentElement;
    const returnFocusElement = returnFocusRef.current;
    const previousOverflow = root.style.overflow;
    const previousPaddingRight = root.style.paddingRight;
    const previousGalleryOpen = root.dataset.galleryOpen;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const activeImages = galleryImagesRef.current;
    const count = activeImages.length;
    setClosing(false);
    setPositions([]);
    setLandedPhotos([]);
    setEnlargedPhotoIndex(null);
    setButtonVisible(false);
    if (!managedByParent) {
      root.style.overflow = "hidden";
      root.dataset.galleryOpen = "true";
      if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
      lenis?.stop();
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxWidth = count === 1
      ? Math.min(viewportWidth < 640 ? viewportWidth * 0.85 : 520, viewportWidth - 24)
      : Math.min(viewportWidth < 640 ? (count <= 3 ? 180 : 150) : (count <= 3 ? 230 : 260), viewportWidth - 24);
    const maxHeight = count === 1 ? viewportHeight * 0.7 : Math.max(120, viewportHeight * (count <= 3 ? 0.34 : 0.38));
    const cols = count === 1 ? 1 : viewportWidth < 640 ? 2 : count <= 3 ? count : 3;
    const rows = Math.ceil(count / cols);
    const next = activeImages.map((photo, index) => {
      const scale = Math.min(maxWidth / photo.src.width, maxHeight / photo.src.height, 1);
      const width = photo.src.width * scale;
      const height = photo.src.height * scale;
      const rotation = count === 1 ? Math.random() * 4 - 2 : Math.random() * 20 - 10;
      if (count === 1) {
        return { x: (viewportWidth - width) / 2, y: (viewportHeight - height) / 2, rotation, stackRotation: Math.random() * 2 - 1, width, height };
      }

      const col = index % cols;
      const row = Math.floor(index / cols);
      const zoneWidth = viewportWidth / cols;
      const zoneHeight = viewportHeight / rows;
      const zoneMinX = col * zoneWidth;
      const zoneMinY = row * zoneHeight;
      const minX = Math.max(0, Math.min(viewportWidth - width, zoneMinX));
      const maxX = Math.max(minX, Math.min(viewportWidth - width, zoneMinX + zoneWidth - width));
      const minY = Math.max(0, Math.min(viewportHeight - height, zoneMinY));
      const maxY = Math.max(minY, Math.min(viewportHeight - height, zoneMinY + zoneHeight - height));
      return {
        x: minX + Math.random() * (maxX - minX),
        y: minY + Math.random() * (maxY - minY),
        rotation,
        stackRotation: Math.random() * 6 - 3,
        width,
        height,
      };
    });
    setPositions(next);
    setLandedPhotos(Array.from({ length: count }, () => false));
    setZOrder(activeImages.map((_, index) => index));
    setDragging(null);
    if (reduceMotion) setButtonVisible(true);
    else {
      const staggerDuration = count <= 3 ? 120 : 150;
      const buttonDelay = 720 + Math.max(0, count - 1) * staggerDuration;
      buttonTimerRef.current = setTimeout(() => setButtonVisible(true), buttonDelay);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    if (!managedByParent) window.addEventListener("keydown", onKeyDown);
    if (requestCloseRef) requestCloseRef.current = requestClose;
    return () => {
      if (!managedByParent) {
        window.removeEventListener("keydown", onKeyDown);
        root.style.overflow = previousOverflow;
        root.style.paddingRight = previousPaddingRight;
        if (previousGalleryOpen === undefined) delete root.dataset.galleryOpen;
        else root.dataset.galleryOpen = previousGalleryOpen;
        lenis?.start();
      }
      if (requestCloseRef) requestCloseRef.current = null;
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (buttonTimerRef.current) clearTimeout(buttonTimerRef.current);
      setPositions([]);
      setLandedPhotos([]);
      setEnlargedPhotoIndex(null);
      setClosing(false);
      returnFocusElement?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Closing uses the current state but is intentionally bound to this gallery-open lifecycle.
  }, [schoolIndex, isOpen, galleryImages.length, reduceMotion, returnFocusRef, lenis, managedByParent, requestCloseRef]);

  if (!mounted || (schoolIndex === null && !images) || !document.body) return null;

  function requestClose() {
    if (closing || closeTimerRef.current) return;
    setClosing(true);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      onCloseRef.current();
    }, 250);
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>, index: number) => {
    const position = positions[index];
    if (!position || closing) return;
    if (enlargedPhotoIndex === index) return;
    // Keep dragging available even if the deal animation's completion event
    // has not fired yet (for example, when a card is grabbed immediately).
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = { pointerX: event.clientX, pointerY: event.clientY, x: position.x, y: position.y };
    setDragging(index);
    setLandedPhotos((current) => current.map((landed, photoIndex) => photoIndex === index || landed));
    setZOrder((current) => [...current.filter((photoIndex) => photoIndex !== index), index]);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>, index: number) => {
    if (dragging !== index || closing || !containerRef.current) return;
    const { width, height } = positions[index];
    const x = Math.min(window.innerWidth - width, Math.max(0, dragOrigin.current.x + event.clientX - dragOrigin.current.pointerX));
    const y = Math.min(window.innerHeight - height, Math.max(0, dragOrigin.current.y + event.clientY - dragOrigin.current.pointerY));
    setPositions((current) => current.map((position, photoIndex) => photoIndex === index ? { ...position, x, y } : position));
  };

  return createPortal((
    <>
      {!managedByParent && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120] bg-black/40 backdrop-blur-[6px]"
        />
      )}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
        className={`fixed inset-0 z-[121] overflow-hidden ${managedByParent ? "pointer-events-none" : ""}`}
        style={{ zIndex: enlargedPhotoIndex === null ? 121 : 122 }}
        role="dialog" aria-modal={managedByParent ? undefined : true} aria-label={`${images ? t.gallery.certificateTitle : t.gallery.schoolTitle} ${galleryTitle}`}
      >
      {galleryImages.map((photo, index) => {
        const position = positions[index];
        if (!position) return null;
        const isDragging = dragging === index;
        const offset = index - (galleryImages.length - 1) / 2;
        const centerX = window.innerWidth / 2 - position.x - position.width / 2 + offset * 1.5;
        const centerY = window.innerHeight / 2 - position.y - position.height / 2 + index * 1.5;
        const landingRotation = position.rotation;
        const isEnlarged = enlargedPhotoIndex === index;
        const enlargedScale = Math.max(1, Math.min(2.5, (window.innerWidth - 32) / position.width, (window.innerHeight - 32) / position.height));
        const enlargedX = window.innerWidth / 2 - position.x - position.width / 2;
        const enlargedY = window.innerHeight / 2 - position.y - position.height / 2;
        const staggerDelay = (galleryImages.length - 1 - index) * (galleryImages.length <= 3 ? 0.12 : 0.15);
        return (
          <motion.div
            key={`${galleryTitle}-${index}`}
            ref={isEnlarged ? enlargedPhotoRef : undefined}
            initial={reduceMotion
              ? { opacity: 0, scale: 0.96, x: 0, y: 0, rotate: landingRotation }
              : { opacity: 0, scale: 0.6, x: centerX, y: centerY, rotate: position.stackRotation }}
            animate={closing
              ? { opacity: 0, scale: 0.78, x: 0, y: 0, rotate: landingRotation }
              : isEnlarged
                ? { opacity: 1, scale: enlargedScale, x: enlargedX, y: enlargedY, rotate: 0, boxShadow: "0 30px 90px rgba(0,0,0,0.75)" }
              : isDragging
                ? { opacity: 1, scale: 1.045, x: 0, y: 0, rotate: 0, boxShadow: "0 30px 90px rgba(0,0,0,0.75)" }
                : reduceMotion
                  ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: landingRotation }
                  : landedPhotos[index]
                    ? { opacity: 1, scale: 1, x: 0, y: 0, rotate: landingRotation, boxShadow: "0 16px 45px rgba(0,0,0,0.48)" }
                    : {
                        opacity: [0, 1, 1],
                        scale: [0.6, 1.04, 1],
                        x: [centerX, -Math.sign(centerX || 1) * 5, 0],
                        y: [centerY, -Math.sign(centerY || 1) * 5, 0],
                        rotate: [position.stackRotation, landingRotation + Math.sign(landingRotation - position.stackRotation || 1) * 2, landingRotation],
                        boxShadow: ["0 8px 20px rgba(0,0,0,0.12)", "0 24px 60px rgba(0,0,0,0.5)", "0 16px 45px rgba(0,0,0,0.48)"],
                      }}
            transition={closing
              ? { duration: 0.25, ease: "easeOut" }
              : isEnlarged
                ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              : reduceMotion
                ? { duration: 0.22, delay: staggerDelay * 0.2, ease: "easeOut" }
                : { duration: 0.72, delay: staggerDelay, ease: [0.22, 1, 0.36, 1], times: [0, 0.84, 1] }}
            onAnimationComplete={() => {
              if (!closing && !landedPhotos[index]) {
                setLandedPhotos((current) => current.map((landed, photoIndex) => photoIndex === index || landed));
              }
            }}
            onPointerDown={(event) => onPointerDown(event, index)}
            onDoubleClick={(event) => {
              if (closing) return;
              event.preventDefault();
              event.stopPropagation();
              setEnlargedPhotoIndex((current) => current === index ? null : index);
              setZOrder((current) => [...current.filter((photoIndex) => photoIndex !== index), index]);
            }}
            onPointerMove={(event) => onPointerMove(event, index)}
            onPointerUp={() => setDragging(null)}
            onPointerCancel={() => setDragging(null)}
            onDragStart={(event) => event.preventDefault()}
            onContextMenu={(event) => event.preventDefault()}
            className={`absolute rounded-lg border border-white/20 bg-[#242522] touch-none select-none ${isEnlarged ? "cursor-zoom-out shadow-[0_30px_90px_rgba(0,0,0,0.75)]" : isDragging ? "cursor-grabbing shadow-[0_30px_90px_rgba(0,0,0,0.75)]" : "cursor-zoom-in shadow-[0_16px_45px_rgba(0,0,0,0.48)]"}`}
            style={{ left: position.x, top: position.y, width: position.width, height: position.height, zIndex: isEnlarged ? 300 : isDragging ? 200 : 10 + zOrder.indexOf(index), pointerEvents: closing ? "none" : "auto" }}
          >
            <Image src={photo.src} alt={images ? photo.alt : `${t.gallery.photoAlt} ${galleryTitle} ${index + 1}`} width={photo.src.width} height={photo.src.height} draggable={false} className="pointer-events-none block h-full w-full rounded-[inherit] object-contain" />
          </motion.div>
        );
      })}
        {!managedByParent && buttonVisible && <BackFaceButton onClick={requestClose} />}
      </motion.div>
    </>
  ), document.body);
}

export function SchoolGalleryBackdrop({
  blurPercent,
  onBlurChange,
  openSchools,
  onCloseSchool,
  onCloseAll,
}: {
  blurPercent: number;
  onBlurChange: (value: number) => void;
  openSchools: { index: number; closeRef: { current: (() => void) | null } }[];
  onCloseSchool: (index: number) => void;
  onCloseAll: () => void;
}) {
  const { t } = useLanguage();
  if (!openSchools.length) return null;
  const normalizedBlurPercent = Math.min(100, Math.max(0, blurPercent));
  const blurStrength = normalizedBlurPercent / 100;
  const blurPixels = MAX_BACKGROUND_BLUR_PX * blurStrength;
  const tintAlpha = 0.4 * blurStrength;

  return createPortal((
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[120]"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${tintAlpha})`,
          backdropFilter: `blur(${blurPixels}px)`,
          WebkitBackdropFilter: `blur(${blurPixels}px)`,
          pointerEvents: normalizedBlurPercent >= 30 ? "auto" : "none",
          transition: "backdrop-filter 180ms ease-out, background-color 180ms ease-out",
        }}
      />
      <div className="pointer-events-auto fixed left-3 top-1/2 z-[130] flex -translate-y-1/2 flex-col items-center gap-2 rounded-full border border-white/15 bg-neutral-950/90 px-2 py-3 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <span className="text-[10px] tabular-nums text-white/80">{normalizedBlurPercent}%</span>
        <input
          id="school-gallery-blur"
          type="range"
          min={0}
          max={100}
          step={1}
          value={normalizedBlurPercent}
          onChange={(event) => onBlurChange(Number(event.currentTarget.value))}
          className="h-28 w-4 cursor-pointer touch-none accent-[#d0ff71]"
          style={{ writingMode: "vertical-lr", direction: "rtl" }}
          aria-label={t.gallery.backgroundBlur}
          aria-orientation="vertical"
          aria-valuetext={`${normalizedBlurPercent}%`}
        />
      </div>
      <div className="pointer-events-auto fixed right-3 top-3 z-[130] flex max-w-[calc(100vw-72px)] flex-wrap justify-end gap-2 sm:max-w-[calc(100vw-96px)]">
        {openSchools.map(({ index }) => (
          <button
            key={index}
            type="button"
            onClick={() => onCloseSchool(index)}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/15 bg-neutral-950/90 px-2.5 py-1.5 text-[11px] text-white/85 shadow-sm transition hover:border-[#d0ff71]/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d0ff71]"
            aria-label={`${t.gallery.closeGallery}: ${schools[index].name}`}
          >
            <span className="max-w-[34vw] truncate sm:max-w-none">{schools[index].name}</span><X aria-hidden="true" size={13} />
          </button>
        ))}
      </div>
      <BackFaceButton onClick={onCloseAll} />
    </>
  ), document.body);
}
