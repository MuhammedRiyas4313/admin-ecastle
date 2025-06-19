"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { motion, AnimatePresence, MotionProps } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  handleClose: () => void;
  show: boolean;
  title?: string;
  children: React.ReactNode;
  containerPadding?: string;
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  closeButton?: boolean;
}

export default function Modal({
  handleClose,
  show,
  title,
  children,
  containerPadding = "px-4 pt-5 pb-4 sm:p-6 sm:pb-5",
  width = "lg",
  closeButton = false,
}: ModalProps) {
  // Animation configuration with proper types
  const backdropAnimation: MotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  };

  const panelAnimation: MotionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { 
      duration: 0.2,
      ease: "easeOut" // Using named easing instead of array
    }
  };

  return (
    <AnimatePresence mode="wait">
      {show && (
        <Dialog open={show} onClose={handleClose} className="relative z-10">
          {/* Backdrop with proper motion props */}
          <motion.div
            {...backdropAnimation}
            className="fixed inset-0 bg-black/70"
          >
            <DialogBackdrop className="absolute inset-0" />
          </motion.div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              {/* Panel wrapped in motion.div */}
              <motion.div
                {...panelAnimation}
                className={`relative transform overflow-hidden rounded-[20px] bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-${width}`}
              >
                <DialogPanel className={`bg-white ${containerPadding}`}>
                  {closeButton && (
                    <button
                      onClick={handleClose}
                      className="absolute top-5 right-5 text-gray-700 hover:text-black"
                    >
                      <XMarkIcon className="w-7 h-7" />
                    </button>
                  )}
                  {title && (
                    <DialogTitle
                      as="h2"
                      className="text-xl font-medium text-gray-900 mb-2 sm:mb-5"
                    >
                      {title}
                    </DialogTitle>
                  )}
                  <div className="w-full">{children}</div>
                </DialogPanel>
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}