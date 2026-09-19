import { motion } from "framer-motion";

export default function MaskText({ text, as: Tag = "h2", className = "", delay = 0 }) {
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="mr-[0.22em] -mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.045 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
