"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
  whileInView?: any;
  viewport?: any;
}

export function MotionDiv({ children, ...props }: MotionProps) {
  return <motion.div {...props}>{children}</motion.div>;
}

export function MotionH1({ children, ...props }: MotionProps) {
  return <motion.h1 {...props}>{children}</motion.h1>;
}

export function MotionP({ children, ...props }: MotionProps) {
  return <motion.p {...props}>{children}</motion.p>;
} 